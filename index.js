
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const ejs = require('ejs')
const path = require('path')


app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))







app.use(express.json());
app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json())
app.set("view engine", "ejs")



//create and connect to  db

const MongoURI = 'mongodb+srv://lydia:muna19@cluster0.mw7lp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'||'mongodb://localhost:27017/contact';

mongoose.connect(MongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    
},(err)=>{
    if(err){
        console.log(err)
    }else{console.log('DATABASE CONNECTION IS SUCCESSFULL')}
    
})

  

//create schema

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true

    },
    email:{
        type:String,
        require:true

    },
    comment:{
        type:String,
        require:true
    }

    
});
 const Contact = mongoose.model('Contact',contactSchema);


 app.get('/',(req,res)=>{
   return res.render("app")
 })


 //create user record
app.post('/contact',(req,res)=>{
    //check is record exist
    Contact.findOne({name:req.body.name},(err,existingContact)=>{
        if(err){
            return res.status(500).json({ err })
        }else if(existingContact){
            return res.status(401).send({ message :'contact exists'})
        }
    })

    Contact.create({
        name:req.body.name,
        email:req.body.email,
        comment:req.body.comment,
        


    },(err,newContact)=>{
        if(err){
            return res.status(500).json({ err })
        }else{
            newContact.save((err,savedContact)=>{
                if(err){
                    return res.status(500).json({ err })
                }else{
                    return res.render("contact",{newContact})
                    
                }

            })
        
        }
    })


})

app.listen(port,()=>{
    console.log(`the server is listening on port : ${port}`)})



