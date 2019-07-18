"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("tns-core-modules/platform");
var coolAds_1 = require("~/admob/coolAds");
var question_view_model_1 = require("~/question/question-view-model");
var http_service_1 = require("~/services/http.service");
var persistence_service_1 = require("~/services/persistence.service");
var admob_common_js_1 = require("../admob/admob-common.js");
var constantsModule = require("../shared/constants");
var AdService = /** @class */ (function () {
    function AdService() {
        var _this = this;
        this._showAd = true;
        if (!persistence_service_1.PersistenceService.getInstance().isPremium()) {
            http_service_1.HttpService.getInstance().showAds().then(function (show) {
                _this._showAd = show === "true";
            });
        }
        else {
            this._showAd = false;
        }
    }
    Object.defineProperty(AdService.prototype, "showAd", {
        get: function () {
            return this._showAd;
        },
        set: function (showAd) {
            this._showAd = showAd;
        },
        enumerable: true,
        configurable: true
    });
    AdService.getInstance = function () {
        return AdService._instance;
    };
    AdService.prototype.showInterstitial = function () {
        if (this._showAd) {
            this.doShowInterstitial();
        }
    };
    AdService.prototype.showSmartBanner = function () {
        if (this._showAd) {
            return this.doCreateSmartBanner();
        }
    };
    AdService.prototype.hideAd = function () {
        if (this._showAd) {
            coolAds_1.CoolAds.getInstance().hideBanner().then(function () { return console.log("Banner hidden"); }, function (error) { return console.error("Error hiding banner: " + error); });
        }
    };
    AdService.prototype.getAdHeight = function () {
        var height = 0;
        if (this._showAd) {
            var screenHeight = platform_1.screen.mainScreen.heightDIPs;
            if (screenHeight > 400 && screenHeight < 721) {
                height = 50;
            }
            else if (screenHeight > 720) {
                height = 90;
            }
        }
        return height;
    };
    AdService.prototype.doCreateSmartBanner = function () {
        return this.createBanner(admob_common_js_1.AD_SIZE.SMART_BANNER);
    };
    /*doCreateSkyscraperBanner(): void {
        this.createBanner(AD_SIZE.SKYSCRAPER);
    }

    doCreateLargeBanner(): void {
        this.createBanner(AD_SIZE.LARGE_BANNER);
    }

    doCreateRegularBanner(): void {
        this.createBanner(AD_SIZE.BANNER);
    }

    doCreateRectangularBanner(): void {
        this.createBanner(AD_SIZE.MEDIUM_RECTANGLE);
    }

    doCreateLeaderboardBanner(): void {
        this.createBanner(AD_SIZE.LEADERBOARD);
    }*/
    AdService.prototype.doShowInterstitial = function () {
        if (this._showAd) {
            coolAds_1.CoolAds.getInstance().showInterstitial().then(function () { return console.log("Shown interstetial..."); }, function (error) { return console.log("Error showing interstitial", error); });
        }
    };
    AdService.prototype.doPreloadInterstitial = function (resolve, reject) {
        var _this = this;
        if (this._showAd) {
            coolAds_1.CoolAds.getInstance().preloadInterstitial({
                testing: AdService._testing,
                iosInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                androidInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                onAdClosed: function () {
                    _this.doPreloadInterstitial(resolve, reject);
                }
            }).then(function () {
                console.log("Interstitial preloaded");
                resolve();
            }, function (error) {
                console.log("Error preloading interstitial: " + error);
                reject(error);
            });
        }
    };
    AdService.prototype.doCreateInterstitial = function () {
        if (this._showAd) {
            coolAds_1.CoolAds.getInstance().createInterstitial({
                testing: AdService._testing,
                iosInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                androidInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                onAdClosed: function () {
                    console.log("doCreate Closed...");
                }
            }).then(function () { return console.log("Interstitial created"); }, function (error) { return console.error("Error creating interstitial: " + error); });
        }
    };
    AdService.prototype.delayedPreloadInterstitial = function () {
        setTimeout(function () {
            if (!persistence_service_1.PersistenceService.getInstance().isPremium()) {
                AdService.getInstance().doPreloadInterstitial(function () {
                    question_view_model_1.QuestionViewModel._errorLoading = false;
                }, function () {
                    question_view_model_1.QuestionViewModel._errorLoading = true;
                });
            }
        }, 2000);
    };
    AdService.prototype.preloadVideoAd = function (arg, rewardCB, reload, afterAdLoaded) {
        return coolAds_1.CoolAds.getInstance().preloadVideoAd(arg, rewardCB, reload, afterAdLoaded);
    };
    AdService.prototype.showVideoAd = function () {
        return coolAds_1.CoolAds.getInstance().showVideoAd();
    };
    AdService.prototype.adLoaded = function () {
        return coolAds_1.CoolAds.getInstance().adLoaded();
    };
    AdService.prototype.createBanner = function (size) {
        return coolAds_1.CoolAds.getInstance().createBanner({
            testing: AdService._testing,
            // if this 'view' property is not set, the banner is overlayed on the current top most view
            // view: ..,
            size: size,
            iosBannerId: constantsModule.BANNER_AD_ID,
            androidBannerId: constantsModule.BANNER_AD_ID,
            // Android automatically adds the connected device as test device with testing:true, iOS does not
            // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
            margins: {
                // if both are set, top wins
                // top: 10
                bottom: platform_1.isIOS ? 50 : 0
            },
            keywords: ["games", "education"]
        });
    };
    AdService._testing = false;
    AdService._instance = new AdService();
    return AdService;
}());
exports.AdService = AdService;
