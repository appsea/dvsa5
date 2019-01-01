import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid } from "platform";
import { Switch } from "tns-core-modules/ui/switch";
import { topmost } from "ui/frame";
import { NavigatedData, Page } from "ui/page";
import { CreateViewEventData } from "ui/placeholder";
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
        subTopic.complete = (<Switch>swargs.object).checked;
        pageData.set("complete", subTopic.complete);
        TopicService.getInstance().saveSubTopic(subTopic);
    });
    subTopic = <ISubTopic>page.navigationContext;
    page.bindingContext = pageData;
    pageData.set("complete", subTopic.complete ? subTopic.complete : false);
}

export function onDrawerButtonTap(args: EventData) {
    resetBanner();
    const sideDrawer = <RadSideDrawer>topmost().getViewById("sideDrawer");
    sideDrawer.showDrawer();
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.gotoSubtopics("Attitude");
    args.cancel = true;
}

export function goPrevious(args) {
    const subTopic: ISubTopic = TopicService.getInstance().findSubTopicFromLink("topics/attitude/priority");
    navigationModule.gotoChapters(subTopic);
}

export function handleSwipe(args) {
    if (args.direction === 1) {
        goPrevious(undefined);
    }
}
