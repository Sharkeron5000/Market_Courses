const { body } = require('express-validator/check');
const User = require('../models/user')

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Введите корректный Email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Такой Email занят')
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6, max: 56 }).withMessage('Пароль должен быть минимум 6 символов')
    .isAlphanumeric().withMessage('Нужен корректный пароль')
    .trim(),

  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true
  })
    .trim(),

  body('name').isLength({ min: 3 }).withMessage('Имя должно иметь как минимум 3 символа')
    .trim()
];

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Введите корректный Email')
    .normalizeEmail(),

  body('password')
    .trim()
];

exports.courseValidators = [
  body('title')
    .isLength({ min: 3 }).withMessage('Минимальная длина названия 3 символа')
    .trim(),

  body('price')
    .isNumeric().withMessage('Введите корректную цену'),

  body('img')
    .isURL().withMessage('Введите корректный Url картинки')
]