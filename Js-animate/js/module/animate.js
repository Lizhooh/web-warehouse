/**
 * 使用严格模式
 */
'use strict';


var $$ = (function(undefined) {

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
        // 如果浏览器不支持 querySelectorAll, 则使用 getElementById
        if(typeof document.querySelectorAll === undefined) {
            if(select[0] === '#') return [content.getElementById(select)];
            if(select[0] === '.') return content.getElementsByClassName(select);
        }
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
        var core = 'transform'       in sty ? ''       :
                   'webkitTransform' in sty ? 'webkit' :
                   'oTransform'      in sty ? 'o'      :
                   'mozTransform'    in sty ? 'moz'    : false;
        return core;
    };

    (function(element) {

        /**
         * 平移动画引擎
         * @param{Number} x: 水平距离
         * @param{Number} y: 垂直距离
         * @param{Number} speed: 动画时间. 可选, 默认1000, 单位 ms
         */
        var moveTo = function(x, y, speed) {
            var node = this;

            // 设置默认值
            x = x || 0;
            y = y || 0;
            speed = speed || 1000;

            // 计算运动次数, 每秒 50HZ
            var frame = float(speed / 1000) * 50;

            x = int(x),
            y = int(y);

            var i     = 0,
                stepX = x / frame,     // 水平步长
                stepY = y / frame,     // 垂直步长
                lenX  = 0,
                lenY  = 0;

            /**
             * 检测其 css3 兼容性支持程度
             */
            var core = hasCss3();

            var
                // not css3
                move = function() {

                    if(i == 0) {
                        node.style.position = 'absolute';
                        lenX = node.offsetLeft;
                        lenY = node.offsetTop;
                    }

                    node.style.top  = lenY + 'px';
                    node.style.left = lenX + 'px';

                    lenX += stepX;
                    lenY += stepY;

                    if(i++ > frame) {
                        return;
                    }

                    var times = setTimeout(move, speed / frame);
                },

                // css3
                _move = function() {
                    node.style[core + 'transition'] = "all " + speed + "ms ease-in-out";
                    node.style[core + 'transform']  = "translate(" + x + "px," + y + "px)";
                    node.style.position = 'absolute';

                    setTimeout(function() {
                        node.style[core + 'transition'] = null;
                        node.style[core + 'transform']  = null;
                        node.style.left = node.offsetLeft + x + 'px';
                        node.style.top  = node.offsetTop  + y + 'px';
                    }, speed);
                };

            // 不支持css3
            if(core === false) {
                move();
            }
            // 支持css3
            else {
                _move();
            }

        };

        /**
         * html 所有结点都继承至 Element , Element 继承至 Object
         * 向 Element 的原型添加函数
         *
         * - 使用
         * - element.moveTo(x, y, [speed]);
         *
         * @param{Number} x: 水平距离
         * @param{Number} y: 垂直距离
         * @param{Number} speed: 动画时间. 可选, 默认1000, 单位 ms
         */
        element.prototype.moveTo = function(x, y, speed) {
            // 改变 moveTo 的 this 指向
            moveTo.call(this, x, y, speed);
        };

    }(Element));

    return _$;

})(undefined);



