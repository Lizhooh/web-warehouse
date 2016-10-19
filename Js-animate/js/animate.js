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
    };

    /**
     * 进制装换
     * @param{Number} num
     * @param{Number} n: 原来的进制
     * @return{Number/String}
     */
    var conver = function(num, n) {
        return parseInt(num, n);
    };

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

    // 静态变量, bool表示是否在动画中
    _$.animate = false;

    // 扩展 Element 的函数
    (function(element) {

        /**
         * 平移动画引擎
         * @param{Number} x: 水平距离
         * @param{Number} y: 垂直距离
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Function} callback: 回调函数
         */
        var moveTo = function(x, y, spend, callback) {
            var node = this;

            // 设置默认值
            x = x || 0;
            y = y || 0;
            spend = spend || 600;

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
                        lenX = int(getComputedStyle(node, null).left);
                        lenY = int(getComputedStyle(node, null).top);
                        _$.animate = true;
                    }

                    node.style.top  = lenY + 'px';
                    node.style.left = lenX + 'px';

                    lenX += stepX;
                    lenY += stepY;

                    // 动画结束
                    if(i++ > frame) {
                        _$.animate = false;
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
                    if(!node.style[core + 'transition']) {
                        node.style[core + 'transition'] = "all " + spend + "ms " + buffer;
                    }
                    // 设置位移
                    node.style[core + 'transform']  = "translate(" + x + "px," + y + "px)";
                    node.style.position = 'absolute';
                    _$.animate = true;

                    // 动画完成后
                    setTimeout(function() {
                        // 清空状态
                        node.style[core + 'transition'] = '';
                        node.style[core + 'transform']  = '';

                        node.style.left = int(getComputedStyle(node, null).left) + x + 'px';
                        node.style.top  = int(getComputedStyle(node, null).top)  + y + 'px';

                        _$.animate = false;
                        callback();
                    }, spend + 10);
                };

            // 不支持css3使用 _
            core === false ? _move() : move();
        };

        /**
         * 透明动画引擎
         * @param{Number} number: 透明度 0-1
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Boolean} start: 透明度为0时，是否隐藏结点, 可选，默认false
         * @param{Function} callback: 回调函数
         */
        var opacityTo = function(number, spend, start, callback) {
            var node = this;

            // 设置默认值
            spend = spend || 600;
            start = start || false;

            // 计算运动次数, 每秒 50HZ
            var frame = float(spend / 1000) * 50,
                i     = 0,
                step  = float(number / frame),
                len   = 0,
                times = null;

            var setOpacity = function(number) {
                if(isIE())
                    node.style.filter  = 'alpha(opactiy:' + number * 100 + ')';
                else
                    node.style.opacity = number;
            };

            // not css3
            var _opacity = function() {

                if(i == 0) {
                    len = node.opacity || node.style.filter || len;
                    _$.animate = true;
                }

                if(isIE())
                    node.style.filter  = 'alpha(opactiy:' + number * 100 + ')';
                else
                    node.style.opacity = number;

                len += step;

                // 动画结束后
                if(i++ > frame) {
                    if(start === true && number === 0) {
                        node.display = 'none';
                    }

                    _$.animate = false;
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

                _$.animate = true;

                // 动画结束后
                setTimeout(function() {
                    // 清空状态
                    node.style[core + 'transition'] = '';

                    if(start === true && number === 0) {
                        node.display = 'none';
                    }

                    _$.animate = false;
                    callback();
                }, spend + 10);
            };

            // 不支持css3使用 _
            core === false ? _opacity() : opacity();
        };

        /**
         * 颜色引擎
         * - 使用
         * - element.colorTo(color, spend, callback);
         * @param{String} color: rgba颜色值或十六进制颜色值
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Function} callback: 回调函数
         */
        var bgColorTo = function(color, spend, callback) {
            var node = this;
            spend = spend || 600;


            var dtR = 0, dtG = 0, dtB = 0, dtA = 0,
                 or = 0, og  = 0, ob  = 0, oa  = 0;

            // setDt
            (function(undefined) {
                var oldColor = getComputedStyle(node).backgroundColor;

                var getRGBA = function(oldColor, name) {
                    var str = null;
                    if(oldColor.substr(0, 4) === 'rgba') {
                        str = oldColor.substr(5, oldColor.length - 6);
                    }
                    else {
                        str = oldColor.substr(4, oldColor.length - 5);
                    }

                    var na  = {'r':0, 'g':1, 'b':2, 'a':3},
                        arr = str.split(',');

                    if(arr[3] === undefined) {
                        arr[3] = '1';
                    }

                    return arr[ na[name] ].trim();
                };


                or = int(getRGBA(oldColor, 'r')),
                og = int(getRGBA(oldColor, 'g')),
                ob = int(getRGBA(oldColor, 'b')),
                oa = float(getRGBA(oldColor, 'a'));

                var r, g, b, a;

                if(color[0] === '#') {
                    r = conver(color.substr(1, 2), 16),
                    g = conver(color.substr(3, 2), 16),
                    b = conver(color.substr(5, 2), 16),
                    a  = 1.0;
                }
                if(color.substr(0, 3) === 'rgb') {
                    r = int(getRGBA(color, 'r')),
                    g = int(getRGBA(color, 'g')),
                    b = int(getRGBA(color, 'b')),
                    a = 1.0;

                }
                if(color.substr(0, 4) === 'rgba') {
                    r = int(getRGBA(color, 'r')),
                    g = int(getRGBA(color, 'g')),
                    b = int(getRGBA(color, 'b')),
                    a = float(getRGBA(color, 'a'));
                }

                dtR = r - or;
                dtB = b - ob;
                dtG = g - og;
                dtA = a - oa;

            })(undefined);


            var frame = float(spend / 1000) * 50,
                i     = 0,
                stepR = float(dtR / frame),
                stepG = float(dtG / frame),
                stepB = float(dtB / frame),
                stepA = float(dtA / frame),
                lenR  = 0,
                lenG  = 0,
                lenB  = 0,
                lenA  = 0,
                times = null;

            var _colors = function() {

                // 初始化
                if(i == 0) {
                    lenR = or;
                    lenG = og;
                    lenB = ob;
                    lenA = oa;

                    _$.animate = true;
                }

                node.style.backgroundColor = 'rgba(' + int(lenR) + ',' + int(lenG) + ',' + int(lenB) + ',' + lenA + ')';

                lenR += stepR;
                lenG += stepG;
                lenB += stepB;
                lenA += stepA;

                if(i++ > frame) {
                    node.style.backgroundColor = color;
                    clearTimeout(times);
                    _$.animate = false;
                    callback();
                    return;
                }

                times = setTimeout(_colors, spend / frame);
            };

            var colors = function() {
                // 设置过渡
                if(!node.style[core + 'transition']) {
                    node.style[core + 'transition'] = "all " + spend + "ms " + buffer;
                }
                // 设置颜色
                node.style.backgroundColor = color;
                _$.animate = true;

                // 动画结束后
                setTimeout(function() {
                    // 清空状态
                    node.style[core + 'transition'] = '';

                    _$.animate = false;
                    callback();
                }, spend + 10);
            };

            // 不支持css3使用 _
            core === false ? _colors() : colors();
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
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Function} callback: 回调函数
         */
        element.prototype.moveTo = function(x, y, spend, callback) {
            // 回调函数, 绑定其 this 到 element 上
            callback = callback || function() {};

            // 改变 moveTo 的 this 指向
            moveTo.call(this, x, y, spend, callback.bind(this));
            return this;
        };

        /**
         * 透明动画引擎
         * - 使用
         * - element.opacityTo(number, [spend], [start], [callback]);
         * @param{Number} number: 透明度 0-1
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Boolean} start: 透明度为0时，是否隐藏结点, 可选，默认false
         * @param{Function} callback: 回调函数
         */
        element.prototype.opacityTo = function(number, spend, start, callback) {
            callback = callback || function() {};

            opacityTo.call(this, number, spend, start, callback.bind(this));
            return this;
        };

        /**
         * 颜色引擎
         * - 使用
         * - element.colorTo(color, spend, callback);
         * @param{String} color: rgba颜色值或十六进制颜色值
         * @param{Number} spend: 动画时间. 可选, 默认600, 单位 ms
         * @param{Function} callback: 回调函数
         */
        element.prototype.bgColorTo = function(color, spend, callback) {
            callback = callback || function() {};

            bgColorTo.call(this, color, spend, callback.bind(this));
            return this;
        };

    }(Element));


    return _$;


})(undefined);



