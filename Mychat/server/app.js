'use strict';

    var express    = require('express'),
        app        = express(),
        server     = require('http').createServer(app),
        io         = require('socket.io')(server),
        template   = require('art-template'),
        colors     = require('colors'),
        logger     = require('morgan'),
        bodyParser = require('body-parser');

    /**
     * 视图引擎配置
     */
    template.config('extname', '.html');
    template.config('openTag', '{');
    template.config('closeTag', '}');

    app
        .engine('.html', template.__express)
        .set('view engine', 'html')
        .set('views', __dirname + '/views');

    app
        .use(logger('dev'))
        .use(bodyParser.json())
        .use(express.static(__dirname + '/public'));

    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//      res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });

    app.get('/', function(req, res, next) {
        res.render('index', {
            title: 'hello'
        });
    });

    // 检测用户名是否重复
    app.post('/user/hasname', function(req, res, next) {
        var post = req.body || {};

        console.log(post);

        var inArray = function(name, list) {
            for(var i in list) {
                if(list[i].name !== undefined) {
                    if(name === list[i].name) return true;
                }
            }
            return false;
        };

        if(inArray(post.name || '', list)) {
            res.jsonp(true);
        }
        else {
            res.jsonp(false);
        }
    });

    server.listen(3000, function() {
        console.log("Serve run in 127.0.0.1:3000".yellow);
    });


    /**
     * socket.io
     */


    var time = require('./module/time');

    // 客户端标识
    var id   = 1;

    // 客户端列表
    var list = [];

    /**
     * scoket io 客户端连接
     */
    io.on('connection', function(socket){
        // 连接成功
        console.log('Welcome socket'.green, time.get().yellow);

        socket.on('init', function(data) {

            // 获取用户信息
            var user = {
                soid : socket.id,
                id   : id,
                name : data.name,
                time : data.time,
            };

            list.push(user);

//          console.log(JSON.stringify(list, null, 4));

            // 返回客户端当前的用户列表
            socket.emit('init', {
                list: list,
                user: user,
            });

            // 广播欢迎  xxx 消息, 同时更新 list 列表
            io.sockets.emit('login', {
                who  : 'admin',
                name : 'Admin',
                info : '欢迎 ' + user.name + ' 加入聊天',
                time : time.minget(),
            }, list);

            id++;
        });

        var times = null;

        // 接收消息, 接收完后进行广播
        socket.on('update', function(data) {
            console.log(data);

            times = setTimeout(function() {

                // 单用户广播
                /*
                socket.emit('news', {
                    who  : 'thay',
                    name : 'Aer',
                    info : info,
                    time : time.minget(),
                });
                */

                // 广播 news
                io.sockets.emit('news', {
                    id   : data.id,
                    who  : 'they',
                    name : data.name,
                    info : data.info,
                    time : data.time,
                });

                times = null;
            }, 500);
        });

        // 监听客户端退出
        socket.on('disconnect', function(data){

            // 判断用户 socket.id
            for(var i in list) {
                if(list[i].soid === socket.id) {
                    var user = list[i];

                    list.splice(i, 1);

                    // 重置 id
                    if(list.length === 0) id = 1;

                    // 广播通知客户端
                    io.sockets.emit('leave', {
                        who  : 'admin',
                        name : 'Admin',
                        info : user.name + ' 离开了聊天',
                        time : time.minget(),
                    }, list);

                    console.log(data.red + ' : ' + user.id + '-' + user.name);
                    return;
                }
            }

        });

    });

    /**
     * 错误处理
     */
    io.on('error', function(error) {
        if(error) {
            console.error(
                JSON.stringify(error, null, 4).red
            );
        }
    });


    // 广播服务
    io.sockets.on('connection', function(sockets) {
        console.log("Welcome sockets".yellow, time.get().green + '\n');
    });

