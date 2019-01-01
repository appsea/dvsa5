import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost } from "ui/frame";
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
        const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
        sideDrawer.showDrawer();
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
