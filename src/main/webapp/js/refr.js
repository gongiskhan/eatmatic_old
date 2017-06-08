if ( !String.prototype.replaceAll ) {
    String.prototype.replaceAll = function (target, replacement) {
        return this.split(target).join(replacement);
    };
}
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}
if(typeof String.prototype.trim == 'undefined'){
    String.prototype.trim = function(){
        return this.replace(/^\s+|\s+$/g, '');
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisArg*/) {
        'use strict';

        if (this == null) {
            throw new TypeError('Array.prototype.some called on null or undefined');
        }

        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}
(function (App, undefined) {

    /**
     * BEGIN PROPERTIES AND METHODS
     */
    var isAndroid,
        isLt4,
        isIOS,
        eventHandlers = {},
        cssAnimationsEnabled = true,
        orderHistory,
        settings,
        orders = [],
        currentPage='currentOrders',
        trigger = function (event, data) {
            var handlers = eventHandlers[event];
            if (typeof handlers != 'undefined')
                for (var i = 0; i < handlers.length; i++) {
                    if (typeof handlers[i] == 'function')
                        handlers[i](data);
                    else
                        console.error('Event handler for ' + event + ' is not a function.');
                }
        },
        bindClick = function (selector, callback) {
            $(selector).off('click');
            $(selector).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                callback(e);
                return false;
            });
        },
        registerListeners = function() {
            document.addEventListener("resume", function () {

            }, false);

            bindClick('.loadHome', function (e) {
                window.location.href = 'index.html';
            });

            bindClick('#scan', function (e) {
                scan();
            });

        },
        applyI18n = function(){
            $('*[i18n]').each(function(it,el){
                if(i18n[settings.language][$(el).attr('i18n')])
                    $(el).html(i18n[settings.language][$(el).attr('i18n')]);
            });
        },
        init = function (callback) {

            isAndroid = (window.device && window.device.platform == 'Android');
            isLt4 = (window.device && window.device.version.substring(0, 1) < 4);
            isIOS = (window.device && window.device.platform == 'iOS');
            settings = localStorage.getItem('eatmatic_settings') != null ? JSON.parse(localStorage.getItem('eatmatic_settings')) : {language: 'pt'};
            disableUnsupportedFeatures();
            loadHome();
            callback();
        },
        disableUnsupportedFeatures = function () {

            if (!isAndroid) {
                $('.androidOnly').hide();
            }
            if (!isIOS) {
                console.log('Disable pop-up transitions');
                $('#content').on('create', function () {
                    try {
                        $('.jQueryMobilePopUp').popup('option', 'transition', 'none');
                    } catch (err) {
                    }
                });
                $('.iOSOnly').hide();
            }
            if (isLt4 || (!isAndroid && !isIOS)) {
                console.log('Disable CSS animations.');
                cssAnimationsEnabled = false;
                /*
                 var s = document.createElement('link');
                 s.setAttribute('rel','stylesheet');
                 s.setAttribute('type','text/css');
                 s.setAttribute('href','css/style_android_23.css');
                 document.getElementsByTagName('head')[0].appendChild(s);
                 */
            }

        },
        setContent = function (callback) {
            console.log('Setting page content.');

            if (cssAnimationsEnabled) {
                $('#content').off('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend');
                $('#content').on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function () {
                    afterHideAnimation(callback);
                });
                $('#content').removeClass('showContent').removeClass('hideContent').addClass('hideContent');
            } else {
                afterHideAnimation(callback);
            }
        },
        afterHideAnimation = function (callback) {

            $('#content').css({opacity: 0});
            if(window.device && !!window.device.platform)
                $.mobile.loading( 'show' );

            console.log('About to call setContent callback.');
            callback(function (html) {

                console.log('Received result from setContent callback.');

                $('#content').html(html);
                $('#content').trigger('create');
                trigger('pageContentChanged');
                if(typeof window.device != 'undefined' && typeof window.device.platform != 'undefined' && !!window.device.platform)
                    $.mobile.loading('hide');
                if (cssAnimationsEnabled) {
                    $('#content').off('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend');
                    $('#content').on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function () {
                        afterShowAnimation();
                    });
                    $('#content').removeClass('showContent').removeClass('hideContent').addClass('showContent');
                } else {
                    afterShowAnimation();
                }
            });
        },
        afterShowAnimation = function () {
            applyI18n();
            $('#content').css({opacity: 1});
        },

        scan = function () {


        },
        loadHome = function () {

            console.log('Loading Home.');
            var html = '<div id="activeOrders"></div>';

            html += '<div id="orderMenu">';
            html += '<a href="#" id="scan" class="orderMenuItem button">SCAN</a>';
            html += '</div>';

            setContent(function (callback) {
                console.log('Executing setContent callback.');
                callback(html);
                registerListeners();
                currentOrders();
                var inter = setInterval(function(){
                    if(currentPage != 'orderHistory')
                        currentOrders();
                },2000);

            });
        };

    /**
     * END PROPERTIES AND METHOD
     */


    //Exports
    App.init = init;
    App.completeOrder = completeOrder;
    App.currentOrders = currentOrders;
    App.holdingOrders = holdingOrders;
    App.orderHistory = orderHistory;

    /**
     * UTIL FUNCTIONS
     */
    function executeNative(action, callback, args) {
        //callback("{}");
        if(!args)
            args = [];
        //args = JSON.stringify(args)
        if(typeof cordova != 'undefined'){
            cordova.exec(function (result) {
                    callback(result);
                }, function () {
                    console.log('error calling CostumPlugin');
                    console.log(arguments);
                    for (o in arguments) {
                        console.log(arguments[o]);
                    }
                },
                "CostumPlugin",
                action,
                args);
        }
    }

    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }

    function getParam(name) {
        try {
            var location = window.top.location.href;
            if (location.indexOf(name) != -1) {
                var start = location.indexOf(name) + name.length + 1;
                var end = location.indexOf('&', start);
                if (end <= 1)end = location.length;
                return location.substring(start, end);
            }
        } catch (err) {
        }
        return null;
    }

})(window.App = window.App || {});