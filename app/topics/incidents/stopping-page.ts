import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { isAndroid } from "tns-core-modules/platform";
import { topmost } from "tns-core-modules/ui/frame";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Switch } from "tns-core-modules/ui/switch";
import { QuestionViewModel } from "~/question/question-view-model";
import { ISubTopic } from "~/shared/questions.model";
import * as navigationModule from "../../shared/navigation";
import { TopicService } from "../topic.service";

let banner: any;
const pageData = new Observable();
let _subTopic: ISubTopic;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    resetBanner();
}

export function onNavigatingTo(args: NavigatedData) {
    /************************************************************
     * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
     * Skipping the re-initialization on back navigation means the user will see the
     * page in the same data state that he left it in before navigating.
     *************************************************************/

    if (args.isBackNavigation) {
        return;
    }
    const page = <Page>args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    banner = page.getViewById("banner");
    const mySwitch: Switch = <Switch>page.getViewById("my-switch");
    mySwitch.on("checkedChange", (swargs) => {
        _subTopic.complete = (<Switch>swargs.object).checked;
        pageData.set("complete" , _subTopic.complete);
        TopicService.getInstance().saveSubTopic(_subTopic);
    });
    _subTopic = <ISubTopic>page.navigationContext;
    page.bindingContext = pageData;
    pageData.set("complete" , _subTopic.complete ? _subTopic.complete : false);
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.gotoSubtopics("Incidents");
    args.cancel = true;
}

export function goPrevious(args) {
    const subTopic: ISubTopic = TopicService.getInstance().findSubTopicFromLink("topics/incidents/warning-page");
    navigationModule.gotoChapters(subTopic);
}

export function goNext(args) {
    const subTopic: ISubTopic = TopicService.getInstance().findSubTopicFromLink("topics/incidents/firstaid-page");
    navigationModule.gotoChapters(subTopic);
}

export function handleSwipe(args) {
    if (args.direction === 1) {
        goPrevious(undefined);
    } else if (args.direction === 2) {
        goNext(undefined);
    }
}
