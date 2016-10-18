
    var app = angular.module('app', []);

    /**
     * 类似 $();
     * @return{Array} element数组
     */
    app.factory('$$', function() {
        return function(select, context) {
            context = context || document;
            return Array.prototype.slice.call(
                context.querySelectorAll(select)
            );
        }
    })

    app.controller('Map', ['$scope', '$$',
        function($scope, $$) {
            $scope.city = '北京';

            // 初始化
            var map = (function init() {
                var map = new BMap.Map('container');
                // 默认地图级别
                map.setZoom(11);

                // 设置默认城市
                map.centerAndZoom($scope.city, map.getZoom());

                // 关键字搜索
                BMAP.prompt('search', $$('#panel')[0] ,map);

                // 添加定位控件
                BMAP.addGeolocationControl(map, {
                    offset: new BMap.Size(5, $$('html')[0].offsetHeight - 80)
                });
                return map;
            })(undefined);


            // 按Enter触search()
            $$('#search')[0].onkeydown = function(event) {
                if(event.keyCode === 13) {
                    $scope.search();
                }
            }

            $scope.search = function() {
                // 更新地图级别
                $scope.city = $$('#search')[0].value;
                return map.centerAndZoom($scope.city, map.getZoom());
            }

            $scope.add = function() {
                map.setZoom(map.getZoom() < 19 ? map.getZoom()+1 : map.getZoom());
            }

            $scope.remove = function() {
                map.setZoom(map.getZoom() > 1  ? map.getZoom()-1 : map.getZoom());
            }
        }
    ]);



