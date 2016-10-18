
    // 命名空间
    var BMAP = BMAP || {};

    BMAP.init = function(map) {
        this.map = map;
    }

    /**
     * 生成关键字提示框
     * @param{String} inputId 输入框id
     * @param{Object} panel element对象
     * @param{Object} map BMap对象
     */
    BMAP.prompt = function(inputId, panel, map) {
        var ac = new BMap.Autocomplete({
            input    : inputId,
            location : map
        });

        ac.addEventListener("onhighlight", function(e) {
            //鼠标放在下拉列表上的事件
            var str = "",
                _value = e.fromitem.value,
                value = "";

            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }

            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            panel.innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {
            //鼠标点击下拉列表后的事件
            var _value = e.item.value;

            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            panel.innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            document.getElementById(inputId).value = myValue;
            setPlace();
        });

        function setPlace(){
            //清除地图上所有覆盖物
            map.clearOverlays();

            function myFun(){
                //获取第一个智能搜索的结果
                var pp = local.getResults().getPoi(0).point;
                map.centerAndZoom(pp, 18);
                //添加标注
                map.addOverlay(new BMap.Marker(pp));
            }

            //智能搜索
            var local = new BMap.LocalSearch(map, {
              onSearchComplete: myFun
            });
            local.search(myValue);
        }
    };


    /**
     * 根据浏览器定位
     */
    BMAP.geoLocation = function(map) {
        var geolocation = new BMap.Geolocation();

        geolocation.getCurrentPosition(
            function(r) {
                if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    //alert('您的位置：'+r.point.lng+','+r.point.lat);
                }
                else {
                    //alert('failed'+this.getStatus());
                }

            },{
                enableHighAccuracy: true
            }
        )
    };

    /**
     * 地图平移缩放控件
     * @param{Object} map BMap对象
     */
    BMAP.addNavigationControl = function(map) {
        var navigationControl = new BMap.NavigationControl({
                // 靠左下角位置
                anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: true
            });
        map.addControl(navigationControl);
    };

    /**
     * 定位控件
     * @param{Object} map BMap对象
     */
    BMAP.addGeolocationControl = function(map, opts) {
        var $this = this;
        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl(opts);

        geolocationControl.addEventListener("locationSuccess", function(e) {
            // 定位成功事件
            var address = '';
            address += e.addressComponent.province;
            address += e.addressComponent.city;
            address += e.addressComponent.district;
            address += e.addressComponent.street;
            address += e.addressComponent.streetNumber;
            $this.geoLocation(map);
            //console.log("当前定位地址为：" + address);
        });
        geolocationControl.addEventListener("locationError", function(e) {
            // 定位失败事件
            console.log(e.message);
        });
        map.addControl(geolocationControl);
    };

   /**
    * 交通图层
    * @param{Object} map BMap对象
    * @param{Boolean} flag [true-开启, flag-关闭]
    */
    BMAP.traffic = function(map, flag) {
        // 添加交通图层
        if(flag === true) {
            var traffic = new BMap.TrafficLayer();
            map.addTileLayer(traffic);
            return true;
        }
        // 移除图层
        map.removeTileLayer(traffic);
    }

    /**
     * 添加标注
     * @param{Object} map BMap对象
     */
    BMAP.addMarker = function(map, point) {
        // 创建标注
        var marker = new BMap.Marker(point);
        // 将标注添加到地图中
        map.addOverlay(marker);
        //跳动的动画
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    };

    BMAP.addLabel = function(map) {
        var opts = {
            position : point,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(30, -30)    //设置文本偏移量
        }
        var label = new BMap.Label("欢迎使用百度地图，这是一个简单的文本标注哦~", opts);  // 创建文本标注对象
            label.setStyle({
                 color : "red",
                 fontSize : "12px",
                 height : "20px",
                 lineHeight : "20px",
                 fontFamily:"微软雅黑"
             });
        map.addOverlay(label);
    };



