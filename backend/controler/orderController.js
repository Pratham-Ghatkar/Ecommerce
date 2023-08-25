const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncerrors = require("../middleware/catchAsyncerror");
const { Error } = require("mongoose");

// create new order
exports.newOrder = catchAsyncerrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shppingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shppingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//  get single order
exports.getsingleOrder = catchAsyncerrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return -next(
      new Errorhandler(`Order not found for ${order.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//  get login user details
exports.myOrders = catchAsyncerrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders  --admin
exports.allOrders = catchAsyncerrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
// update order status -- Admin
exports.updateStatus = catchAsyncerrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new Errorhandler(`Order not found for ${order.params.id}`, 404)
    );
  }
  if (order.orderStatus === "delivered") {
    return next(
      new Errorhandler("you have already delivered this product", 404)
    );
  }
  order.orderItems.forEach(async (ord) => {
    await updatestock(ord.product, ord.quantity);
  });

  order.orderStatus = req.body.status;
  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

async function updatestock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete  order --Admin
exports.deleteOrder = catchAsyncerrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new Errorhandler(`Order not found for ${order.params.id}`, 404)
    );
  }
  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "order deleted successfully",
  });
});
