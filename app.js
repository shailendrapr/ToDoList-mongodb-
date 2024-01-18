//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect("mongodb+srv://admin-shailendra:test123@cluster0.mxiadmi.mongodb.net/todolistDB");




const itemsSchema={
  name:String
}

const listSchema={
  name:String,
  items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);

const Item=mongoose.model("Item",itemsSchema);
const item1= new Item({
  name:"welcome to your to do list"
})
const item2= new Item({
  name:"Hit + to add"
})
const item3= new Item({
  name:"<-- hit this to delete"
})
const defaultItems=[item1,item2,item3];

const ele=[];
ele.push("hello");
app.get("/", function(req, res) {
  Item.find({}).then((result)=>{
    if(result.length===0)
    {
Item.insertMany(defaultItems).then((result)=>{
  //console.log(result);
}).catch((err) => {
  console.error(err);
});
res.redirect("/");
    }
    else{
    res.render("list", {listTitle: "Today", newListItems: result});}
    })
  })
  

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listname=req.body.list;
 
  const newdoc=new Item({
    name:itemname
  });
  if(listname==="Today")
  {
  newdoc.save();
  //Item.create(newdoc).then((res)=>{}).catch((err)=>{console.log(err)});

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
    res.redirect("/");}
    else{
      List.findOne({name:listname}).then((result)=>{
        result.items.push(newdoc);
        result.save();
        res.redirect("/"+listname);
      })
    }
  
});

app.post("/delete",function(req,res)
{
 const id=req.body.newlname;
 const listName=req.body.listName
 if(listName==="Today"){
 Item.findByIdAndDelete(id).then((res)=>{

 });
 res.redirect("/");}
 else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}}).then((result)=>{console.log(result)});
  res.redirect("/"+listName);
 }
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
app.get("/:customListName",function(req,res)
{
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName}).then((rese)=>
  {
    if(!rese)
    {  const list= new List({
      name: customListName,
      items:defaultItems
    });
  
    list.save();
  res.redirect("/"+customListName); }
  else
  res.render("list", {listTitle: rese.name, newListItems: rese.items});
  })




})


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
