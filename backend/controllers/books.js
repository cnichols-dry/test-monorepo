const Book = require("../models/book");
const User = require("../models/user");

exports.createBook = async (req, res, next) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    imageURL: req.body.imageURL,
    description: req.body.description,
    creator: req.userData.userId,
  });

  try {
    const createdBook = await book.save();
    res.status(201).json({
      message: "Book added successfully",
      book: {
        ...createdBook,
        id: createdBook.id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Creating a book failed",
    });
  }
};

exports.getBooks = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const bookquery = Book.find();

  if (pageSize && currentPage) {
    bookquery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  try {
    const docs = await bookquery;
    const countDocs = await Book.countDocuments();
    res.status(200).json({
      message: "Books fetched successfully",
      books: docs,
      maxBooks: countDocs,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed fetching books",
    });
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(500).json({
      message: "fetching book failed",
    });
  }
};

exports.updateBook = async (req, res, next) => {
  const book = new Book({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    imageURL: imageURL,
    description: req.body.description,
  });
  try {
    const result = await Book.updateOne({ _id: req.params.id }, book);

    if (result.n > 0) {
      res.status(200).json({
        message: "Updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not update book",
    });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const reuslt = await Book.deleteOne({ _id: req.params.id });
    if (reuslt.n > 0) {
      res.status(200).json({
        message: "Book deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "deleting book failed",
    });
  }
};

exports.addToCart = async (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.body.userId;

  try {
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    await user.addToCart(book);
    res.status(201).json({
      message: "item added to cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "adding item to cart Failed",
    });
  }
};

exports.getCart = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    const cart = user.cart.items;
    res.status(200).json({
      message: "cart fetched successfully",
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch cart",
    });
  }
};

exports.removeFromCart = async (req, res, next) => {
  const bookId = req.query.bookId;
  const userId = req.params.id;

  try {
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    await user.removeFromCart(book);

    res.status(201).json({
      message: "item removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "remove failed",
    });
  }
};

exports.clearCart = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    await user.clearCart();
    res.status(200).json({
      message: "cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "failed clearing cart",
    });
  }
};
