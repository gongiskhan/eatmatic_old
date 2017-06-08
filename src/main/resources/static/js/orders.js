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

            document.onkeypress = function(e) {
                e = e || window.event;
                var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
                if (charCode) {
                    var k = String.fromCharCode(charCode);
                    if(k > 0 && k < 10){
                        if(orders[k-1]){
                            completeOrder(k);
                        }
                    }

                }
            };
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
        currentOrders = function(){
            currentPage = 'currentOrders';
            $('#orderMenu a.orderMenuItem').replaceWith('<a href="#" class="orderMenuItem button" onclick="App.orderHistory()">HISTORICO</a>')
            var currentSize = orders.length;
            orders = [];
            $.ajax({
                type: 'GET',
                async:false,
                contentType:'application/json',
                url: '/order',
                success: function (resp) {
                    var ordersFromServer = JSON.parse(resp);
                    $('#activeOrders').html('');
                    ordersFromServer.forEach(function(order,i){
                        if(order.active){
                            orders.push(order);
                        }
                    });
                    if(orders.length == 0){
                        $('#activeOrders').html('<br/><br/><p style="font-size:1em; text-align: center;">&nbsp;NÃO HÁ PEDIDOS ATIVOS!! É DEUS NO CÉU E A CAMI E A D.MARIA NA TERRA!</p>');
                    }
                    orders.forEach(function(order,i){
                        var orderHtml = '';
                        orderHtml += '<div class="orderContainer">';
                        // orderHtml += ('<h3 class="orderNumber"><span style="float:left;"> '+(i+1)+' - PEDIDO '+order.id+'</span><span style="float:right;">'+order.tableNum+'</span></h3>');
                        orderHtml += ('<h3 class="orderNumber"><span class="tableNum">'+(order.tableNum == 'Para Levar' ? 'TakeAway' : order.tableNum)+'</span>');
                        if(order.scheduled)
                            orderHtml += '<span class="serveAt">'+order.serveHour+'</span>';
                        orderHtml += '</h3>';
                        orderHtml += ('<div class="orderItemsTable">');
                        orderHtml += ('<div class="thead">');
                        orderHtml += ('<span class="nome">Prato</span>');
                        orderHtml += ('<span class="qtd">Qtd.</span>');
                        orderHtml += ('</div>');
                        orderHtml += ('<div class="tbody">');
                        order.items.forEach(function(item,i){
                            orderHtml += ('<div class="tr">');
                            orderHtml += ('<span class="nome">'+item.name+'</span>');
                            orderHtml += ('<span class="qtd">'+item.quantity+'</span>');
                            orderHtml += ('</div>');
                        });
                        orderHtml += '</div>';
                        orderHtml += '</div>';
                        var data = new Date(order.date).toISOString();
                        data = data.substring(data.indexOf('T')+1,data.lastIndexOf('.'));
                        orderHtml += ('<span><a href="#" class="button doneButton" onclick="App.completeOrder('+(i+1)+')">RETIRAR</a></span>');
                        orderHtml += ('<span class="orderDate">'+data+'</span><br/>');
                        // orderHtml += ('<span class="orderRef">'+order.ref+'</span>');
                        orderHtml += '</div>';
                        $('#activeOrders').append(orderHtml);
                    });
                    if(orders.length > currentSize){
                        var msg = new SpeechSynthesisUtterance();
                        var voices = window.speechSynthesis.getVoices();
                        msg.voice = voices[1]; // Note: some voices don't support altering params
                        msg.voiceURI = 'native';
                        msg.volume = 1; // 0 to 1
                        msg.rate = 0.7; // 0.1 to 10
                        msg.pitch = 0.8; //0 to 2
                        msg.text = 'Saí';
                        var order = orders[orders.length-1];
                        order.items.forEach(function(item,it){
                            if(it > 0)
                                msg.text += ' mais ';
                            msg.text += item.quantity;
                            msg.text += '   ';
                            msg.text += item.name;
                            msg.text += '            ';
                        });
                        msg.lang = 'pt-PT';
                        speechSynthesis.speak(msg);
                    }
                }
            });
        },
        orderHistory = function(){
            currentPage = 'orderHistory';
            $('#orderMenu a.orderMenuItem').replaceWith('<a href="#" class="orderMenuItem button" onclick="App.currentOrders()">PEDIDOS</a>')
            $.ajax({
                type: 'GET',
                async:false,
                contentType:'application/json',
                url: '/order',
                success: function (resp) {
                    var ordersFromServer = JSON.parse(resp).reverse();
                    if(ordersFromServer.length == 0){
                        $('#activeOrders').html('NÃO HÁ PEDIDOS!');
                    }
                    var todayOrders = 0;
                    var historyHTML = '<div class="orderHistoryTable">';
                    historyHTML += ('<div class="thead">');
                    // historyHTML += ('<span>#</span>');
                    historyHTML += ('<span>Data</span>');
                    historyHTML += ('<span>Items</span>');
                    historyHTML += ('<span>Mesa</span>');
                    historyHTML += ('<span>Ref</span>');
                    historyHTML += ('<span>Marcação</span>');
                    historyHTML += ('</div>');
                    historyHTML += ('<div class="tbody">');
                    ordersFromServer.forEach(function(order,i){
                        historyHTML += ('<div class="tr">');
                        var dataC = new Date(order.date).toISOString();
                        var dataCToday = new Date().toISOString();
                        var data = dataC.substring(0,dataC.indexOf('T'));
                        var dataToday = dataCToday.substring(0,dataCToday.indexOf('T'));
                        var hora = dataC.substring(dataC.indexOf('T')+1,dataC.lastIndexOf('.'));
                        // historyHTML += ('<span>'+(ordersFromServer.length - i)+'</span>');
                        historyHTML += ('<span>'+data+'/'+hora+'</span>');
                        historyHTML += ('<span class="items">');
                        order.items.forEach(function(item,i){
                            historyHTML += (item.quantity+' '+item.name + '<br/>');
                            if(data == dataToday)
                                todayOrders = (todayOrders + item.quantity);
                        });
                        historyHTML += ('</span>');
                        historyHTML += ('<span>'+order.tableNum+'</span>');
                        historyHTML += ('<span>'+order.ref+'</span>');
                        historyHTML += ('<span>'+order.serveHour+'</span>');
                        historyHTML += ('</div>');
                    });
                    historyHTML += '</div>';
                    historyHTML += '</div>';

                    historyHTML = ('<br/><span>Pedidos hoje: '+todayOrders+'</span>')+historyHTML;
                    $('#activeOrders').html(historyHTML);
                }
            });
        },
        holdingOrders = function(){
            $.ajax({
                type: 'GET',
                async:false,
                contentType:'application/json',
                url: '/order',
                success: function (resp) {
                    var ordersFromServer = JSON.parse(resp);
                    $('#activeOrders').hide();
                    $('#activeOrders').html('');
                    ordersFromServer.forEach(function(order,i){
                        if(order.active && order.scheduled){
                            var orderHtml = '';
                            orderHtml += '<div class="orderContainer">';
                            orderHtml += ('<h3 class="orderNumber"><span style="float:left;"> '+(i+1)+' - PEDIDO '+order.id+'</span><a href="#" class="button doneButton" onclick="App.">RETIRAR</a><span style="float:right;">'+order.tableNum+'</span></h3>');
                            orderHtml += ('<div class="orderItemsTable">');
                            orderHtml += ('<div class="thead">');
                            orderHtml += ('<span>Prato</span>');
                            orderHtml += ('<span>Quantidade</span>');
                            orderHtml += ('</div>');
                            orderHtml += ('<div class="tbody">');
                            order.items.forEach(function(item,i){
                                orderHtml += ('<div class="tr">');
                                orderHtml += ('<span>'+item.name+'</span>');
                                orderHtml += ('<span>'+item.quantity+'</span>');
                                orderHtml += ('</div>');
                            });
                            orderHtml += '</div>';
                            orderHtml += '</div>';
                            orderHtml += ('<span class="orderDate">Data e Hora: '+new Date(order.date).toString()+'</span>');
                            orderHtml += ('<span class="orderRef">Referência: '+order.ref+'</span>');
                            orderHtml += '</div>';
                            $('#activeOrders').append(orderHtml);
                        }
                    });
                    $('#activeOrders').show();
                    if(orders.length > currentSize){
                        var msg = new SpeechSynthesisUtterance();
                        var voices = window.speechSynthesis.getVoices();
                        msg.voice = voices[1]; // Note: some voices don't support altering params
                        msg.voiceURI = 'native';
                        msg.volume = 1; // 0 to 1
                        msg.rate = 0.7; // 0.1 to 10
                        msg.pitch = 0.8; //0 to 2
                        msg.text = 'Saí';
                        var order = orders[orders.length-1];
                        order.items.forEach(function(item,it){
                            if(it > 0)
                                msg.text += ' mais ';
                            msg.text += item.quantity;
                            msg.text += '   ';
                            msg.text += item.name;
                            msg.text += '            ';
                        });
                        msg.lang = 'pt-PT';
                        speechSynthesis.speak(msg);
                    }
                }
            });
        },
        completeOrder = function(position){
            var order = orders[position-1];
            //if(confirm('Tem a certeza que terminou o pedido?')){
            order.active = false;
            $.ajax({
                type:'POST',
                contentType: 'application/json',
                url: "/orderComplete",
                data: JSON.stringify(order),
                complete:function(res){
                    console.debug('RESPONSE: '+res.responseText);
                    console.debug(res);
                },
                success:function(){
                    currentOrders();
                }
            });
            //}
        },
        unscheduleOrder = function(position){
            var order = orders[position-1];
            order.scheduled = false;
            $.ajax({
                type:'POST',
                contentType: 'application/json',
                url: "/unscheduleOrder",
                data: JSON.stringify(order),
                complete:function(res){
                    console.debug('RESPONSE: '+res.responseText);
                    console.debug(res);
                },
                success:function(){
                    currentOrders();
                }
            })
        },
        loadHome = function () {

            console.log('Loading Home.');
            var html = '<div id="activeOrders"></div>';

            html += '<div id="orderMenu">';
            // html += '<a href="#" class="orderMenuItem button" onclick="App.currentOrders()">PEDIDOS</a>';
            // html += '<a href="#" class="orderMenuItem button" onclick="App.holdingOrders()">MARCAÇÕES</a>';
            html += '<a href="#" class="orderMenuItem button" onclick="App.orderHistory()">HISTORICO</a>';
            html += '</div>';

            setContent(function (callback) {
                console.log('Executing setContent callback.');
                callback(html);
                registerListeners();
                currentOrders();
                // var inter = setInterval(function(){
                //     if(currentPage != 'orderHistory')
                //         currentOrders();
                // },2000);

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