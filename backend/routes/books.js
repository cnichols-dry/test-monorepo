const express = require('express');
const booksController = require('../controllers/books');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('',booksController.getBooks);
router.get('/:id',booksController.getBook);
router.get('/cart/:userId',checkAuth,booksController.getCart);
router.post('',checkAuth,booksController.createBook);
router.post('/cart/:id',checkAuth,booksController.addToCart);
router.put('/cart/:id',checkAuth,booksController.clearCart);
router.put('/:id',checkAuth,booksController.updateBook);
router.delete('/cart/:id',checkAuth,booksController.removeFromCart);
router.delete('/:id',checkAuth,booksController.deleteBook);

module.exports = router;