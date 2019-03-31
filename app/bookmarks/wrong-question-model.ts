import { EventData, Observable } from "tns-core-modules/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { BookmarkQuestionModel } from "./bookmark-question-model";

export class WrongQuestionModel extends BookmarkQuestionModel {

    private static message: string = "Hurray!! No more wrong questions. Click Ok to go to practice.";

    constructor() {
        super(PersistenceService.getInstance().readWrongQuestions(), "wrong", WrongQuestionModel.message);
        super.next();
    }

    next(): void {
        super.next();
    }
}
