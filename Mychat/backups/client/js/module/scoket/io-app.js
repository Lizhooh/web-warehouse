'use strict';

(function(win) {

    var instance  = null,       // 缓存变量
        so        = null,       // socket 对象
        eventOn   = [],         // 自定义事件缓存区
        eventEmit = [],         // 触发事件缓存区
        serverUrl = null;       // url

    /**
     * socket 连接类
     * @param{String} url: 地址
     * @param{Object} config: 配置对象
     * @return{Object} 单例类
     */
    var socket = function(url, config) {
        serverUrl = url || 'http://127.0.0.1:3000';

        if(!(this instanceof socket)) {
            return new socket(url);
        }

        var than = {

            /**
             * 开始连接服务器
             */
            connect: function() {
                var $this = this;
                so = io.connect(serverUrl, config);

                // use cache
                eventOn.forEach(function(item, index, list) {
                    $this.on.apply(null, item);
                });

                eventEmit.forEach(function(item, index, list) {
                    $this.emit.apply(null, item);
                });

                // clear cache
                eventOn = eventEmit = [];

                return so;
            },

            /**
             * 自定义事件
             */
            on: function(type, callback) {
                if(!so) {
                    // add cache
                    eventOn.push([type, callback]);
                    return;
                }

                so.on(type, function() {
                    if(typeof callback === 'function') {
                        var arg = Array.prototype.slice.call(arguments);

                        callback.apply(this, arg);
                    }
                });
            },

            /**
             * 触发事件
             */
            emit: function() {
                var arg = Array.prototype.slice.call(arguments);

                if(!so) {
                    // add cache
                    eventEmit.push(arg);
                    return;
                }

                so.emit.apply(so, arg);
            },
        };

        return instance ? instance : instance = than;
    };

    win.Socket = socket;

})(window);

