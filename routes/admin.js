var express = require('express');
var db = require('../DataBase/mysql').conn;
var router = express.Router();

router.get('/user', function (req, res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }
    var data = {};
    db.query('select Id,UserName,TrueName,PassWord from user', function (err, result) {
        data.data = result;
        data.status = 1;
        data.msg = 'success';
        res.send(data);
    });
});
router.post('/user', function (req, res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('update user set ? where Id =?', [{
        UserName: req.body.UserName,
        PassWord: req.body.PassWord,
        TrueName: req.body.TrueName
    }, req.body.Id]);
    res.send({
        status: 1,
        msg: 'success'
    });
});
router.post('/addUser', function (req,res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('insert into user set ?',{
        UserName:req.body.UserName,
        PassWord:req.body.PassWord,
        TrueName:req.body.TrueName,
        Status:1,
        BookNum:2
    });

    res.send({
        status: 1,
        msg: 'success'
    });
});
router.post('/deleteUser', function (req,res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('delete from user where Id= ?',[req.body.Id]);

    res.send({
        status: 1,
        msg: 'success'
    });
});

router.get('/book', function (req,res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }
    var data = {};
    db.query('select * from books', function (err, result) {
        data.data = result;
        data.status = 1;
        data.msg = 'success';
        res.send(data);
    })
});
router.post('/book', function (req, res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('update books set ? where Id =?', [{
        Name: req.body.Name,
        Type:req.body.Type,
        Author: req.body.Author,
        PublishHouse:req.body.PublishHouse,
        PublishDate:req.body.PublishDate,
        ISBN:req.body.ISBN,
        Edtion:req.body.Edtion,
        Price:req.body.Price,
        Quantity:req.body.Quantity
    }, req.body.Id]);
    res.send({
        status: 1,
        msg: 'success'
    });
});
router.post('/addBook',function(req,res){
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('insert into books set ?',{
        Name: req.body.Name,
        Type:req.body.Type,
        Author: req.body.Author,
        PublishHouse:req.body.PublishHouse,
        PublishDate:req.body.PublishDate,
        ISBN:req.body.ISBN,
        Edtion:req.body.Edtion,
        Price:req.body.Price,
        Quantity:req.body.Quantity
    });

    res.send({
        status: 1,
        msg: 'success'
    });
});
router.post('/deleteBook', function (req,res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }

    db.query('delete from books where Id = ?',[req.body.Id]);

    res.send({
        status: 1,
        msg: 'success'
    });
});

router.get('/borrow', function (req,res) {
    var sess = req.session;
    if (!sess.ifAdmin) {
        res.send({
            status: 0,
            msg: '不是管理员账户'
        })
    }
    var data = {};
    db.query('select * from borrowlist where Status = 1', function (err, result) {
        data.data=result;
        data.status = 1;
        data.msg = 'success';
        res.send(data);
    })
});

module.exports = router;