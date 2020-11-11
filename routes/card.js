const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
})

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart)
  const cart = {
    courses, price: computePrice(courses)
  };
  res.status(200).json(cart);
})

router.get ('/', async (req, res) => {
  // const card = await Card.fetch();
  // res.render('card', {
  //   title: 'Корзина',
  //   isCard: true,
  //   courses: card.courses,
  //   price: card.price,
  // })
  res.json({test:true})
})

module.exports = router;