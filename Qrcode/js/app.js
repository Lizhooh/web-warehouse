
    require.config({
        paths: {
            'jquery':       ['http://libs.baidu.com/jquery/2.0.3/jquery.min', './lib/jquery.min'],
            'jqrcode':      ['./lib/jquery.qrcode.min'],        /* 生成二维码 */
            'qrcodeLib':    ['./lib/qrcode.lib.min'],           /* 解析二维码 */
            'xqrcode':      ['./model/xqrcode'],                /* 扫码二维码 */
            'utf':          ['./model/utf'],                    /* 转码格式 */
        },
        /**
         * 依赖注入
         */
        shim: {
            'jqrcode': {
                deps: ['jquery'],
                exports: 'jqrcode',
            },
        }
    });

    require(['qrcodeLib', 'xqrcode'],
        function(qrcodeLib, xqrcode) {
            /**
             * 扫码
             */
            xqrcode.init(
                $('[node-type=qr-btn]')
            );
        }
    );

    require(['jquery', 'jqrcode', 'utf'],
        function($, jqrcode, utf) {

            var text = '',
                color = 'rgba(255, 40, 0, 1)',

                createQrcode = function($element, text, color) {
                    $element.html('')
                        .qrcode({
                            width: 180,
                            height: 180,
                            render: "canvas",           // 设置渲染方式  canvas
                            text: text,                 // 二维码文本
                            background: "#ffffff",      // 背景颜色
                            foreground: color           // 前景颜色
                        })
                    ;
                };

            $('#content')
                .on('focus', function(event) {
                    var msg = $(this).siblings('.msg');
                    msg.text('生成二维码（未生成）');
                })

                .on('blur', function(event) {
                    if(!$('#content').val()) return;

                    var msg = $(this).siblings('.msg');
                    msg.text('生成二维码（已生成）');

                    text = utf.utf16to8(
                        $('#content').val() || 'define'
                    );

                    createQrcode($("#qrcode"), text, color);
                })

                /* color */
                .next()
                    .on('click', function(event) {
                        var who = event.target;
                        if(who.className === 'color' || !text) return;

                        color = $(who).css('background-color');
                        createQrcode($("#qrcode"), text, color);
                    })
                ;
            ;
        }
    );



