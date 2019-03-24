import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { QuestionViewModel } from "~/question/question-view-model";
import { ITopicStatus } from "~/shared/questions.model";
import { TopicService } from "./topic.service";

export class StudyListViewModel extends Observable {

    private _topicStatus: Array<ITopicStatus>;

    constructor() {
        super();
        this._topicStatus = TopicService.getInstance().getTopicStatus();
        this.publish();
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "topicStatus",
            value: this._topicStatus
        });
    }

    get topicStatus() {
        return this._topicStatus;
    }

}
