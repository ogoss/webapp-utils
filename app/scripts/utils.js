/**
 * Canvas Frame Player v1.0.0
 */
;
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    global.utils = factory();
  }
}(window, function() {
  var utils = {};

  /**
   * AJAX封装
   * 若未使用jQuery等库，可使用此AJAX实例
   * @return {Object} ajax实例
   */
  function ajax() {
    var ajax = {};
    ajax.x = function() {
      if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
      }
      var versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
      ];

      var xhr;
      for (var i = 0; i < versions.length; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        } catch (e) {}
      }
      return xhr;
    };

    ajax.send = function(url, type, callback, method, data, async) {
      if (async === undefined) {
        async = true;
      }
      var x = ajax.x();
      x.open(method, url, async);
      x.onreadystatechange = function() {
        var data;
        if (x.readyState == 4) {
          data = (type === 'JSON') ? JSON.parse(x.responseText) : x.responseText;
          callback(data);
        }
      };
      if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
      x.send(data);
    };

    ajax.get = function(url, data, type, callback, async) {
      var query = [];
      for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
      ajax.send(url + (query.length ? '?' + query.join('&') : ''), type, callback, 'GET', null, async);
    };

    ajax.post = function(url, data, type, callback, async) {
      var query = [];
      for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
      ajax.send(url, type, callback, 'POST', query.join('&'), async);
    };

    return ajax;
  }

  /**
   * 获取手机操作系统
   * @returns {String}
   */
  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }

    return 'unknown';
  }

  /**
   * 队列加载图片
   * @param {Array} res 图片URL数组
   * @param {Number} [start=0] 起始值
   * @param {Number} [total=res.length] 总数
   * @param {Function} onLoadStart 加载开始回调函数
   * @param {Function} onLoading 加载中回调函数
   * @param {Function} onLoadEnd 加载结束回调函数
   */
  function queue(res, start, total, onLoadStart, onLoading, onLoadEnd) {
    // 判断回调函数类型
    var isFuncOnLoadStart = isFunction(onLoadStart);
    var isFuncOnLoadEnd = isFunction(onLoadEnd);
    var isFuncOnLoading = isFunction(onLoading);

    // 设默认值
    start = start || 0;
    total = total || res.length;
    var image, timer;

    startLoop();

    // 开始循环
    function startLoop() {
      // 判断图片数组是否存在
      if (!res) {
        console.log('Resources not exists');
        return;
      }

      // console.log('Queue start');
      (isFuncOnLoadStart) ? onLoadStart(res, start, total): '';
      loop();
    }

    // 循环进行
    function loop() {
      if (start >= total) {
        end();
        return;
      }

      setTimer(2000);

      image = new Image();
      image.onload = image.onabort = image.onerror = null;
      image.onload = function() {
        // console.log('Queuing');
        (isFuncOnLoading) ? onLoading(res, start, total): '';
        clearTimer();
      };
      image.onerror = function() {
        clearTimer();
      };
      image.src = res[start];
    }

    // 结束循环
    function end() {
      // console.log('Queue end');
      (isFuncOnLoadEnd) ? onLoadEnd(res, start, total): '';
    }

    // 设置计时器
    function setTimer(t) {
      timer = setInterval(function() {
        clearTimer();
      }, t);
    }

    // 关闭计时器
    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      start++;
      loop(res, start, total, onLoadEnd, onLoading);
    }
  }

  /**
   * 数字前补0
   * @param {Number} num 需要补齐的数字
   * @param {Number} length 总位数
   * @return {String}
   */
  function prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  /**
   * 验证是否是函数
   * @param {Object} functionToCheck [description]
   * @return {Boolean}
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * 监测屏幕是否横屏
   * @param  {Function} landscapeFunc 横屏回调函数
   * @param  {Function} portraitFunc  竖屏回调函数
   */
  function detectOrient(landscapeFunc, portraitFunc) {
    var supportOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');

    var updateOrientation = function() {
      if (supportOrientation) {
        updateOrientation = function() {
          var orientation = window.orientation;
          switch (orientation) {
            case 90:
            case -90:
              orientation = 'block'; // 横屏
              isFunction(landscapeFunc) ? landscapeFunc() : '';
              break;
            default:
              orientation = 'none'; // 竖屏
              isFunction(portraitFunc) ? portraitFunc() : '';
          }
          document.getElementById('orientLayer').style.display = orientation;
        };
      } else {
        updateOrientation = function() {
          var orientation = (window.innerWidth > window.innerHeight) ? 'block' : 'none';
          document.getElementById('orientLayer').style.display = orientation;
        };
      }
      updateOrientation();
    };

    if (supportOrientation) {
      window.addEventListener('orientationchange', updateOrientation, false);
    } else {
      window.setInterval(updateOrientation, 5000);
    }
    updateOrientation();
  }

  /**
   * 获取url的参数值
   * @param {String} strParamName 参数名
   * @param {String} url url地址
   * @return 参数值
   */
  function getURLParam(strParamName, url) {
    var strReturn = '';
    var strHref = url.toLowerCase();
    if (strHref.indexOf('?') > -1) {
      var strQueryString = strHref.substr(strHref.indexOf('?') + 1).toLowerCase();
      var aQueryString = strQueryString.split('&');
      for (var iParam = 0; iParam < aQueryString.length; iParam++) {
        if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + '=') > -1) {
          var aParam = aQueryString[iParam].split('=');
          strReturn = decodeURIComponent(aParam[1]);
          break;
        }
      }
    }
    return strReturn;
  }

  utils.ajax = ajax();
  utils.getMobileOperatingSystem = getMobileOperatingSystem;
  utils.queue = queue;
  utils.prefixInteger = prefixInteger;
  utils.isFunction = isFunction;
  utils.detectOrient = detectOrient;
  utils.getURLParam = getURLParam;

  return utils;
}));
