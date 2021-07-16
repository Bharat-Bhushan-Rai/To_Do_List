const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose= require("mongoose");

const app= express();

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistdb",{useUnifiedTopology:true,useNewUrlParser:true});

const nameschema= new mongoose.Schema({
    name:String
});

const Item= mongoose.model("Item",nameschema);
const Newitem = mongoose.model("Newitem",nameschema);

const item1 = new Item(
    {name:"Welcome to TO Do List"}
    );
const item2 = new Item(
    {name:"Click On + button to add item"}
    );


const default_item= [item1,item2];


var options = { weekday: 'long',  month: 'long', day: 'numeric' };
var today  = new Date();
let day=today.toLocaleDateString("en-US", options);

// let works=[];
app.get("/",function(req,res)
{
    Item.find({},function(err,founditems)
    {
        if(err)
        {
            console.log(err);
        }
        else 
        {
    
            if(founditems.length ===0)
            {
                Item.insertMany(default_item,function(err)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("Runnning succesfully");
                        
                    }
                })
            }
            res.render('index',{day:day,founditems:founditems});
        }
    })
    // Item.find({},function(err,founditems)
    // {
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {

    //     }
    // })
})




app.post("/",function(req,res)
{
    let itemname = req.body.work;
    const item= new Item({name:itemname});
    item.save();
    // res.render('index',{day:day,works:works});
    res.redirect("/");
})

app.post("/delete",function(req,res)
{
    
    // console.log(req.body); 
    const checkeditemid= req.body.checkbox;
    Item.findByIdAndRemove(checkeditemid,function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Deleted Successfully");
        }
    })
    res.redirect("/");
})


app.listen(3000,function()
{
    console.log("Server is running at 3000");
})