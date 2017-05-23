var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mydb')
var dbMongo = mongoose.connection;
dbMongo.on('error',console.error.bind(console,'connection error:'))
dbMongo.once('open',function(){
  console.log('MongoDb connect')
})

var Schema = new mongoose.Schema({
  type: String,
  stories: [{
    story: String,
    title: String
  }]
})
var myobj = mongoose.model('Data', Schema)

let getStories = (URL)=>{
  var mangStories = [];
  request(URL,function(error,response,body){
      if(error){
        console.log(error);
      }else {
        $ = cheerio.load(body);
        var ds = $(body).find("a.a-title");
        var type = $(body).find("strong").text();
        var n = ds.length;
        ds.each(function (i,e) {
          request(e["attribs"]["href"],function (error1,response1,body1) {
            if(error1){
              console.log(error1);
            }else {
                $ = cheerio.load(body1);
                var data= $(body1).find("div.padding-10-20").text();
                var ten = $(body1).find("h3.margin-bottom-0").text();
                var object = { story: data, title: ten };
                mangStories.push(object);
             }
             if(mangStories.length == n){
               MongoClient.connect(url, function(err, db) {
                 if (err) throw err;
                 myobj = {type: type,stories: mangStories};
                 db.collection("truyencuoi").insertOne(myobj, function(err1, res1) {
                   if (err1) throw err1;
                   console.log("1 record inserted");
                   db.close();
                 });
               });
             }
          });
        });
      }
   });
};

var mangURL = ['http://www.zuize.vn/cat/truyen-cuoi-dan-gian.html','http://www.zuize.vn/cat/truyen-cuoi-tham-thuy.html',
              'http://www.zuize.vn/cat/truyen-cuoi-nuoc-ngoai.html','http://www.zuize.vn/cat/truyen-cuoi-ve-tinh-yeu.html',
              'http://www.zuize.vn/cat/truyen-cuoi-the-loai-khac.html'];
mangURL.forEach(function(URL){
  getStories(URL);
 })
