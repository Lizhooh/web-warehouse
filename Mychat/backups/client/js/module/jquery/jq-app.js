'use strict';

(function($) {

    /**
     * 添加滚动条
     */
    var scrollList = ['#user-list', '#inmsg', '#news'];

    /**
     * 美化滚动条
     * @param{Array/String} scrollList: calss或id
     * @function{Function} add(el): 增加项目
     */
    mscroll = function(scrollList) {

        if(!(this instanceof mscroll)) {
            return new mscroll(scrollList);
        }

        var config = {
            cursorcolor: "rgba(11, 11, 11, 0.3)",
            cursoropacitymax: 1,
            touchbehavior: false,
            cursorwidth: "6px",
            cursorborder: "0",
            cursorborderradius: "2px",
            hidecursordelay: 800,
            autohidemode: true,
            spacebarenabled: false,
            enablekeyboard: false,
        };

        var instance = null,
            element  = [],

            setel = function(list) {
                if(Object.prototype.toString.call(list) === '[object Array]') {
                    for(var i in list) {
                        element.push($(list[i]));
                    }
                }
                else {
                    element.push($(list));
                }
            },

            // 小屏幕取消美化滚动条
            check = function(element) {

                if($('body').width() > 768) {
                    for(var i in element) {
                        var options = Object.create(config);
                        element[i].niceScroll(options).resize();
                    }
                }
                else {
                    for(var i in element) {
                        element[i].css('overflow-y', 'auto');
                    }
                }
            },

            than = {
                add: function(el) {
                    setel(el)
                    check(element);
                }
            };

        // 初始化
        var init = function() {
                setel(scrollList);
                check(element);
            }; init();

        return instance ? instance : instance = than;

    };

    var mscroll = new mscroll(scrollList);

})(jQuery);

