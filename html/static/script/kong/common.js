/*-------------GOBALS---------------*/
/**
 * 改变jQuery AJAX回调函数this指针指向(使用案例见ajaxForm)
 * @param {Object} thisObj 要替换当前this指针的对象
 * @return {Function} function(data){}
 */
Function.prototype.Apply = function(thisObj) {
    var _method = this;
    return function(data) {
        return _method.apply(thisObj, [data]);
    };
};

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| 
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal 
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) 
        //    where Array is the standard built-in constructor with that name and 
        //    len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal 
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal 
                //    method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal 
                //     method of callback with T as the this value and argument 
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg*/ ) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

/**
 * 给方法设置一个属性
 * @param {string} key
 * @param {stirng} value
 */
Function.prototype.set = function(key, value) {
    try {
        Object.defineProperty(this, key, {
            get: function() {
                return value;
            }
        });
    } catch (e) {
        this[key] = value;
    }
};
/**
 * 方法拷贝
 * @return {function}
 */
Function.prototype.clone = function() {
    var cloneObj = this;
    if (this.__isClone) {
        cloneObj = this.__clonedFrom;
    }

    var temp = function() {
        return cloneObj.apply(this, arguments);
    };
    for (var key in this) {
        temp[key] = this[key];
    }

    temp.__isClone = true;
    temp.__clonedFrom = cloneObj;

    return temp;
};

/*--------------Window---------------*/
/**
 * 兼容不支持console的低版本IE浏览器
 * @type {[type]}
 */
var console = console || {
    log: function() {
        return false;
    }
}

/**
 * 获取顶层window对象
 * @return {[type]} [description]
 */
function getTop() {
    var _oWin = window,
        _oWinParent = parent;
    try {
        while (_oWin != _oWinParent) {
            _oWin = _oWinParent;
            _oWinParent = _oWinParent.parent;
        }
    } catch (e) {
        console.log(e);
    }
    return _oWin;
}

/*--------------Array---------------*/
/**
 * 获取数组中第一个元素
 * @param  {object} defaultVal [description]
 * @return {[type]}            [description]
 */
var first = function(array, defaultVal) {
    if (defaultVal == undefined)
        defaultVal = null;
    if (!array instanceof Array || !array) return defaultVal;
    return array.length ? array[0] : defaultVal;
};

/*---------------------CopyToClipboard-------------------*/
// http://help.dottoro.com/ljctuhrg.php

/**
 * 复制文本到前切板
 * @param {str} textToClipboard 要复制到剪切板的文本
 * @param {Function} fnSuccess       成功回调，可为空
 * @param {Function} fnFail          失败回调，可为空
 */
function CopyToClipboard(textToClipboard, fnSuccess, fnFail) {

    var success = true;
    if (window.clipboardData) { // Internet Explorer
        window.clipboardData.setData("Text", textToClipboard);
    } else {
        // create a temporary element for the execCommand method
        var forExecElement = CreateElementForExecCommand(textToClipboard);

        /* Select the contents of the element 
            (the execCommand for 'copy' method works on the selection) */
        SelectContent(forExecElement);

        var supported = true;

        // UniversalXPConnect privilege is required for clipboard access in Firefox
        try {
            if (window.netscape && netscape.security) {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }

            // Copy the selected content to the clipboard
            // Works in Firefox and in Safari before version 5
            success = document.execCommand("copy", false, null);
        } catch (e) {
            success = false;
        }

        // remove the temporary element
        document.body.removeChild(forExecElement);
    }

    if (success) {
        fn = fnSuccess || function() {
            alert("The text is on the clipboard, try to paste it!");
        };
        fn();
    } else {
        fn = fnFail || function() {
            alert("Your browser doesn't allow clipboard access!");
        };
        fn();
    }
}

function CreateElementForExecCommand(textToClipboard) {
    var forExecElement = document.createElement("div");
    // place outside the visible area
    forExecElement.style.position = "absolute";
    forExecElement.style.left = "-10000px";
    forExecElement.style.top = "-10000px";
    // write the necessary text into the element and append to the document
    forExecElement.textContent = textToClipboard;
    document.body.appendChild(forExecElement);
    // the contentEditable mode is necessary for the  execCommand method in Firefox
    forExecElement.contentEditable = true;

    return forExecElement;
}

function SelectContent(element) {
    // first create a range
    var rangeToSelect = document.createRange();
    rangeToSelect.selectNodeContents(element);

    // select the contents
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(rangeToSelect);
}

/*---------------------Media------------------*/
/**
 * 声音播放器
 * @param {string} source 音频文件地址
 * @param {int} volume 音量(0-100)
 * @param {bool} loop   是否循环播放
 *
 * var foo=new Sound("url",100,true);
 * foo.start();
 * foo.stop();
 * foo.start();
 * foo.init(100,false);
 * foo.remove();
 */
function Sound(source, volume, loop) {
    this.source = source;
    this.volume = volume;
    this.loop = loop;
    var son;
    this.son = son;
    this.finish = false;
    this.stop = function() {
        document.body.removeChild(this.son);
    };
    this.start = function() {
        if (this.finish) return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume);
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop);
        document.body.appendChild(this.son);
    };
    this.remove = function() {
        document.body.removeChild(this.son);
        this.finish = true;
    };
    this.init = function(volume, loop) {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    };
}


/*----------------------Math------------------*/
/**
 * 阶乘
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
Math.factorial = function(num) {
    if (num <= 1) return 1;
    var res = 1;
    for (var i = 1; i <= num; i++)
        res *= i;
    return res;
};

/**
 * 组合,從 n 個相異物中不重複的取出 m 個之組合數。
 * http://latex.codecogs.com/gif.latex?_nC_m={n%20\choose%20m}=\frac{_nP_m}{m!}=\frac{n!}{m!(n-m)!}
 * @param  {int} n 总数量
 * @param  {int} m 取出的数量
 * @return {int}   [description]
 */
Math.combinatorics = function(n, m) {
    return Math.factorial(n) / (Math.factorial(m) * Math.factorial(n - m));
}

/*----------------------Range------------------*/
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
        result.push(i);
    }

    return result;
}

/*----------------------Timer------------------*/
var Timer = function(seconds, onStart, onEnd, onInterval) {
    seconds--;
    onStart && onStart(seconds);
    var timer = window.setInterval(function() {
        onInterval && onInterval(seconds)
        if (seconds-- <= 0) {
            onEnd && onEnd();
            window.clearInterval(timer);
        }
    }, 1000);
}


/*--------------------------URL--------------------------------*/
/*---------
 **URL重定向
 **---------
 **url:重定向URL
 **params:要传递的querystring
 **clear:是否清空参数
 */
var Redirect = function(url, params, clear) {
        if (!isNullOrEmpty(params)) {
            var paramArr = params.split('&');
            var isFirst = true;
            $(paramArr).each(function(i, param) {
                if (isFirst) isFirst = false;
                else {
                    if (clear) clear = false;
                }
                var paramInfo = param.split('=');
                url = addActionToUrl(url, paramInfo[0], paramInfo[1], clear);
            });
        }
        window.location.href = url;
    }
    /*刷新本页*/
var Reload = function(win) {
        win = win || window;
        win.location.reload();
    }
    //增加回发参数
var addAction = function(action /*参数名*/ , value /*参数值*/ , clear /*是否清空参数*/ ) {
        //获取当前页Url
        var formUrl = $("form")[0].action;
        formUrl = addActionToUrl(formUrl, action, value, clear);
        $("form")[0].action = formUrl;
    }
    //获取QueryString
var getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //在指定Url中获取QueryString
var getQueryStringFromUrl = function(url, name) {
    var index = url.indexOf('?');
    if (index < 0) return null;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(index + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var addActionToUrl = function(formUrl, action /*参数名*/ , value /*参数值*/ , clear /*是否清空参数*/ ) {
    //如果Url中含有参数
    if (formUrl.indexOf("?") >= 0) {
        //清空参数
        if (clear) formUrl = formUrl.substr(0, formUrl.indexOf("?") + 1);
        //Url中含有要添加的参数对
        if (formUrl.indexOf(action) > 0) {
            //获取所有参数对值
            var queryString = formUrl.substr(formUrl.indexOf("?") + 1, formUrl.length);
            //分组
            var queryStringArr = queryString.split("&");
            //不包含参数的Url
            formUrl = formUrl.substr(0, formUrl.indexOf("?") + 1);
            var isFirst = true;
            //遍历参数对
            for (var i = 0; i < queryStringArr.length; i++) {
                //如果参数对不等于要添加的Action.则添加到Url中
                if (queryStringArr[i].indexOf(action) < 0) {
                    if (isFirst) isFirst = false;
                    else formUrl += "&";
                    formUrl += queryStringArr[i];
                }
            }
        }
        //避免只有一个参数,并且参数相同时出现的?&情况
        if (formUrl.indexOf("?") + 1 != formUrl.length) formUrl += "&";
    } else {
        formUrl += "?";
    }

    formUrl += action + "=" + value;
    return formUrl;
}

/*-------------------------STRINGS---------------------------------*/
//string.format
//用法："{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};
//startsWith
String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
};
//endsWith
String.prototype.endsWith = function(str) {
    return this.slice(-str.length) == str;
};
String.prototype.replaceAll = function(old_str, new_str) {　　
    return this.replace(new RegExp(old_str, "gm"), new_str);
};
//字符串是否空
var isNullOrEmpty = function(str) {
    return str == null || str == "" || str == undefined;
}

/*-------------------------JSON------------------------------------*/
/*
 **获取JSON对象的长度
 */
var GetJSONLength = function(obj) {
    var length = 0;
    for (var item in obj)
        length++;
    return length;
}

/*--------------------------DATE TIME------------------------------*/
Date.prototype.format = function(format) {
    format = format || "yyyy-MM-dd HH:mm:ss";
    return formatDate(this, format);
}
Date.prototype.week = function() {
    return {
        start: getWeekStartDate(this),
        end: getWeekEndDate(this)
    }
}
Date.prototype.month = function() {
    return {
        start: getMonthStartDate(this),
        end: getMonthEndDate(this),
        days: getMonthDays(this)
    }
}
Date.prototype.add = function(part, value) {
    if (isNaN(value))
        value = 0;
    var result = new Date(this.getTime());
    switch (part) {
        case "y":
            result.setUTCFullYear(this.getUTCFullYear() + value);
            break;
        case "M":
            result.setUTCMonth(this.getUTCMonth() + value);
            break;
        case "d":
            result.setUTCDate(this.getUTCDate() + value);
            break;
        case "h":
            result.setUTCHours(this.getUTCHours() + value);
            break;
        case "m":
            result.setUTCMinutes(this.getUTCMinutes() + value);
            break;
        case "s":
            result.setUTCSeconds(this.getUTCSeconds() + value);
            break;
        default:
    }
    return result;
};
/**
 * 得到两个日期之间相差的天数
 * @param  {[date]} value [description]
 * @return {[int]}       [description]
 */
Date.prototype.subtract = function(value) {
    if (isNaN(value))
        value = new Date();
    return (this.getTime() - value.getTime()) / 3600000 / 24;
};
/*
 *将字符串解析成一个Date
 *date_str:yyyy-MM-dd
 */
var parseDate = function(date_str, date_format) {
        // var dateArr = date_str.split('-');
        // return new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]);
        var time = getDateFromFormat(date_str, date_format || 'yyyy-M-d H:m:s');
        return new Date(time);
    }
    //     /**
    //      * 将Date对象转化成字符串
    //      * yyyy-MM-dd
    //      */
    // var formatDate = function(date) {
    //         var myyear = date.getFullYear();
    //         var mymonth = date.getMonth() + 1;
    //         var myweekday = date.getDate();

//         if (mymonth < 10) {
//             mymonth = "0" + mymonth;
//         }
//         if (myweekday < 10) {
//             myweekday = "0" + myweekday;
//         }
//         return (myyear + "-" + mymonth + "-" + myweekday);
//     }
/**
 * 获取日期的相关信息
 * @param  {Date} date 日期，如果为空则默认调用new Date()
 * @return {dict}{
 *     date:yyyy-MM-dd,
 *     week:今天本周的第几天,
 *     day:当前日
 *     month:当前月
 *     year:当前年
 * }
 */
var getDate = function(date) {
        if (date == null || date == undefined)
            date = new Date();
        return {
            date: formatDate(date),
            week: date.getDay(),
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        }
    }
    /**
     * 获得月的天数
     * @param  {[Date]} 日期，如果为空则表示获取当月
     * @return {[int]}天数
     */
var getMonthDays = function(date) {
        date = getDate(date);
        var monthStartDate = new Date(date.year, date.month, 1);
        var monthEndDate = new Date(date.year, date.month + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    /**
     * 获取季度的开始月份
     * @param  {[Date]} 日期，若为空则获取本季度
     * @return {[int]}季度(0,3,6,9)
     */
var getQuarterStartMonth = function(date) {
        date = getDate(date);
        var quarterStartMonth = 0;
        if (date.month < 3) {
            quarterStartMonth = 0;
        }
        if (2 < date.month && date.month < 6) {
            quarterStartMonth = 3;
        }
        if (5 < date.month && date.month < 9) {
            quarterStartMonth = 6;
        }
        if (date.month > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    /**
     * 获取周的开始时间
     * @param  {Date} date 日期，如果为空则默认调用new Date()
     * @return {Date}日期
     */
var getWeekStartDate = function(date) {
        date = getDate(date);
        var weekStartDate = new Date(date.year, date.month, date.day - date.week);
        return weekStartDate;
    }
    /**
     * 获取周的结束时间
     * @param  {Date} date 日期，如果为空则默认调用new Date()
     * @return {Date}日期
     */
var getWeekEndDate = function(date) {
        date = getDate(date);
        var weekEndDate = new Date(date.year, date.month, date.day + (6 - date.week));
        return weekEndDate;
    }
    /**
     * 获取月的开始时间
     * @param  {Date} date 日期，如果为空则默认调用new Date()
     * @return {Date}日期
     */
var getMonthStartDate = function(date) {
        date = getDate(date);
        var monthStartDate = new Date(date.year, date.month, 1);
        return monthStartDate;
    }
    /**
     * 获取月的结束时间
     * @param  {Date} date 日期，如果为空则默认调用new Date()
     * @return {Date}日期
     */
var getMonthEndDate = function(date) {
        date_info = getDate(date);
        var monthStartDate = new Date(date_info.year, date_info.month, getMonthDays(date));
        return monthStartDate;
    }
    /**
     * 获取季度的开始时间
     * @param  {Date} date 日期，如果为空则默认调用new Date()
     * @return {Date}日期
     */
var getQuarterStartDate = function(date) {
    date = getDate(date);
    var quarterStartDate = new Date(date.year, getQuarterStartMonth(date), 1);
    return formatDate(quarterStartDate);
}
var getQuarterEndDate = function(date) {
    date = getDate(date);
    var quarterEndMonth = getQuarterStartMonth(date) + 2;
    var quarterStartDate = new Date(date.year, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
}

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

function LZ(x) {
    return (x < 0 || x > 9 ? "" : "0") + x
}

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------

function isDate(val, format) {
    var date = getDateFromFormat(val, format);
    if (date == 0) {
        return false;
    }
    return true;
}

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------

function compareDates(date1, dateformat1, date2, dateformat2) {
    var d1 = getDateFromFormat(date1, dateformat1);
    var d2 = getDateFromFormat(date2, dateformat2);
    if (d1 == 0 || d2 == 0) {
        return -1;
    } else if (d1 > d2) {
        return 1;
    }
    return 0;
}

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getDateFromFormat()
// ------------------------------------------------------------------

function formatDate(date, format) {
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var y = date.getYear() + "";
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var E = date.getDay();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    // Convert real date parts into formatted versions
    var value = new Object();
    if (y.length < 4) {
        y = "" + (y - 0 + 1900);
    }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H == 0) {
        value["h"] = 12;
    } else if (H > 12) {
        value["h"] = H - 12;
    } else {
        value["h"] = H;
    }
    value["hh"] = LZ(value["h"]);
    if (H > 11) {
        value["K"] = H - 12;
    } else {
        value["K"] = H;
    }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) {
        value["a"] = "PM";
    } else {
        value["a"] = "AM";
    }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
            result = result + value[token];
        } else {
            result = result + token;
        }
    }
    return result;
}

// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------

function _isInteger(val) {
    var digits = "1234567890";
    for (var i = 0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

function _getInt(str, i, minlength, maxlength) {
    for (var x = maxlength; x >= minlength; x--) {
        var token = str.substring(i, i + x);
        if (token.length < minlength) {
            return null;
        }
        if (_isInteger(token)) {
            return token;
        }
    }
    return null;
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------

function getDateFromFormat(val, format) {
    val = val + "";
    format = format + "";
    var i_val = 0;
    var i_format = 0;
    var c = "";
    var token = "";
    var token2 = "";
    var x, y;
    var now = new Date();
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var date = 1;
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var ampm = "";

    while (i_format < format.length) {
        // Get next token from format string
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token == "yyyy" || token == "yy" || token == "y") {
            if (token == "yyyy") {
                x = 4;
                y = 4;
            }
            if (token == "yy") {
                x = 2;
                y = 2;
            }
            if (token == "y") {
                x = 2;
                y = 4;
            }
            year = _getInt(val, i_val, x, y);
            if (year == null) {
                return 0;
            }
            i_val += year.length;
            if (year.length == 2) {
                if (year > 70) {
                    year = 1900 + (year - 0);
                } else {
                    year = 2000 + (year - 0);
                }
            }
        } else if (token == "MMM" || token == "NNN") {
            month = 0;
            for (var i = 0; i < MONTH_NAMES.length; i++) {
                var month_name = MONTH_NAMES[i];
                if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                    if (token == "MMM" || (token == "NNN" && i > 11)) {
                        month = i + 1;
                        if (month > 12) {
                            month -= 12;
                        }
                        i_val += month_name.length;
                        break;
                    }
                }
            }
            if ((month < 1) || (month > 12)) {
                return 0;
            }
        } else if (token == "EE" || token == "E") {
            for (var i = 0; i < DAY_NAMES.length; i++) {
                var day_name = DAY_NAMES[i];
                if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                }
            }
        } else if (token == "MM" || token == "M") {
            month = _getInt(val, i_val, token.length, 2);
            if (month == null || (month < 1) || (month > 12)) {
                return 0;
            }
            i_val += month.length;
        } else if (token == "dd" || token == "d") {
            date = _getInt(val, i_val, token.length, 2);
            if (date == null || (date < 1) || (date > 31)) {
                return 0;
            }
            i_val += date.length;
        } else if (token == "hh" || token == "h") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 1) || (hh > 12)) {
                return 0;
            }
            i_val += hh.length;
        } else if (token == "HH" || token == "H") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 0) || (hh > 23)) {
                return 0;
            }
            i_val += hh.length;
        } else if (token == "KK" || token == "K") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 0) || (hh > 11)) {
                return 0;
            }
            i_val += hh.length;
        } else if (token == "kk" || token == "k") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 1) || (hh > 24)) {
                return 0;
            }
            i_val += hh.length;
            hh--;
        } else if (token == "mm" || token == "m") {
            mm = _getInt(val, i_val, token.length, 2);
            if (mm == null || (mm < 0) || (mm > 59)) {
                return 0;
            }
            i_val += mm.length;
        } else if (token == "ss" || token == "s") {
            ss = _getInt(val, i_val, token.length, 2);
            if (ss == null || (ss < 0) || (ss > 59)) {
                return 0;
            }
            i_val += ss.length;
        } else if (token == "a") {
            if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                ampm = "AM";
            } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                ampm = "PM";
            } else {
                return 0;
            }
            i_val += 2;
        } else {
            if (val.substring(i_val, i_val + token.length) != token) {
                return 0;
            } else {
                i_val += token.length;
            }
        }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) {
        return 0;
    }
    // Is date valid for month?
    if (month == 2) {
        // Check for leap year
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
            if (date > 29) {
                return 0;
            }
        } else {
            if (date > 28) {
                return 0;
            }
        }
    }
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
        if (date > 30) {
            return 0;
        }
    }
    // Correct hours value
    if (hh < 12 && ampm == "PM") {
        hh = hh - 0 + 12;
    } else if (hh > 11 && ampm == "AM") {
        hh -= 12;
    }
    var newdate = new Date(year, month - 1, date, hh, mm, ss);
    return newdate.getTime();
}

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------

function parseDate(val) {
    var preferEuro = (arguments.length == 2) ? arguments[1] : false;
    generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
    monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
    dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
    var checkList = new Array('generalFormats', preferEuro ? 'dateFirst' : 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
    var d = null;
    for (var i = 0; i < checkList.length; i++) {
        var l = window[checkList[i]];
        for (var j = 0; j < l.length; j++) {
            d = getDateFromFormat(val, l[j]);
            if (d != 0) {
                return new Date(d);
            }
        }
    }
    return null;
}

/*-----------------------JS FILES----------------------------------*/
/*
 **获取引用文件的参数
 **fileName:文件名，例如:jquery.js
 */
var GetReferenceFileArguments = function(fileName) {
    //获取到所有<script>对象
    var scripts = document.getElementsByTagName("script");
    var arguments = new Array();
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        //取得你想要的js文件名
        if (src.indexOf(fileName) !== -1) {
            //获取js文件名后面的所有参数
            src = src.substring(src.lastIndexOf(fileName + "?") + (fileName.length + 1));
            var array = src.split("&");
            //将参数一个一个遍历出来
            for (var j = 0; j < array.length; j++) {
                var finalObj = array[j].split("=");
                arguments[finalObj[0]] = finalObj[1];
            }
        }
    }
    return arguments;
}

/*--------------------------------银行卡----------------------------------------*/
//Description:  银行卡号Luhm校验
//Luhm校验规则：16位银行卡号（19位通用）:
// 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
// 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
// 3.将加法和加上校验位能被 10 整除。

//方法步骤很清晰，易理解，需要在页面引用Jquery.js    
var BankCard = function(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）

        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        if (lastNum == luhm) {
            return true;
        } else {
            return false;
        }
    }
    /*--------------------------------身份证----------------------------------------*/
    /*
    根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
        地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
        出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
        顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
        校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

    出生日期计算方法。
        15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
        2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
    下面是正则表达式:
     出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
     身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i            
     15位校验规则 6位地址编码+6位出生日期+3位顺序号
     18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

     校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                    公式(1)中： 
                    i----表示号码字符从由至左包括校验码在内的位置序号； 
                    ai----表示第i位置上的号码字符值； 
                    Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                    i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                    Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

    */
    //身份证号合法性验证 
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证

/*
 * 验证身份证
 * 返回:{
 *     pass:boolean:验证是否通过
 *     error:str:验证不通过的原因
 *     gender:int：性别(1:男 0:女)
 * }
 */
var IDCodeValid = function(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;
    var gender = code.substr(16, 1) % 2 ? 1 : 0;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    return {
        pass: pass,
        error: tip,
        gender: gender
    };
}