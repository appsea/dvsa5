import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import { EventData, Observable } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { isAndroid, screen } from "platform";
import { ListView } from "tns-core-modules/ui/list-view";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { topmost } from "ui/frame";
import { Label } from "ui/label";
import { NavigatedData, Page } from "ui/page";
import { CreateViewEventData } from "ui/placeholder";
import { Repeater } from "ui/repeater";
import { TextView } from "ui/text-view";
import { SelectedPageService } from "~/shared/selected-page-service";
import { CategoryListViewModel } from "./category-list-view-model";

let vm: CategoryListViewModel;
let _page: any;
const banner: any = {};
let categoryList: ListView;
let startButton: any;

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
    _page = page;
    categoryList = _page.getViewById("categoryList");
    startButton = page.getViewById("startButton");
    startButton.visibility = "collapsed";
    SelectedPageService.getInstance().updateSelectedPage("category");
    vm = new CategoryListViewModel();
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
    // resetBanner();
    vm.showDrawer();
}

import { AnimationCurve } from "tns-core-modules/ui/enums";

export function selectCategory(args): void {
    vm.selectCategory(args);
    categoryList.refresh();
    if (vm.categoriesSelected) {
        if (startButton.visibility !== "visible") {
            startButton.visibility = "visible";
            startButton.translateY = 300;
            startButton.animate({ translate: { x: 0, y: 0 }, opacity: 1, duration: 500 });
        }
    } else {
        startButton.animate({ translate: { x: 0, y: 300 }, opacity: 1, duration: 500  }).then(() => {
            startButton.visibility = "collapsed";
        });
        // startButton.animate({ translate: { x: 0, y: -200 }, opacity: 1, duration: 500 });
        // startButton.translateY = 0;
        // startButton.visibility = "collapsed";
        // startButton.opacity = 0;
        // startButton.visibility = "collapsed";
    }
}

export function start() {
    vm.start();
}
