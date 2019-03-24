import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData } from "tns-core-modules/data/observable";
import { isAndroid } from "tns-core-modules/platform";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { NavigatedData, Page } from "ui/page";
import { ITopic } from "~/shared/questions.model";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as navigationModule from "../shared/navigation";
import { StudyListViewModel } from "./study-list-view-model";

let vm: StudyListViewModel;
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
    SelectedPageService.getInstance().updateSelectedPage("study");
    vm = new StudyListViewModel();
    page.bindingContext = vm;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
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

export function selectTopic(args) {
    const selectedTopic: ITopic = args.view.bindingContext;
    navigationModule.gotoSubtopics(selectedTopic.name);
}
