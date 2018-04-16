const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// map global promise - get rid of warning
//mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev').then(()=>{
  console.log("mongodb connected!!!");
}).catch((err)=>{
  console.log(err);
});

//load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');
//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//index route
app.get('/', (req,res)=>{
  res.render('index');
});

app.get('/about',(req,res)=>{
  res.render("about");
});

//add idea form
app.get('/ideas/add',(req,res)=>{
  res.render("ideas/add");
});


const port = 5000;

app.listen(port,()=>{
  console.log(`server stared on port ${port}`);
})
