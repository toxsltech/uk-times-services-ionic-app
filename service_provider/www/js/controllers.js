angular.module('UkTimeServices.controllers', [])

.controller('loginCtrl', ['deviceToken', '$cordovaSplashscreen', '$timeout', '$location', '$ionicHistory', '$ionicPopup', '$cordovaToast', '$ionicPlatform', '$localStorage', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$interval',

        function(deviceToken, $cordovaSplashscreen, $timeout, $location, $ionicHistory, $ionicPopup, $cordovaToast, $ionicPlatform, $localStorage, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $interval) {

            $scope.$on('$ionicView.enter', function() {
                if ($state.current.name == 'main.login') {
                    console.log(deviceToken)
                    deviceToken.hitfordevicetoken();
                }
            })

            $scope.user = {};
            if ($localStorage.checktrue == true) {
                $scope.user.password = $localStorage.password;
                $scope.user.email = $localStorage.username;
                $scope.HasPassport = true;
            } else {
                $scope.user.password = '';
                $scope.user.email = '';
            }
            $scope.CheckPassport = function(HasPassport) {
                if (HasPassport == 'true') {
                    $localStorage.checktrue = HasPassport;
                    $scope.HasPassport = true;
                } else {
                    $localStorage.checktrue = HasPassport;
                }
            }
            $scope.checkinternet = function() {
                console.log("called")
                $ionicPlatform.ready(function() {
                    if (window.Connection) {
                        if (navigator.connection.type == Connection.NONE) {
                            $localStorage.connectionhave = 'NO';
                            $ionicLoading.show({
                                template: 'Sorry, no Internet connectivity detected. Please reconnect',
                                duration: 4000
                            })
                            $cordovaSplashscreen.hide();
                        } else {
                            if ($localStorage.connectionhave == 'NO') {
                                $localStorage.connectionhave = 'YES'
                                $rootScope.checkit();
                                $ionicLoading.show({
                                    template: 'Please Wait',
                                    duration: 3000
                                })
                            }
                        }
                    }
                })
            }
            $interval(function() {
                $scope.checkinternet();
            }, 3000);

            $scope.login = function(user) {
                if (user.$valid == false) {
                    $cordovaToast.showLongCenter('Please Fill Details');
                    return false;
                }

                if ((ionic.Platform.isIOS())) {
                    $scope.device_type = 2;
                } else {
                    $scope.device_type = 1;
                }
                var req = {
                    'LoginForm[username]': $scope.user.email,
                    'LoginForm[password]': $scope.user.password,
                    'LoginForm[device_token]': $localStorage.device_token,
                    'LoginForm[device_type]': $scope.device_type
                }
                if ($localStorage.checktrue == true) {
                    $localStorage.password = $scope.user.password;
                    $localStorage.username = $scope.user.email;
                } else {
                    $localStorage.$reset();
                    $localStorage.username = '';
                    $localStorage.password = '';
                }
                console.info(req);
                UkTimeServices.login(req).then(function(_response) {
                    $localStorage.auth_code = _response.auth_code;
                    if (_response.status == 'OK') {
                        $localStorage.password = $scope.user.password;
                        $ionicLoading.hide();
                        $cordovaToast.showLongCenter('Login successfully');
                        $state.go("menu.spHome",{},{reload:true});
                    } else {
                        $ionicLoading.show({
                            template: _response.error,
                            duration: 1200,
                            noBackDrop: true,
                        });
                    }

                }, function(response) {
                    UkTimeServices.reponseHandler(response);
                })
            }


        }
    ])
    .controller('chatctrl', ['$ionicModal', '$ionicGesture', '$cordovaToast', '$state', '$location', 'SERVERLINK', '$cordovaFileTransfer', '$rootScope', '$interval', '$ionicLoading', 'UkTimeServices', '$ionicScrollDelegate', '$localStorage', '$cordovaCamera', '$ionicActionSheet', '$scope', '$cordovaImagePicker', function($ionicModal, $ionicGesture, $cordovaToast, $state, $location, SERVERLINK, $cordovaFileTransfer, $rootScope, $interval, $ionicLoading, UkTimeServices, $ionicScrollDelegate, $localStorage, $cordovaCamera, $ionicActionSheet, $scope, $cordovaImagePicker) {

 $rootScope.messagedata = [];

        $ionicModal.fromTemplateUrl('modal.html', function(modal) {
            $scope.gridModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        })
        $scope.openModal = function(data) {
            console.info(data);
            $scope.inspectionItem = data;
            $scope.gridModal.show();
        }
        $scope.closeModal = function() {
            $scope.gridModal.hide();
        }


        $scope.gesture = {
            used: ''
        };

        $scope.onGesture = function(gesture) {
            $scope.gesture.used = gesture;
            if (gesture == 'Swipe Down') {
                $localStorage.valueforstop = '';
            }
            if (gesture == 'Swipe up') {
                $localStorage.valueforstop = 'valuestroesd';
            }
        }


        var element = angular.element(document.querySelector('#content'));

        $ionicGesture.on('tap', function(e) {
            $scope.$apply(function() {
                $scope.gesture.used = 'Tap';
            })
        }, element);

        $scope.data = '';
        $scope.serviceid = $localStorage.useridforchat;
        $scope.customerid = $localStorage.myid;
       
        $scope.sendimage = [];
        $scope.sendMessage = function(data) {

            if (data == '' || data == undefined) {
                return false;
            }
            $ionicScrollDelegate.scrollBottom();
            $rootScope.messagedata.push(data)
            var timerdate = new Date();
            var req = {
                'Message[content]': data,
                'Message[to_id]': $localStorage.useridforchat,
                'Message[from_id]': $localStorage.myid,
                'Message[send_time]': timerdate,
                'Message[latitude]': '30.7132134',
                'Message[longitude]': '76.7095012',
                'Message[type_id]': '4',
                'Message[create_time]': timerdate,
                'Message[booking_id]': $localStorage.taskidforchating
            }
            console.info(req);
            UkTimeServices.messagesend(req).then(function(_response) {
                $localStorage.valueforstop = 'valuestroesd';
                $scope.data = '';
                if (_response.status == 'OK') {
                    $ionicLoading.hide();
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $rootScope.getchat = function() {
            $scope.imageDatapro = '';
            UkTimeServices.messageget().then(function(_response) {
                if (_response.status == 'OK') {
                    $scope.imageDatapro = '';
                    $localStorage.imageset = '';
                    $rootScope.messagedata = _response.messages;
                    $ionicScrollDelegate.scrollBottom();
                    $ionicLoading.hide();
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $rootScope.getchat();

        var myInterval = $interval(function() {

            if ($localStorage.valueforstop == 'valuestroesd') {
                $rootScope.getchat();
            }
        }, 3000);

        $scope.ionicBackforchat = function() {
            $localStorage.valueforstop = '';
            if ($localStorage.checkforsedule != undefined) {
                $state.go('menu.spScheduleDetails');
            } else {
                $state.go('menu.message');
            }

        }
        $scope.actionsheet = function() {
            $ionicActionSheet.show({
                buttons: [
                    { text: '<i class="icon ion-images"></i> Load from Library' },
                    { text: '<i class="icon ion-camera"></i> Use Camera' },
                ],
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            $scope.imagepicker(index);
                            return true;
                        case 1:
                            $scope.camerapicker();
                            return true;
                    }
                }
            });

        }

        $scope.imagepicker = function() {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        $localStorage.imageset = results[i];
                        $scope.imageDatapro = $localStorage.imageset;
                        $cordovaToast.showLongCenter('Sending image');
                        $scope.uploadimage($localStorage.imageset);
                    }
                }, function(error) {
                    console.error(error)
                });
        }
        $scope.camerapicker = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $localStorage.imageset = imageData;
                    $scope.imageDatapro = $localStorage.imageset;
                    $cordovaToast.showLongCenter('Sending image');
                    $scope.uploadimage($localStorage.imageset);
                },
                function(err) {
                    console.info(err)
                }
            )
        }
        var timesend = new Date();
        $scope.uploadimage = function(dataimage) {
            var update_request = {
                'Message[to_id]': $localStorage.useridforchat,
                'Message[booking_id]': $localStorage.taskidforchating,
                'Message[send_time]': timesend
            }
            var url = SERVERLINK.URL + 'message/sendFile' + '?auth_code=' + $localStorage.auth_code;
            var targetPath = dataimage;
            var filename = targetPath.split("/").pop();
            var options = {
                fileKey: "Message[file_path]",
                fileName: targetPath,
                chunkedMode: false,
                mimeType: "image/jpg",
                params: update_request
            };
            $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                console.info(result);
                if (result.response.status == "OK") {
                    $ionicLoading.hide();
                    $scope.imageDatapro = '';
                    $localStorage.imageset = undefined;
                }
            }, function(err) {
                $ionicLoading.hide();
                $scope.imageData = '';
                $cordovaToast.showLongCenter('Image is not sent successfully');
                $localStorage.imageset = '';
            });
        }
    }])
    .controller('signUp', ['$cordovaToast', '$ionicModal', '$ionicPlatform', '$filter', '$localStorage', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading',

        function($cordovaToast, $ionicModal, $ionicPlatform, $filter, $localStorage, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading) {


            $scope.customerHome = function() {
                UkTimeServices.customerHome().then(function(response) {
                    if (response.status == 'OK') {
                        $ionicLoading.hide();
                        $scope.listofskills = response.list;
                        console.info(response)
                    }
                }, function(response) {
                    UkTimeServices.reponseHandler(response);
                })
            }
            $scope.customerHome();

            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.selectskills = function() {
                $scope.modal.hide();
            }
            $scope.selectvalue = [];
            $scope.serverSideChange = function(data, status) {
                if (status == true) {
                    $scope.selectvalue.push(data);
                }
                if (status == false) {
                    var index = $scope.selectvalue.indexOf(data);
                    $scope.selectvalue.splice(index, 1);
                }
            }

            $scope.minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
            $scope.maxdate = new Date(new Date().setFullYear(new Date().getFullYear() - 80))

            $scope.user = {};


            $scope.signUpUser1 = function(userform, user) {
                var day = new Date($scope.user.dob).getDate();
                var month = new Date($scope.user.dob).getMonth() + 1;
                var year = new Date($scope.user.dob).getFullYear();

                if (userform.$valid == false) {
                    return false;
                }
                if (user.password.length <= 7) {
                    $cordovaToast.showLongCenter('Password should have minimum 8 characters');
                    return false;
                }

                if ($scope.user.con_password != $scope.user.password) {
                    $cordovaToast.showLongCenter('Password and conform password is not same');
                    return false;
                }
                $scope.firstchar = $scope.user.phone.charAt(0);

                if ($scope.firstchar != 0) {
                    $cordovaToast.showLongCenter('Phone Number should be start with 0');
                    return false;
                }

                if ($scope.user.phone.length != 11) {
                    $cordovaToast.showLongCenter('Phone Number should be 11 Digit');
                    return false;
                }


                if (userform.$valid == true) {
                    $localStorage.firstname = $scope.user.name;
                    $localStorage.surname = $scope.user.Surname;
                    $localStorage.Address = $scope.user.Address;
                    $localStorage.email = $scope.user.email;
                    $localStorage.password = $scope.user.password;
                    $localStorage.dob = year + "/" + month + "/" + day;
                    $localStorage.nationality = $scope.user.nationality;
                    $localStorage.phone = $scope.user.phone;
                    $state.go('main.signUpSP2')

                }

            }
            $scope.signUpUser2 = function(userform, user) {

                if (userform.$valid == false) {
                    return false;
                }
                if ($scope.selectvalue.length == 0) {

                    $cordovaToast.showLongCenter('You not selected any skills');
                    return false;
                }
                var request = {
                    'User[first_name]': $localStorage.firstname,
                    'User[last_name]': $localStorage.surname,
                    'User[address]': $localStorage.Address,
                    'User[user_email]': $localStorage.email,
                    'User[password]': $localStorage.password,
                    'User[dob]': $localStorage.dob,
                    'User[nationality]': $localStorage.nationality,
                    'User[phone]': $localStorage.phone,
                    'User[branch_code]': $scope.user.Short,
                    'User[bank_name]': $scope.user.Bank,
                    'User[bank_ac_no]': $scope.user.Account,
                    'User[skill]': $scope.selectvalue,
                    'User[experiences]': $scope.user.Experiance,
                    'User[reg_type]': 'P'
                }

                UkTimeServices.register(request).then(function(response) {
                    $ionicLoading.hide();
                    if (response.status == 'OK') {
                        if ((ionic.Platform.isIOS())) {
                            $scope.device_type = 2;
                        } else {
                            $scope.device_type = 1;
                        }
                        var params = {
                            'LoginForm[username]': $localStorage.email,
                            'LoginForm[password]': $localStorage.password,
                            'LoginForm[device_token]': $localStorage.device_token,
                            'LoginForm[device_type]': $scope.device_type
                        }
                        UkTimeServices.login(params).then(function(_response) {
                            $localStorage.auth_code = _response.auth_code;
                            if (_response.status == 'OK') {
                                $ionicLoading.hide();
                                $cordovaToast.showLongCenter('Signup successfully');
                                $state.go('menu.spHome')
                            } else {
                                $cordovaToast.showLongCenter(_response.error);
                            }
                        }, function(_response) {
                            UkTimeServices.reponseHandler(_response);
                        })
                    } else {
                        $cordovaToast.showLongCenter(response.error);
                    }

                }, function(response) {
                    UkTimeServices.reponseHandler(response);
                })
            }


        }
    ])

.controller('changePassword', ['$state', '$cordovaToast', '$cordovaInAppBrowser', '$ionicHistory', '$ionicLoading', '$localStorage', '$scope', 'UkTimeServices', function($state, $cordovaToast, $cordovaInAppBrowser, $ionicHistory, $ionicLoading, $localStorage, $scope, UkTimeServices) {


    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
    };
    $scope.aboutapp = function() {
        $cordovaInAppBrowser.open('http://uktimeservices.co.uk/information/cms/aboutus', '_blank', options)
            .then(function(event) {})
    }
    $scope.privacypolicy = function() {
        $cordovaInAppBrowser.open('http://www.uktimeservices.co.uk/information/cms/privacy-policy', '_blank', options)
            .then(function(event) {})
    }

    $scope.goback = function() {
        $ionicHistory.goBack();
    }
    $scope.changePassword = function(userForm, Current, newvaluepassword, Confirm) {
        if (userForm.$valid == false) {
            return false;
        }
        if (Current != $localStorage.password) {
            $cordovaToast.showLongCenter('Please check your current password');
            return false;
        }
        if (newvaluepassword != Confirm) {
            $cordovaToast.showLongCenter('Password and conform password is not same');
            return false;
        }
        if (newvaluepassword.length <= 7) {
            $cordovaToast.showLongCenter('Password should have minimum 8 characters');
            return false;
        }
        var params = {
            'User[current_password]': Current,
            'User[new_password]': newvaluepassword,
            'User[confirm_password]': Confirm
        }
        UkTimeServices.changePassword(params).then(function(_response) {
            $ionicLoading.hide();
            if (_response.status == 'OK') {
                $localStorage.password = newvaluepassword;
                $ionicLoading.hide();
                $cordovaToast.showLongCenter('Password successfully changed');
                $state.go('main.changePassword');
            } else {
                $cordovaToast.showLongCenter(_response.error);
            }
        }, function(response) {
            UkTimeServices.reponseHandler(response);
        })
    }

}])

.controller('ForgotPassword', ['$cordovaToast', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$localStorage', '$ionicSideMenuDelegate', '$ionicHistory',

    function($cordovaToast, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $localStorage, $ionicSideMenuDelegate, $ionicHistory) {


        $scope.forgotPassword = function(email) {
            if (email == undefined) {
                $cordovaToast.showLongCenter('please Fill your email address')
                return false;
            }

            var req = {
                'User[user_email]': email
            }
            UkTimeServices.forgotPassword(req).then(function(_response) {
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $cordovaToast.showLongCenter(_response.message)
                }

            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })

        }





    }
])

.controller('getprofile', ['$ionicModal', '$cordovaToast', '$ionicPopup', '$timeout', '$rootScope', '$http', '$ionicSideMenuDelegate', '$filter', '$ionicPlatform', '$ionicHistory', '$state', '$cordovaFileTransfer', 'SERVERLINK', '$cordovaCamera', '$cordovaImagePicker', '$ionicActionSheet', '$ionicLoading', '$localStorage', '$scope', 'UkTimeServices', function($ionicModal, $cordovaToast, $ionicPopup, $timeout, $rootScope, $http, $ionicSideMenuDelegate, $filter, $ionicPlatform, $ionicHistory, $state, $cordovaFileTransfer, SERVERLINK, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet, $ionicLoading, $localStorage, $scope, UkTimeServices) {
        
        $scope.ratingsObject = {
            iconOn: 'ion-ios-star', //Optional
            iconOff: 'ion-ios-star-outline', //Optional
            iconOnColor: 'rgb(200, 200, 100)', //Optional
            iconOffColor: 'rgb(200, 100, 100)', //Optional
            rating: 2, //Optional
            minRating: 1, //Optional
            readOnly: true, //Optional
            callback: function(rating, index) { //Mandatory
                $scope.ratingsCallback(rating, index);
            }
        };

        $scope.ratingsCallback = function(rating, index) {
            console.log('Selected rating is : ', rating, ' and the index is : ', index);
        };


        $scope.customerHome = function() {
            UkTimeServices.customerHome().then(function(response) {
                if (response.status == 'OK') {
                    $ionicLoading.hide();
                    $scope.listofskills = response.list;
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.customerHome();


        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.selectskills = function() {
            $scope.modal.hide();
        }
        $scope.selectvalue = [];
        $scope.serverSideChange = function(data, status) {
            $scope.showpencil = "yes";
            $localStorage.valuechnaged = 'valuechnaged';
            if (status == true) {
                $scope.selectvalue.push(data);
            }
            if (status == false) {
                var index = $scope.selectvalue.indexOf(data);
                $scope.selectvalue.splice(index, 1);
            }
        }


        $scope.getprofile = function() {
            UkTimeServices.check().then(function(_response) {
                console.info(_response.user_profile.skill);
                $scope.myskilldata=_response.user_profile.skill;
                console.log($scope.myskilldata);
                if (_response.status == 'OK') {
                    $ionicLoading.hide();
                    $localStorage.emailid = _response.user_profile.user_email;
                    $localStorage.myid = _response.user_profile.user_id;
                    $scope.user_profile = _response.user_profile;
                    $scope.imageData = _response.user_profile.image;
                    $localStorage.imageprofile = _response.user_profile.image;
                    $localStorage.profilename = _response.user_profile.first_name;
                    $scope.user_profile.data = new Date(_response.user_profile.dob);
                }
                if (_response.status == 'NOK') {
                    $ionicLoading.hide();
                    $state.go('main.login')
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.getprofile();
        if ($state.current.name == "main.spProfile") {
            $scope.getprofile();

        }
        $scope.toggleLefts = function() {
            $state.go('main.spProfile');
            $scope.getprofile();
            $ionicSideMenuDelegate.toggleLeft();
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>',
                duration: 2000,
            });
        }

        $scope.cancelreason = function() {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.reason">',
                title: 'Reason of cancellation',
                subTitle: 'Please Enter Reason of cancellation',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.reason) {
                                $cordovaToast.showLongCenter('You Didn\'t' + ' Enter Reason of cancellation');
                                e.preventDefault();
                            } else {
                                var paramsdata = {
                                    'Page[email]': $localStorage.emailid,
                                    'SerCancellation[create_user_id]': $localStorage.myid,
                                    'SerCancellation[description]': $scope.data.reason,
                                    'SerCancellation[task_id]': $localStorage.taskidofcancel
                                }
                                UkTimeServices.cancelreason(paramsdata).then(function(_response) {

                                    if (_response.status == 'OK') {
                                        $cordovaToast.showLongCenter(_response.success);
                                        $timeout(function() {
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go('menu.spHome');
                                        }, 1200);
                                    } else {
                                        $cordovaToast.showLongCenter(_response.error);
                                    }
                                }, function(response) {
                                    UkTimeServices.reponseHandler(response);
                                })
                            }
                        }
                    }
                ]
            })
        }

        UkTimeServices.check().then(function(_response) {
            if (_response.status == 'OK') {
                $ionicLoading.hide();
                $localStorage.emailid = _response.user_profile.user_email;
                $localStorage.myid = _response.user_profile.user_id;
                $scope.user_profile = _response.user_profile;
                $scope.imageData = _response.user_profile.image;
                $localStorage.imageprofile = _response.user_profile.image;
                $localStorage.profilename = _response.user_profile.first_name;
                $scope.user_profile.data = new Date(_response.user_profile.dob);
            }
            if (_response.status == 'NOK') {
                $ionicLoading.hide();
                $state.go('main.login')
            }
        }, function(response) {
            UkTimeServices.reponseHandler(response);
        })
       
        $scope.changefunction = function() {

            console.info(isNaN($scope.data.Expenses));
           $scope.multiplevisiable= $rootScope.before_price* $scope.data.workhour;
            $scope.multiple = $rootScope.pricesehulerate * $scope.data.workhour;
            var sumoftotalexandaddition = +$scope.multiple + +$scope.data.Expenses;
            if($scope.data.Expenses){
                console.info($scope.data.Expenses);
 var totalsumvisiable=+$scope.multiplevisiable + +$scope.data.Expenses;
                    console.info(totalsumvisiable);
                    $scope.newtotalsumdata = totalsumvisiable.toFixed(2);
            }
            
            console.info($scope.data.Expenses.length);
            if($scope.data.Expenses.length=='1'){
                 console.info($scope.data.Expenses.length);
                $scope.data.Expenses=$scope.data.Expenses+'.00';
            }
        
            $scope.totalsumdata = sumoftotalexandaddition.toFixed(2);
            if ($scope.totalsumdata == 'NaN') {
                $scope.totalsumdata = "";
            }
        }
        $scope.data = {};
         $scope.data.Expenses="0.00";
        $scope.numberPickerObject = {

            inputValue: 1, //Optional
            minValue: 1,
            maxValue: 24,
            precision: 2, //Optional
            decimalStep: 0.25, //Optional
            format: "DECIMAL", //Optional - "WHOLE" or "DECIMAL"
            titleLabel: 'Select number of work hour', //Optional
            setLabel: 'Set', //Optional
            closeLabel: 'Close', //Optional
            setButtonType: 'button-positive', //Optional
            closeButtonType: 'button-stable', //Optional
            callback: function(val) {
              console.info(val);
                if (val == undefined) {
                    $scope.totalsumdata = "";
                }
                 console.info(val);
          if(val!=undefined){

                $scope.data.workhour = val;
           console.info(val.toString().split(".")[0]);
            console.info(val.toString().split(".")[1]);

            $scope.myvaluedecimal=val.toString().split(".")[1];
            if(val.toString().split(".")[1]=='0'){
                $scope.myvaluedecimal="00";
            }

            $scope.data.mydisplayvaluedata=val.toString().split(".")[0]+":"+$scope.myvaluedecimal;
            console.info($scope.mydisplayvaluedata);
}

                $scope.multiple = $rootScope.pricesehulerate * $scope.data.workhour;
                $scope.multiplevisiable= $rootScope.before_price* $scope.data.workhour;

                if ($scope.data.Expenses) {
                    var sumoftotalexandaddition = +$scope.multiple + +$scope.data.Expenses;
                    $scope.totalsumdata = sumoftotalexandaddition.toFixed(2);
                    var totalsumvisiable=+$scope.multiplevisiable + +$scope.data.Expenses;
                    console.info($scope.totalsumdata);
                    $scope.newtotalsumdata = totalsumvisiable.toFixed(2);
                    console.info($scope.newtotalsumdata);
                    if ($scope.totalsumdata == 'NaN') {
                        $scope.totalsumdata = "";
                    }
                     if ($scope.newtotalsumdata == 'NaN') {
                        $scope.newtotalsumdata = "";
                    }
                } else {
                    $scope.totalsumdata = $scope.multiple.toFixed(2);
                }

            }
        };
        if ((ionic.Platform.isIOS())) {
            $scope.template = 'Number of hour worked <ionic-numberpicker input-obj="numberPickerObject"><input readonly="true" input-obj="numberPickerObject" class="popup-input" type="tel" ng-change="changefunction()" ng-model="data.mydisplayvaluedata"></ionic-numberpicker><br>Expenses and additional <form novalidate class="simple-form"><input class="popup-input" type="number" ng-change="changefunction(data.Expenses)" ng-model="data.Expenses" ><p class="text-center"> <strong>Total Sum :</strong><span> £ {{totalsumdata}}</span></p>';
        } else {
            $scope.template = ' Number of hour worked <ionic-numberpicker input-obj="numberPickerObject"><input readonly="true" input-obj="numberPickerObject" class="popup-input" type="tel" ng-change="changefunction()" ng-model="data.mydisplayvaluedata"></ionic-numberpicker><br>Expenses and additional<div class="search"><i style="position: absolute;line-height: 29px;font-size: 20px;margin-left: 6px;">£</i><input class="popup-input" type="tel" ng-change="changefunction()" ng-model="data.Expenses"></div><p class="text-center"> <strong>Total Sum :</strong><span> £ {{totalsumdata}}</span></p>';
        }
        $scope.invoice = function() {
            var myPopup = $ionicPopup.show({
                title: 'Create Invoice',
                template: $scope.template,
                subTitle: $localStorage.namedataofbook + ' £' + $localStorage.pricedataofbook + '/Hr',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Create</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.workhour) {
                            $cordovaToast.showLongCenter('Please enter Number of hour worked');
                            $scope.invoice();
                            return false;
                        }

                        if ($scope.data.Expenses != undefined) {
                            console.log($scope.data.Expenses)
                                var totalsumvisiable=+$scope.multiplevisiable + +$scope.data.Expenses;
                    console.info(totalsumvisiable);
                    $scope.newtotalsumdata = totalsumvisiable.toFixed(2);
                            if (isNaN($scope.data.Expenses)) {
                                console.info(isNaN($scope.data.Expenses))
                                $scope.data.Expenses = '';
                                $cordovaToast.showLongCenter('Please enter number or decimal for Expenses and additional ');
                                return false;
                            }
                        }

                        if (!$scope.data.Expenses) {
                            $scope.data.Expenses = 0;
                        }
                        console.log($scope.data.Expenses)
                        var today = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        var parameterdata = {
                            'Invoice[sp_price]': $scope.totalsumdata,
                            'Invoice[total_price]': $scope.newtotalsumdata,
                            'Invoice[no_of_hour]': $scope.data.workhour,
                            'Invoice[additional]': $scope.data.Expenses,
                            'Invoice[task_id]': $localStorage.taskidofcancel,
                            'Invoice[create_user_id]': $localStorage.myid,
                            'Invoice[create_time]': today,
                            'Invoice[customer_id]': $localStorage.useridforchat
                                
                        }
                        console.info(parameterdata);
                
                        UkTimeServices.invoiceadd(parameterdata).then(function(_response) {
                        	console.log(_response)
                        	
                            if (_response.status == 'OK') {
                                $cordovaToast.showLongCenter('Invoice create successfully');
                                $timeout(function() {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    $state.go('menu.spHome');
                                }, 1200);
                            } else {
                                $ionicLoading.hide();
                                $cordovaToast.showLongCenter(_response.error);
                            }
                        }, function(response) {
                            UkTimeServices.reponseHandler(response);
                        })
                    }

                }]

            })
        }

        $scope.cancelsedhule = function() {
            UkTimeServices.cancelsedule().then(function(_response) {
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $cordovaToast.showLongCenter(_response.success);
                    $timeout(function() {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.spHome');
                    }, 1200);
                } else {
                    $cordovaToast.showLongCenter(_response.error);
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }

        $scope.direttomap = function() {
            launchnavigator.navigate([$localStorage.latitudedataformap, $localStorage.longitudedataformap]);
        }
        $scope.sedhuldetails = function(data) {
            console.info(data)
            $localStorage.latitudedataformap = data.latitude;
            $localStorage.taskidforchating = data.task_id;
            console.log($localStorage.taskidforchating);
            $localStorage.longitudedataformap = data.longitude;
            $localStorage.customeridata = data.user.user_id;
            $localStorage.booking_id = data.booking_id;
            console.info($localStorage.booking_id);
            $rootScope.imagedatofallcwcateuser = data.user.image;
            $rootScope.imageprofileofuser = data.user.image;
            $localStorage.pricedataofbook = data.service.price;
            $localStorage.namedataofbook = data.service.service_name;
            $rootScope.pricesehulerate = data.service.price;
            $rootScope.before_price = data.service.before_price;
            $localStorage.useridforchat = data.user_id;
            $localStorage.timerset = data.booking_time;
            $rootScope.booking_hour = data.booking_hour;
            
            $rootScope.convertedDate = new Date(data.booking_time_ios);
            $rootScope.booktimer = $filter('date')($rootScope.convertedDate, 'dd/MM/yyyy hh:mm:ss');
            console.info($rootScope.booktimer)
            $localStorage.taskidofcancel = data.task_id;
            $rootScope.pather = 'http://maps.googleapis.com/maps/api/staticmap?center=' + data.latitude + ',' + data.longitude + '&zoom=14&size=350x200&markers=color:red%7Clabel:C%7C' + data.latitude + ',' + data.longitude + '&sensor=false';
            $rootScope.locationname = data.task_location;
            $rootScope.taskname = data.service.service_name;
            $rootScope.abouttask = data.about_task;
            $rootScope.clientname = data.user.first_name;
            $rootScope.clientlastname = data.user.last_name;
            $rootScope.pricecleint = data.service.price;
            $timeout(function() {
                $state.go('menu.spScheduleDetails');
            }, 100);

        }
        $scope.getsedhulelist = function() {
            UkTimeServices.myalljobs().then(function(_response) {
                console.info(_response)
                if (_response.status == 'OK') {
                    $scope.listdata = _response.list;
                    $state.go('menu.spSchedule');
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.showLongCenter('You have no booked job');
                    $scope.listdata='';
                    $state.go('menu.spSchedule');
                }

            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })
        }

        $scope.messagelist = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            })
            UkTimeServices.messagegetList().then(function(_response) {

                if (_response.status == 'OK') {
                    $scope.datalist = _response.messages;
                    $ionicLoading.hide();
                }
                $state.go('menu.message');
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        if ($state.current.name == "menu.message") {
            $scope.messagelist();
        }


        $scope.checkmessageuserforhit = function(data) {
            $localStorage.checkforsedule = undefined;
            $localStorage.useridforchat = data.to_id;
            UkTimeServices.getUser().then(function(_response) {
                if (_response.status == 'OK') {
                    $localStorage.valueforstop = 'valuestroesd'
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner>',
                        duration: 3000
                    });
                    $state.go('main.chat');

                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

        }
        $scope.hitmessageaschdule = function() {

            $localStorage.checkforsedule = 'YES';
            UkTimeServices.getUser().then(function(_response) {
                if (_response.status == 'OK') {
                    $localStorage.valueforstop = 'valuestroesd'
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner>',
                        duration: 3000
                    });
                    $state.go('main.chat');

                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

        }
        $scope.showpencil = undefined;
        $scope.alert = function() {
            $scope.showpencil = "yes";
            $localStorage.valuechnaged = 'valuechnaged';
        }
        $scope.$watch('myProp', function(newVal, oldVal) {
            $scope.myProp = newVal;

        })
        $scope.parseInt = parseInt;
        $scope.acceptedTaskservice = function() {
            UkTimeServices.servicecompleted().then(function(_response) {
                console.info(_response);
                $localStorage.enter = "enterforcheck";
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $scope.jobdata = _response.detail;
                    $ionicLoading.hide();
                    $state.go('menu.spHome');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                } else {
                    $cordovaToast.showLongCenter('You have not Completed jobs');
                    $state.go('menu.spHome');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                }

            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }

        if ($state.current.name == "menu.spHome") {
            $scope.acceptedTaskservice();
        }

        $scope.chatfucntion = function(data) {

            $localStorage.checkforsedule = undefined;
            $localStorage.valueforstop = 'valuestroesd';
            $localStorage.useridforchat = data.task.User.user_id;

            UkTimeServices.getUser().then(function(_response) {
                if (_response.status == 'OK') {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner>',
                        duration: 3000,
                    });
                    $state.go('main.chat')

                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

        }


        $scope.minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
        $scope.maxdate = new Date(new Date().setFullYear(new Date().getFullYear() - 80))

        $scope.notification = function() {
            UkTimeServices.taskBooking().then(function(_response) {
                console.info(_response)
                $scope.listofjobs = '';
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $scope.listofjobs = _response.list;
                    if (_response.list.length == 0) {
                        $cordovaToast.showLongCenter('You have no notification');
                        console.info(_response.list.length)
                    }
                    $ionicLoading.hide();
                    $state.go('menu.spNotifications');
                } else {
                    $cordovaToast.showLongCenter('You have no notification');
                    $state.go('menu.spNotifications');
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.checkrequst = function(taskid, user_id) {
            $localStorage.taskid = taskid;
            $localStorage.user_id = user_id;
            UkTimeServices.taskBookingview().then(function(_response) {
                console.info(_response)
                $ionicLoading.hide();
                $rootScope.dataprolist = _response.detail;
                if (_response.status == 'OK') {
                    $state.go('main.spServiceRequest');
                }

            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.ionicGoBack = function() {
            $state.go('menu.spNotifications');
            $scope.notification();
        }

        $scope.accept = function() {
            UkTimeServices.taskBookingaccept($localStorage.taskid, $localStorage.myid).then(function(_response) {
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $cordovaToast.showLongCenter(_response.success);
                    $timeout(function() {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.spHome');
                    }, 1200);
                } else {
                    $cordovaToast.showLongCenter(_response.error);
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.decline = function() {

            UkTimeServices.taskBookingreject().then(function(_response) {
                $ionicLoading.hide();
                if (_response.status == 'OK') {
                    $cordovaToast.showLongCenter(_response.success);
                    $timeout(function() {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('menu.spHome');
                    }, 1200);
                } else {
                    $cordovaToast.showLongCenter(_response.error);
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })
        }

        $scope.$watch(function() {
            return $localStorage.imageprofile;
        }, function(newVal, oldVal) {

            if (newVal != undefined) {
                $scope.dataimage = newVal;
            }
        }, true);
        $scope.$watch(function() {
            return $localStorage.profilename;
        }, function(newValchange) {
            if (newValchange != undefined) {
                $scope.name = newValchange;
            }
        }, true);
        $scope.actionsheet = function() {
            $ionicActionSheet.show({
                buttons: [
                    { text: '<i class="icon ion-images"></i> Load from Library' },
                    { text: '<i class="icon ion-camera"></i> Use Camera' },
                ],
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            $scope.imagepicker(index);
                            return true;
                        case 1:
                            $scope.camerapicker();
                            return true;
                    }
                }
            });

        }

        $scope.imagepicker = function() {
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                        $scope.imageData = results[i];
                        $scope.showpencil = "yes";
                        $localStorage.valuechnaged = 'valuechnaged';
                        
                    }
                }, function(error) {
                    console.error(error)
                });
        }
        $scope.camerapicker = function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(
                function(imageData) {
                    $scope.imageData = imageData;
                    $scope.showpencil = "yes";
                    $localStorage.valuechnaged = 'valuechnaged';
                },
                function(err) {
                    console.info(err)
                }
            )
        }
        $scope.updateProfile = function(data) {
            if ($localStorage.valuechnaged == undefined) {
                $cordovaToast.showLongCenter('There is no change for update your Profile');
                return false;
            }
                       $scope.firstchar = data.phone.charAt(0);
                if ($scope.firstchar != 0) {
                    $cordovaToast.showLongCenter('Phone Number should be start with 0');
                    return false;
                }
            if (data.phone.length)
                if (data.phone.length != 11) {
                    $cordovaToast.showLongCenter('Phone Number should be 11 Digit');
                    return false;
                }
            $scope.newdate = $filter('date')(data.data, "yyyy-MM-dd");
            var res = $scope.imageData.substr(0, 4);
            if (res == 'http' || res.length == 0) {
                var request = {
                    'User[first_name]': data.first_name,
                    'User[last_name]': data.last_name,
                    'User[address]': data.address,
                    'User[user_email]': data.user_email,
                    'User[dob]': $scope.newdate,
                    'User[nationality]': data.nationality,
                    'User[phone]': data.phone,
                    'User[branch_code]': data.branch_code,
                    'User[bank_name]': data.bank_name,
                    'User[bank_ac_no]': data.bank_ac_no,
                    'User[skill]': data.skill,
                    'User[experiences]': data.experiences
                }
                console.info(data.skill);
                UkTimeServices.updateProfile(request).then(function(_response) {
                    if (_response.status = 'OK') {
                        $scope.showpencil = undefined;

                        $ionicLoading.hide();
                        $localStorage.valuechnaged = undefined;
                        $cordovaToast.showLongCenter('Profile Updated');
                    }
                }, function(response) {
                    UkTimeServices.reponseHandler(response);
                })
            }
            if (res == 'file') {
                var update_request = {
                    'User[first_name]': data.first_name,
                    'User[last_name]': data.last_name,
                    'User[address]': data.address,
                    'User[user_email]': data.user_email,
                    'User[dob]': $scope.newdate,
                    'User[nationality]': data.nationality,
                    'User[phone]': data.phone,
                    'User[branch_code]': data.branch_code,
                    'User[bank_name]': data.bank_name,
                    'User[bank_ac_no]': data.bank_ac_no,
                    'User[skill]': data.skill,
                    'User[experiences]': data.experiences
                }
                console.info(data.skill);
                var url = SERVERLINK.URL + 'user/updateProfile' + '?auth_code=' + $localStorage.auth_code;
                var targetPath = $scope.imageData;
                var filename = targetPath.split("/").pop();
                var options = {
                    fileKey: "User[image]",
                    fileName: targetPath,
                    chunkedMode: false,
                    mimeType: "image/jpg",
                    params: update_request
                };
                $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                    var responds = JSON.parse(result.response);
                    if (responds.status == "OK") {
                        $scope.selectvalue = [];
                        $ionicLoading.hide();
                        $scope.showpencil = undefined;
                        $localStorage.valuechnaged = undefined;
                        $cordovaToast.showLongCenter('Profile Updated');
                    }
                }, function(err) {
                    console.error(err);
                });
            }

        }
        $scope.aboutapp=function(){
             $ionicPlatform.ready(function() {
            cordova.getAppVersion(function(version) {
               console.info(version);
               $rootScope.myappversion=version;
               $state.go('menu.aboutapp');
               
            });
        })
        }
        $scope.logout = function() {
            UkTimeServices.logout().then(function(_response) {
                if (_response.status = 'OK') {
                    $ionicLoading.hide();
                    if ($localStorage.checktrue == true) {
                        $localStorage.$reset();
                        $timeout(function() {
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            $state.go('main.login');
                            $localStorage.checktrue == true
                            $rootScope.hitfordevicetoken();
                            $rootScope = undefined;
                        }, 1000);
                        $cordovaToast.showLongCenter('successfully Logout');
                    } else {
                        $localStorage.$reset();
                        $cordovaToast.showLongCenter('successfully Logout');
                        $timeout(function() {
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            $state.go('main.login');
                            $rootScope.hitfordevicetoken();
                            $rootScope = undefined;
                            $scope = undefined;
                        }, 1000);

                    }
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })


        }
        $scope.ionicBack = function() {
            $state.transitionTo('menu.spHome');
            $timeout(function() {
                $scope.getprofile();
            }, 400);
        }
    }])
    .controller('messagectrl', ['UkTimeServices', '$localStorage', '$ionicLoading', '$scope', '$state', function(UkTimeServices, $localStorage, $ionicLoading, $scope, $state) {
        $scope.checkmessageuser = function() {

            UkTimeServices.getUser().then(function(_response) {
                $localStorage.useridforchat = _response.to_id;
                if (_response.status == 'OK') {
                    $localStorage.valueforstop = 'valuestroesd'
                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner>',
                        duration: 3000
                    });
                    $state.go('main.chat');

                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })

        }

    }])