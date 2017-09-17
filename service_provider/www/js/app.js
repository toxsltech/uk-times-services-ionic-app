angular.module('UkTimeServices', ['rw.moneymask','ionic-numberpicker', 'ionic-timepicker', 'ion-datetime-picker', 'ionic', 'UkTimeServices.controllers', 'UkTimeServices.routes', 'UkTimeServices.directives', 'UkTimeServices.services', 'ngStorage', 'ngCordova', 'ngMessages'])

.config(function($ionicConfigProvider, $sceDelegateProvider, $httpProvider) {



        $ionicConfigProvider.backButton.text('').previousTitleText(false);

        $httpProvider.interceptors.push('timeoutHttpIntercept');

        // $ionicConfigProvider.views.maxCache(0);

    })
    .constant('SERVERLINK', {
        URL: 'http://uktimeservices.co.uk/api/api/'
    })


.run(function($cordovaSplashscreen, UkTimeServices, $ionicPlatform, $rootScope, $state, $localStorage, $timeout, $cordovaToast, $location, $ionicHistory, $ionicLoading) {
        var warnedExit = false;
        $localStorage.checkvalueforcalc = undefined;
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $state.go('main.login')
                $timeout(function() {
                    $cordovaSplashscreen.hide();
                }, 1000);
                return false;
            }
        }
        $ionicPlatform.registerBackButtonAction(function(event) {
            if ($location.path() == "/main/login") {
                if (!$ionicHistory.backView()) {
                    if (!warnedExit) {
                        event.preventDefault();
                        warnedExit = true;
                        $cordovaToast.showLongCenter('Press back again to exit.')
                        $timeout(function() {
                            warnedExit = false;
                        }, 3000);
                    } else {
                        ionic.Platform.exitApp();
                    }
                } else {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.goBack();
                }
            } else {
                event.preventDefault();
            }
        }, 1000);

        $rootScope.checkit = function() {
            $localStorage.valueforstop = '';
            $localStorage.enter == undefined
            UkTimeServices.check().then(function(_response) {
                    console.log(_response);
                    if (_response.status == "OK") {
                          $state.go("menu.spHome",{},{reload:true});
                        $timeout(function() {
                            $cordovaSplashscreen.hide();
                        }, 1000);
                    } else {
                        $ionicLoading.hide();
                        $state.go('main.login')
                        $timeout(function() {
                            $cordovaSplashscreen.hide();
                        }, 1000);
                    }
                },
                function(response) {
                    $cordovaSplashscreen.hide();
                    UkTimeServices.reponseHandler(response);
                })

        }
        $rootScope.checkit();


        $ionicPlatform.ready(function() {
            $rootScope.goTo = function(path) {
                $state.go(path);
            }
           
                    if (window.Connection) {
                        if (navigator.connection.type == Connection.NONE) {
                              $state.go('main.login')
                        $timeout(function() {
                            $cordovaSplashscreen.hide();
                        }, 1000);
                        }
                    }


            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


        });

        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        $rootScope.windowPaddingWidth = screenWidth - 10;
        $rootScope.customerHomeScreenHeight = screenHeight - 74;
        $rootScope.Height35 = (screenHeight - 74) * 0.35;
        $rootScope.Height50 = (screenHeight - 74) / 2;
        $rootScope.Height65 = (screenHeight - 74) * 0.65;
        $rootScope.itemBoxSize = ($rootScope.windowPaddingWidth) * 0.47;
        $rootScope.itemBoxImgSize = ($rootScope.itemBoxSize) * 0.50;
        $rootScope.profileImgBoxSize = ($rootScope.customerHomeScreenHeight) * 0.35;
    })
    .filter('MMM', function($filter) {
        return function(input) {
            if (input == null) { return ""; }

            var _date = $filter('date')(new Date(input),
                'MMM');

            return _date.toUpperCase();

        };
    })
    .filter('daY', function($filter) {
        return function(input) {
            if (input == null) { return ""; }

            var _date = $filter('date')(new Date(input),
                'dd');

            return _date.toUpperCase();

        };
    })
    .filter('year', function($filter) {
        return function(input) {
            if (input == null) { return ""; }

            var _date = $filter('date')(new Date(input),
                'yyyy');

            return _date.toUpperCase();

        };
    })
    .directive('realTimeCurrency', function ($filter, $locale) {
    var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
    var toNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
    var trailingZerosRegex = new RegExp('\\' + decimalSep + '0');
    var filterFunc = function (value) {
        return $filter('currency')(value,'£','2');
    };

    function getCaretPosition(input){
        if (!input) return 0;
        if (input.selectionStart !== undefined) {
            return input.selectionStart;
        } else if (document.selection) {
            // Curse you IE
            input.focus();
            var selection = document.selection.createRange();
            selection.moveStart('character', input.value ? -input.value.length : 0);
            return selection.text.length;
        }
        return 0;
    }

    function setCaretPosition(input, pos){
        if (!input) return 0;
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
            return; 
        }
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(pos, pos);
        }
        else if (input.createTextRange) {
           
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    
    function toNumber(currencyStr) {
        return parseFloat(currencyStr.replace(toNumberRegex, ''), 10);
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function postLink(scope, elem, attrs, modelCtrl) {    
            modelCtrl.$formatters.push(filterFunc);
            modelCtrl.$parsers.push(function (newViewValue) {
                var oldModelValue = modelCtrl.$modelValue;
                var newModelValue = toNumber(newViewValue);
                modelCtrl.$viewValue = filterFunc(newModelValue);
                var pos = getCaretPosition(elem[0]);
                elem.val(modelCtrl.$viewValue);
                var newPos = pos + modelCtrl.$viewValue.length -
                                   newViewValue.length;
                if ((oldModelValue === undefined) || isNaN(oldModelValue)) {
                    newPos -= 3;
                }
                setCaretPosition(elem[0], newPos);
                return newModelValue;
            });
        }
    };
});
