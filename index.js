/** Сервер */
const express = require('express');
/** Сокращение пути и более легкого получения доступа к файлам */
const path = require('path');
/** Защита сервера присваиванием токена */
const csrf = require('csurf');
/** Серверные сообщения, которые отображаются только один раз */
const flash = require('connect-flash');
/** База данных */
const mongoose = require('mongoose');
/** Защита Express приложения, устанавливая различные HTTP заголовки */
const helmet = require('helmet');
/** Сжиматель кода*/
const compression = require('compression');
/** Поддержка handlebars в экспрессе*/
const exphbs = require('express-handlebars');
/** handlebars */
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
/** Сессии */
const session = require('express-session');
/** База данных */
const MongoStore = require('connect-mongodb-session')(session);
/** РОУТЕРЫ  */
/** Домашная страница */
const homeRoutes = require('./routes/home');
/** */
const cardRoutes = require('./routes/card');
/** Список курсов */
const coursesRoutes = require('./routes/courses');
/** Добавление курса */
const addRoutes = require('./routes/add');
/** Корзина */
const orderRoutes = require('./routes/order');
/** Авторизация */
const authRoutes = require('./routes/auth');
/** Личнаяяя страница */
const profileRoutes = require('./routes/profile');
/** САМОПИСАНЫЕ middleaware */
const varMiddleware = require('./middleaware/variables');
const userMiddleware = require('./middleaware/user');
const errorHandler = require('./middleaware/error');
const fileMiddleware = require('./middleaware/file');
const keys = require('./keys')

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
});
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_IRI
})

//
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('5fab13d0818a5104ec1e64fc');
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// })

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_IRI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: 'AqVadPlay@yandex.ru',
    //     name: 'EliBro',
    //     cart: { items: [] }
    //   });
    //   await user.save();
    // };

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();