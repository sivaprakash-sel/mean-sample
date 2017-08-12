const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var multer  = require('multer');
var mongo = require('mongodb');

var jsonParser = bodyParser.json();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

var MONGO_SERVER = "mongodb://localhost:27017/test";

router.get('/categories', (req, res) => {
  mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
    if(err) { return console.dir(err); }
    var collection = db.collection('products');
    collection.find().toArray(function(err, items) {
        var categories = [];
        for(let item of items) {
          if(!categories.includes(item['category'])) {
            categories.push(item['category']);
          }
        }
        res.send(JSON.stringify(categories))
      });
  });
});

router.get('/products', (req, res) => {
  findAllProducts(req, res);
});

function findAllProducts(req, res) {
  mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
      if(err) { return console.dir(err); }
      var collection = db.collection('products');
      collection.find().toArray(function(err, items) {
      res.send(JSON.stringify(items)) });
    });
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var fileType = file.originalname.substring(file.originalname.indexOf('.'));
        var fileName = req.params['id'] + fileType;
        console.log('Uploaded : ', fileName, ' originalname: ', file.originalname);
        cb(null, fileName);
        mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
            if(err) { return console.dir(err); }
            var collection = db.collection('products');
            collection.update({"_id": mongo.ObjectID(req.params['id'])},
                              {$set:{"imageUrl": '/uploads/' + fileName}},
                              {w:1}, function(err, result) {});
          });

    }
});

var upload = multer({ storage: storage });

router.get('/product/:id', (req, res) => {
  var p = {};
  mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
      if(err) { return console.dir(err); }
      var collection = db.collection('products');
      collection.findOne({"_id": mongo.ObjectID(req.params['id'])}, function(err, p) {
       console.log('Product', p);
      res.send(JSON.stringify(p)) });
  });

});

router.get('/delete-product/:id', (req, res) => {
  var prods = [];
  mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
      if(err) { return console.dir(err); }
      var collection = db.collection('products');
      collection.remove({"_id": mongo.ObjectID(req.params['id'])});
      collection.find().toArray(function(err, prods) {  res.send(JSON.stringify(prods)) });
    });

});

router.post('/search', jsonParser, (req, res) => {
  if(req.body['text'] == '' && req.body['categories'].length == 0) {
    findAllProducts(req, res);
  } else {
    var productQuery = {};
    if(req.body['text'] != '' && req.body['categories'].length > 0) {
      productQuery = {
        "$and": [
                {
                  "$or": [
                    {'title': new RegExp(req.body['text'], 'i')},
                    {'category': new RegExp(req.body['text'], 'i')}
                  ]
                },
                {'category': {"$in": req.body['categories']}}
                ]
        };
    } else if(req.body['text'] != '') {
      productQuery = {
                       "$or": [
                         {'title': new RegExp(req.body['text'], 'i')},
                         {'category': new RegExp(req.body['text'], 'i')}
                       ]
                     };
    } else {
      productQuery = {'category': {"$in": req.body['categories']}};
    }

    mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('products');
        collection.find(productQuery).toArray(function(err, prods) { res.send(JSON.stringify(prods)) });
      });
  }
});

router.post('/save-product', jsonParser, (req, res) => {
  var product = req.body;
  var prods = [];
    mongo.MongoClient.connect(MONGO_SERVER, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('products');
        if(product['_id'] && product['_id'] != '') {
          var prodId = product['_id'];
          delete product._id
          collection.updateOne({"_id": mongo.ObjectID(prodId)}, product);
        } else {
          collection.insert(product);
        }
        collection.find().toArray(function(err, prods) { res.send(JSON.stringify(prods)) });
      });
});

router.post('/upload-file/:id', upload.single('file'), (req, res) => {
  res.send('{}');
});

module.exports = router;
