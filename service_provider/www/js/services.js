angular.module('UkTimeServices.services', [])

.factory('timeoutHttpIntercept', function($rootScope, $q) {
    return {
        'request': function(config) {
            config.timeout = 20000;
            return config;
        }

    };
})

.factory('deviceToken', function($rootScope, $q, $localStorage, $ionicLoading, $ionicPlatform) {

    return {
        'hitfordevicetoken': function() {
            $ionicPlatform.ready(function() {
                if ((ionic.Platform.isIOS() || ionic.Platform.isAndroid())) {
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
                    document.addEventListener("deviceready", function() {
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

                    });
                    push.on('error', function(e) {
                        console.info(e)
                    });

                }
            })
        }
    }
})

.factory('UkTimeServices', ['$q', '$http', 'timeoutHttpIntercept', '$state', 'SERVERLINK', '$ionicLoading', '$rootScope', '$localStorage', function($q, $http, timeoutHttpIntercept, $state, SERVERLINK, $ionicLoading, $rootScope, $localStorage) {



    $http.defaults.useXDomain = true;
    $rootScope.$storage = $localStorage;

    Object.toparams = function(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };

    function getAuthCode(query) {
        var auth_code = $rootScope.$storage.auth_code;
        if (auth_code != null) {
            if (query == true) {
                return '?auth_code=' + auth_code;
            } else {
                return auth_code;
            }
        } else {
            console.log('Authorisation code not found!');
            return '';
        }
    }
    return {
        reponseHandler: function(response) {
            if (response == null) {
                $ionicLoading.show({
                    template: 'Slow Internet Connection',
                    duration: 1200,
                });
            }
            timeoutHttpIntercept.request(response);
        },


        register: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/user-signup',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        login: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/proLogin',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        stripepay: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/addCard' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        sendresdule: function(myobject) {

            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'serCancellation/reSechdule?id=' + $localStorage.useridforchat + '&booking_id=' + $localStorage.booking_id + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        invoiceadd: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'invoice/add?id=' + $localStorage.customeridata + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.info(req);
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        taskBooking: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/myBookings' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        cancelreason: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'serCancellation/cancel' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {

                deferred.reject(data);
            });
            return deferred.promise;
        },

        myalljobs: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/bookedJob' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.info(req);
            $http(req).
            success(function(response) {
                console.info(response)
                deferred.resolve(response);
            }).
            error(function(data) {
                console.info(data)
                deferred.reject(data);
            });
            return deferred.promise;
        },
        servicecompleted: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'service/completed' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        cancelsedule: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/cancel?id=' + $localStorage.taskidofcancel + '&user_id=' + $localStorage.useridforchat + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },

        check: function(myobject) {

            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/check' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        updateProfile: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/updateProfile' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },

        changePassword: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/changePassword' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        forgotPassword: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/recover',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        logout: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/logout' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        customerHome: function(myobject) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'service/index',
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {

                deferred.resolve(response);
            }).
            error(function(data) {

                deferred.reject(data);
            });
            return deferred.promise;
        },
        notification: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/notification' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        myjobslists: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/job' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        jobslistafterpay: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/jobslistafterpay' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        taskBookingview: function(myobject, taskid) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/view/id/' + $localStorage.taskid + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        taskBookingaccept: function(myobject, taskid, userid) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'task-booking/accept?id=' + $localStorage.taskid + '&user_id=' + $localStorage.myid,
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'auth_code': getAuthCode(false)
                }
            }

            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {

                deferred.reject(data);
            });
            return deferred.promise;
        },
        viewacceptedjobs: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'task-booking/myacceptedjobs' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        taskBookingreject: function(myobject, taskid) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/reject/id/' + $localStorage.taskid + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        getUser: function(myobject, user_id) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'user/getUser?id=' + $localStorage.useridforchat + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);
            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        messagesend: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'message/sendMessage/' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        imagesend: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'message/sendFile' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        messageget: function(myobject) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'message/getMessage?id=' + $localStorage.myid + '&booking_id=' + $localStorage.taskidforchating + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);

            });
            return deferred.promise;
        },
        messagegetList: function(myobject) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'message/getList' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);

            });
            return deferred.promise;
        },
        acceptedTaskservice: function(myobject) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'task-booking/customerTask' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);

            });
            return deferred.promise;
        }

    }

}]);