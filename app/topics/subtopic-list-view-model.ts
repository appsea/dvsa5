import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost } from "ui/frame";
import { ISubTopic } from "~/shared/questions.model";
import { TopicService } from "./topic.service";
import {QuestionViewModel} from "~/question/question-view-model";

export class SubtopicListViewModel extends Observable {

    private _subTopics: Array<ISubTopic>;
    private _topic: string;

    constructor(topic: string) {
        super();
        this._topic = topic;
        this._subTopics = TopicService.getInstance().findSubTopics(topic);
        this.publish();
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "subTopics",
            value: this._subTopics
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "topic",
            value: this._topic
        });
    }

    get subTopics() {
        return this._subTopics;
    }

    get topic() {
        return this._topic;
    }

}
