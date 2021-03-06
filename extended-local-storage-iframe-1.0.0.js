/**
 * @fileOverview extended local storage for iframe page
 * @description set and get parameters sended by parent page to iframe local storage <br>
 * require ie8+ or other modern browsers
 * @name extended-local-storage-iframe.js
 * @author Ryosuke Tsuji @thujikun
 * @version 1.0.0
 * Copyright (c) 2012 "thujikun" Ryosuke Tsuji
 * Licensed under the MIT license.
 * https://github.com/thujikun/extended-local-storage/blob/master/LICENSE-MIT
*/

/**
 * @class ExtendedLocalStorageIframe
 * @description constructor of ExtendedLocalStorageIframe<br>
 * all methods are private
 * @param {Array} domains permitted domain array
 */
;var ExtendedLocalStorageIframe = function(domains) {
    this.__init(domains);
};
ExtendedLocalStorageIframe.prototype = {
    /**
     * @function
     * @description initialize ExtendedLocalStorageIframe<br>
     * private function
     * @param {Array} domains permitted domain array
     */
    __init: function(domains) {
        var self = this;

        /** when local storage or JSON object nothing, finish function */
        if(!window.localStorage || !window.JSON) return false;

        this._addEvent('message', window, function(e) {
            var i,
                length,
                permissionFlag = false,
                data,
                response,
                source = e.source,
                origin = e.origin;
            
            /** when access url is permitted, continue function */
            for(i = 0, length = domains.length; i < length; i++) {
                if(origin === domains[i]) {
                    permissionFlag = true;
                    break;
                }
            }
            if(!permissionFlag) return false;

            data = JSON.parse(e.data);

            switch(data.type){
                case 'get':
                    response = {
                        type:        'get',
                        value:       self._getItem(data.key),
                        callbackKey: data.callbackKey
                    };

                    /** return value to parent window */
                    self._returnMessage(source, origin, response);
                    break;

                case 'set':
                    self._setItem(data.key, data.value);

                    response = {
                        type:  'set',
                        callbackKey: data.callbackKey
                    };

                    /** send message to execute sync function */
                    self._returnMessage(source, origin, response);
                    break;

                case 'remove':
                    self._removeItem(data.key);

                    response = {
                        type:  'remove',
                        callbackKey: data.callbackKey
                    };

                    /** send message to execute sync function */
                    self._returnMessage(source, origin, response);
                    break;
            }


        });
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
     * @description send postMessage to your other HTML<br>
     * private function
     * @param  {Object} source   caller source of postMessage
     * @param  {Object} origin   caller origin of postMessage
     * @param  {Object} response response to caller
     */
    _returnMessage: function(source, origin, response) {
        response = JSON.stringify(response);

        /** make postMessage API async for IE8 */
        setTimeout(function(){
            source.postMessage(response, origin);
        }, 0);
    },
    /**
     * @function
     * @description set local storage<br>
     * private function
     * @param  {String}   key   local storage key
     * @param  {String}   vakue local storage value
     */
    _setItem: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * @function
     * @description get local storage<br>
     * private function
     * @param  {String}   key local storage key
     */
    _getItem: function(key) {
        var value = localStorage.getItem(key);

        if(value) {
            value = JSON.parse(localStorage.getItem(key));
        } else {
            value = null;
        }
        return value;
    },
    /**
     * @function
     * @description remove local storage<br>
     * private function
     * @param  {String}   key local storage key
     */
    _removeItem: function(key) {
        localStorage.removeItem(key);
    }
};

!function(){
    var iframeStorage = new ExtendedLocalStorageIframe(extendedLocalStoragePermissions);
}.call(window);
