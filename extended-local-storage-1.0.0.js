/**
 * @fileOverview extended local storage
 * @description use iframe to access same origin local storage from diffrent origin page.<br>
 * require ie8+ or other modern browsers
 * @name extended-local-storage.js
 * @author Ryosuke Tsuji @thujikun
 * @version 1.0.0
 * Copyright (c) 2012 "thujikun" Ryosuke Tsuji
 * Licensed under the MIT license.
 * https://github.com/thujikun/extended-local-storage/blob/master/LICENSE-MIT
*/

/**
 * @class ExtendedLocalStorage
 * @description constructor of ExtendedLocalStorage
 * @param {String} url your other domain HTML url
 */
var ExtendedLocalStorage = function(url) {
    this.__init(url);
};
ExtendedLocalStorage.prototype = {
    /**
     * @function
     * @description initialize ExtendedLocalStorage<br>
     * private function
     * @param  {String} url your other domain HTML url
     */
    __init: function(url) {
        var self = this,
            tmpUrl;

        /** when url is nothing, do nothing */
        if(!url) return false;

        tmpUrl = url.split('/');
        self._iframe = document.createElement('iframe');
        self._iframe.style.display = 'none';
        self._origin = tmpUrl[0] + '//' + tmpUrl[2];
        self._loadEndFlag = false;

        self._iframe.src = url;
        document.body.appendChild(self._iframe);

        self._addEvent('load', self._iframe, function() {
            self.content = self._iframe.contentWindow;
            self._loadEndFlag = true;
        });
        
        self.callbackTable = [];
        self.callbackCnt = 0;
        self.__setCallback();
    },
    /**
     * @function
     * @description set postMessage callback<br>
     * private function
     */
    __setCallback: function() {
        var self = this;

        self._addEvent('message', window, function(e) {
            var data,
                callback;

            if(e.origin === self._origin) {
                data = JSON.parse(e.data);
                callback = self.callbackTable[data.callbackKey];
                if(typeof callback === 'function') {
                    switch(data.type) {
                        case 'set':
                            callback();
                            break;
                        case 'get':
                            callback(data.value);
                            break;
                        case 'remove':
                            callback();
                            break;
                    }
                }
            }
        });
    },
    /**
     * @function
     * @description get callback count<br>
     * private function
     */
    __getCallbackKey: function() {
        return self.callbackCnt++;
    },
    /**
     * @function
     * @description send postMessage to your other HTML<br>
     * private function
     */
    _send: function(data) {
        var self = this;

        if(!window.localStorage || !window.JSON) {
            return false;
        }
        data = JSON.stringify(data);
        if(self._loadEndFlag) {

            /** make postMessage API async for IE8 */
            setTimeout(function(){
                self.content.postMessage(data, self._origin);
            });
        } else {
            self._addEvent('load', self._iframe, function() {

                 /** make postMessage API async for IE8 */
                setTimeout(function(){
                    self.content.postMessage(data, self._origin);
                }, 0);
            });
        }
    },
    /**
     * @function
     * @description add event listener<br>
     * private function
     * @param  {String}   handler event handler
     * @param  {Object}   element event target
     * @param  {function} func    event listener
     */
    _addEvent: function(handler, element, func) {
        if(element.addEventListener) {
            element.addEventListener(handler, function(e) {
                func.call(element, e);
            }, false);
        } else if(element.attachEvent) {
            handler = 'on' + handler;
            element.attachEvent(handler, function(e) {
                func.call(element, e);
            });
        }
    },
    /**
     * @function
     * @description add event listener<br>
     * public function
     * @param  {String}   key      local storage key
     * @param  {String}   vakue    local storage value
     * @param  {function} callback callback function
     */
    setItem: function(key, value, callback) {
        var self = this,
            callbackKey = 'callback' + self.__getCallbackKey(),
            data = {
                type:        'set',
                key:         key,
                value:       value,
                callbackKey: callbackKey
            };
        
        self.callbackTable[callbackKey] = callback;
        self._send(data);
    },
    /**
     * @function
     * @description add event listener<br>
     * public function
     * @param  {String}   key      local storage key
     * @param  {function} callback callback function<br>
     * first argument of this callback is local storage value
     */
    getItem: function(key, callback) {
        var self = this,
            callbackKey = 'callback' + self.__getCallbackKey(),
            data = {
                type:        'get',
                key:         key,
                callbackKey: callbackKey
            };

        self.callbackTable[callbackKey] = callback;
        self._send(data);
    },
    /**
     * @function
     * @description add event listener<br>
     * public function
     * @param  {String}   key      local storage key
     * @param  {function} callback callback function<br>
     */
    removeItem: function(key, callback) {
        var self = this,
            callbackKey = 'callback' + self.__getCallbackKey(),
            data = {
                type:        'remove',
                key:         key,
                callbackKey: callbackKey
            };

        self.callbackTable[callbackKey] = callback;
        self._send(data);
    }
};