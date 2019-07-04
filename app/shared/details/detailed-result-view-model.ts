import { EventData, Observable, PropertyChangeData  } from "tns-core-modules/data/observable";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { TextField } from "tns-core-modules/ui/text-field";
import { QuestionUtil } from "~/services/question.util";
import { ObservableProperty } from "../observable-property-decorator";
import { IQuestion, IState } from "../questions.model";
import {QuizUtil} from "~/shared/quiz.util";

export class DetailedResultViewModel extends Observable {

    @ObservableProperty() searchPhrase: string = "";

    private readonly ALL: string = "All";
    private readonly INCORRECT: string = "Incorrect";
    private readonly CORRECT: string = "Correct";
    private readonly SKIPPED: string = "Skipped";
    private _searching: boolean = false;
    private searchBar: SearchBar;
    private textField: TextField;

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
        this._message = this.ALL;
        this.allQuestions.forEach((question) => {
            question.skipped = QuestionUtil.isSkipped(question);
        });
        this._questions = this.allQuestions;
        this._size = this._questions.length;
        this.publish();
    }

    correct(): void {
        this._message = this.CORRECT;
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isCorrect(question));
        this._size = this._questions.length;
        this.publish();
    }

    incorrect(): void {
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isWrong(question));
        this._message = this.INCORRECT;
        this._size = this._questions.length;
        this.publish();
    }

    skipped(): void {
        this._message = this.SKIPPED;
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isSkipped(question));
        this._size = this._questions.length;
        this.publish();
    }

    onSearchSubmit(args): void {
        this.refilter();
        const searchBar = <SearchBar>args.object;
        searchBar.dismissSoftInput();
    }

    searchBarLoaded(args): void {
        this.searchBar = <SearchBar>args.object;
    }

    textFieldLoaded(args): void {
        this.textField = <TextField>args.object;
        setTimeout(() => {
            {
                this.textField.focus();
                this.textField.dismissSoftInput();
            }
        }, 100);
    }

    clear(): void {
        if (this._message === this.CORRECT) {
            this.correct();
        } else if (this._message === this.INCORRECT) {
            this.incorrect();
        } else if (this._message === this.SKIPPED) {
            this.skipped();
        } else {
            this.all();
        }
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
        if(this._searching){
            QuizUtil.showKeyboard(this.searchBar);
        }
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
