angular.module('UkTimeServices.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // ================ Main Layout ================ //

        .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/layouts/main.html'

    })

    .state('main.login', {
        cache: false,
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
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/signUp.html',
                controller: 'signUp'
            }
        }
    })

    .state('main.signUpSP', {
        url: '/signUpSP',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/signUpSP.html'

            }
        }
    })

    .state('main.signUpSP2', {
        url: '/signUpSP2',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/signUpSP2.html'

            }
        }
    })

    .state('main.book', {
        url: '/book',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/book.html'

            }
        }
    })

    .state('main.profile', {
        url: '/profile',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/profile.html'

            }
        }
    })

    .state('main.chat', {
        url: '/chat',
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/chat.html',
                controller: 'chatctrl'

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

    .state('main.customerRatings', {
        url: '/customerRatings',
        cache: false,
        views: {
            'mainView': {
                templateUrl: 'templates/views/main/customerRatings.html',
                controller: 'loginCtrl'
            }
        }
    })


    // ================ Menu Layout ================ //

    .state('menu', {
        url: '/menu',
        abstract: true,
        cache: false,
        templateUrl: 'templates/layouts/menu.html',
        controller: 'CustomerProfile'
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
        .state('menu.notification', {
            url: '/notification',
            cache: false,
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/notification.html',
                    controller: 'CustomerProfile'
                }
            }
        })
            .state('menu.allocate', {
            url: '/allocate',
            cache: false,
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/allocate.html',
                    controller: 'CustomerProfile'
                }
            }
        })

    .state('menu.customerServices', {
            url: '/customerServices',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/customerServices.html',
                    controller: 'CustomerProfile'
                }
            }

        })
        .state('menu.customerHome', {
            url: '/customerHome',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/customerHome.html',
                    controller: 'CustomerHome'
                }
            }

        })
        .state('menu.sechdule', {
            url: '/sechdule',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/sechdule.html',
                    controller: 'CustomerProfile'
                }
            }

        })
        .state('menu.customerBook', {
            url: '/customerBook',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/customerBook.html',
                    controller: 'CustomerBookCtrl'
                }
            }

        })

    .state('menu.customerBook2', {
            url: '/customerBook2',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/customerBook2.html',
                    controller: 'CustomerBookCtrl'
                }
            }

        })
        .state('menu.customerProfile', {
            url: '/customerProfile',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/customerProfile.html',
                    controller: 'CustomerProfile'
                }
            }

        })
        .state('menu.customerSettings', {
            url: '/customerSettings',
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/customerSettings.html',
                    controller: 'CustomerProfile'
                }
            }

        })
                .state('menu.aboutapp', {
            url: '/aboutapp',
            views: {
                'menuView': {
                    templateUrl: 'templates/views/menu/aboutapp.html',
                    controller: 'CustomerProfile'
                }
            }

        })
        .state('menu.changePassword', {
            url: '/changePassword',
            views: {
                cache: false,
                'menuView': {
                    templateUrl: 'templates/views/menu/changePassword.html',
                    controller: 'ChangePassword'
                }
            }

        })

     // ================ Otherwise ================ //

      


});