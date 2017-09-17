angular.module('UkTimeServices', ['ionic-ratings', 'ion-datetime-picker', 'ion-google-autocomplete', 'ionic', 'UkTimeServices.controllers', 'UkTimeServices.routes', 'UkTimeServices.services', 'ngStorage', 'ngCordova', 'ngMessages', 'angular-stripe'])

.config(function($logProvider, $ionicConfigProvider, $sceDelegateProvider, stripeProvider, $httpProvider) {
        $logProvider.debugEnabled(false);
      stripeProvider.setPublishableKey('pk_live_pcAGlfUvvbKjp1uP2EIsUkTp');
      //  stripeProvider.setPublishableKey('pk_test_owY5ClbQiLSr3jEyBH3aW1f8');
        $ionicConfigProvider.backButton.text('').previousTitleText(false);
        $httpProvider.interceptors.push('timeoutHttpIntercept');
    })
    .constant('SERVERLINK', {
        URL: 'http://uktimeservices.co.uk/api/api/'
    })

.run(function($ionicLoading, $cordovaSplashscreen, UkTimeServices, $location, $ionicPlatform, $rootScope, $state, $ionicHistory, $localStorage, $cordovaToast, $timeout) {

        $ionicPlatform.ready(function() {
             if (window.Connection) {
                        if (navigator.connection.type == Connection.NONE) {
                              $state.go('main.login')
                        $timeout(function() {
                            $cordovaSplashscreen.hide();
                        }, 1000);
                        }
                    }
        	$rootScope.hitfordevicetoken=function(){
        		if((ionic.Platform.isIOS() || ionic.Platform.isAndroid())){
        		   var push = PushNotification.init({

        		            android: {
        		                senderID: "317704156389",
        		            },
        		            ios: {
        		                alert: "true",
        		                badge: "true",
        		                sound: "true"
        		            },
        		        });
        		       document.addEventListener("deviceready", function(){
        		        push.on('registration', function(data) {
        		            $localStorage.device_token = data.registrationId;
        		            console.info($localStorage.device_token);
        		           
        		             })

        		        });
        		        push.on('notification', function(data) {
        		        	console.info(data);
        		            $ionicLoading.show({
        		                template: data.message,
        		                noBackdrop: true,
        		                duration: 2000
        		            });
        		            $rootScope.checkit();
        		        });
        		        push.on('error', function(e) {
        		            console.info(e)
        		        });
        		    }
        		}
            $rootScope.goTo = function(path) {
                $state.go(path);
            }
            var warnedExit = false;
            $ionicPlatform.registerBackButtonAction(function(event) {
            	if ($state.current.name == "main.login" || $state.current.name == "main.customerRatings") {
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
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            }, 1000);


            $rootScope.checkit = function() {
            	console.info(new Date());
                $localStorage.valueforstop = '';
                if (window.Connection) {
                    if (navigator.connection.type == Connection.NONE) {
                        $state.go('main.login');
                        $timeout(function() {
                            $cordovaSplashscreen.hide();
                        }, 1000);
                    }
                }
                UkTimeServices.check().then(function(_response) {
                	console.log(_response)
                    if (_response.status == "OK") {
                         $localStorage.mylastnamedata=_response.user_profile.last_name;
                     console.info($localStorage.mylastnamedata);
                 	 if(_response.user_profile.rating != false){
                        $state.go("main.customerRatings",{},{reload:true});
                        console.info( _response.user_profile.rating[0]);
                            $localStorage.jobid = _response.user_profile.rating[0].job_id;
                            $localStorage.toid = _response.user_profile.rating[0].to_id;
                            $localStorage.ratingimage=_response.user_profile.rating[0].image;
                            $localStorage.nameofrating=_response.user_profile.rating[0].name;
                    		console.info(_response.user_profile.rating);
                    		$timeout(function() {
                                $ionicLoading.hide();
                                $cordovaSplashscreen.hide();
                            },1000);
                    		return false
                    	}
                        $localStorage.myid = _response.user_profile.user_id;
                        console.info($localStorage.myid);
                        $state.go('menu.customerHome')
                        $timeout(function() {
                            $ionicLoading.hide();
                            $cordovaSplashscreen.hide();
                        }, 1000);
                    } else {
                        $state.go('main.login')
                        $timeout(function() {
                            $ionicLoading.hide();
                            $cordovaSplashscreen.hide();
                        }, 1000);
                    }
                }, function(response) {
                    
                    UkTimeServices.reponseHandler(response);
                })
            }
            $rootScope.checkit();

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
    .directive('upwardsScoll', function($timeout) {
        return {
            link: function(scope, elem, attr, ctrl) {
                var raw = elem[0];

                elem.bind('scroll', function() {
                    if (raw.scrollTop <= 0) {
                        var sh = raw.scrollHeight;
                        scope.$apply(attr.upwardsScoll);

                        $timeout(function() {
                            elem.animate({
                                scrollTop: raw.scrollHeight - sh
                            }, 500);
                        }, 0);
                    }
                });
                $timeout(function() {
                    scope.$apply(function() {
                        elem.scrollTop(raw.scrollHeight);
                    });
                }, 0);
            }
        }
    })
    .filter('MMM', function($filter) {
        return function(input) {
            if (input == null) {
                return "";
            }

            var _date = $filter('date')(new Date(input),
                'yyyy/mm/dd');

            return _date.toUpperCase();
        };
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