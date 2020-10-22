/*
	Filename: index.js
	Name: Jagjit Singh
	Student ID: 301106044
	Date: 2020-09-29
*/

const { MongoClient, ObjectId } = require('mongodb');
var mongo = require('mongodb').MongoClient;
var mongoUrl = "mongodb+srv://root:qwerty123@cluster0.4w2rf.azure.mongodb.net/test";

var express = require('express');
var router = express.Router();

//Authentication check
function restricted(req,res,next){
    if (req.session.user) {
        next();
    }
    else res.redirect('/login');
}

router.get('/', function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - Web Developer"
    };
    res.render('pages/index',{global_data:global_data});
});

router.get('/services', function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - Services"
    };
    res.render('pages/services',{global_data:global_data});
});

router.get('/projects', function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - Projects"
    };
    res.render('pages/projects',{global_data:global_data});
});

router.get('/aboutme', function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - About Me"
    };
    res.render('pages/aboutme',{global_data:global_data});
});

router.get('/contact', function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - Contact"
    };
    res.render('pages/contact',{global_data:global_data});
});
//Update contact using id in the url
router.get('/update/:id', restricted,function(req, res) {
    var global_data={
        "page_title":"Jagjit Singh - Update Contact"
    };

    var _id=req.params.id;
    var name=req.query.name;
    var number=req.query.number;
    var email=req.query.email;

    async function handleUpdate(){
        if(name || number || email){
            await MongoClient.connect(mongoUrl, function(err,db){
                dbo=db.db("portfolio");

                if(name)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{name:name}
                    });

                if(number)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{number:number}
                });

                if(email)
                    dbo.collection("contact_list").findOneAndUpdate({"_id": ObjectId(_id)}, {
                        $set:{email:email}
                });
            });
            return res.redirect('/admin');
        }
    }

    handleUpdate();

    res.render('pages/update',{global_data:global_data});
});

router.get('/delete/:id', restricted, function(req, res) {
    var _id=req.params.id;

    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("portfolio");
        dbo.collection("contact_list").deleteOne({"_id": ObjectId(_id)});
        res.redirect('/admin');
    });
});

router.get('/admin', restricted, function(req, res) {
    var contact_list=[];
    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("portfolio");
        dbo.collection("contact_list").find().toArray(function(err,results){
            for(let i=0;i<results.length;i++){
                contact_list.push(results[i]);
            }

            var global_data={
                "page_title":"Jagjit Singh - Manage Contacts",
                "contact_list":contact_list
            };
            
            console.log(contact_list);
            res.render('pages/admin',{global_data:global_data});
        });
    });
});

router.get('/login', function(req, res) {

    var auth_status=(req.query.status)?req.query.status:"";
    var global_data={
        "auth_status":auth_status,
        "page_title":"Jagjit Singh - Login"
    };
    res.render('pages/login',{global_data:global_data});
});

router.get('/logout',function(req,res){
    req.session.user=null;
    res.redirect('/login');
});

//Handing authentication, sending back auth responses
router.get('/login/auth',function(req,res){
    //Login user if it exists in database
    var username=req.query.username;
    var password=req.query.password;
    var isLoggedIn=null;

    MongoClient.connect(mongoUrl, function(err,db){
        dbo=db.db("portfolio");
        dbo.collection("user_accounts").find({}).toArray(function(err,results){
            for(let i=0;i<results.length;i++)
                if(username==results[i].username && password==results[i].password)
                    isLoggedIn=true;

            if(isLoggedIn){
                req.session.user=username;
                console.log("Logged in as "+username);
                res.redirect('/admin');
            }
            else res.redirect('/login?status=Invalid Credentials');
        });
    });
});

module.exports = router;