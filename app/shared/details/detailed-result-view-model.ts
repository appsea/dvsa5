import { EventData, Observable, PropertyChangeData  } from "tns-core-modules/data/observable";
import { TextField } from "tns-core-modules/ui/text-field";
import { SearchBar } from "ui/search-bar";
import { QuestionUtil } from "~/services/question.util";
import { ObservableProperty } from "../observable-property-decorator";
import { IQuestion, IState } from "../questions.model";

export class DetailedResultViewModel extends Observable {

    @ObservableProperty() searchPhrase: string = "";

    private _searching: boolean = false;

    get size() {
        return this._size;
    }

    get message() {
        return this._message;
    }

    get questions() {
        return this._questions;
    }

    private _questions: Array<IQuestion> = [];
    private allQuestions: Array<IQuestion>;
    private _message: string;
    private _size: number;
    private state: IState;

    constructor(state: IState) {
        super();
        this.state = state;
        this.allQuestions = state.questions;
        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "searchPhrase") {
                this.refilter();
            }
        });
        this.all();
    }

    all(): void {
        this._message = "All";
        this.allQuestions.forEach((question) => {
            question.skipped = QuestionUtil.isSkipped(question);
        });
        this._questions = this.allQuestions;
        this._size = this._questions.length;
        this.publish();
    }

    correct(): void {
        this._message = "Correct";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isCorrect(question));
        this._size = this._questions.length;
        this.publish();
    }

    incorrect(): void {
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isWrong(question));
        this._message = "Incorrect";
        this._size = this._questions.length;
        this.publish();
    }

    skipped(): void {
        this._message = "Skipped";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isSkipped(question));
        this._size = this._questions.length;
        this.publish();
    }

    onSearchSubmit(args): void {
        this.refilter();
        const searchBar = <SearchBar>args.object;
        searchBar.dismissSoftInput();
    }

    textFieldLoaded(args): void {
        const textField: TextField = <TextField>args.object;
        setTimeout(() => {
            {
                textField.focus();
                textField.dismissSoftInput();
            }
        }, 100);
    }

    clear(): void {
        this.refilter();
    }

    refilter() {
        const f = this.searchPhrase.trim().toLowerCase();

        this._questions = this.allQuestions.filter((q) => q.prashna.text.toLowerCase().includes(f)
            || q.options.filter((o) => o.description && o.description.toLowerCase().includes(f)).length > 0
            || q.explanation.toLowerCase().includes(f));
        this.publish();
    }

    get searching() {
        return this._searching;
    }

    toggleSearch(): void {
        this._searching = !this._searching;
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questions",
            value: this._questions
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "size",
            value: this._size
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "message",
            value: this._message
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "searching",
            value: this._searching
        });
    }
}
