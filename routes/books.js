var express = require('express');
var db = require('../DataBase/mysql').conn;
var router = express.Router();

router.get('/', function (req, res) {
    db.query('select * from books', function (err, result) {
        if (err) {
            res.send('Connect Failed');
        }
        else {
            var data = {};
            data.data = result;
            res.send(data);
        }
    })
});
router.get('/detail', function (req, res) {
    db.query('select * from books where Id=?', req.query.Id, function (err, result) {
        if (err) {
            res.send('Connect Failed');
        } else {
            var data = {};
            data.data = result[0];
            res.send(data);
        }
    })
});
router.post('/borrow', function (req, res) {
    var sess = req.session;
    var num = 0;
    if (!sess.User) {
        res.send({
            status: 0,
            msg: "请先登录"
        })
    }
    else{
        db.query('select * from user where Id=?', [sess.UserId], function (err, result) {
            if (!parseInt(result[0].BookNum) > 0) {
                res.send({
                    status: 0,
                    msg: '已达到借书上限'
                });
            }else{
                db.query('insert into borrowlist set ?', {
                    UserId: sess.UserId,
                    BookId: req.body.BookId,
                    Name:req.body.BookName,
                    Status:1
                });
                db.query('update user set BookNum = ? where Id = ?', [parseInt(result[0].BookNum)-1, sess.UserId], function (err) {
                    if (err) {
                        res.end({
                            status: 0,
                            msg: 'sdsds1212d'
                        })
                    }
                });
                db.query('select * from books where Id = ?',[req.body.BookId], function (err,result) {
                    db.query('update books set Quantity = ? where Id = ?',[parseInt(result[0].Quantity)-1,req.body.BookId]);
                });
                res.send({
                    status: 1,
                    msg: '借书成功'
                });
            }
        });
    }
});
router.post('/back', function (req,res) {
    var sess=req.session;
    if (!sess.User) {
        res.send({
            status: 0,
            msg: "请先登录"
        })
    }
    db.query('update borrowlist set Status = ? where UserId = ? and BookId = ?',[0,sess.UserId,req.body.Id]);
    db.query('select BookNum from user where Id = ?',[sess.UserId], function (err,result) {
        db.query('update user set BookNum = ? where Id = ?',[parseInt(result[0].BookNum)+1,sess.UserId]);
    });
    db.query('select * from books where Id = ?',[req.body.Id], function (err,result2) {
        db.query('update books set Quantity = ? where Id = ?',[parseInt(result2[0].Quantity)+1,req.body.Id]);
    });
    res.send({
        status:1,
        msg:'还书成功'
    });
});
router.post('/order', function (req,res) {
    var sess=req.session;
    if (!sess.User) {
        res.send({
            status: 0,
            msg: "请先登录"
        })
    }
    db.query('insert into orderlist set ?',{
        UserId:sess.UserId,
        BookId:sess.Id
    });
    res.send({
        status:1,
        msg:'成功'
    });
});
router.get('/order', function (req,res) {
    var sess=req.session;
    if (!sess.User) {
        res.send({
            status: 0,
            msg: "请先登录"
        })
    }
    db.query('select * from orderlist where UserId = ?',[sess.UserId], function (err,result) {
        if (result.length == 0) {
            res.send({
                status: 2,
                msg: "没有预约书籍"
            });
        }else{
            res.cookie('ifOrder','true');
            db.query('select * from book where Id = ?',[req.body.Id], function (err,result1) {
                if(!parseInt(result1[0].Quantity-1>0)){
                    res.send({
                        status:0,
                        msg:'failed'
                    });
                }else{
                    db.query('select * from user where Id=?', [sess.UserId], function (err, result) {
                        if (!parseInt(result[0].BookNum) > 0) {
                            res.send({
                                status: 0,
                                msg: '已达到借书上限'
                            });
                        }else{
                            db.query('insert into borrowlist set ?', {
                                UserId: sess.UserId,
                                BookId: req.body.BookId,
                                Name:req.body.BookName,
                                Status:1
                            });
                            db.query('update user set BookNum = ? where Id = ?', [parseInt(result[0].BookNum)-1, sess.UserId], function (err) {
                                if (err) {
                                    res.end({
                                        status: 0,
                                        msg: 'sdsds1212d'
                                    })
                                }
                            });
                            db.query('select * from books where Id = ?',[req.body.BookId], function (err,result) {
                                db.query('update books set Quantity = ? where Id = ?',[parseInt(result[0].Quantity)-1,req.body.BookId]);
                            });
                            res.send({
                                status: 1,
                                msg: '借书成功'
                            });
                        }
                    });
                }
            });
        }
    });
});
router.post('/test', function (req, res) {
    db.query('insert into borrowlist set ?', {
        UserId: 1,
        BookId: req.body.BookId
    });
    db.query('update user set BookNum = ? where Id = ?', [1, 1], function (err) {
        if (err) {
            res.end({
                status: 0,
                msg: 'sdsds1212d'
            })
        }
    });
});

module.exports = router;