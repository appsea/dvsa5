import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { isAndroid, screen } from "tns-core-modules/platform";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { topmost } from "tns-core-modules/ui/frame";
import { ListView } from "tns-core-modules/ui/list-view";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { Label } from "ui/label";
import { NavigatedData, Page } from "ui/page";
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
    if (vm) {
        vm.refresh();
    }
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

export function practice() {
    vm.practice();
}
