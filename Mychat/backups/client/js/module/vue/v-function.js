'use strict';

/**
 * 通用函数库
 */
(function() {

    window.$fun = {

        // 获取时间
        getTime: function() {
            var t     = new Date(),
                time  = null;

            var setTime = function(t) {
                    return t - 0 < 10 ? '0' + t : t;
                };

            time = setTime(t.getHours())   + ':' +
                   setTime(t.getMinutes()) + ':' +
                   setTime(t.getSeconds());

            return time;
        },

        // 更新消息滚动条
        updateScroll: function() {
            var news = $('#news');

            news.stop().animate({
                scrollTop: $("#news > .news-list").height()
            }, 800);

            news.getNiceScroll().resize();
        },

    };

})();



