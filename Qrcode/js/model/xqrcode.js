
define(function() {

    if(typeof qrcode === 'undefined') {
        throw new Error('qrcode is not define.');
        return new Object();
    }

    var input  = 'input[node-type=jsbridge]',
        result = '.result-qrcode';

    var Qrcode = function(tempBtn) {
        var _this_ = this;
        var isWeiboWebView = /__weibo__/.test(navigator.userAgent);

        if(isWeiboWebView) {
            if(window.WeiboJSBridge) {
                _this_.bridgeReady(tempBtn);
            }
            else {
                document.addEventListener('WeiboJSBridgeReady', function() {
                    _this_.bridgeReady(tempBtn);
                });
            }
        }
        else {
            _this_.nativeReady(tempBtn);
        }
    };

    Qrcode.prototype = {

        nativeReady: function(tempBtn) {

            $(input, tempBtn)
                .on('click', function(e) {
                    e.stopPropagation();
                });

            $(tempBtn)
                .on('click', function(e) {
                    $(this)
                        .find(input)
                        .trigger('click');
                });

            $(tempBtn)
                .on('change', this.getImgFile);
        },

        bridgeReady: function(tempBtn) {
            $(tempBtn)
                .on('click', this.weiBoBridge);
        },

        weiBoBridge: function() {
            window.WeiboJSBridge.invoke('scanQRCode', null, function(params) {

                //拍照， 得到扫码的结果
                $(result)
                    .append( '<div class="item">' + params.result.toString() + '</div>');
            });
        },

        getImgFile: function() {
            var _this_   = this;
            var inputDom = $(this).find(input);
            var imgFile  = inputDom[0].files;
            var oFile    = imgFile[0];
            var oFReader = new FileReader();
            var rFilter  = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

            if(imgFile.length === 0) {
                return;
            }

            if(!rFilter.test(oFile.type)) {
                alert("选择正确的图片格式!");
                console.warn('文件格式不正确.');
                return;
            }

            oFReader.onload = function(oFREvent) {

                qrcode.decode(oFREvent.target.result);
                qrcode.callback = function(data) {
                    //文件，得到扫码的结果
                    $(result)
                        .append( '<div class="item">' + data.toString() + '</div>');
                };
            };

            oFReader.readAsDataURL(oFile);
        },

        destory: function() {
            $(tempBtn)
                .off('click');
        }
    };

    Qrcode.init = function(tempBtn) {
        var $this = this;

        tempBtn.each(function() {
            new $this($(this));
        });
    };

    return Qrcode;
});
