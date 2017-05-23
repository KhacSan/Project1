var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
app.set('view engine','ejs')
app.set('views','./views')
app.use(express.static('./public'))
server.listen(3000);
var multer = require('multer');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');
var dbMongo = mongoose.connection;
dbMongo.on('err',console.error.bind(console,'connect error'))
dbMongo.once('open',function(){
  console.log('Mongodb connect')
})
var Schema = new mongoose.Schema({
     type: String,
     stories: [{
       story: String,
       title: String
     }]
});
app.get('/',function(req,res){
  res.render('trangchu')
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

io.on("connection",function(socket){
  socket.on("yeu_cau",function(data){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("truyencuoi").find({type: data.type}).toArray(function(err, results) {
        if (err) throw err;
        var index = Math.floor(Math.random() * results[0].stories.length);
        socket.emit('phan_hoi',results[0].stories[index]);
        db.close();
      });
    });
  });
});
app.get('/truyen-cuoi-dan-gian',function(req,res){
  res.render('truyen-cuoi-dan-gian')
});
app.get('/truyen-cuoi-tham-thuy',function(req,res){
  res.render('truyen-cuoi-tham-thuy')
});
app.get('/truyen-cuoi-nuoc-ngoai',function(req,res){
  res.render('truyen-cuoi-nuoc-ngoai')
});
app.get('/truyen-cuoi-ve-tinh-yeu',function(req,res){
  res.render('truyen-cuoi-ve-tinh-yeu')
});
app.get('/truyen-cuoi-the-loai-khac',function(req,res){
  res.render('truyen-cuoi-the-loai-khac');
});
