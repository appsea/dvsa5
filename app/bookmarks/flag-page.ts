import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { isAndroid, screen } from "tns-core-modules/platform";
import * as ButtonModule from "tns-core-modules/ui/button";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { SwipeDirection } from "tns-core-modules/ui/gestures";
import { Label } from "tns-core-modules/ui/label";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import { ConnectionService } from "~/shared/connection.service";
import { SelectedPageService } from "~/shared/selected-page-service";
import { FlagQuestionModel } from "./flag-question-model";

let vm: FlagQuestionModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let defaultExplanation: Label;
let explanationHeader: Label;
let _page: any;
let scrollView: ScrollView;
let banner: any;
let loaded: boolean = false;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    loaded = false;
    setTimeout(() => showBannerAd(), 1000);
}

function showBannerAd(): void {
    if (vm.length > 0 && AdService.getInstance().showAd && (!loaded || (banner && banner.height === "auto"))) {
        AdService.getInstance().showSmartBanner().then(
            () => {
                loaded = true;
                banner.height = AdService.getInstance().getAdHeight() + "dpi";
            },
            (error) => {
                resetBanner();
            }
        );
    }
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
    loaded = false;
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
    _page = <Page>args.object;
    vm = new FlagQuestionModel();
    _page.bindingContext = vm;
    _page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    banner = _page.getViewById("banner");
    optionList = _page.getViewById("optionList");
    suggestionButton = _page.getViewById("suggestionButton");
    explanationHeader = _page.getViewById("explanationHeader");
    defaultExplanation = _page.getViewById("defaultExplanation");
    scrollView = _page.getViewById("scrollView");
    SelectedPageService.getInstance().updateSelectedPage("flag");
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    } else if (args.direction === SwipeDirection.right) {
        previous();
    }
}

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton && scrollView) {
        const locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function previous(): void {
    if (!vm) {
        vm = new FlagQuestionModel();
    }
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function next(): void {
    if (AdService.getInstance().showAd && !ConnectionService.getInstance().isConnected()) {
        dialogs.alert("Please connect to internet so that we can fetch next question for you!");
    } else {
        vm.next();
        showBannerAd();
        if (scrollView) {
            scrollView.scrollToVerticalOffset(0, false);
        }
    }
}

export function showAnswer(): void {
    vm.showAnswer();
    optionList.refresh();
}

export function flag(): void {
    vm.flag();
}

export function selectOption(args): void {
    vm.showAnswer();
    vm.selectOption(args);
    optionList.refresh();
}

export function firstOption(args) {
    divert(0);
}
export function secondOption(args: CreateViewEventData) {
    divert(1);
}
export function thirdOption(args: CreateViewEventData) {
    divert(2);
}
export function fourthOption(args: CreateViewEventData) {
    divert(3);
}

export function divert(index: number) {
    vm.showAnswer();
    vm.selectIndex(index);
    optionList.refresh();
}
