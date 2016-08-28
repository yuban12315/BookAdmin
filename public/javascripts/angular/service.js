var app = angular.module('MyService', []);

app.factory('LoginService', ['$q', '$http', function ($q, $http) {
    return {
        Login: function (LogData) {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            if (LogData.UserName.length == 0) {
                delay.reject("请输入正确的用户名");
                return promise;
            }
            if (LogData.PassWord.length == 0) {
                delay.reject("请输入密码");
                return promise;
            }
            $http.post('/user/login', {
                UserName: LogData.UserName,
                PassWord: LogData.PassWord
            }).success(function (data) {
                if (data.status == 1) {
                    delay.resolve('success');
                }
                else {
                    delay.reject(data.msg);
                }
            });
            return promise;
        },
        logout: function () {
            $http.post('/user/logout');
        },
        setForm: function () {
            return {
                UserName: '',
                PassWord: ''
            };
        },
        setMsg: function () {
            return {
                ifshow: false,
                text: '测试'
            };
        }
    }
}]);
app.factory('BookService', ['$q', '$http', function ($q, $http) {
    return {
        booklist: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/books').success(function (data) {
                delay.resolve(data.data);
            }).error(function () {
                delay.reject('error');
            });
            return promise;
        },
        query: function (Id) {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/books/detail', {params: {Id: Id}}).success(function (data) {
                delay.resolve(data.data);
            }).error(function () {
                delay.reject('error');
            });
            return promise;
        },
        borrow: function (Book) {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.post('/books/borrow', {
                BookId: Book.Id,
                BookName: Book.Name
            }).success(function (data) {
                if (data.status == 1) {
                    delay.resolve(data.msg);
                } else {
                    delay.reject(data.msg);
                }
            });
            return promise;
        },
        back: function (Book) {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.post('/books/back', {
                Id: Book.BookId
            }).success(function (data) {
                if (data.status = 1) {
                    delay.resolve('success');
                }
                else {
                    delay.reject('error')
                }
            });
            return promise;
        },
        order: function (Book) {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.post('/books/order', {
                Id: Book.Id,
                Name: Book.Id
            }).success(function (data) {
                if (data.status == 1)
                    delay.resolve(data);
                else delay.reject(data);
            });
            return promise;
        },
        check: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/books/order').success(function (data) {
                if (data.status == 1)
                    delay.resolve(data);
                else delay.reject(data);
            });
            return promise;
        }
    }
}]);
app.factory('UserService', ['$q', '$http', function ($q, $http) {
    return {
        data: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/user/data').success(function (data) {
                delay.resolve(data.data);
            });
            return promise;
        }
    }
}]);
app.factory('AdminService', ['$q', '$http', function ($q, $http) {
    return {
        getUser: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/admin/user').success(function (data) {
                if (data.status == 1)
                    delay.resolve(data.data);
                else delay.reject(data);
            });
            return promise;
        },
        getBook: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/admin/book').success(function (data) {
                if (data.status == 1)
                    delay.resolve(data.data);
                else delay.reject(data);
            });
            return promise;
        },
        getBorrow: function () {
            var delay = $q.defer();
            var promise = delay.promise;
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            $http.get('/admin/borrow').success(function (data) {
                if(data.status==1)
                    delay.resolve(data.data);
                else delay.reject(data);
            });
            return promise;
        },

        updateBook: function (Book) {
            $http.post('/admin/book',Book);
        },
        addBook: function (Book) {
            $http.post('/admin/addBook',Book);
        },
        deteleBook: function (Book) {
          $http.post('/admin/deleteBook',Book)
        },

        updateUser: function (User) {
            $http.post('/admin/user',User);
        },
        addUser:function(User){
            $http.post('/admin/addUser',User)
        },
        deteleUser: function (User) {
            $http.post('/admin/deleteUser',User)
        },

        byBook: function (Users,List,Books) {
            var data={};
            var num=0;
            for(var i in List){
                for(var k in Users){
                    if(Users[k].Id==List[i].UserId){
                        List[i].UserName=Users[k].UserName;
                    }
                }
            }
            for(var i in Books){
                for(var k in List){
                    if(Books[i].Id==List[k].BookId){
                        data[num]=List[k];
                        num++;
                    }
                }
            }
            console.log(data)
            return data;
        },
        byUser: function (Users,List,Books) {
            var data={};
            var num=0;
            for(var i in List){
                for(var k in Users){
                    if(Users[k].Id ==List[i].UserId){
                        List[i].UserName=Users[k].UserName;
                    }
                }
            }
            for(var i in Users){
                for(var k in List){
                    if(Users[i].Id==List[k].UserId){
                        data[num]=List[k];
                        num++;
                    }
                }
            }
            console.log(data);
            return data;
        }
    }
}]);