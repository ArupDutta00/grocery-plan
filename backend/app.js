const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/grocery_database', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const Schema = new mongoose.Schema({

    groceryItem: {
        type: String,
        required: true
    },
    isPurchased: {
        type: Boolean,
        required: true,
        default: false
    }

}, { versionKey: false });

var GroceryList = mongoose.model('GroceryList', Schema);

app.post('/grocery/add', (req, res)=>{

    var GroceryData = new GroceryList({
        groceryItem: req.body.groceryItem,
        isPurchased: req.body.isPurchased });

    GroceryData.save().then((docs) => {
        console.log("Success", docs);
        res.json({result:"success"});
    }, (err) => {
        res.json(err)
    });
});

app.get('/grocery/getAll', (req, res) => {
    GroceryList.find().then((data) =>{res.json(data) }
    ,(err)=>{
        res.json(err);
    });
});

app.put('/grocery/updatePurchaseStatus', (req, res) => {
    GroceryList.findOneAndUpdate({ _id: req.body._id }, { isPurchased: req.body.isPurchased }, { returnOriginal: false }).then((result) => {
        res.json(result)
              
    })
});
app.delete('/grocery/deleteGroceryItem',(req, res) => {
    GroceryList.deleteOne({ _id: req.body._id }).then((result) => {
        res.json({result:"Success"})
               
    })
});

app.listen('3001',()=>{console.log("Server is running on 3001");
});


