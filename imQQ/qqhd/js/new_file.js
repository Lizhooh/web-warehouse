$(function() {
    $("#wrap-silde")
        .fullpage({
            "navigation": true,
            verticalCentered: false,
            resize: false
        });
    $(".js-toggle")
        .click(function(e) {
            var me = $(this),
                cssclass = me.data("cssclass") || "hide",
                selector = me.data("selector"),
                prevent = me.data("prevent");
            if(selector) {
                var eo = $(selector);
                eo.toggleClass(cssclass)
            }
            prevent && e.preventDefault()
        });

    function autoScrolling() {
        var $ww = $(window)
            .width(),
            $hh = $(window)
            .height();
        if($ww < 1441 && $ww > 1024 || $hh < 840 && $hh > 736) {
            $.fn.fullpage.setAutoScrolling(false);
            $("#fp-nav")
                .hide();
            $(".arrow")
                .hide();
            $("#wrap-silde .section")
                .css("height", "950px")
        }
        else {
            $.fn.fullpage.setAutoScrolling(true)
        }
    }
    autoScrolling();
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        detectOrientation()
    }, false);

    (function() {
        detectOrientation()
    })();

    function detectOrientation() {
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && window.orientation === 180 || window.orientation === 0) {
            $(".dialog-guide")
                .hide()
        }
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && window.orientation === 90 || window.orientation === -90) {
            $(".dialog-guide")
                .show()
        }
    }

    (function() {
        if(typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            onReady()
        }
        else {
            if(document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", onReady, false)
            }
            else {
                if(document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", onReady);
                    document.attachEvent("onWeixinJSBridgeReady", onReady)
                }
            }
        }
        if(!!mqq) {
            mqq.data.setShareInfo({
                share_url: window.location.href,
                image_url: "http://sqimg.qq.com/qq_product_operations/im/mac/5.0/images/share-img.png",
                title: "QQ iPad版-新视觉·心体验",
                desc: "支持IOS9分屏特性，更能和WPS跨屏编辑文档，边聊边办公;关注特别的你，生日提前提醒;文件一搜即达，分类查找更加方便，妈妈再也不怕我找不到文件啦！"
            }, function(succ) {})
        }

        function onReady() {
            WeixinJSBridge.on("menu:share:timeline", function(event) {
                WeixinJSBridge.invoke("shareTimeline", {
                    img_url: "http://sqimg.qq.com/qq_product_operations/im/mac/5.0/images/share-img.png",
                    img_width: "128",
                    img_height: "128",
                    link: window.location.href,
                    desc: "支持IOS9分屏特性，更能和WPS跨屏编辑文档，边聊边办公;关注特别的你，生日提前提醒;文件一搜即达，分类查找更加方便，妈妈再也不怕我找不到文件啦！",
                    title: "QQ iPad版-新视觉·心体验"
                }, function(res) {
                    WeixinJSBridge.log(res.err_msg)
                })
            });
            WeixinJSBridge.on("menu:share:appmessage", function(argv) {
                WeixinJSBridge.invoke("sendAppMessage", {
                    img_url: "http://sqimg.qq.com/qq_product_operations/im/mac/5.0/images/share-img.png",
                    img_width: "128",
                    img_height: "128",
                    link: window.location.href,
                    desc: "支持IOS9分屏特性，更能和WPS跨屏编辑文档，边聊边办公;关注特别的你，生日提前提醒;文件一搜即达，分类查找更加方便，妈妈再也不怕我找不到文件啦！",
                    title: "QQ iPad版-新视觉·心体验"
                }, function(res) {
                    WeixinJSBridge.log(res.err_msg)
                })
            })
        }
    })()
});