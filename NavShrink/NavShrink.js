;

if(jQuery === undefined) {
    throw new Error('Jquery is not define.');
}

(function(global, $, undefined) {

    $.fn.NavShrink = function(options) {

        /* options 不是 object时，抛出错误 */
        if(typeof options !== 'object') {
            throw Array.prototype.slice.call(arguments) + ' not is a object.';
            return;
        }

        /**
         * 默认属性
         * @param{Object} x.open 是否开启, x.min: x方向放缩最少值, x.max: x方向放缩最大值
         * @param{Object} y.open 是否开启, y.min: y方向放缩最少值, y.max: y方向放缩最大值
         * @param{Number} speed 动画速度
         * @param{Object} parent 父产生滚动条的Jquery对象, 默认 body
         * @param{Number} start 从滚动条顶部多少位置开始触发动画, 默认0
         * @param{Function} downAfter down动画完成后的回调函数
         * @param{Function} upAfter up动画完成后的回调函数
         */
        var $default = {
            x: {
                open: false,
                min: '50%',
                max: '100%',
            },
            y: {
                open: true,
                min: '50px',
                max:  '100px',
            },
            speed: 400,
            father: $(window),
            start: 0,
            downAfter: function(scrollTop) { },
            upAfter: function(scrollTop) { },
        };

        /**
         * 合并两个对象，当且旧对象有的属性才能被合并
         */
        var merge = function(newObj, oldObj) {
            for(var i in newObj) {
                if(oldObj.hasOwnProperty(i)) {
                    if(i === 'x' || i === 'y') {
                        merge(newObj[i], oldObj[i]);
                    }
                    else {
                        oldObj[i] = newObj[i];
                    }
                }
            }

            return oldObj;
        };

        /* 对象合并 */
        options = merge(options, $default);

        /* 滚动条对象 */
        var body = options.father;

        /* 监控滚动条 */
        var scroll = function(callback) {
            var before = body.scrollTop();

            body.scroll(function() {
                var after = $(this).scrollTop(),
                    dat   = after - before;

                // 更新
                before = after;

                /**
                 * callback
                 * @param{String} direction 方向
                 * @param{Number} scrollTop 滚动条顶端位置
                 */
                return dat > 0 ? callback('up', before) : callback('down', before);
            });
        };

        var status = 'down';

        var ani1 = { },
            ani2 = { };

        /* 配置动画对象 */
        if(options.x.open) {
            ani1.width = options.x.min;
            ani2.width = options.x.max;
        }

        if(options.y.open) {
            ani1.height = options.y.min;
            ani2.height = options.y.max;
        }

        return this.map(function() {
            var $this = $(this);

            /* 添加动画 */
            scroll(function(direction, scrollTop) {
                // 如果状态相同，不大于指定位置，则不产生动画,
                if(status === direction || options.start >= scrollTop) return;
                status = direction;

                /* 滚动条向上时的动画 */
                if(status === 'up') {
                    $this.stop().animate(ani1, options.speed, function() {
                        options.downAfter(scrollTop);
                    });
                }

                /* 滚动条向下时的动画 */
                if(status === 'down') {
                    $this.stop().animate(ani2, options.speed, function() {
                        options.upAfter(scrollTop);
                    });
                }
            });

            return $(this);
        });
    };

})(window, jQuery, undefined);

//  $('.nav').NavShrink({
//      start: 0,
//      speed: 500,
//  });
//
//  $('.box-nav').NavShrink({
//      father: $('.box'),
//      start: 0,
//  });
