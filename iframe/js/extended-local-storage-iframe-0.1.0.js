/**
 * @fileOverview extended local storage for iframe page
 * @description set and get parameters sended by parent page to iframe local storage <br>
 * require ie8+ or other modern browsers
 * @name extended-local-storage-iframe-0.1.0.js
 * @author Ryosuke Tsuji @thujikun
 * @version 0.1.0
 * Dual licensed under the MIT or GPL Version 2 licenses.
*/

;var ExtendedLocalStorageIframe = function(domains) {
    this.init(domains);
};
ExtendedLocalStorageIframe.prototype = {
    init: function(domains) {
        var self = this;

        /** when local storage or JSON object nothing, finish function */
        if(!window.localStorage || !window.JSON) return false;

        this.addEvent('message', window, function(e) {
            var i,
                length,
                permissionFlag = false,
                data,
                responseData;
            
            /** when access url is permitted, continue function */
            for(i = 0, length = domains.length; i < length; i++) {
                if(e.origin === domains[i]) {
                    permissionFlag = true;
                    break;
                }
            }
            if(!permissionFlag) return false;

            data = e.data;

            switch(data.type){
                case 'get':
                    responseData = {
                        type:  'get',
                        value: self.getItem(data.key)
                    };

                    /** return value to parent window */
                    e.source.postMessage(responseData, e.origin);
                    break;

                case 'set':

                    self.setItem(data.key, data.value);

                    responseData = {
                        type:  'set'
                    };

                    /** send message to execute sync function */
                    e.source.postMessage(responseData, e.origin);
                    break;
            }


        });
    },
    addEvent: function(handler, element, func){
        if(element.addEventListener) {
            element.addEventListener(handler, function(e) {
                func(e);
            }, false);
        } else if(element.attachEvent) {
            handler = 'on' + handler;
            element.attachEvent(handler, function(e) {
                func(e);
            });
        }
    },
    setItem: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        
    },
    getItem: function(key) {
        var value = localStorage.getItem(key);

        if(value) {
            value = JSON.parse(localStorage.getItem(key));
        } else {
            value = null;
        }
        return value;

    }
};

!function(){
    var iframeStorage = new ExtendedLocalStorageIframe(extendedLocalStoragePermissions);
}.call(window);