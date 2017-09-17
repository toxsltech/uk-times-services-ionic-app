angular.module('UkTimeServices.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    // ================ Main Layout ================ //

        .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/layouts/main.html'
    })

    .state('main.login', {
        url: '/login',
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/login.html',
                controller: 'loginCtrl'

            }
        }
    })

    .state('main.signUp', {
        url: '/signUp',
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/signUp.html',
                controller: 'signUp'
            }
        }
    })



    .state('main.signUpSP2', {
            url: '/signUpSP2',
            views: {
                'mainView': {
                    templateUrl: 'templates/views/main/signUpSP2.html',
                    controller: 'signUp'

                }
            }
        })
        .state('main.spProfile', {
            url: '/spProfile',
            cache: false,
            views: {
                'mainView': {
                    templateUrl: 'templates/views/main/spProfile.html',
                    controller: 'getprofile'

                }
            }
        })
        .state('main.spServiceRequest', {
            url: '/spServiceRequest',
            cache: false,
            views: {
                'mainView': {
                    templateUrl: 'templates/views/main/spServiceRequest.html',
                    controller: 'getprofile'
                }
            }
        })




    .state('main.forgotPassword', {
        url: '/forgotPassword',
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/forgotPassword.html',
                controller: 'ForgotPassword'
            }
        }
    })

    .state('main.chat', {
        url: '/chat',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/chat.html',
                controller: 'chatctrl'

            }
        }
    })

    .state('main.changePassword', {
        url: '/changePassword',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/changePassword.html',
                controller: 'changePassword'

            }
        }
    })



    .state('menu.spSettings', {
        url: '/spSettings',
        views: {
            'menuView': {
                templateUrl: 'templates/views/menu/spSettings.html',
                controller: 'changePassword'

            }
        }

    })

    .state('menu.aboutapp', {
        url: '/aboutapp',
        views: {
            'menuView': {
                templateUrl: 'templates/views/menu/aboutapp.html',
                controller: 'changePassword'

            }
        }

    })

    .state('menu.spHome', {
            cache: false,
            url: '/spHome',
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/spHome.html',
                    controller: 'getprofile'

                }
            }

        })
        .state('menu.spNotifications', {
            url: '/spNotifications',
            cache: false,
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/spNotifications.html',
                    controller: 'getprofile'
                }
            }
        })
        .state('menu.message', {
            url: '/message',
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/messages.html',
                    controller: 'getprofile'

                }
            }
        })

    // ================ Menu Layout ================ //

    .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'templates/layouts/menu.html',
        controller: 'getprofile'
    })

    .state('menu.home', {
            url: '/home',
            cache: false,
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/home.html'

                }
            }

        })
        .state('menu.spSchedule', {
            url: '/spSchedule',
            cache: false,
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/spSchedule.html',
                    controller: 'getprofile'

                }
            }

        })

    .state('menu.spScheduleDetails', {
        url: '/spScheduleDetails',
        cache: false,
        views: {
            'menuView': {
                templateUrl: 'templates/views/menu/spScheduleDetails.html',
                controller: 'getprofile'

            }
        }

    })




});