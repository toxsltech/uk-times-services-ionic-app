var exec = cordova.require('cordova/exec');
var PushNotification = function(options) {
    this._handlers = {
        'registration': [],
        'notification': [],
        'error': []
    };
    if (typeof options === 'undefined') {
        throw new Error('The options argument is required.');
    }
    this.options = options;
    var that = this;
    var success = function(result) {
        if (result && typeof result.registrationId !== 'undefined') {
            that.emit('registration', result);
        } else if (result && result.additionalData && typeof result.additionalData.callback !== 'undefined') {
            var executeFunctionByName = function(functionName, context /*, args */) {
                var args = Array.prototype.slice.call(arguments, 2);
                var namespaces = functionName.split('.');
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            };

            executeFunctionByName(result.additionalData.callback, window, result);
        } else if (result) {
            that.emit('notification', result);
        }
    };
    var fail = function(msg) {
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        that.emit('error', e);
    };
    setTimeout(function() {
        exec(success, fail, 'PushNotification', 'init', [options]);
    }, 10);
};
PushNotification.prototype.unregister = function(successCallback, errorCallback, options) {
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('PushNotification.unregister failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.unregister failure: success callback parameter must be a function');
        return;
    }

    var that = this;
    var cleanHandlersAndPassThrough = function() {
        if (!options) {
            that._handlers = {
                'registration': [],
                'notification': [],
                'error': []
            };
        }
        successCallback();
    };

    exec(cleanHandlersAndPassThrough, errorCallback, 'PushNotification', 'unregister', [options]);
};
PushNotification.prototype.setApplicationIconBadgeNumber = function(successCallback, errorCallback, badge) {
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'setApplicationIconBadgeNumber', [{badge: badge}]);
};
PushNotification.prototype.getApplicationIconBadgeNumber = function(successCallback, errorCallback) {
    if (!errorCallback) { errorCallback = function() {}; }

    if (typeof errorCallback !== 'function')  {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
    }

    if (typeof successCallback !== 'function') {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'getApplicationIconBadgeNumber', []);
};

PushNotification.prototype.on = function(eventName, callback) {
    if (this._handlers.hasOwnProperty(eventName)) {
        this._handlers[eventName].push(callback);
    }
};
PushNotification.prototype.off = function (eventName, handle) {
    if (this._handlers.hasOwnProperty(eventName)) {
        var handleIndex = this._handlers[eventName].indexOf(handle);
        if (handleIndex >= 0) {
            this._handlers[eventName].splice(handleIndex, 1);
        }
    }
};
PushNotification.prototype.emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var eventName = args.shift();

    if (!this._handlers.hasOwnProperty(eventName)) {
        return false;
    }

    for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
        this._handlers[eventName][i].apply(undefined,args);
    }

    return true;
};

PushNotification.prototype.finish = function(successCallback, errorCallback, id) {
    if (!successCallback) { successCallback = function() {}; }
    if (!errorCallback) { errorCallback = function() {}; }
    if (!id) { id = 'handler'; }

    if (typeof successCallback !== 'function') {
        console.log('finish failure: success callback parameter must be a function');
        return;
    }

    if (typeof errorCallback !== 'function')  {
        console.log('finish failure: failure parameter not a function');
        return;
    }

    exec(successCallback, errorCallback, 'PushNotification', 'finish', [id]);
};
module.exports = {
    init: function(options) {
        return new PushNotification(options);
    },

    hasPermission: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PushNotification', 'hasPermission', []);
    },
    PushNotification: PushNotification
};
