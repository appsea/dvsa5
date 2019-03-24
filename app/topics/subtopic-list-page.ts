import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { EventData } from "data/observable";
import { isAndroid } from "tns-core-modules/platform";
import { NavigatedData, Page } from "ui/page";
import { CreateViewEventData } from "ui/placeholder";
import { ISubTopic } from "~/shared/questions.model";
import * as navigationModule from "../shared/navigation";
import { SubtopicListViewModel } from "./subtopic-list-view-model";

let vm: SubtopicListViewModel;
let banner: any;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    resetBanner();
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
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
    const topic: string = <string> page.navigationContext;
    vm = new SubtopicListViewModel(topic);
    page.bindingContext = vm;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.toPage("topics/study-list");
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    resetBanner();
    vm.showDrawer();
}

export function selectSubTopic(args) {
    const selectedTopic: ISubTopic = args.view.bindingContext;
    navigationModule.gotoChapters(selectedTopic);
}
