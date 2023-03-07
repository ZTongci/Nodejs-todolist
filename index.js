const { request } = require("express");
const express = require("express");
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);


function titleCase(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }



let app = express();
let items = [];


mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true});


app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


const itemSchema = new mongoose.Schema({
    name: String
  });

const itemModle = mongoose.model("items", itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items:Object
  });

const listModle = mongoose.model("lists", listSchema);

// get now weekdat
let today =new Date();
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
let currentday = today.toLocaleDateString('en-us', options);


app.get("/", function (request, response){

    listModle.find({}, function(err, result){
        if(result.length == 0){
            const item = new itemModle({name: "Please add item↓"});
            const lists = new listModle({name: currentday, items: item});
            lists.save();
            response.redirect("/")
        }
        else{
            response.render("list", {kindOfDay: result, items: result}); 
        }
        
    }); 
    
        }
);
    


app.get("/:listname", function (request, response){
    listModle.find({}, function(err, result){
        title = [{name: titleCase(request.params.listname)}]
        let juge = 0;
        result.forEach(element => {
            if(element.name == titleCase(request.params.listname)){
                juge += 1;
            }


        });
        if(0==juge){
            const item = new itemModle({name: "Please add item↓"});
            const lists = new listModle({name: titleCase(request.params.listname), items: item});
            lists.save();
            response.redirect("/"+request.params.listname);
        }
        else{response.render("list", {kindOfDay: title, items: result});}
        
    });
});


app.post("/", function(request, response){
    const item = new itemModle({name: request.body.newItem});

    if(request.body.hidden != currentday){
        const lists = new listModle({name: request.body.hidden, items: item});
        lists.save();
        response.redirect("/"+request.body.hidden);
    }
    else{    
        const lists = new listModle({name: currentday, items: item});
        lists.save();
    response.redirect("/");}

    

});


app.post("/delete", function(request, response){
    
    listModle.findByIdAndRemove({_id: request.body.checkbox}, function(err, result){
    });

        if(request.body.hidden != currentday){response.redirect("/"+request.body.hidden);}
        else{response.redirect("/");}
 });

    



app.listen(3000, function (){
    console.log("Success start from prot 3000");
});

