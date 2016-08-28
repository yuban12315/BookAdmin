var express = require('express');
var db = require('../DataBase/mysql').conn;
var async = require('async');
var router = express.Router();

/* GET users listing. */
router.post('/login', function (req, res, next) {
    var sess = req.session;
    if (sess.User) {
        console.log(sess.User);
        res.send({
            status: 1,
            msg: "已经登录过了"
        });
    } else {
        db.query('select * from user where UserName=?', [req.body.UserName], function (err, result) {
            if (err) {
                res.send('Connect Failed');
            }
            if (result.length == 0) {
                res.send({
                    status: 0,
                    msg: "用户不存在"
                });
            }
            else if (result[0].PassWord.toString() != req.body.PassWord) {
                res.send({
                    status: 0,
                    msg: '密码错误'
                });
            }
            else {
                if (parseInt(result[0].Status) == 5) {
                    sess.ifAdmin = true;
                    res.cookie('Admin', 'true');
                } else {
                    sess.ifAdmin = false;
                }
                //res.cookie('logged','true',{maxAge: 3600 * 1000});
                sess.User = req.body.UserName;
                sess.UserId = result[0].Id;
                res.send({
                    status: 1,
                    msg: '成功',
                });
            }
        });
    }
});
router.post('/logout', function (req, res) {
    req.session.destroy();
    res.send('1');
});
router.get('/data', function (req, res) {
    var sess = req.session;
    if (!sess.User) {
        res.send({
            status: 0,
            msg: "请先登录"
        })
    }
    var resData = {};
    resData.data = {};
    var data = resData.data;
    db.query('select * from user where Id = ?', [sess.UserId], function (err, result) {
        data.UserName = result[0].UserName.toString();
        data.BookNum = result[0].BookNum.toString();
        data.TrueName = result[0].TrueName.toString();
        data.BookList = {};
        db.query('select * from borrowlist where UserId = ? and Status = ?', [sess.UserId,1], function (err, result1) {
            data.BookList = result1;
            res.send(resData);
        });
    });
});
module.exports = router;
