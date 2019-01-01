import * as appSettings from "application-settings";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { FLAG_QUESTION, PRACTICE_STATS, PREMIUM, RESULT, WRONG_QUESTION } from "~/shared/constants";
import { IPracticeStats, IQuestion, IResult } from "~/shared/questions.model";

export class ProgressViewModel extends Observable {

    resetAllStats(): any {
        this.resetPracticeStats();
        this.resetMockExamStats();
    }

    readPracticeStats(): IPracticeStats {
        return appSettings.hasKey(PRACTICE_STATS) ? JSON.parse(appSettings.getString(PRACTICE_STATS))
            : {attempted: new Array<number>(), correct: new Array<number>()};
    }

    readWrongQuestions(): Array<IQuestion> {
        return this.readQuestions(WRONG_QUESTION);
    }

    readFlaggedQuestions(): Array<IQuestion> {
        return this.readQuestions(FLAG_QUESTION);
    }

    addQuestions(key: string, questions: Array<IQuestion>) {
        appSettings.setString(key, JSON.stringify(questions));
    }

    addResult(results: Array<IResult>) {
        appSettings.setString(RESULT, JSON.stringify(results));
    }

    getResult(): Array<IResult> {
        let items: Array<IResult> = [];
        if (appSettings.hasKey(RESULT)) {
            items = JSON.parse(appSettings.getString(RESULT));
        }

        return items;
    }

    saveResult(result: IResult): void {
        if (appSettings.hasKey(RESULT)) {
            const items: Array<IResult> = JSON.parse(appSettings.getString(RESULT));
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        } else {
            const items: Array<IResult> = [];
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        }
    }

    savePracticeStats(practiceStats: IPracticeStats) {
        appSettings.setString(PRACTICE_STATS, JSON.stringify(practiceStats));
    }

    resetMockExamStats(): void {
        appSettings.remove(RESULT);
    }

    isPremium(): boolean {
        return appSettings.hasKey(PREMIUM);
    }

    private resetPracticeStats() {
        appSettings.remove(PRACTICE_STATS);
    }

    private readQuestions(key: string): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasBookmarkedQuestions(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    private hasBookmarkedQuestions(key: string): boolean {
        return appSettings.hasKey(key);
    }
}
