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
        printerConnected = false,
        defaultDiacriticsRemovalMap = [
            {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
            {'base':'AA','letters':'\uA732'},
            {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
            {'base':'AO','letters':'\uA734'},
            {'base':'AU','letters':'\uA736'},
            {'base':'AV','letters':'\uA738\uA73A'},
            {'base':'AY','letters':'\uA73C'},
            {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
            {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
            {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
            {'base':'DZ','letters':'\u01F1\u01C4'},
            {'base':'Dz','letters':'\u01F2\u01C5'},
            {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
            {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
            {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
            {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
            {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
            {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
            {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
            {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
            {'base':'LJ','letters':'\u01C7'},
            {'base':'Lj','letters':'\u01C8'},
            {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
            {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
            {'base':'NJ','letters':'\u01CA'},
            {'base':'Nj','letters':'\u01CB'},
            {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
            {'base':'OI','letters':'\u01A2'},
            {'base':'OO','letters':'\uA74E'},
            {'base':'OU','letters':'\u0222'},
            {'base':'OE','letters':'\u008C\u0152'},
            {'base':'oe','letters':'\u009C\u0153'},
            {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
            {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
            {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
            {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
            {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
            {'base':'TZ','letters':'\uA728'},
            {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
            {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
            {'base':'VY','letters':'\uA760'},
            {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
            {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
            {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
            {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
            {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
            {'base':'aa','letters':'\uA733'},
            {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
            {'base':'ao','letters':'\uA735'},
            {'base':'au','letters':'\uA737'},
            {'base':'av','letters':'\uA739\uA73B'},
            {'base':'ay','letters':'\uA73D'},
            {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
            {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
            {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
            {'base':'dz','letters':'\u01F3\u01C6'},
            {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
            {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
            {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
            {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
            {'base':'hv','letters':'\u0195'},
            {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
            {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
            {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
            {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
            {'base':'lj','letters':'\u01C9'},
            {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
            {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
            {'base':'nj','letters':'\u01CC'},
            {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
            {'base':'oi','letters':'\u01A3'},
            {'base':'ou','letters':'\u0223'},
            {'base':'oo','letters':'\uA74F'},
            {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
            {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
            {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
            {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
            {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
            {'base':'tz','letters':'\uA729'},
            {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
            {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
            {'base':'vy','letters':'\uA761'},
            {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
            {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
            {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
            {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
        ],
        diacriticsMap = {},
        /*
        db,
        localStorage = {
            getItem:function(name){
                var result = null;
                db.get(name,function(err,doc){
                    if(doc)
                        result = doc.value;
                });
                return result;
            },
            setItem: function(name, value){
                console.debug(name);
                localStorage.write({_id:name, value:value});
            },
            write: function(doc){
                db.get(doc._id).then(function (origDoc) {
                    doc._rev = origDoc._rev;
                    return db.put(doc);
                }).catch(function (err) {
                    if (err.status === 409) {
                        return localStorage.write(doc);
                    } else { // new doc
                        return db.put(doc);
                    }
                });
            }
        },
        */
        listen = function (event, handler) {
            if (typeof eventHandlers[event] == 'undefined')
                eventHandlers[event] = [];
            eventHandlers[event].push(handler);
        },
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
        bindChange = function (selector, callback) {
            $(selector).off('change');
            $(selector).on('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                callback(e);
                return false;
            });
        },
        bindFocus = function (selector, callback) {
            $(selector).off('focus');
            $(selector).on('focus', function (e) {
                e.preventDefault();
                e.stopPropagation();
                callback(e);
                return false;
            });
        },
        showAllListItems = function(element){
            $('ul.ui-listview li').addClass('ui-screen-hidden');

            if ($(element).val().trim() == '') {
                $(element).parents('div.ui-block-a').find('li').removeClass('ui-screen-hidden');
            } else {
                $(element).parents('div.ui-block-a').find('ul.ui-listview').listview('refresh');
            }
            var inputValue = $(element).parents('div.ui-block-a').find('input.orderItemInput').val();
            $(element).parents('div.ui-block-a').find('li').each(function(it,el){
                if ($(el).html() == inputValue){
                    $(el).addClass('ui-screen-hidden');
                }
                $(el).on('click',function(it,el){
                    $('.ui-input-clear-hidden').removeClass('ui-input-clear-hidden');
                });
            });
            $('.ui-input-clear-hidden').removeClass('ui-input-clear-hidden');
        },
        registerListeners = function() {
            document.addEventListener("resume", function () {

            }, false);
            $('.obs').hide();
            bindClick('.reOrderButton',function(e){

            });
            bindClick('.orderHistory', function (e) {
                loadOrderHistory();
            });
            bindClick('.loadHome', function (e) {
                window.location.href = 'index.html';
            });
            $('#tableNum').on('change',function(e){
                if($('#tableNum').val() == 'describe'){
                    $('#tableNum').parents('.ui-select').after('<textarea id="tableLocation" cols="40" rows="2" name="tableLocation" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ui-input-has-clear" style="font-size:0.6em; padding: 0.7em;"></textarea>');
                }else{
                    $('#tableLocation').remove();
                }
                return true;
            });
            $('.ui-icon-delete').off('click');
            $('.ui-icon-delete').on('click',function(e){
                var el = $(e.target).parents('div.ui-input-text').find('input.orderItemInput').get(0);
                setTimeout(function(){
                    showAllListItems(el);
                },500);
                return true;
            });
            bindFocus('.orderItemInput', function (e) {
                showAllListItems(e.target);
            });
            $("ul.ui-listview").off("filterablefilter");
            $("ul.ui-listview").on("filterablefilter", function (e, ui) {
                var inputValue = $(e.target).parents('div.ui-block-a').find('input.orderItemInput').val();
                $(ui).each(function (it, el) {
                   if ($(el).html() == inputValue){
                       $(el).addClass('ui-screen-hidden');
                   }
                });
                $(ui).on('click',function(it,el){
                    $('.ui-input-clear-hidden').removeClass('ui-input-clear-hidden');
                });
            });
            bindClick('#placeOrderButton',function(e){

                var thisOrderItems = [];
                $('.orderItemInput').each(function(it,el){
                    if($(el).val().trim()){
                        thisOrderItems.push({name: $(el).val(), quantity: $($('.orderItemValue').get(it)).val() });
                    }
                });
                var now = new Date();
                var nowTime = now.getTime();
                var nowTimeString = nowTime+"";
                var ref = nowTimeString.substring(nowTimeString.length-7, nowTimeString.length-2);
                console.log('Order ref: '+ref);
                var order = {items: thisOrderItems, date: now, tableNum:$('#tableNum').val(), tableLocation: $('#tableLocation').val(), ref: ref, serveHour: $('#serveHour').val() ? $('#serveHour').val() + ':' + $('#serveMinute').val() : 'Agora', scheduled: !!$('#serveHour').val()};

                placeOrder(order);

            });
            bindClick('#askForCheckButton',function(e){

                if(checkPrinterConnected() && checkCanOrder()){
                    $('#confirmationText').html('<p i18n="checkConfirmation">'+(i18n[settings.language]['checkConfirmation'] ? i18n[settings.language]['checkConfirmation'] : 'Tem a certeza que deseja pedir a Conta?')+'</p>');
                    $('#confirmation').popup('open');

                    var orderRefs = [];
                    var now = new Date().getTime();
                    for(var i = 0; i < orderHistory.length; i++){
                        var order = orderHistory[i];
                        if(order.date > (now - 7200000)){ //in the last 2 hours
                            orderRefs.push(order.ref);
                        }
                    }

                    var askCheckText = '';
                    askCheckText += (i18n[settings.language]['askCheck1'] ? i18n[settings.language]['askCheck1'] : 'Cliente com encomenda(s) \n');
                    askCheckText += orderRefs.join();
                    askCheckText += (i18n[settings.language]['askCheck2'] ? i18n[settings.language]['askCheck2'] : '\n\n Pede a Conta em \n');
                    askCheckText += ($('#tableNum').val() == 'describe' ? $('#tableLocation').val() : $('#tableNum').val() == 'counter' ? 'Balcão' : $('#tableNum').val());

                    bindClick('#confirmationYes',function(e){
                        $('#confirmation').popup('close');
                        executeNative("print",function(){
                            $('#informationText').html('<p i18n="checkOrdered">'+(i18n[settings.language]['checkOrdered'] ? i18n[settings.language]['checkOrdered'] : 'A conta foi solicitada')+'</p>');
                            setTimeout(function(){
                                $('#information').popup('open');
                                loadHome();
                            },500);
                        },[(i18n[settings.language]['askCheckTitle'] ? i18n[settings.language]['askCheckTitle'] : 'Pedido de Conta')+'\n\n',askCheckText,'']);
                    });
                }
            });
            bindClick('.menuItemButton',function(e){
                var item = e.target.nodeName.toLowerCase() == 'a' ? $(e.target).find('span').html() : $(e.target).html();
                addOrderItem(item);
            });
            /*
            bindClick('.addOrderItemButton',function(e){
                if($('.addOrderItemButton').size() < 20) {
                    $('#orderItemsContainer').append(addOrderItem());
                    $('#orderItemsContainer').trigger('create');
                    registerListeners();
                }else{
                    $('#informationText').html('Too many Items. A encomenda não pode ter tantos artigos.');
                    $('#information').popup('open');
                }
            });
            */
            bindClick('ul.ui-listview li',function(e){
                $(e.target).parents('div.ui-block-a').find('input.orderItemInput').val($(e.target).html());
                $( "ul.ui-listview li" ).addClass('ui-screen-hidden');
            });
            bindClick('.orderHistory',function(){
                loadOrderHistory();
            });
            $('.settingsSave').off('click');
            $('.settingsSave').on('click',function(){
                settings.language = $('#language').val();
                settings.userName = $('#userName').val();
                localStorage.setItem('eatmatic_settings',JSON.stringify(settings));
                applyI18n();
            });
            $('.settingsLink').off('click');
            $('.settingsLink').on('click',function(){
                $('#language').val(settings.language);
                $('#userName').val(settings.userName);
                applyI18n();
                registerListeners();
            });
            bindClick('#orderItemsContainer .deleteOrderItemButton',function(e){
                $(e.target).parents('div.ui-grid-a').remove();
            });
            bindClick('#orderItemsContainer .obsOrderItemButton',function(e){
                var obs = $(e.target).parents('div.ui-grid-a').find('.obs');
                obs.show();
                bindClick('.obsItemButton',function(e){
                    var input = $(e.target).parents('div.ui-grid-a').find('.orderItemInput');
                    input.val(input.val() + '  ' + ($(e.target).get(0).nodeName.toLowerCase() == 'a' ?  $(e.target).find('span').html() : $(e.target).html()));
                    $('.obs').hide();
                    registerListeners();
                });
            });
        },
        placeOrderFromHistory = function (orderIndex) {
            var order = orderHistory[orderIndex];
            placeOrder(order);
        },
        someOrderItem = function(element){
            if(this.name == element.name)
                return true;
            else
                return false;
        },
        placeOrder = function(order){
            order.date = new Date();
            if(order.items.length > 0){
                if(checkCanOrder()){

                    var orderItemsJSON = localStorage.getItem('eatmatic_orderItems');
                    var orderItems = orderItemsJSON ? JSON.parse(orderItemsJSON) : [];

                    var html = '';
                    html += '<p i18n="orderSuccess">'+(i18n[settings.language]['orderSuccess'] ? i18n[settings.language]['orderSuccess'] : 'A encomenda foi submetida.')+'</p><br/>';
                    html += '<h3 i18n="itemsOrdered">'+(i18n[settings.language]['itemsOrdered'] ? i18n[settings.language]['itemsOrdered'] : 'Artigos encomendados')+'</h3>';
                    var itemsOrdered = '<ul style="list-style: none;">';
                    for(var i = 0; i < order.items.length; i++){

                        if(!orderItems.some(someOrderItem,order.items[i]))
                            orderItems.push(order.items[i]);

                        itemsOrdered += ('<li>'+order.items[i].quantity+ ' '+ order.items[i].name +' </li>');
                    }
                    localStorage.setItem('eatmatic_orderItems',JSON.stringify(orderItems));
                    itemsOrdered += '</ul><br/>';

                    html += itemsOrdered;

                    html += ('<span i18n="reference">'+(i18n[settings.language]['reference'] ? i18n[settings.language]['reference'] : 'Referência: ') +'</span> <span> '+order.ref+' </span><br/>');
                    html += ('<span i18n="submitedAt">'+(i18n[settings.language]['submitedAt'] ? i18n[settings.language]['submitedAt'] : 'Data: ') +'</span> <span> '+order.date.toLocaleString()+' </span><br/><br/><br/>');

                    if(order.tableNum == 'counter'){
                        html += '<h3 i18n="collect">'+(i18n[settings.language]['collect'] ? i18n[settings.language]['collect'] : 'Recolher')+'</h3><br/>';
                        html += '<p i18n="lookForArea">'+(i18n[settings.language]['lookForArea'] ? i18n[settings.language]['lookForArea'] : 'Procure a área identificada como "Eatmatic". Se o estabelecimento não possuir esta área peça a um empregado que o avise quando a encomenda estiver preparada.')+'</p>';
                    }else if(order.tableNum == 'describe'){
                        html += '<h3 i18n="tableLocationTitle">'+(i18n[settings.language]['tableLocationTitle'] ? i18n[settings.language]['tableLocationTitle'] : 'Localização da Mesa')+'</h3><br/>';
                        html += '<p><span i18n="titleLocation">'+(i18n[settings.language]['titleLocation'] ? i18n[settings.language]['tableLocation'] : 'A encomenda será entregue na mesa localizada em: ')+'<span> <br/>'+order.tableLocation+'</p>';
                    }else{
                        html += '<h3 i18n="tableNumber">'+(i18n[settings.language]['tableNumber'] ? i18n[settings.language]['tableNumber'] : 'Número da Mesa')+'</h3><br/>';
                        html += '<p><span i18n="deliveredAt">'+(i18n[settings.language]['deliveredAt'] ? i18n[settings.language]['deliveredAt'] : 'A encomenda será entregue na mesa: ')+'</span><span>'+order.tableNum+'</span></p>';
                    }

                    /*
                    var orderText = '';
                    for(var i = 0; i < order.items.length; i++){
                        orderText += ("- " + order.items[i].quantity + ' ' + order.items[i].name + "\n");
                    }
                    orderText += ('\n\n');
                    if(order.tableNum == 'describe')
                        orderText += order.tableLocation;
                    else if(order.tableNum == 'counter')
                        orderText += 'Balcao';
                    else
                        orderText += order.tableNum;
                    orderText += '\n\n';

                        if($('#serveHour').val()){
                            orderText += ('HORA: '+$('#serveHour').val() + ' : ' + $('#serveMinute').val() + '\n\n');
                        }

                        var datens = '';
                        datens += order.date.toLocaleString();
                        datens += '\n';
                        datens += 'Ref.: ' + order.ref;
                        datens += '\n';
                        datens += 'Por: ' + settings.userName;
                        datens += '\n\n';
                     */
                    console.debug('Order: '+JSON.stringify(order));
                    $('#informationText').html(html);
                    $.ajax({
                        type:'POST',
                        contentType: 'application/json',
                        url: "/order",
                        data: JSON.stringify(order),
                        complete:function(res){
                            console.debug('RESPONSE: '+res.responseText);
                            console.debug(res);
                        },
                        success:function(){
                            $('#information').popup('open');
                            loadHome();
                            orderHistory.push(order);
                            localStorage.setItem('eatmatic_orderHistory',JSON.stringify(orderHistory));
                        }
                    })
                }
            }else{
                $('#informationText').html('<p i18n="noOrderItems">'+(i18n[settings.language]['noOrderItems'] ? i18n[settings.language]['noOrderItems'] : 'A encomenda não tem artigos.')+'</p>');
                $('#information').popup('open');
            }
        },
        checkCanOrder = function(){
            return true;
            var interval = 3600000;
            if(orderHistory.length > 5){
                var canOrder = new Date(orderHistory[orderHistory.length - 4].date).getTime() < (new Date().getTime() - interval);
                if(canOrder){
                    return true;
                }else{
                    $('#informationText').html('<p i18n="cannotOrderMore">'+(i18n[settings.language]['cannotOrderMore'] ? i18n[settings.language]['cannotOrderMore'] : 'Demasiadas encomendas.')+'</p>');
                    $('#information').popup('open');
                    return false;
                }
            }
            return true;
        },
        applyI18n = function(){
            $('*[i18n]').each(function(it,el){
                if(i18n[settings.language][$(el).attr('i18n')])
                    $(el).html(i18n[settings.language][$(el).attr('i18n')]);
            });
        },
        init = function (callback) {

            //db = new PouchDB('eatmatic_database');

            for (var i=0; i < defaultDiacriticsRemovalMap .length; i++){
                var letters = defaultDiacriticsRemovalMap [i].letters;
                for (var j=0; j < letters.length ; j++){
                    diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap [i].base;
                }
            }

            isAndroid = (window.device && window.device.platform == 'Android');
            isLt4 = (window.device && window.device.version.substring(0, 1) < 4);
            isIOS = (window.device && window.device.platform == 'iOS');
            orderHistory = localStorage.getItem('eatmatic_orderHistory') != null ? JSON.parse(localStorage.getItem('eatmatic_orderHistory')) : [];
            settings = localStorage.getItem('eatmatic_settings') != null ? JSON.parse(localStorage.getItem('eatmatic_settings')) : {language: 'pt', userName: 'Indefinido'};
            disableUnsupportedFeatures();
            loadHome();
            callback();

            checkConnectionStatus();
        },
        checkConnectionStatus = function(){
            executeNative('checkConnection',function(r){
                console.log('Printer connected: '+r);
                $('#printerLight').removeClass('active');
                if(r != 'false'){
                    $('#printerLight').addClass('active');
                    printerConnected = true;
                }else{
                    $('#printerLight').removeClass('active');
                    printerConnected = false;
                }
                checkConnectionStatus();
            },[]);
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
        loadOrder = function(orderIndex){
            var order = orderHistory[orderIndex];

             var html = '<h2 class="pageTitle order"><span></span><text i18n="orderTitle">'+(i18n[settings.language]['orderTitle'] ? i18n[settings.language]['orderTitle'] : 'Order Details')+'</text><\/h2>';
             html += '<table data-role="table" id="orderHistory">';
             html += '<thead>';
             html += '<tr>';
             html += '<th >Hora</th>';
             html += '<th i18n="reference">'+(i18n[settings.language]['reference'] ? i18n[settings.language]['reference'] : 'Reference')+'</th>';
             html += '<th i18n="submitedAt">'+(i18n[settings.language]['submitedAt'] ? i18n[settings.language]['submitedAt'] : 'Submitted at')+'</th>';
             html += '<th i18n="itemsTableHeader">'+(i18n[settings.language]['itemsTableHeader'] ? i18n[settings.language]['itemsTableHeader'] : 'Items')+'</th>';
             html += '<th i18n="dateTableHeader">'+(i18n[settings.language]['dateTableHeader'] ? i18n[settings.language]['dateTableHeader'] : 'Date')+'</th>';
             html += '</tr>';
             html += '</thead>';
             html += '<tbody>';

             var orderHtml = '<tr>';

            orderHtml += '<td>';
            orderHtml += order.ref;
            orderHtml += '</td>';

            orderHtml += '<td>';
            orderHtml += order.ref;
            orderHtml += '</td>';

             orderHtml += '<td>';
             orderHtml += new Date(order.date).toLocaleString();
             orderHtml += '</td>';

             orderHtml += '<td>';
             for(var it= 0; it <  order.items.length; it++){
                 var item = order.items[it];
                 orderHtml += ('<span>'+item.quantity + ' ' + item.name +'</span>'+((it+1) < order.items.length ? ' | ' : ''));
             }
             orderHtml += '</td>';

             orderHtml += '<td>';
             orderHtml += order.tableNum;
             orderHtml += '</td>';

             orderHtml += '</tr>';

             html += orderHtml;

             html += '</tbody>';
             html += '</table>';
             html += '<br/>';

             html += '<div class="btnContainer" style="float:right;margin-right:1em;">';
             html += '<a href="#" onclick="App.placeOrderFromHistory('+orderIndex+')" data-role="button" class="genericBtn ui-link ui-btn ui-shadow ui-corner-all reOrderButton" role="button"><span class="smallText" i18n="reorderButton">'+(i18n[settings.language]['reorderButton'] ? i18n[settings.language]['reorderButton'] : 'Re-Order')+'</span></a>';
             html += '</div>';

            setContent(function (callback) {
                console.log('Executing setContent callback.');
                callback(html);
                registerListeners();
            });

        },
        loadOrderHistory = function(){
            console.log('Loading Order History.');

            var html = '<h2 class="pageTitle order"><span></span><text i18n="orderHistoryTitle">'+(i18n[settings.language]['orderHistoryTitle'] ? i18n[settings.language]['orderHistoryTitle'] : 'Histórico de Encomendas')+'</text><\/h2>';
            html += '<ul style="margin:0.2em;" class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-filter-placeholder="" data-filter="true" data-inset="true">';
            for(var i = 0; i < orderHistory.length; i++) {
                var order = orderHistory[i];
                var orderHtml = '<li style="text-overflow: ellipsis;">';
                orderHtml += '<a class="ui-btn-d ui-btn ui-btn-icon-right ui-icon-carat-r" data-form="ui-btn-up-d" data-swatch="a" data-theme="a" href="#" onclick="App.loadOrder('+i+')">';
                for(var it= 0; it <  order.items.length; it++){
                    var item = order.items[it];
                    orderHtml += ('<span>'+item.quantity+' '+ item.name+'</span>'+((it+1) < order.items.length ? ' | ' : ''));
                }
                orderHtml += '</a>';
                orderHtml += '</li>';
                html += orderHtml;
            }
            html += '</ul>';

            setContent(function (callback) {
                console.log('Executing setContent callback.');
                callback(html);
                registerListeners();
            });

        },
        loadHome = function () {

            console.log('Loading Home.');
/*
            var html = '';
            html += '<h2 class="pageTitle info"><span><\/span>When to order<\/h2>';
            html += '<span class="trafficLight active tutorial"></span>';
            html += '<p class="tutorial text">READY - When the traffic light on the top right of your screen is green, that means you are now in a establishment that supports eatmatic. <br/>Get ordering!</p>';
            html += '<div class="btnContainer tutorial"><a href="#" data-role="button" class="genericBtn" data-role="button"><span class="smallText">Close</span></a></div>';
*/
            var html = '';
            html += '<h2 class="pageTitle order"><span></span><text i18n="ordersTitle">'+(i18n[settings.language]['ordersTitle'] ? i18n[settings.language]['ordersTitle'] : 'Pedido')+'</text><\/h2>';
            html += '<div id="orderItemsContainer">';
            html += '<br/>'
            html += '</div>';
            html += '<h2 class="pageTitle menu"><span></span><text i18n="menuTitle">'+(i18n[settings.language]['menuTitle'] ? i18n[settings.language]['menuTitle'] : 'Menu')+'</text><\/h2>';
            html += '<div id="menuItemsContainer">';
            $.ajax({
                type: 'GET',
                async:false,
                contentType:'application/json',
                url: '/admin/menu',
                success: function (menu) {
                    try{
                        menu = JSON.parse(menu)
                    }catch(err){}
                    html += '<div data-role="collapsible-set">';
                    var firstGone = false;
                    for (var cat in menu) {
                        if (menu.hasOwnProperty(cat)) {
                            html += ('<div data-role="collapsible" data-collapsed="'+(firstGone ? 'true' : 'false')+'">');
                            firstGone = true;
                            html += ('<h3>' + cat + '</h3>');
                            for (var prod in menu[cat]) {
                                if(menu[cat].hasOwnProperty(prod)){
                                    html += '<a style="margin-bottom: 0.2em; width: 20em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" href="#" data-role="button" class="genericBtn menuItemButton">';
                                    html += ('<span style="display:inline-block; width: 18em !important; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" class="ellipsis">' + prod + '</span>');
                                    // com preço html += ('<span style="display:inline-block; width: 18em !important; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" data-tail="' + menu[cat][prod].toFixed(2) + ' €" class="ellipsis">' + prod + '</span>');
                                    html += '</a>';
                                }
                            }
                            html += '</div>';
                        }
                    }
                    html += '</div>';
                }
            });
            html += '</div>';
            html += '<div class="ui-grid-a dataDiv">';
            html += '<div class="ui-block-a" style="width:50%;text-align: center;">';
            html += '<div class="btnContainer" style="margin:auto;">';
            html += '<a href="#" data-role="button" class="genericBtn" id="placeOrderButton"><span class="smallText" i18n="send">'+(i18n[settings.language]['send'] ? i18n[settings.language]['send'] : 'Enviar')+'</span></a>';
            html += '</div>';
            html += '</div>';
            html += '<div class="ui-block-b" style="width:50%;text-align: center;">';
            html += '<div class="btnContainer">';
            html += '<a href="#" data-role="button" class="genericBtn" id="askForCheckButton"><span class="smallText" i18n="bill">'+(i18n[settings.language]['bill'] ? i18n[settings.language]['bill'] : 'Conta')+'</span></a>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="dataDiv" style="padding-top: 1em;">';
            //html += '<label style="font-size:0.5em;">Choose to pick up at counter, have delivered at table number or table location description.</label>';
            html += '<select id="tableNum">';
            html += '<option value="Balcao">Balcao</option>';
            html += '<option value="Para Levar">Para Levar</option>';
            for(var i = 1 ; i < 31; i++){
                html += ('<option><span i18n="table">'+(i18n[settings.language]['table'] ? i18n[settings.language]['table'] : 'Mesa') + '</span><span> '+ i +' </span></span></option>');
            }
            html += '</select>';
            html += '</div>';

            html += '<div class="dataDiv" style="padding-top: 1em;" id="serveTime">';
            html += '<label>Hora</label>';
            html += '<input type="number" data-role="time" id="serveHour" min="12" max="16" placeholder="AGORA"/>';
            html += '<span> : </span>';
            html += '<input type="number" data-role="time" id="serveMinute" min="00" max="60" step="15" placeholder="AGORA"/>';
            html += '</div>';

            html += '<br/>';
            html += '<br/>';
            html += '<br/>';

            setContent(function (callback) {
                console.log('Executing setContent callback.');
                callback(html);
                registerListeners();
            });
        },
        addOrderItem = function(item) {
            console.debug('Adding: '+item);
            var rnd = Math.ceil(Math.random()*10000);
            //var orderItems = localStorage.getItem('eatmatic_orderItems') ? JSON.parse(localStorage.getItem('eatmatic_orderItems')) : [];
            var html = '';
            html += '<div class="ui-grid-a dataDiv">';
            html += '<div class="ui-block-a" style="width:67%;margin-right:2%;">';
            html += ('<textarea rows="1" data-clear-btn="false" type="text" class="orderItemInput" id="orderItemInput_'+rnd+'">'+item+'</textarea>');
            //html += '<ul style="margin:0.5em;" class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-filter-reveal="true" data-filter="true" data-input="#orderItemInput_'+rnd+'" data-inset="true">';
            //for(var i = 0; i < orderItems.length; i++){
                //html += ('<li data-corners="false" data-shadow="false" data-wrapperels="div" class="ui-btn ui-li ui-first-child ui-btn-up-c">'+orderItems[i].name+'</li>');
            //}
            //html += '</ul>';
            html += '</div>';
            html += '<div class="ui-block-b" style="width:10%; margin-right: 2%;">';
            html += '<input type="number" class="orderItemValue" style="text-transform: uppercase;" value="1"/>';
            html += '</div>';
            html += '<div class="ui-block-c" style="width:18%;">';
            html += '<div class="btnContainer" style="padding-top:0.05em;">';
            html += '<a href="#" data-role="button" class="genericBtn obsOrderItemButton" style="display: inline-block; width:40%; padding:0 0.2em 0 0.2em;"><span style="font-size: 1.6em;">O</span></a>';
            html += '<a href="#" data-role="button" class="genericBtn deleteOrderItemButton" style="display: inline-block; width:40%; padding:0 0.2em 0 0.2em; margin-left:0.5em;"><span style="font-size: 1.6em;">x</span></a>';
            html += '</div>';
            html += '</div>';
            html += '<div class="obs" style="display:none; margin-top:2em;" data-role="collapsible-set">';
            html += '<div class="obsContainer" data-role="collapsible" data-collapsed="false">';
            $.ajax({
                type: 'GET',
                async:false,
                contentType:'application/json',
                url: 'obs.json',
                success: function (menu) {
                    try{
                        menu = JSON.parse(menu)
                    }catch(err){}
                    html += '<div>';
                    for (var cat in menu) {
                        if (menu.hasOwnProperty(cat)) {
                            html += '<a style="margin-bottom: 0.2em; width: 20em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" href="#" data-role="button" class="genericBtn obsItemButton">';
                            html += ('<span style="display:inline-block; width: 18em !important; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" class="ellipsis">' + cat + '</span>');
                            html += '</a>';
                        }
                    }
                    html += '</div>';
                }
            });
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $('#orderItemsContainer').append(html);
            $('#content').trigger('create');
            trigger('pageContentChanged');
            registerListeners();
        };

    /**
     * END PROPERTIES AND METHOD
     */


        //Exports
    App.init = init;
    App.loadOrder = loadOrder;
    App.placeOrderFromHistory = placeOrderFromHistory;

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