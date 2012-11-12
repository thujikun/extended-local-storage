/**
 * @fileOverview extended local storage
 * @description use iframe to access same origin local storage from diffrent origin page.<br>
 * require ie8+ or other modern browsers
 * @name extended-local-storage-0.1.0.js
 * @author Ryosuke Tsuji @thujikun
 * @version 0.1.0
 * Copyright (c) 2012 "thujikun" Ryosuke Tsuji
 * Licensed under the MIT license.
 * https://github.com/thujikun/extended-local-storage/blob/master/LICENSE-MIT
*/

;var ExtendedLocalStorage = function(url){
    this.init(url);
};
ExtendedLocalStorage.prototype = {
    init: function(url) {
        var self = this,
            tmpUrl;

        /** when url is nothing, do nothing */
        if(!url) return false;

        tmpUrl = url.split('/');
        self.iframe = document.createElement('iframe');
        self.iframe.style.display = 'none';
        self.origin = tmpUrl[0] + '//' + tmpUrl[2];
        self.loadEndFlag = false;

        self.iframe.src = url;
        document.body.appendChild(self.iframe);

        self.addEvent('load', self.iframe, function() {
            self.content = self.iframe.contentWindow;
            self.loadEndFlag = true;
        });
    },
    addEvent: function(handler, element, func) {
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
    send: function(data) {
        var self = this;

        if(!window.localStorage || !window.JSON){
            return false;
        }
        data = JSON.stringify(data);
        if(self.loadEndFlag) {
            self.content.postMessage(data, self.origin);
        } else {
            self.addEvent('load', self.iframe, function() {
                self.content.postMessage(data, self.origin);
            });
        }
        
    },
    setItem: function(key, value, callback) {
        var self = this,
            data = {
                "type":  "set",
                "key":   key,
                "value": value
            };

        self.send(data);

        self.addEvent('message', window, function(e) {
            var data = JSON.parse(e.data);
            if(e.origin === self.origin && data.type === 'set') {
                callback();
            }
        });
        
    },
    getItem: function(key, callback) {
        var self = this,
            data = {
                "type":  "get",
                "key":   key
            };

        self.send(data);

        self.addEvent('message', window, function(e) {
            var data = JSON.parse(e.data);
            if(e.origin === self.origin && data.type === 'get') {
                callback(data.value);
            }
        });
    }
};