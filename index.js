const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add')

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes)


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://AqVadPlay:sWpyPeH2vvqfAEOd@cluster0.yb8wm.mongodb.net/Cluster0?retryWrites=true&w=majority';
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
};

start();