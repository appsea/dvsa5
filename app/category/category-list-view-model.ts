import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as dialogs from "ui/dialogs";
import { topmost } from "ui/frame";
import { QuestionViewModel } from "~/question/question-view-model";
import { AdService } from "~/services/ad.service";
import { CategoryService } from "~/services/category.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { ICategory } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";

export class CategoryListViewModel extends Observable {

    get categories() {
        return this._categories;
    }

    get total() {
        return this._categories.length;
    }

    get categoriesSelected() {
        return this.selected > 0;
    }

    get selected() {
        return this.categories.filter((c) => c.selected).length;
    }

    private _categories: Array<ICategory>;

    constructor() {
        super();
        /*PersistenceService.getInstance().clearCategories();
        CategoryService.getInstance().readCategoriesFromFirebase();*/
        this._categories = CategoryService.getInstance().getCategories();
        this._categories.forEach((c) => {
            c.icon = String.fromCharCode(+c.icon);
        });
        console.log("c.icon::", this._categories[0]);
        this.publish();
    }

    selectCategory(args: any) {
        const selectedCategory = args.view.bindingContext;
        selectedCategory.selected = selectedCategory.selected ? false : true;
        this.publish();
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
        AdService.getInstance().hideAd();
    }

    start() {
        if (this.categoriesSelected) {
            this.showOptions();
        } else {
            dialogs.alert("Please select at least one category!!!");
        }
    }

    showMenu(accessibleQuestions) {
        let message: string = "You don't have access to these questions";
        const actions = ["Top Up"];
        if (accessibleQuestions.length > 0) {
            message = "You can practice only " + accessibleQuestions.length
                + " Questions. Top up for more.";
            actions.push("Practice");
        }
        dialogs.action({
            message,
            cancelButtonText: "Cancel",
            actions
        }).then((result) => {
            if (result === "Top Up") {
                navigationModule.toPage("stats/summary");
            } else if (result === "Practice") {
                navigationModule.gotoCategoryPractice(accessibleQuestions);
            }
        });
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "categories",
            value: this._categories
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "categoriesSelected",
            value: this.categoriesSelected
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "selected",
            value: this.selected
        });
    }

    private showOptions() {
        const actions = ["All Questions"];
        if (this.findWronglyAnsweredSelectedCategories().length > 0) {
            actions.push("Incorrectly Answered");
        }
        if (this.categories.filter((ca) => ca.selected && (ca.wronglyAnswered.length > 0 &&
                ca.questionNumbers.length > ca.attempted.length)).length > 0) {
            actions.push("Incorrect and unanswered");
        }
        const unansweredQuestionNumbers = this.findUnansweredQuestionNumbers();
        if (unansweredQuestionNumbers.length > 0 && this.isUnansweredLessThanTotalQuestions(unansweredQuestionNumbers)) {
            actions.push("Unanswered");
        }
        if (actions.length > 1) {
            dialogs.action({
                message: "Please select for practice",
                cancelButtonText: "Cancel",
                actions
            }).then((result) => {
                let numbers = [];
                if (result === "All Questions") {
                    numbers = this.findAllQuestionsForSelectedCategories();
                } else if (result === "Unanswered") {
                    const unanswered = this.findUnansweredQuestionNumbers();
                    numbers = numbers.concat(unanswered);
                } else if (result === "Incorrectly Answered") {
                    for (const category of this.categories) {
                        if (category.selected) {
                            numbers = numbers.concat(category.wronglyAnswered);
                        }
                    }
                } else if (result === "Incorrect and unanswered") {
                    for (const category of this.categories) {
                        if (category.selected) {
                            const unanswered: Array<number> = category.questionNumbers.filter((q) =>
                                category.attempted.indexOf(q) === -1);
                            numbers = numbers.concat(unanswered);
                            numbers = numbers.concat(category.wronglyAnswered);
                        }
                    }
                }
                this.handleAccessibleQuestions(numbers);
            });
        } else {
            const numbers = this.findAllQuestionsForSelectedCategories();
            this.handleAccessibleQuestions(numbers);
        }
    }

    private handleAccessibleQuestions(numbers: Array<number>) {
        const size: number = QuestionService.getInstance().readQuestionSize();
        const accessibleQuestions = numbers.filter((value) => value < size);
        if (accessibleQuestions.length === numbers.length) {
            navigationModule.gotoCategoryPractice(accessibleQuestions);
        } else {
            this.showMenu(accessibleQuestions);
        }
    }

    private findWronglyAnsweredSelectedCategories() {
        return this.categories.filter((ca) => ca.selected && ca.wronglyAnswered.length > 0);
    }

    private findUnansweredQuestionNumbers() {
        const unanswered: Array<number> = [];
        for (const category of this.categories) {
            if (category.selected) {
                unanswered.concat(category.questionNumbers.filter((q) =>
                    category.attempted.indexOf(q) === -1));
            }
        }

        return unanswered;
    }

    private findAllQuestionsForSelectedCategories() {
        let numbers = [];
        for (const category of this.categories) {
            if (category.selected) {
                numbers = numbers.concat(category.questionNumbers);
            }
        }

        return numbers;
    }

    private isUnansweredLessThanTotalQuestions(unansweredQuestionNumbers) {
        return unansweredQuestionNumbers.length < this.findAllQuestionsForSelectedCategories().length;
    }
}
