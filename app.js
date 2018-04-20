const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// map global promise - get rid of warning
//mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev').then(()=>{
  console.log("mongodb connected!!!");
}).catch((err)=>{
  console.log(err);
});

//load idea model.
require('./models/Idea');
const Idea = mongoose.model('ideas');
//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//index route
app.get('/', (req,res)=>{
  res.render('index');
});

app.get('/about',(req,res)=>{
  res.render("about");
});

//idea index page
app.get('/ideas',(req,res)=>{
  Idea.find({}).sort({date:"desc"})
  .then(ideas=>{
    res.render("ideas/index", {ideas});
  })

});
//add idea form
app.get('/ideas/add',(req,res)=>{
  res.render("ideas/add");
});
//edit idea form
app.get('/ideas/edit/:id',(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  }).then(idea=>{
    res.render("ideas/edit",{ idea });
  })

})

//process form
app.post('/ideas',(req,res)=>{
  let errors = [];
  if (!req.body.title){
    errors.push({text:"please add a title"})
  }
  if (!req.body.details){
    errors.push({text:"please add some details"})
  }
  if(errors.length>0){
    console.log("!!!",req.body);
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      details:req.body.details
    })
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea=>{
      res.redirect('/ideas')
    });
  }

});


const port = 5000;

app.listen(port,()=>{
  console.log(`server stared on port ${port}`);
})
