angular.module('UkTimeServices.controllers', [])
    .controller('loginCtrl', ['$cordovaToast', '$log', '$interval', '$cordovaSplashscreen', '$ionicPlatform', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$localStorage',
        function($cordovaToast, $log, $interval, $cordovaSplashscreen, $ionicPlatform, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $localStorage) {

        $scope.$on('$ionicView.enter', function() {
        
        	$rootScope.myratingimage=$localStorage.ratingimage;
        	$rootScope.myratingname=$localStorage.nameofrating;
              if ($state.current.name == 'main.login') {       
                 $rootScope.hitfordevicetoken();
                }          
              })
                console.info($rootScope.myratingimage,$rootScope.myratingname);
    $scope.user = {};

            UkTimeServices.check().then(function(_response) {
                if (_response.status == 'OK') {
                    $ionicLoading.hide();
                     $rootScope.imagedataprofile = _response.user_profile.image;
                     $scope.nameofdata = _response.user_profile.first_name;
                     $localStorage.mylastnamedata=_response.user_profile.last_name;
                     console.info($localStorage.mylastnamedata);
                }
                if (_response.status == 'NOK') {
                    $ionicLoading.hide();
                    $state.go('main.login')
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

            $scope.ratingsObject = {
                iconOn: 'ion-ios-star', //Optional
                iconOff: 'ion-ios-star-outline', //Optional
                iconOnColor: '#01c8eb', //Optional
                iconOffColor: '#01c8eb ', //Optional
                rating: 0, //Optional
                minRating: 0, //Optional
                readOnly: false, //Optional
                callback: function(rating, index) { //Mandatory    
                    $scope.ratingsCallback(rating, index);
                }
            };

            $scope.ratingsCallback = function(rating, index) {
                console.log(rating);
                $scope.ratinvalue = rating;
            };
            $scope.submitrating = function(commentext) {
                if ($scope.ratinvalue == undefined || $scope.ratinvalue == 0) {
                    $cordovaToast.showLongCenter('Please Select Rating');
                    return false;
                }
                console.info($scope.ratinvalue, commentext);
                var req = {
                    'SerRating[rate]': $scope.ratinvalue,
                    'SerRating[comment]': commentext,
                    'SerRating[to_id]':  $localStorage.toid, 
                    'SerRating[job_id]':   $localStorage.jobid
                }
            console.info(req);
                UkTimeServices.customerRating(req).then(function(_response) {
                	console.log(_response);
                    if (_response.status == 'OK') {
                    	$cordovaToast.showLongCenter('Thank You for your Rating review');
                    	$rootScope.checkit();
                    }else{
                    	$cordovaToast.showLongCenter('Server is not responding');
                    }

                }, function(response) {

                    UkTimeServices.reponseHandler(response);
                })
            }

            if ($localStorage.checktrue == true) {
                $scope.user.password = $localStorage.password;
                $scope.user.email = $localStorage.username;
                $scope.HasPassport = true;
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
            $scope.login = function(userForm, user) {

                if (userForm.$valid == false) {
                    $cordovaToast.showLongCenter('Please Fill Details');
                    return false;
                }
                if (ionic.Platform.isIOS()) {
                    $scope.deviceteps = '2';
                } else {
                    $scope.deviceteps = '1';
                }
                var req = {
                    'LoginForm[username]': user.email,
                    'LoginForm[password]': user.password,
                    'LoginForm[device_token]': $localStorage.device_token,
                    'LoginForm[device_type]': $scope.deviceteps
                }

                if ($localStorage.checktrue == true) {
                    $localStorage.password = user.password;
                    $localStorage.username = user.email;
                } else {
                    $localStorage.username = '';
                    $localStorage.password = '';
                }
                $log.log(req);
                UkTimeServices.login(req).then(function(_response) {
                    $localStorage.currentpassword = user.password;
                    $ionicLoading.hide();
                    $localStorage.auth_code = _response.auth_code;
                    if (_response.status == 'OK') {
                       $rootScope.checkit();
                       $cordovaToast.showLongCenter('Successfully Logged in');
                    } else {
                        $cordovaToast.showLongCenter(_response.error);
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
            $scope.data = '';
            console.info(req);
            UkTimeServices.messagesend(req).then(function(_response) {
                console.log(_response)
                $scope.data = '';
                if (_response.status == 'OK') {
                    $ionicLoading.hide();
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

        }
        $rootScope.getchat = function() {
            $localStorage.imageset = '';
             $rootScope.imageData = '';
              $scope.imageData = '';
            UkTimeServices.messageget().then(function(_response) {
                 console.log(_response)
                if (_response.status == 'OK') {
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

      

        $scope.ionicBack = function() {
            $localStorage.valueforstop = '';
            $state.go('menu.allocate')
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
                        $scope.imageData = $localStorage.imageset;
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
                    $scope.imageData = $localStorage.imageset;
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
            console.info(dataimage);
            var update_request = {
                'Message[to_id]': $localStorage.useridforchat,
                'Message[booking_id]': $localStorage.taskidforchating,
                'Message[send_time]': timesend
            }
            console.log(update_request);
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
                    $scope.imageData = '';
                    $rootScope.imageData = '';
                    $localStorage.imageset = '';
                }
            }, function(err) {
                console.info(err);
                $scope.imageData = '';
                $ionicLoading.show({
                    template: 'Image is not sent successfully',
                    duration: 2000,
                })
                $scope.imageData = '';
                $localStorage.imageset = '';
            });
        }
    }])
    .controller('signUp', ['$cordovaToast', '$localStorage', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading',

        function($cordovaToast, $localStorage, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading) {


            $scope.user = {};
            $scope.signUpUser = function(user, userForm) {
                $scope.username = user.fname + user.lname;

                if (userForm.$invalid == true) {
                    return false;
                }

                if (user.con_password != user.password) {
                    $cordovaToast.showLongCenter('Passwords do not match');
                    return false;
                }
                if (user.password.length <= 7) {
                    $cordovaToast.showLongCenter('Password should have minimum 8 characters');
                    return false;
                }

                var firstdata = user.phone.charAt(0);

                if (firstdata != 0) {
                    $cordovaToast.showLongCenter('Phone Number should be start with 0');
                    return false;
                }
                if (user.phone.length != 11) {
                    $cordovaToast.showLongCenter('Phone Number should have minimum 11 Digits');
                    return false;
                }

                var request = {
                    'User[last_name]': user.lname,
                    'User[first_name]': user.fname,
                    'User[postal_code]': user.Code,
                    'User[password]': user.password,
                    'User[username]': $scope.username,
                    'User[phone]': user.phone,
                    'User[address]': user.Address,
                    'User[user_email]': user.email,
                    'User[reg_type]': 'C'
                }
                console.info(request);

                if (ionic.Platform.isIOS()) {
                    $scope.deviceteps = '2';
                } else {
                    $scope.deviceteps = '1';
                }
                UkTimeServices.register(request).then(function(_response) {
                    $ionicLoading.hide();

                    if (_response.status == 'OK') {
                        var params = {
                            'LoginForm[username]': user.email,
                            'LoginForm[password]': user.password,
                            'LoginForm[device_token]': $localStorage.device_token,
                            'LoginForm[device_type]': $scope.deviceteps
                        }
                        console.info(params);
                        UkTimeServices.login(params).then(function(_response) {
                            $localStorage.currentpassword = user.password;
                            $localStorage.auth_code = _response.auth_code;
                            if (_response.status == 'OK') {
                                $ionicLoading.hide();
                                $cordovaToast.showLongCenter('Signup successfully');
                                $state.go('menu.customerHome')
                            } else {
                                $cordovaToast.showLongCenter(_response.error);
                            }

                        })
                    } else {
                        $cordovaToast.showLongCenter(_response.error);
                    }
                }, function(response) {

                    UkTimeServices.reponseHandler(response);
                })

            }


        }
    ])

.controller('CustomerHome', ['$cordovaToast', '$log', '$interval', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$ionicHistory', '$localStorage', '$ionicSideMenuDelegate', '$location',

    function($cordovaToast, $log, $interval, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $ionicHistory, $localStorage, $ionicSideMenuDelegate, $location) {

        $scope.customerHome = function() {
            UkTimeServices.check().then(function(_response) {
                if (_response.status == 'OK') {
                    $ionicLoading.hide();
                    $localStorage.myid = _response.user_profile.user_id;
                    $scope.profile = _response.user_profile;
                    $rootScope.imagedataprofile = _response.user_profile.image;
                    $scope.nameofdata = _response.user_profile.first_name;
                    
                     $localStorage.mylastnamedata=_response.user_profile.last_name;
                     console.info($localStorage.mylastnamedata);
                }
                if (_response.status == 'NOK') {
                    $ionicLoading.hide();
                    $state.go('main.login')
                }
            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

            UkTimeServices.customerHome().then(function(_response) {
                $ionicLoading.hide();
                console.info(_response);
                if (_response.status == 'OK') {
                    $scope.list = _response.list;
                } else {
                    var error = typeof _response.error !== 'undefined' ? _response.error : 'Cannot connect';
                    $cordovaToast.showLongCenter(error);
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
        }
        $scope.customerHome();
        $scope.book = function(id, price, name) {
            $rootScope.booktimerdatapro = '';
            $localStorage.checkvalueforcalc = undefined;
            $localStorage.service_id = id;
            if ($localStorage.service_id == undefined) {
                $scope.customerHome();
                return false;
            }
            $localStorage.servicenameofselect = name;
            $localStorage.pricerate = price;
            $state.go('menu.customerBook');
        }


    }
])

.controller('CustomerBookCtrl', ['$filter', '$cordovaToast', 'stripe', '$ionicActionSheet', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$ionicHistory', '$localStorage', '$ionicSideMenuDelegate', '$ionicPopup',



    function($filter, $cordovaToast, stripe, $ionicActionSheet, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $ionicHistory, $localStorage, $ionicSideMenuDelegate, $ionicPopup) {



    $scope.checkfortrue = function() {
    $localStorage.mythisfuncnotcall='yes';
        UkTimeServices.check().then(function(_response) {
           	console.log('enter',_response)
               if (_response.status == "OK") {
               	if(_response.user_profile.rating != false){
                       $localStorage.jobid = _response.user_profile.rating[0].job_id;
                       $localStorage.toid = _response.user_profile.rating[0].to_id;
                       $localStorage.ratingimage=_response.user_profile.rating[0].image;
                       $localStorage.nameofrating=_response.user_profile.rating[0].name;
               		console.info(_response.user_profile.rating);
                         $localStorage.mylastnamedata=_response.user_profile.last_name;
                     console.info($localStorage.mylastnamedata);
               		  $state.go('main.customerRatings');
               		return false
               	}
            }
        })
    }
    $scope.myservicename = $localStorage.servicenameofselect;
    $scope.myserviceprice = $localStorage.pricerate;
    $localStorage.booking_hour = 1;
    $localStorage.unit = 1;
    $scope.mindate = new Date();
    $scope.payment = {};
    $scope.checkfortrue();
    $scope.hitstripepother = function(card) {
        if (card.number == undefined || card.cvc == undefined || card.exp_month == undefined || card.exp_year == undefined) {
            $cordovaToast.showLongCenter('Please Fill all details');
            $scope.inputPopup();
            return false;
        }
        $ionicLoading.show({
            template: 'Please wait it may takes upto 10 sec'
        })
        return stripe.card.createToken(card)
            .then(function(response) {
                console.info(response)
                var payment = angular.copy($scope.payment);
                payment.card = void 0;
                payment.token = response.id;
                var request = {
                    'User[card_number]': card.number,
                    'User[card_cvv]': card.cvc,
                    'User[card_exp_month]': card.exp_month,
                    'User[card_exp_year]': card.exp_year,
                    'User[stripe_token]': payment.token
                }
                UkTimeServices.stripepay(request).then(function(_response) {
                    console.info(_response)
                    if (_response.status == 'OK') {
                        $cordovaToast.showShortCenter('Your Card Details successfully saved');
                        $scope.submitbooking();
                    }
                    if (_response.status == 'NOK') {
                        $ionicLoading.hide();
                        $cordovaToast.showShortCenter('Your Card Details are incorrect');
                        $state.go('menu.customerHome');
                    }
                }, function(response) {
                    console.info(response)
                    UkTimeServices.reponseHandler(response);
                });
            })
            .catch(function(err) {
                console.info(err)
                $ionicLoading.hide();
                if (err.type && /^Stripe/.test(err.type)) {
                    $cordovaToast.showLongCenter(err.message);
                    $state.go('menu.customerHome');
                } else {
                    $cordovaToast.showLongCenter(err.message);
                    $state.go('menu.customerHome');
                }
            })
    }
    $scope.book = {};
    $scope.value = 'Unit';

    $scope.onAddressSelection = function(location) {
        $scope.location = location.formatted_address;
        $localStorage.latsdata = location.geometry.location.lat();
        $localStorage.lngdata = location.geometry.location.lng();

    }

    $scope.actionsheetunit = function() {

        $ionicActionSheet.show({
            buttons: [
                { text: 'Unit' },
                { text: 'Flat' },
            ],
            buttonClicked: function(index) {
                switch (index) {
                    case 0:
                        $scope.Unit(index);
                        return true;
                    case 1:
                        $scope.Flat(index);
                        return true;
                }
            }
        })

    }
    $scope.Flat = function() {
        $scope.value = 'Flat';
    }
    $scope.Unit = function() {
        $scope.value = 'Unit';

    }
    $scope.names = ["Unit", "Flat"];
    $scope.actionsheetunitservice = function() {
      $localStorage.booking_hour='';
        $ionicActionSheet.show({
            buttons: [
                { text: 'Hours' },
                { text: 'Small- Est. 1-2 hrs' },
                { text: 'Medium – Est 2-4 hrs' },
                { text: 'Large – Est 4+ hrs' },
            ],
            buttonClicked: function(index) {
               
                switch (index) {
                    case 0:
                        $scope.Hours(index);
                        return true;
                    case 1:
                        $scope.Small(index);
                        return true;
                    case 2:
                        $scope.Medium(index);
                        return true;
                    case 3:
                        $scope.Large(index);
                        return true;
                }
            }
        })

    }
        $scope.Hours = function() {
            $scope.servicvalue = 'Hours';
            $localStorage.booking_hour = 1;
        }
        $scope.Small = function() {
            $scope.servicvalue = 'Small- Est. 1-2 hrs';
            $localStorage.booking_hour = 2;

        }
        $scope.Medium = function() {
            $scope.servicvalue = 'Medium – Est 2-4 hrs';
            $localStorage.booking_hour = 3;

        }
        $scope.Large = function() {
            $scope.servicvalue = 'Large – Est 4+ hrs';
            $localStorage.booking_hour = 4;


        }
        $scope.serviceare = ["Unit", "Flat"];

        $scope.continue = function(book, booktimer) {
        	if($localStorage.mythisfuncnotcall!='yes'){
        		 $scope.checkfortrue();
        		return false;
        	}
            console.info($scope.servicvalue);
            var a = book.rate;
            var b = 00;
            $scope.data = (a + "." + b);
            if (typeof $scope.location == 'undefined' || typeof $scope.value == 'undefined' || typeof $scope.servicvalue == 'undefined' || typeof book.about == 'undefined') {
                $cordovaToast.showLongCenter('Please fill all the details');
                return false;
            }
            if ($scope.servicvalue == 'Hours') {
                $cordovaToast.showLongCenter('Please select your service hours');
                return false;
            }
            if (booktimer.length == 0) {
                $cordovaToast.showLongCenter('Please select your Schedule Date and Time');
                return false;
            }
            if ($scope.value == "Unit") {
                $localStorage.unit = 1
            } else {
                $localStorage.unit = 2
            }
            $localStorage.location = $scope.location;
            $localStorage.hrs = $scope.servicvalue;
            $localStorage.about = book.about;
            $localStorage.reatevalue = $scope.data;
            $state.go('menu.customerBook2');

        }

        $scope.doneBooking = function(book, bookingform) {

            if (bookingform.$invalid == true) {

                return false;
            }
            var datain = book.Number.charAt(0);
            if (datain != 0) {
                $cordovaToast.showLongCenter('Phone Number should be start with 0');
                return false;
            }
            if (book.Number.length != 11) {
                $cordovaToast.showLongCenter('Phone Number should have minimum 11 Number');
                return false;
            }
            console.info($localStorage.datetimeselected);
            
            $scope.hourly_rate = parseInt($localStorage.pricerate);
            $localStorage.request = {
                'TaskBooking[service_id]': $localStorage.service_id,
                'TaskBooking[task_location]': book.street + ',' + book.city + ',' + book.service_loc,
                'TaskBooking[address]': $localStorage.location,
                'TaskBooking[about_task]': $localStorage.about,
                'TaskBooking[booking_time]': $localStorage.datetimeselected,
                'TaskBooking[book_for]': $localStorage.unit,
                'TaskBooking[price_cat]': "T",
                'TaskBooking[booking_hour]': $localStorage.booking_hour,
                'TaskBooking[hourly_rate]': $scope.hourly_rate,
                'User[phone]': book.Number,
                'TaskBooking[latitude]': $localStorage.latsdata,
                'TaskBooking[longitude]': $localStorage.lngdata,
                'TaskBooking[postal_code]': book.code
            }
            console.info($localStorage.request);
            $scope.inputPopup = function() {
                $cordovaToast.showLongCenter('Please fill the card card details to confirm booking');
                $scope.data = {};
                var inputPopupClick = $ionicPopup.confirm({
                    template: '<div class="list list-inset"><label class="item item-input"><i class="icon ion-card placeholder-icon"></i><input style="padding-right:0px;" type="tel" placeholder="Card number" ng-model="data.number" cc-number></label><div class="row no-padding"><div class="col no-padding"><label class="item item-input"><i class="icon ion-android-calendar placeholder-icon"></i><input  style="padding-right:0px;" ng-model="data.exp_month" maxlength="2" type="tel" placeholder="MM"></div><div class="col no-padding"><label class="item item-input"><i class="icon ion-android-calendar placeholder-icon"></i><input ng-model="data.exp_year" maxlength="4" type="tel" style="padding-right:0px;" placeholder="YYYY"></div></div></label><label class="item item-input"><i class="icon ion-locked placeholder-icon"></i><input type="tel"style="padding-right:0px;" placeholder="CVV" ng-model="data.cvc" maxlength="3"></label></div>',
                    title: '<img src="img/logo.png">',
                    scope: $scope,
                    cssClass: 'appPopup',
                    buttons: [{
                            text: '<b>Cancel</b>',
                            onTap: function(e) {
                                $state.go('menu.customerHome');
                                $cordovaToast.showLongCenter('Sorry Your jobs is not booked');
                            }
                        },
                        {
                            text: '<b>BOOK MY SERVICE</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                $scope.hitstripepother($scope.data)
                            }

                        }
                    ]
                })
            }
            $scope.inputPopup();
        }
        $scope.submitbooking = function() {
            console.info($localStorage.request)
            UkTimeServices.taskBooking($localStorage.request).then(function(_response) {
                if (_response.status == 'OK') {
                    $localStorage.servicenameofselect = '';
                    $localStorage.pricerate = '';
                    $ionicLoading.hide();
                    $cordovaToast.showLongCenter('Your Jobs Successfully Booked');
                    $state.go('menu.customerHome');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $localStorage.request = '';
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.showLongCenter(_response.error);
                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            });
        }
    }

])



.controller('CustomerProfile', ['$ionicPlatform','$ionicPopup', '$filter', '$cordovaToast', '$log', '$cordovaInAppBrowser', '$timeout', '$location', 'SERVERLINK', '$cordovaFileTransfer', '$cordovaImagePicker', '$cordovaCamera', '$ionicActionSheet', '$rootScope', '$scope', '$stateParams', '$state', 'UkTimeServices', '$ionicLoading', '$localStorage', '$ionicSideMenuDelegate', '$ionicHistory',

        function($ionicPlatform,$ionicPopup, $filter, $cordovaToast, $log, $cordovaInAppBrowser, $timeout, $location, SERVERLINK, $cordovaFileTransfer, $cordovaImagePicker, $cordovaCamera, $ionicActionSheet, $rootScope, $scope, $stateParams, $state, UkTimeServices, $ionicLoading, $localStorage, $ionicSideMenuDelegate, $ionicHistory) {

    $scope.ionicBackdata = function() {
            $localStorage.valueforstop = '';
            $state.go('menu.allocate')
    }

    $scope.Allocate = function() {
       console.info('hit');
       UkTimeServices.allocate().then(function(_response) {
                console.info(_response);
                $localStorage.enter = "enterforcheck";
                if (_response.status == 'OK') {
                    $scope.myallocatejobdata = _response.list;
                      $state.go('menu.allocate');
                     $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                } else {
                    $cordovaToast.showLongCenter('You have no allocated jobs');
                    $ionicLoading.hide();
                }

        }, function(response) {
            UkTimeServices.reponseHandler(response);
        })
    }

    if ($state.current.name == "menu.allocate"){
        $scope.Allocate();
    }


        $scope.notifcationnextpage = function() {
            UkTimeServices.mycompleteJobjos().then(function(_response) {
                console.info(_response);
                $localStorage.enter = "enterforcheck";
                if (_response.status == 'OK') {
                    $scope.jobdata = _response.list;
                      $state.go('menu.notification');
                     $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                } else {
                    $cordovaToast.showLongCenter('You have not Completed jobs');
                    $ionicLoading.hide();
                }

            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })
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
                                console.info(paramsdata)
                                UkTimeServices.cancelreason(paramsdata).then(function(_response) {
                                    console.info(_response)
                                    if (_response.status == 'OK') {
                                        $ionicLoading.hide();
                                        $cordovaToast.showLongCenter(_response.success);
                                        $timeout(function() {
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go('menu.customerHome')
                                        }, 1200);
                                    } else {
                                        $ionicLoading.hide();
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

        $scope.hitmessageaschdule = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            $localStorage.checkforsedule = 'YES';
            UkTimeServices.getUser().then(function(_response) {
                if (_response.status == 'OK') {
                    $localStorage.valueforstop = 'valuestroesd'
                    $ionicLoading.hide();
                    $state.go('main.chat');

                }
            }, function(response) {
                UkTimeServices.reponseHandler(response);
            })

        }

            $scope.direttomap = function() {
                launchnavigator.navigate([$localStorage.latitudedataformap, $localStorage.longitudedataformap]);
            }

            $scope.sedhuldetails = function(data) {
                console.info(data);
                $rootScope.convertedDate = new Date(data.booking_time_ios);
                console.info(data.task_status);
                if (data.task_status == "") {
                    return false;
                }
                $localStorage.checkvalueforcalc = 'valuecheckdata';
                if ($rootScope.convertedDate == undefined) {
                    $rootScope.convertedDate = new Date(data.booking_time_ios);
                }
                $localStorage.taskidforchating = data.task_id;
                console.info($localStorage.taskidforchating);
                $localStorage.latitudedataformap = data.latitude;
                $localStorage.longitudedataformap = data.longitude;
                $rootScope.imagedatofallcwcateuser = data.alocate_user.image;
                $rootScope.imageprofileofuser = data.user.image;
                $localStorage.emailid = data.user.user_email;
                $localStorage.myid = data.user_id;
                $localStorage.booking_id = data.booking_id;
                $localStorage.pricedataofbook = data.service.price;
                $localStorage.namedataofbook = data.service.service_name;
                $rootScope.pricesehulerate = data.service.price;
                $localStorage.useridforchat = data.alocate_user.user_id;
                $localStorage.timerset = data.booking_time;
                $rootScope.booking_hour = data.booking_hour;
                $rootScope.booktimer = $filter('date')($rootScope.convertedDate, 'dd/MM/yyyy hh:mm:ss');
                $localStorage.taskidofcancel = data.task_id;
                $rootScope.pather = 'http://maps.googleapis.com/maps/api/staticmap?center=' + data.latitude + ',' + data.longitude + '&zoom=14&size=350x200&markers=color:red%7Clabel:C%7C' + data.latitude + ',' + data.longitude + '&sensor=false';
                $rootScope.locationname = data.address;
                $rootScope.taskname = data.service.service_name;
                $rootScope.abouttask = data.about_task;
                $rootScope.clientname = data.alocate_user.first_name;
                $rootScope.clientlastname = data.alocate_user.last_name;
                console.info($rootScope.clientlastname)
                $rootScope.pricecleint = data.service.price;
                $timeout(function() {
                    $state.go('menu.sechdule');
                }, 150);
            }


            $scope.parseInt = parseInt;

            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
            };
            $scope.aboutapp = function() {
                $cordovaInAppBrowser.open('http://uktimeservices.co.uk/information/cms/aboutus', '_blank', options)
                    .then(function(event) {

                    })
            }
            $scope.privacypolicy = function() {
                $cordovaInAppBrowser.open('http://www.uktimeservices.co.uk/information/cms/privacy-policy', '_blank', options)
                    .then(function(event) {

                    })
            }

            if ($localStorage.device_token != undefined) {
                if ($localStorage.device_token == 'test') {
                    $scope.datafornoti = undefined;
                } else {
                    $scope.datafornoti = $localStorage.device_token;
                }

            }

            $scope.checkvaluenoti = function(checkvalue) {
                if (checkvalue == false) {
                    $localStorage.checkvalueforset = undefined;
                    $localStorage.withoutnotifcaiton = 'false';
                } else {
                    $localStorage.checkvalueforset = 'data';
                    $localStorage.withoutnotifcaiton = undefined;
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
                            $ionicHistory.clearHistory();
                            $localStorage.$reset();
                            $ionicHistory.clearCache();
                            $cordovaToast.showLongCenter('successfully Logout');
                            $state.go('main.login');
                        } else {
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            $localStorage.$reset();
                            $cordovaToast.showLongCenter('successfully Logout');
                            $state.go('main.login');
                        }
                    }
                }, function(response) {

                    UkTimeServices.reponseHandler(response);
                })


            }

            $scope.chatfucntion = function(data) {
                $localStorage.valueforstop = 'valuestroesd';
                $localStorage.useridforchat = data.alocate_user.user_id;
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


            $scope.$watch('myProp', function(newVal, oldVal) {
                    $scope.myProp = newVal;

                })
                
            $rootScope.viewacceptedjobs = function() {
                $scope.jobdata = '';
                UkTimeServices.myalljobs().then(function(_response) {
                    console.info(_response)
                    if (_response.status == 'OK') {
                        console.info(_response)
                        $scope.jobdata = _response.list;
                        $ionicLoading.show({
                            template: _response.success,
                            duration: 2000
                        })

                        $state.go('menu.customerServices')
                    }
                    if (_response.status == 'NOK') {
                        $ionicLoading.hide();
                        $cordovaToast.showLongCenter('You not booked any job');
                    }
                    $state.go('menu.customerServices')
                }, function(response) {
                    UkTimeServices.reponseHandler(response);
                })
            }


            if ($state.current.name == "menu.customerServices") {
                $rootScope.viewacceptedjobs();
            }
            


            $scope.showpencil = undefined;
            $scope.alert = function() {
                $scope.showpencil = "yes";
                $localStorage.valuechnaged = 'valuechnaged';

            }
            $scope.check = function() {

                $rootScope.imagedataprofile = '';
                $rootScope.nameofdata = '';
                UkTimeServices.check().then(function(_response) {

                    if (_response.status == 'OK') {
                        $scope.profile = _response.user_profile;
                        $rootScope.imagedataprofile = _response.user_profile.image;
                        $rootScope.nameofdata = _response.user_profile.first_name;
                         $localStorage.mylastnamedata=_response.user_profile.last_name;
                     console.info($localStorage.mylastnamedata);

                    } else {
                        var error = typeof _response.error !== 'undefined' ? _response.error : 'Cannot connect';
                        $ionicLoading.show({
                            template: error,
                            noBackDrop: false,
                            duration: 1200
                        });
                    }
                }, function(response) {

                    UkTimeServices.reponseHandler(response);
                })

            }
            $scope.check();
            $scope.ionicBack = function() {
                $timeout(function() {
                    $scope.check();
                }, 400);

                $state.go('menu.customerHome');
            }

            $scope.actionsheetcustomer = function(profiledata) {
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
                            $rootScope.imagedataprofile = results[i];
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
                        $rootScope.imagedataprofile = imageData;
                         $scope.showpencil = "yes";
                        $localStorage.valuechnaged = 'valuechnaged';
                    },
                    function(err) {
                        console.info(err)
                    }
                )
            }
            $scope.updateProfile = function(profile) {
                $ionicLoading.hide();
                if ($localStorage.valuechnaged == undefined) {

                    return false;
                }
                var res = $rootScope.imagedataprofile.substr(0, 4);
                if (res == 'http' || res.length == 0) {
                    var request = {
                        'User[first_name]': profile.first_name,
                        'User[last_name]': $localStorage.mylastnamedata,
                        'User[address]': profile.address
                    }
                    console.info(request);
                    UkTimeServices.updateProfile(request).then(function(_response) {
                        if (_response.status = 'OK') {
                            $ionicLoading.hide();
                            $localStorage.valuechnaged = undefined;
                             $scope.showpencil = undefined;
                            $cordovaToast.showLongCenter('Profile Updated');
                        }
                    }, function(response) {

                        UkTimeServices.reponseHandler(response);
                    })
                }

                if (res == 'file') {
                    var update_request = {
                        'User[first_name]': profile.first_name,
                        'User[last_name]': profile.user_email,
                        'User[address]': profile.address
                    }

                    var url = SERVERLINK.URL + 'user/updateProfile' + '?auth_code=' + $localStorage.auth_code;
                    var targetPath = $rootScope.imagedataprofile;
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
                            $ionicLoading.hide();
                             $scope.showpencil = undefined;
                            $localStorage.valuechnaged = undefined;
                            $cordovaToast.showLongCenter('Profile Updated');
                        }

                    }, function(err) {
                        $cordovaToast.showLongCenter('Profile is not Updated');
                    });
                }

            }


        }
    ])
    .controller('ChangePassword', ['$state', '$cordovaToast', '$ionicLoading', '$localStorage', '$scope', 'UkTimeServices', function($state, $cordovaToast, $ionicLoading, $localStorage, $scope, UkTimeServices) {

        $scope.changePassword = function(userForm, Current, newvaluepassword, Confirm) {

            if (userForm.$valid == false) {

                return false;
            }
            if (Current != $localStorage.currentpassword) {
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
            if ($localStorage.currentpassword == newvaluepassword) {
                $cordovaToast.showLongCenter('New Password and Old password cannot be same');
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
                    $localStorage.currentpassword = Confirm;
                    $cordovaToast.showLongCenter('Password successfully changed');
                    $state.go('menu.changePassword');
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
                $cordovaToast.showShortCenter('please Fill  your email address')
                return false;
            }
            var req = {
                'User[user_email]': email
            }
            UkTimeServices.forgotPassword(req).then(function(_response) {
                $ionicLoading.hide();

                if (_response.status == 'OK') {
                    $cordovaToast.showShortCenter(_response.message)
                }

            }, function(response) {

                UkTimeServices.reponseHandler(response);
            })

        }
    }
])