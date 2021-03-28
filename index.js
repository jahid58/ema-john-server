const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntakd.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db(process.env.DB_HOST).collection('fuck');
  const ordersCollection = client.db(process.env.DB_HOST).collection('orders');
  app.post('/addProduct',(req,res)=>{
      const product = req.body
      collection.insertMany(product)
      .then(result=>{
         res.send(result.insertedCount > 0)
      })
  })

  app.post('/orderedProduct',(req,res)=>{
    const ordered = req.body
    ordersCollection.insertMany([ordered])
    .then(result=>{
       res.send(result.insertedCount > 0)
    })
})
  app.get('/products',(req,res)=>{
      collection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })
  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
})
app.post('/productsWithKeys',(req,res)=>{
    const keys = req.body
    collection.find({key:{$in:keys}})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})
})




app.listen(port)
