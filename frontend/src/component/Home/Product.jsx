import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
const Product = ({ product }) => {
  const width = window.innerWidth;
  const options = {
    edit: false,
    color: "grey",
    activecolor: "tomato",
    size: width < 500 ? 10 : 15,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <Link className="productCard" to={`/products/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />

        <span>{`(${product.reviews.length} reviews)`}</span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default Product;
