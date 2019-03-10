/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "application-settings";
import * as appVersion from "nativescript-appversion";
import * as Toast from "nativescript-toast";
import { Observable } from "tns-core-modules/data/observable";
import * as dialogs from "ui/dialogs";
import * as utils from "utils/utils";
import { ConnectionService } from "~/shared/connection.service";
import { IQuestion } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import { CategoryService } from "./category.service";
import { HttpService } from "./http.service";
import { PersistenceService } from "./persistence.service";
import { QuestionUtil } from "./question.util";
import { SettingsService } from "./settings.service";

export class QuestionService {

    static getInstance(): QuestionService {
        return QuestionService._instance;
    }

    private static _instance: QuestionService = new QuestionService();

    private questions: Array<IQuestion> = [];
    private _settingsService: SettingsService;
    private _checked: boolean;

    constructor() {
        this._settingsService = SettingsService.getInstance();
        this._checked = false;
        this.questions = this._settingsService.readQuestions();
    }

    getNextQuestion(): Promise<IQuestion> {
        return this.getFirebaseQuestion();
    }

    handleWrongQuestions(question: IQuestion) {
        const wrongQuestions: Array<IQuestion> = PersistenceService.getInstance().readWrongQuestions();
        if (QuestionUtil.isWrong(question)) {
            this.add(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        } else {
            this.remove(constantsModule.WRONG_QUESTION, question, wrongQuestions);
        }
    }

    handleFlagQuestion(question: IQuestion) {
        const flaggedQuestions: Array<IQuestion> = PersistenceService.getInstance().readFlaggedQuestions();
        if (!this.containsQuestion(question, flaggedQuestions)) {
            Toast.makeText("Added to flagged questions.", "long").show();
            question.flagged = true;
            flaggedQuestions.push(question);
            PersistenceService.getInstance().addQuestions(constantsModule.FLAG_QUESTION, flaggedQuestions);
        } else {
            question.flagged = false;
            this.remove(constantsModule.FLAG_QUESTION, question, flaggedQuestions);
            Toast.makeText("Question is removed from flagged.", "long").show();
        }
    }

    add(key: string, question: IQuestion, questions: Array<IQuestion>) {
        if (!this.containsQuestion(question, questions)) {
            questions.push(question);
            PersistenceService.getInstance().addQuestions(key, questions);
        }
    }

    remove(key: string, question: IQuestion, questions: Array<IQuestion>) {
        const filteredRecords: Array<IQuestion> = questions.filter((item) => item.number !== question.number);
        PersistenceService.getInstance().addQuestions(key, filteredRecords);
    }

    update(question: IQuestion) {
        const url = constantsModule.FIREBASE_URL + "suggestions.json";
        const questionWithDate = {question, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, questionWithDate);
    }

    updateCorrectOption(question: IQuestion) {
        const url = constantsModule.FIREBASE_URL + "updateOption.json";
        const questionWithDate = {question, date: QuizUtil.getDate()};
        HttpService.getInstance().httpPost(url, questionWithDate);
    }

    getFirebaseQuestion(): Promise<IQuestion> {
        this.checkQuestionUpdate();
        if (this.questions.length !== 0) {
            return this.readFromQuestions();
        } else {
            if (this._settingsService.hasQuestions()) {
                this.questions = this._settingsService.readQuestions();

                return this.readFromQuestions();
            } else {
                if (!ConnectionService.getInstance().isConnected()) {
                    dialogs.alert("Please connect to internet so that we can prepare quality questions for you!!");
                } else {
                    this.readAllQuestions();
                }
            }
        }

        return this.getNextQuestionFromCache();
    }

    readAllQuestions(): void {
        HttpService.getInstance().getQuestions<Array<IQuestion>>().then((questions: Array<IQuestion>) => {
            this.questions = questions;
            this._settingsService.saveQuestions(questions);
        });
        CategoryService.getInstance().readCategoriesFromFirebase();
    }

    readQuestionSize(): number {
        return appSettings.hasKey(constantsModule.QUESTIONS_SIZE)
            ? appSettings.getNumber(constantsModule.QUESTIONS_SIZE) : 0;
    }

    getQuestion(value: number): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            resolve(JSON.parse(JSON.stringify(this.questions[value - 1])));
        });
    }

    isFlagged(question: IQuestion): boolean {
        return this.containsQuestion(question, PersistenceService.getInstance().readFlaggedQuestions());
    }

    findPremiumRange(startAt: number, endAt: number): Promise<void> {
        return new Promise((resolve, reject) => {
            HttpService.getInstance().findPremiumRange<Array<IQuestion>>("number", startAt, endAt)
                .then((map: any) => {
                    const newQuestions: Array<IQuestion> = Object.keys(map).map((key) => map[key]);
                    let questions: Array<IQuestion> = this.readQuestions();
                    console.log("questions size ", newQuestions.length);
                    questions = questions.concat(newQuestions);
                    this.saveQuestions(questions);
                    resolve();
                }).catch((e) => {
                console.error("Error Loading Premium Range Questions...", e);
                reject(e);
            });
        });
    }

    saveQuestions(questions: Array<IQuestion>): void {
        const json: string = JSON.stringify(questions);
        appSettings.setString(constantsModule.QUESTIONS, json);
        appSettings.setNumber(constantsModule.QUESTIONS_SIZE, questions.length);
    }

    readQuestions(): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasQuestions() ? JSON.parse(appSettings.getString(constantsModule.QUESTIONS)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    hasQuestions(): boolean {
        return appSettings.hasKey(constantsModule.QUESTIONS);
    }

    hasSize(): boolean {
        return appSettings.hasKey(constantsModule.QUESTIONS_SIZE);
    }

    private containsQuestion(search: IQuestion, questions: Array<IQuestion>): boolean {
        let contains = false;
        questions.forEach((question) => {
            if (question.number === search.number) {
                contains = true;
            }
        });

        return contains;
    }

    private getRandomNumber(max: number): number {
        const randomNumber = Math.floor(Math.random() * (max));

        return randomNumber;
    }

    private checkQuestionUpdate(): void {
        if (!this._checked) {
            HttpService.getInstance().findLatestQuestionVersion().then((latestQuestionVersion: string) => {
                if (this._settingsService.readQuestionVersion() < Number(latestQuestionVersion)) {
                    this.readAllQuestions();
                    this._settingsService.saveQuestionVersion(Number(latestQuestionVersion));
                }
            });
            this.checkUpdates();
            this._checked = true;
        }
    }

    private readFromQuestions(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            const randomNumber = this.getRandomNumber(this.questions.length);
            // randomNumber = 54;
            // const randomNumber = 60; //image
            console.log("randomNumber: ", randomNumber);
            const question = JSON.parse(JSON.stringify(this.questions[randomNumber]));
            question.flagged = this.isFlagged(question);
            resolve(question);
        });
    }

    private getNextQuestionFromCache(): Promise<IQuestion> {
        return new Promise<IQuestion>((resolve, reject) => {
            resolve(QUESTIONS[this.getRandomNumber(QUESTIONS.length)]);
        });
    }

    private checkUpdates() {
        if (!this._checked) {
            HttpService.getInstance().checkPlayStoreVersion().then((playStoreVersion: string) => {
                appVersion.getVersionCode().then((version: string) => {
                    if (Number(playStoreVersion) > Number(version)) {
                        dialogs.confirm({
                            title: "Notification",
                            message: "A latest version of DVSA Theory Test Kit is now available on play store.",
                            okButtonText: "Upgrade",
                            cancelButtonText: "Remind me Later"
                        }).then((proceed) => {
                            if (proceed) {
                                utils.openUrl("https://play.google.com/store/apps/details?id=exuberant.dvsa.cttk");
                            }
                        });
                    }
                });
            });
        }

    }
}

const QUESTIONS: Array<IQuestion> = [
    {
        number: "2",
        explanation: "You should slow down and be cautious. The bridge is narrow and there may not be enough room" +
        " for you to pass an oncoming vehicle at this point. Also, there's no footpath, so be aware of " +
        "pedestrians in the road.",
        category: "Alertness",
        prashna: {
            text: "What should you do as you approach this bridge?",
            image: "cttk2000.jpg"
        },
        options: [
            {
                tag: "A",
                description: "A. Change gear",
                correct: false
            },
            {
                tag: "B",
                description: "B. Move to the right",
                correct: false
            },
            {
                tag: "C",
                description: "C. Slow down",
                correct: true
            },
            {
                tag: "D",
                description: "D. Keep to 30 mph",
                correct: false
            }
        ]
    }];
