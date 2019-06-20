import { EventData } from "tns-core-modules/data/observable";
import { QuestionViewModel } from "~/question/question-view-model";
import { QuestionService } from "../services/question.service";
import * as navigationModule from "../shared/navigation";

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function onPageLoaded(args) {
    if (QuestionService.getInstance().hasQuestions()) {
        navigationModule.route();
    } else {
        QuestionService.getInstance().readAllQuestions().then(() => {
            navigationModule.route();
        });
    }
}
