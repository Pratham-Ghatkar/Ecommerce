const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerror");
const Apifeatures = require("../utils/apifeatures");

// create product -- admin
exports.createProduct = catchAsyncerrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const products = await Product.create(req.body);
  res.status(201).json({
    success: true,
    products,
  });
});
// get all product
exports.getAllProducts = catchAsyncerrors(async (req, res) => {
  const resultperpage = 8;
  const productcount = await Product.countDocuments();
  const apifeatures = new Apifeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultperpage);
  const product = await apifeatures.query;
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
    productcount,
  });
});
// Update products -- admin
exports.updateProducts = catchAsyncerrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "successfully updated",
    product,
  });
});
//  Delete product

exports.deleteProducts = catchAsyncerrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "deleted successfully",
  });
});

// get product details
exports.getProductDetails = catchAsyncerrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  // console.log("hii");
  // console.log(product);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// create new review or update a review
exports.createProductReview = catchAsyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(req.body.productId);

  const isreviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isreviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfreview = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
//  get all reviews of a product
exports.getProductReview = catchAsyncerrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// Delete reviews
exports.deleteProductReview = catchAsyncerrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfreview = reviews.length;
  await Product.findByIdAndUpdate(
    product._id,
    {
      reviews,
      ratings,
      numOfreview,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
  });
});
