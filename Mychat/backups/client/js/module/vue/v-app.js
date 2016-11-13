'use strict';

(function(Vue, $) {

    // socket inti
    var socket = new Socket();

    // 监控服务器消息
    socket.on('news', function(data) {
        if(mainVue) {
            mainVue.news.push(data);
            $fun.updateScroll();
        }
    });

    /**
     * main 控制器
     */
    var mainVue = new Vue({
        el: '#main',
        data: {

            /**
             * 当前用户
             */
            user: {
                name: 'Lizhooh',
                time: '',
            },

            /**
             * 连接聊天室的用户
             */
            list: [
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
                {
                    name: 'Lizhooh',
                    time: '17:23:53',
                },
                {
                    name: 'Aer',
                    time: '17:23:59',
                },
                {
                    name: 'Tree',
                    time: '17:24:23',
                },
            ],

            /**
             * 当前窗口的消息
             */
            news: [
                {
                    who  : 'my',
                    name : 'Lizhooh',
                    info : 'Hello world!',
                    time : '17:23:53'
                },
                {
                    who  : 'they',
                    name : 'Aer',
                    info : 'Hello world!',
                    time : '17:23:53'
                },
                {
                    who  : 'they',
                    name : 'Aer',
                    info : 'Hello world!',
                    time : '17:23:53'
                },
                {
                    who  : 'my',
                    name : 'Lizhooh',
                    info : 'Hello world!',
                    time : '17:23:53'
                },

            ],
        },

        methods: {

            /**
             * 开始聊天
             */
            begin: function(event){
                // 连接服务器
                socket.connect();

                $("#begin").fadeOut(500, function() {
                    $("#app").fadeIn(300);
                });
            },

            /**
             * 发送消息
             */
            addInfo: function(event) {

                var news  = $("#news"),
                    inmsg = $('#inmsg'),
                    info  = inmsg.text(),
                    t     = new Date();

                if(!info) return;
                if(info.length > 1024) {
                    alert("最多1024个字");
                    return;
                }

                this.news.push({
                    who  : 'my',
                    name : this.user.name,
                    info : info,
                    time : $fun.getTime(),
                });

                // 清空输入框
                inmsg.html('');

                // 更新滚动条
                $fun.updateScroll();

                // socket
                socket.emit('update', {
                    info: info
                });
            },

            /**
             * 清屏
             */
            clearInfo: function(event) {
                var times = null;
                var clear = function(list) {
                        if(list.length > 0) {
                            times = setTimeout(function() {
                                list.pop();

                                return clear(list);
                            }, 120);
                        }

                        times = null;
                        return;
                    };

                clear(this.news);
            },
        },

    });

    return mainVue;

})(Vue, jQuery);

