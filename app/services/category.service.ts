import { ICategory, IQuestion } from "~/shared/questions.model";
import { HttpService } from "./http.service";
import { PersistenceService } from "./persistence.service";
import { QuestionUtil } from "./question.util";

export class CategoryService {

    static getInstance(): CategoryService {
        return CategoryService._instance;
    }

    private static _instance: CategoryService = new CategoryService();

    private _categories: Array<ICategory> = [];

    private constructor() {
    }

    getSize(search: string): number {
        return this.getCategory(search).questionNumbers.length;
    }

    getCategory(search: string): ICategory {
        return this._categories.filter((category) => category.name === search)[0];
    }

    attemptQuestion(question: IQuestion) {
        for (const category of this._categories) {
            if (!category.wronglyAnswered) {
                category.wronglyAnswered = [];
            }
            if (!category.attempted) {
                category.attempted = [];
            }
            if (category.questionNumbers.indexOf(+question.number) > -1) {
                if (category.attempted.indexOf(+question.number) === -1) {
                    category.attempted.push(+question.number);
                }
                if (QuestionUtil.isWrong(question)) {
                    if (category.wronglyAnswered.indexOf(+question.number) < 0) {
                        category.wronglyAnswered.push(+question.number);
                    }
                } else {
                    category.wronglyAnswered = category.wronglyAnswered.filter((value) => value !== +question.number);
                }
                category.percentage = ((1 - category.wronglyAnswered.length / category.attempted.length) * 100)
                    .toFixed(2);
            }
            PersistenceService.getInstance().saveCategories(this._categories);
        }
    }

    getCategories(): Array<ICategory> {
        return PersistenceService.getInstance().readCategories();
    }

    readCategoriesFromFirebase(): void {
        HttpService.getInstance().getCategories<Array<ICategory>>().then((categories: Array<ICategory>) => {
            for (const category of categories) {
                if (!category.wronglyAnswered) {
                    category.wronglyAnswered = [];
                }
                if (!category.attempted) {
                    category.attempted = [];
                }
            }
            this.mergeWithSaved(categories);
        });
    }

    mergeWithSaved(newCategories: Array<ICategory>) { // Our mergeWithSaved function
        const existingCategories: Array<ICategory> = PersistenceService.getInstance().readCategories();
        const merged: Array<ICategory> = [];
        for (const category of newCategories) {      // for every property in obj1
            if (this.contains(category, existingCategories)) {
                const savedCategory = this.getCategory(category.name);
                savedCategory.questionNumbers = category.questionNumbers;
                savedCategory.percentage = this.calculatePercentage(savedCategory);
                merged.push(savedCategory);
            } else {
                category.percentage = this.calculatePercentage(category);
                merged.push(category);
            }
        }
        this._categories = merged;
        PersistenceService.getInstance().saveCategories(merged);
    }

    contains(search: ICategory, categories: Array<ICategory>): boolean {
        return categories.filter((c) => c.name === search.name).length > 0;
    }

    private calculatePercentage(category: ICategory): string {
        return category.wronglyAnswered.length === 0 ? "0"
            : (category.wronglyAnswered.length * 100 / category.attempted.length).toFixed(2);
    }
}
