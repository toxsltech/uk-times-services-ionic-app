angular.module('UkTimeServices.services', [])

.factory('timeoutHttpIntercept', function($rootScope, $q) {
    return {
        'request': function(config) {
            config.timeout = 20000;
            return config;
        }
    };
})

.factory('UkTimeServices', ['$cordovaSplashscreen', '$timeout', '$q', '$http', 'timeoutHttpIntercept', '$state', 'SERVERLINK', '$ionicLoading', '$rootScope', '$localStorage', function($cordovaSplashscreen, $timeout, $q, $http, timeoutHttpIntercept, $state, SERVERLINK, $ionicLoading, $rootScope, $localStorage) {



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
            $state.go('main.login')
            $timeout(function() {
                $ionicLoading.hide();
            }, 1000);
            return '';
        }
    }
    return {

        reponseHandler: function(response) {
            if (response == null) {
                $ionicLoading.show({
                    template: 'ERR_INTERNET_DISCONNECTED',
                    duration: 1200,
                });
            }
            if (response == undefined) {
                $ionicLoading.show({
                    template: 'Server is not responding',
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
                url: SERVERLINK.URL + 'user/login',
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
                url: SERVERLINK.URL + 'serCancellation/reSechdule?id=' + $localStorage.myid + '&booking_id=' + $localStorage.booking_id + getAuthCode(true),
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

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'service/index' + getAuthCode(true),
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
        myalljobs: function(myobject) {

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
        taskBooking: function(myobject) {

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/add' + getAuthCode(true),
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
           allocate: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/allocate-job' + getAuthCode(true),
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
        mycompleteJobjos: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'taskBooking/completeJob' + getAuthCode(true),
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
        viewacceptedjobs: function(myobject) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                noBackDrop: false,
            });
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
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'message/sendMessage/' + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req)
            $http(req).
            success(function(response) {
                deferred.resolve(response);

            }).
            error(function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        customerRating: function(myobject) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: SERVERLINK.URL + 'ser-rating/add' + getAuthCode(true),
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
              
                url: SERVERLINK.URL + 'message/getMessage?id=&&' + $localStorage.myid + '&booking_id=' + $localStorage.taskidforchating + getAuthCode(true),
                data: Object.toparams(myobject),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req)
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