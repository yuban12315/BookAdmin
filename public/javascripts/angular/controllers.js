var app = angular.module('main', ['ngRoute', 'MyService']);

app.controller('NavCtrl', ['$scope', '$interval', '$timeout', '$location', '$rootScope', 'LoginService',
    function ($scope, $interval, $timeout, $location, $rootScope, LoginService) {
        $scope.iflogin = function () {
            return getCookie('logged').length > 0;
        };
        $scope.ifAdmin = function () {
            return getCookie('Admin').length > 0;
        };
        $scope.change = function () {
            if ($scope.elem == 'block')
                $('#collapse').click();
        };
        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.web = '加载中';
        });
        $rootScope.$on('$routeChangeSuccess', function () {

        });
        $timeout(function () {
            $interval(function () {
                $scope.elem = getComputedStyle(document.getElementById('collapse')).display;
            }, 500);
        }, 100);
        $scope.logout = function () {
            LoginService.logout();
            clearCookie('logged');
            clearCookie('Admin');
            clearCookie('ifOrder');
            $scope.change();
            $location.path('/');
        }
    }]);
app.controller('MainCtrl', ['$scope', '$rootScope', 'BookService', '$location', function ($scope, $rootScope, BookService, $location) {
    $rootScope.web = '图书管理系统';
    BookService.booklist().success(function (data) {
        $scope.books = data;
    });
    $scope.more = function (index) {
        $location.path('/detail');
        $location.search({'id': $scope.books[index].Id})
    }
}]);
app.controller('DetailCtrl', ['$scope', '$rootScope', 'BookService', '$location','Book', function ($scope, $rootScope, BookService, $location,Book) {
    $rootScope.web = "图书管理系统-详情";
    $scope.book=Book
    $scope.ifborrow = function () {
        return $scope.book.Quantity - 1 > 0
    };
    $scope.borrow = function () {
        BookService.borrow($scope.book).success(function (data) {
            alert("借书成功");
            $location.path("/user");
        }).error(function (data) {
            if (data == '请先登录') {
                alert(data);
                $location.path('/login');
            }
            alert(data);
        })
    };
    $scope.OrderBook = function () {
    }

}]);
app.controller('UserCtrl', ['$scope', '$rootScope', '$location', 'BookService', 'UserService', function ($scope, $rootScope, $location, BookService, UserService) {
    UserService.data().success(function (data) {
        $scope.data = data;
    });
    $scope.back = function (index) {
        BookService.back($scope.data.BookList[index]).success(function (data1) {
            alert("还书成功");
            UserService.data().success(function (data) {
                $scope.data = data;
            });
        })
    }
}]);
app.controller('LogCtrl', ['$scope', '$rootScope', 'LoginService', '$location', function ($scope, $rootScope, LoginService, $location) {
    $rootScope.web = "登录";
    $scope.form = LoginService.setForm();
    $scope.msg = LoginService.setMsg();
    $scope.Login = function () {
        $scope.msg.ifshow = false;
        LoginService.Login($scope.form).success(function (data) {
            setCookie('logged', 'true');
            $location.path('/');
        }).error(function (msg) {
            $scope.msg.ifshow = true;
            $scope.msg.text = msg;
        })
    }
}]);
app.controller('AdminCtrl', ['$scope', '$rootScope', 'AdminService','BorrowList','Users','Books', function ($scope, $rootScope, AdminService,BorrowList,Users,Books) {
    $rootScope.web = '管理界面';
    $scope.books=Books;
    $scope.users=Users;

    $scope.EditBook = function (index) {
        $scope.bookcopy = $scope.books[index];
        $('#myModal').modal('toggle');
    };
    $scope.accept = function () {
        AdminService.updateBook($scope.bookcopy);
        AdminService.getBook().success(function (data) {
            $scope.books = data.data;
        });
    };
    $scope.AddBook = function () {
        $scope.bookcopy = {};
        $('#myModal2').modal('toggle');
    };
    $scope.accept2 = function () {
        AdminService.addBook($scope.bookcopy);
        $('#myModal2').modal('toggle');
        AdminService.getBook().success(function (data) {
            $scope.books = data.data;
        });
    };
    $scope.deleteBook = function () {
        AdminService.deteleBook($scope.bookcopy);
        AdminService.getBook().success(function (data) {
            $scope.books = data.data;
        });
    };

    $scope.EditUser = function (index) {
        $scope.usercopy = $scope.users[index];
        $('#myModal3').modal('toggle');
    };
    $scope.accept3 = function () {
        AdminService.updateUser($scope.usercopy);
        AdminService.getUser().success(function (data) {
            $scope.users = data.data;
        });
    };
    $scope.deleteUser=function(){
        AdminService.deteleUser($scope.usercopy);
        AdminService.getUser().success(function (data) {
            $scope.users = data.data;
        });
    };
    $scope.AddUser = function () {
        $scope.usercopy = {};
        $('#myModal4').modal('toggle');
    };
    $scope.accept4 = function () {
        AdminService.addUser($scope.usercopy);
        AdminService.getUser().success(function (data) {
            $scope.users = data.data;
        });
    };

    $scope.byUser= function () {
        $scope.list=AdminService.byUser($scope.users,BorrowList,Books);
    };
    $scope.byBook= function () {
        $scope.list=AdminService.byBook($scope.users,BorrowList,Books);
    };
    $scope.byBook();
}]);

app.config(['$routeProvider', function ($routeProvider, $scope) {
    $routeProvider.when('/', {
            controller: "MainCtrl",
            templateUrl: "views/main.html"
        })
        .when('/detail', {
            controller: "DetailCtrl",
            templateUrl: "views/detail.html",
            resolve:{
                Book:['BookService','$location', function (BookService,$location) {
                    return BookService.query($location.search().id).success(function (data) {
                        return data;
                    });
                }]
            }
        })
        .when('/login', {
            controller: "LogCtrl",
            templateUrl: "views/login.html"
        })
        .when('/user', {
            controller: "UserCtrl",
            templateUrl: "views/user.html"
        })
        .when('/admin', {
            controller: "AdminCtrl",
            templateUrl: "views/admin.html",
            resolve:{
                BorrowList: ['AdminService', function (AdminService) {
                    return AdminService.getBorrow().success(function (data) {
                        return data;
                    });
                }],
                Users:['AdminService', function (AdminService) {
                    return AdminService.getUser().success(function (data) {
                        return data;
                    });
                }],
                Books:['AdminService', function (AdminService) {
                    return AdminService.getBook().success(function (data) {
                        return data;
                    });
                }]
            }
        })
}]);