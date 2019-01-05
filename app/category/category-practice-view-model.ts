import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";
import { AdService } from "~/services/ad.service";
import { QuestionService } from "~/services/question.service";
import { IOption, IQuestion, IState } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";
import {QuestionViewModel} from "~/question/question-view-model";
import {CategoryService} from "~/services/category.service";

export class CategoryPracticeViewModel extends Observable {
    private _questionService: QuestionService;

    private _question: IQuestion;
    private _questionNumber: number = 0;
    private _cache: Array<IQuestion> = [];

    private _mode: string;
    private _numbers: Array<number>;

    constructor(numbers: Array<number>) {
        super();
        this._questionService = QuestionService.getInstance();
        this._numbers = numbers;
        this.next();
    }

    next(): void {
        if (this._cache.length === 0 || this._questionNumber >= this._cache.length) {
            this.fetchUniqueQuestion();
        } else {
            this._questionNumber = this._questionNumber + 1;
            this._question = this._cache[this._questionNumber - 1];
            this.publish();
        }
    }

    previous(): void {
        this.goPrevious();
    }

    goPrevious() {
        if (this._questionNumber > 1) {
            this._questionNumber = this._questionNumber - 1;
            this._question = this._cache[this._questionNumber - 1];
            this.publish();
        }
    }

    flag(): void {
        this._questionService.handleFlagQuestion(this._question);
        this.publish();
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
        AdService.getInstance().hideAd();
    }

    get question() {
        if (!this._question) {
            this._question = {options: [], explanation: "", show: false};
        }

        for (const option of this._question.options) {
            if (option.description) {
                if (option.description.startsWith("A.")) {
                    option.description = option.description.replace("A. ", "").trim();
                } else if (option.description.startsWith("B.")) {
                    option.description = option.description.replace("B. ", "").trim();
                } else if (option.description.startsWith("C.")) {
                    option.description = option.description.replace("C. ", "").trim();
                } else if (option.description.startsWith("D.")) {
                    option.description = option.description.replace("D. ", "").trim();
                }
            }
        }

        return this._question;
    }

    allQuestionsAsked(): boolean {
        return this._numbers.length <= this._cache.length;
    }

    isPractice(): boolean {
        return this._mode === constantsModule.PRACTICE;
    }

    get options() {
        return this._question.options;
    }

    get questionNumber() {
        return this._questionNumber;
    }

    publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "question",
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questionNumber",
            value: this._questionNumber
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "options",
            value: this._question.options
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "totalQuestions",
            value: this._numbers.length
        });
    }

    showAnswer(): void {
        this.question.options.forEach((option) => option.show = true);
        this.question.show = true;
        this.publish();
    }

    selectOption(args: any) {
        const selectedOption: IOption = args.view.bindingContext;
        if (selectedOption.selected) {
            selectedOption.selected = false;
            this.question.skipped = true;
        } else {
            this.question.options.forEach((item, index) => {
                item.selected = item.tag === selectedOption.tag;
            });
            this.question.skipped = false;
        }
        QuestionService.getInstance().handleWrongQuestions(this.question);
        CategoryService.getInstance().attemptQuestion(this.question);
    }

    getTotalQuestions() : number {
        return this._numbers.length;
    }

    goToEditPage() {
        const state: IState = {questions: [this.question], questionNumber: 1, totalQuestions: 1, mode: this._mode};
        navigationModule.gotoEditPage(state);
    }

    private fetchUniqueQuestion() {
        if (!this.allQuestionsAsked()) {
            let randomIndex: number = QuizUtil.getRandomNumber(this._numbers.length);
            let questionNumber = this._numbers[randomIndex];
            while (this.isAlreadyAsked(questionNumber)) {
                randomIndex = QuizUtil.getRandomNumber(this._numbers.length);
                questionNumber = this._numbers[randomIndex];
            }
            console.log("Fetching question", questionNumber);
            QuestionService.getInstance().getQuestion(questionNumber).then((que: IQuestion) => {
                this._questionNumber = this._questionNumber + 1;
                this._question = que;
                QuizUtil.correctImagePath(this._question);
                this._cache.push(this._question);
                this.publish();
            });
        } else {
            dialogs.confirm("Hurray!! All questions are attempted. Click Ok to go to categories.").then((proceed) => {
                if (proceed) {
                    navigationModule.toPage("category/category");
                }
            });
        }
    }

    private isAlreadyAsked(questionNumber: number): boolean {
        return this._cache.filter((que) => +que.number === questionNumber).length > 0;
        // return false;
    }
}
