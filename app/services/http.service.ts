import { Observable } from "tns-core-modules/data/observable";
import * as constantsModule from "../shared/constants";
import { IQuestion } from "../shared/questions.model";

const httpModule = require("http");

export class HttpService {

    static getInstance(): HttpService {
        return HttpService._instance;
    }

    private static _instance: HttpService = new HttpService();

    private questions: Array<IQuestion> = [];

    private constructor() {

    }

    showAds(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "ads.json";

        return httpModule.getString(url);
    }

    getQuestions<T>(): Promise<T> {
        const url = constantsModule.FIREBASE_URL + "questions.json";

        return httpModule.getJSON(url);
    }

    findLatestQuestionVersion(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "questionVersion.json";

        return httpModule.getString(url);
    }

    checkPlayStoreVersion(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "playStoreVersion.json";

        return httpModule.getString(url);
    }

    checkTotalQuestions(): Promise<string> {
        const url = constantsModule.FIREBASE_URL + "totalQuestions.json";

        return httpModule.getString(url);
    }

    getCategories<T>(): Promise<T> {
        const url = constantsModule.FIREBASE_URL + "categories.json";

        return httpModule.getJSON(url);
    }

    httpPost(url: string, data: any) {
        httpModule.request({
            url,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        });
    }
}
