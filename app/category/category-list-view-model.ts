import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";
import { AdService } from "~/services/ad.service";
import { CategoryService } from "~/services/category.service";
import { ICategory } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";
import {QuestionViewModel} from "~/question/question-view-model";

export class CategoryListViewModel extends Observable {

    get categories() {
        return this._categories;
    }
    private _categories: Array<ICategory>;

    constructor() {
        super();
        this._categories = CategoryService.getInstance().getCategories();
        this.publish();
    }

    selectCategory(args: any) {
        const selectedCategory = args.view.bindingContext;
        selectedCategory.selected = selectedCategory.selected ? false : true;
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
        AdService.getInstance().hideAd();
    }

    start() {
        if (this.categories.filter((c) => c.selected).length > 0) {
            this.showOptions();
        } else {
            dialogs.alert("Please select at least one category!!!");
        }
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "categories",
            value: this._categories
        });
    }

    private showOptions() {
        const actions = ["All Questions", "Unanswered"];
        if (this.categories.filter((ca) => ca.selected && ca.wronglyAnswered.length > 0).length > 0) {
            actions.push("Incorrectly Answered");
        }
        if (this.categories.filter((ca) => ca.selected && (ca.wronglyAnswered.length > 0 ||
                ca.questionNumbers.length > ca.attempted.length)).length > 0) {
            actions.push("Incorrect and unanswered");
        }
        dialogs.action({
            message: "Please select for practice",
            cancelButtonText: "Cancel",
            actions
        }).then((result) => {
            if (result === "All Questions") {
                let numbers = [];
                for (const category of this.categories) {
                    if (category.selected) {
                        numbers = numbers.concat(category.questionNumbers);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result === "Unanswered") {
                let numbers = [];
                for (const category of this.categories) {
                    if (category.selected) {
                        const unanswered: Array<number> = category.questionNumbers.filter((q) =>
                            category.attempted.indexOf(q) === -1);
                        numbers = numbers.concat(unanswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result === "Incorrectly Answered") {
                let numbers = [];
                for (const category of this.categories) {
                    if (category.selected) {
                        numbers = numbers.concat(category.wronglyAnswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            } else if (result === "Incorrect and unanswered") {
                let numbers = [];
                for (const category of this.categories) {
                    if (category.selected) {
                        const unanswered: Array<number> = category.questionNumbers.filter((q) =>
                            category.attempted.indexOf(q) === -1);
                        numbers = numbers.concat(unanswered);
                        numbers = numbers.concat(category.wronglyAnswered);
                    }
                }
                navigationModule.gotoCategoryPractice(numbers);
            }
        });
    }
}
