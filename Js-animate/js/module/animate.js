/**
 * 使用严格模式
 */
'use strict';

var $$ = (function(undefined) {

    /**
     * 缓冲值
     */
    var buffer = 'linear';

    /**
     * 强制转换为 float
     * @param{Number} number
     */
    var float = function(number) {
        return parseFloat(number, 10);
    };

    /**
     * 强制转换为 int
     * @param{Number} number
     */
    var int = function(number) {
        return parseInt(number, 10);
    }

    /**
     * 选择器引擎
     * @param{String} select
     * @param{Element} content
     * @return{Array} Element Array
     */
    var _$ = function(select, content) {
        content = content || document;

        // querySelectorAll: IE9+
        return Array.prototype.slice.call(
            content.querySelectorAll(select)
        );
    };

    /**
     * 检测其 css3 兼容性支持程度
     * @return{String/Boolean}
     */
    var hasCss3 = function() {
        var sty  = document.body.style;
        var core = 'transform'       in sty ? ''       : // all
                   'webkitTransform' in sty ? 'webkit' : // chrome  -webkit-
                   'oTransform'      in sty ? 'o'      : // opera   -o-
                   'mozTransform'    in sty ? 'moz'    : // firefor -moz-
                   'msTransform'     in sty ? 'ms'     : // ie      -ms-
                   false;

        return core;
    };

    /**
     * 判断是否是IE浏览器 (ie浏览器需要特殊处理)
     * @return{Boolean}
     */
    var isIE = function() {
        return !!window.ActiveXObject || "ActiveXObject" in window;
    };


    // 浏览器是否支持 css3
    var core = hasCss3();
//  var times = null;


    // 扩展 Element 的函数
    (function(element) {

        /**
         * 平移动画引擎
         * @param{Number} x: 水平距离
         * @param{Number} y: 垂直距离
         * @param{Number} spend: 动画时间. 可选, 默认1000, 单位 ms
         */
        var moveTo = function(x, y, spend, callback) {
            var node = this;

            // 设置默认值
            x = x || 0;
            y = y || 0;
            spend = spend || 1000;

            // 计算运动次数, 每秒 50HZ
            var frame = float(spend / 1000) * 50;

            x = int(x),
            y = int(y);

            var i     = 0,
                stepX = float(x / frame),     // 水平步长
                stepY = float(y / frame),     // 垂直步长
                lenX  = 0,
                lenY  = 0,
                times = null;

            var
                // not css3
                _move = function() {

                    // 初始化一些值
                    if(i == 0) {
                        node.style.position = 'absolute';
                        lenX = node.offsetLeft;
                        lenY = node.offsetTop;
                    }

                    node.style.top  = lenY + 'px';
                    node.style.left = lenX + 'px';

                    lenX += stepX;
                    lenY += stepY;

                    // 动画结束
                    if(i++ > frame) {
                        clearTimeout(times);
                        // 调用回调函数
                        callback();
                        return;
                    }

                    // 递归
                    times = setTimeout(_move, spend / frame);
                },

                // css3
                move = function() {
                    // 设置过渡
//                  if(!node.style[core + 'transition']) {
                        node.style[core + 'transition'] = "all " + spend + "ms " + buffer;
//                  }
                    // 设置位移
                    node.style[core + 'transform']  = "translate(" + x + "px," + y + "px)";
                    node.style.position = 'absolute';

                    // 动画完成后
                    setTimeout(function() {
                        // 清空状态
                        node.style[core + 'transition'] = '';
                        node.style[core + 'transform']  = '';

                        node.style.left = node.offsetLeft + x + 'px';
                        node.style.top  = node.offsetTop  + y + 'px';

                        clearTimeout(times);
                        callback();
                    }, spend + 10);
                };

            // 不支持css3
            if(core === false) {
                _move();
            }
            // 支持css3
            else {
                move();
            }
        };

        /**
         * 透明动画引擎
         * @param{Number} number: 透明度 0-1
         * @param{Number} spend: 动画时间. 可选, 默认1000, 单位 ms
         * @param{Boolean} start: 透明度为0时，是否隐藏结点, 可选，默认false
         */
        var opacityTo = function(number, spend, start, callback) {
            var node = this;

            callback = callback || function() {};

            if(typeof callback !== 'function') {
                throw new Error(callback + 'is not function.');
            }

            // 设置默认值
            spend = spend || 1000;
            start = start || false;

            // 计算运动次数, 每秒 50HZ
            var frame = float(spend / 1000) * 50,
                i     = 0,
                step  = float(number / frame),
                len   = 0,
                times = null;

            var setOpacity = function(number) {
//              if(isIE())
                    node.style.filter  = 'alpha(opactiy:' + number * 100 + ')';
//              else
                    node.style.opacity = number;
            };

            // not css3
            var _opacity = function() {

                if(i == 0) {
                    len = node.opacity || node.style.filter || len;
                }

//              if(isIE())
                    node.style.filter  = 'alpha(opactiy:' + number * 100 + ')';
//              else
                    node.style.opacity = number;

                len += step;

                // 动画结束后
                if(i++ > frame) {
                    if(start === true && number === 0) {
                        node.display = 'none';
                    }

                    clearTimeout(times);
                    // 调用回调函数
                    callback();
                    return;
                };

                // 递归
                times = setTimeout(_opacity, spend / frame);
            };

            // css3
            var opacity = function() {
                // 设置过渡
                if(!node.style[core + 'transition']) {
                    node.style[core + 'transition'] = "all " + spend + "ms " + buffer;
                }
                // 设置透明度
                setOpacity(number);

                // 动画结束后
                setTimeout(function() {
                    // 清空状态
                    node.style[core + 'transition'] = '';

                    if(start === true && number === 0) {
                        node.display = 'none';
                    }

                    clearTimeout(times);
                    callback();
                }, spend + 10);

            };

            if(core === false) {
                _opacity();
            }
            else {
                opacity();
            }
        };


        /**
         * html 所有结点都继承至 Element , Element 继承至 Object
         * 向 Element 的原型添加函数
         * element.prototype.Func_name = funtion(){
         *     // function body
         * }
         */

        /**
         * 平移动画引擎
         * - 使用
         * - element.moveTo(x, y, [spend]);
         *
         * @param{Number} x: 水平距离
         * @param{Number} y: 垂直距离
         * @param{Number} spend: 动画时间. 可选, 默认1000, 单位 ms
         */
        element.prototype.moveTo = function(x, y, spend, callback) {
            // 回调函数, 绑定其 this 到 element 上
            callback = callback || function() {};

            // 改变 moveTo 的 this 指向
            moveTo.call(this, x, y, spend, callback.bind(this));
            return this;
        }

        element.prototype.opacityTo = function(number, spend, start, callback) {
            callback = callback || function() {};

            opacityTo.call(this, number, spend, start, callback.bind(this));
            return this;
        }

    }(Element));


    return _$;
})(undefined);



