'use strict';

(function(Vue, $) {

    // socket inti
    var socket = new Socket();

    // 监控服务器消息
    socket.on('news', function(data) {
        // 判断是否是广播的是自己的消息
        if(mainVue.user.id !== data.id) {
            mainVue.news.push(data);
            $fun.updateScroll();
        }
    });

    // 取得服务器返回的用户列表
    socket.on('init', function(data) {
        var list = data.list || [];
        mainVue.list = list;

        if(data.user) {
            mainVue.user = data.user;
        }
    });

    // 监听新用户登录消息
    socket.on('login', function(data, list) {
        mainVue.news.push(data);
        mainVue.list = list;
        $fun.updateScroll();
    });

    // 监听有用户离开聊天室时的消息
    socket.on('leave', function(data, list) {
        mainVue.news.push(data);
        mainVue.list = list;
        $fun.updateScroll();
    });


    var flag    = true;

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
                id   : '',
                name : 'Lizhooh',
                time : '',
            },

            /**
             * 连接聊天室的用户列表
             */
            list: [
//              {
//                  id   : 1,
//                  name : 'Lizhooh',
//                  time : '17:23:53',
//              },
            ],

            /**
             * 当前窗口的消息列表
             */
            news: [
//              {
//                  id   : '',
//                  who  : 'my',
//                  name : 'Lizhooh',
//                  info : 'Hello world!',
//                  time : '17:23:53'
//              },
            ],
        },

        methods: {

            /**
             * 连接前检测
             */
            go: function() {
                var $this = this;

                // 检测是否用户名重复
                $.ajax({
                    type: 'post',
                    url: 'http://127.0.0.1:3000/user/hasname',
                    dataType: 'json',
                    data: {
                        name: $this.user.name,
                    },
                    success: function(result) {
                        if(result === false) {
                            $this.begin();
                        }
                        else {
                            $("#msg").text("名称重复");
                        }
                    },
                    error: function() {

                    }
                });
            },

            /**
             * 开始聊天
             */
            begin: function(event){

                if(!this.user.name.length) return;
                if(flag === false)         return;

                // 连接服务器
                socket.connect();

                // 进入时间
                this.user.time = $fun.getTime();

                //{ name: '', time: ''};
                // 记录客户端
                socket.emit('init', this.user);

                flag = false;
                $("#begin").fadeOut(500, function() {
                    $("#app").fadeIn(300);
                    flag = true;
                });
            },

            /**
             * 发送消息
             */
            addInfo: function(event) {

                var news  = $("#news"),
                    inmsg = $('#inmsg'),
                    info  = inmsg.val(),
                    t     = new Date();

                // 检测
                if(!$fun.checkInput(info)) return;

                this.news.push({
                    who  : 'my',
                    name : this.user.name,
                    info : info,
                    time : $fun.getTime(),
                });

                // 清空输入框
                inmsg.val('');

                // 更新滚动条
                $fun.updateScroll();

                // 发送消息
                socket.emit('update', {
                    id  : this.user.id,
                    name: this.user.name,
                    time: this.user.time,
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

            exit: function(event) {

                $("#app").fadeOut(500, function() {
                    $("#begin").fadeIn(300);
                    location.reload();
                });
            },
        },
    });

    return mainVue;

})(Vue, jQuery);

