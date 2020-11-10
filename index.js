const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5fab13d0818a5104ec1e64fc');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes)


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://AqVadPlay:sWpyPeH2vvqfAEOd@cluster0.yb8wm.mongodb.net/shop';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'AqVadPlay@yandex.ru',
        name: 'EliBro',
        cart: { items: [] }
      });
      await user.save();
    };

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();