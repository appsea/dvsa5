"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ads_js_1 = require("../admob/ads.js");
var platform_1 = require("tns-core-modules/platform");
var persistence_service_1 = require("~/services/persistence.service");
var constantsModule = require("../shared/constants");
var http_service_1 = require("../services/http.service");
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
            ads_js_1.hideBanner().then(function () { return console.log("Banner hidden"); }, function (error) { return console.error("Error hiding banner: " + error); });
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
        return this.createBanner(ads_js_1.AD_SIZE.SMART_BANNER);
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
            ads_js_1.showInterstitial().then(function () { return console.log("Shown interstetial..."); }, function (error) { return console.log("Error showing interstitial", error); });
        }
    };
    AdService.prototype.doPreloadInterstitial = function (resolve, reject) {
        var _this = this;
        if (this._showAd) {
            ads_js_1.preloadInterstitial({
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
            ads_js_1.createInterstitial({
                testing: AdService._testing,
                iosInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                androidInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
                onAdClosed: function () {
                    console.log("doCreate Closed...");
                }
            }).then(function () { return console.log("Interstitial created"); }, function (error) { return console.error("Error creating interstitial: " + error); });
        }
    };
    AdService.prototype.createBanner = function (size) {
        return ads_js_1.createBanner({
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
