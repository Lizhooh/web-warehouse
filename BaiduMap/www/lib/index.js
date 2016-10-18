
    var memo = [],
        app  = angular.module('ionicApp', ['ionic']);

    app.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$http',
        function($scope, $rootScope, $ionicModal, $http) {

            var getData = function(url, method, success, error) {
                    $http({
                        method: method,
                        url: url,
                    })
                    .success(function(data, stauts, header, config) {
                        success(data, stauts, header, config);
                        console.warn('success');
                    })
                    .error(function(data, stauts, header, config){
                        error(data, stauts, header, config);
                        console.warn('fail');
                    });
                },

                initUser = function() {
                    return {
                        Type:       '',
                        Account:    '',
                        Password:   '',
                        Remarks:    '',
                        Email:      '',
                    };
                };

            // 初始化
            $scope.newUser = initUser();
            // 创建button
            $scope.createShow  = true;
            // 错误信息
            $scope.messageShow = false;

            // 缓存数组
            $scope.memos = [];
            getData('./json/MemoData.json', 'post', function(data) {
                $scope.memos = data;
            });

            // 引入模型
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope,
            })
            .then(function(modal) {
                $scope.modal = modal;
            });

            $scope.createMemo = function(user) {
                for(i in user) {
                    // user内容不能为空
                    if(!user[i]) {
                        $scope.messageShow = true;
                        return false;
                    }
                }

                $scope.memos.push({
                    name:       user.Type,
                    Type:       user.Type,
                    Account:    user.Account,
                    Password:   user.Password,
                    Remarks:    user.Remarks,
                    Email:      user.Email,
                });

                // 隐藏窗体
                $scope.modal.hide();

            };

            $scope.deleteMemo = function(index) {
                $scope.memos.splice(index, 1);
                $scope.modal.hide();
            }

            $scope.show = function(item) {
                // 显示窗体
                $scope.modal.show();
                // 填充数据
                $scope.newUser = {
                    Type:       item.Type,
                    Account:    item.Account,
                    Password:   item.Password,
                    Remarks:    item.Remarks,
                    Email:      item.Email,
                }

                $scope.createShow  = false;
                $scope.messageShow = false;
                $scope.index       = $scope.memos.indexOf(item);
            }

            $scope.add = function() {
                $scope.modal.show();

                $scope.createShow  = true;
                $scope.messageShow = false;
                $scope.newUser     = initUser();
            }
        }
    ]);