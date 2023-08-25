import React, { Fragment, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getproductdetails } from "../../Actions/productaction";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactStars from "react-rating-stars-component";

function ProductDetails() {
  const params = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("ID: ", params);
    dispatch(getproductdetails(params.id));
  }, [dispatch, params]);

  const data = useSelector((state) => {
    console.log("hii", state.productDetails);
    console.log(params.id);
    return state.productDetails.product.product;
  });
  const width = window.innerWidth;
  const options = {
    edit: false,
    color: "grey",
    activecolor: "tomato",
    size: width < 500 ? 10 : 15,
    value: data?.ratings,
    isHalf: true,
  };

  return (
    <Fragment>
      <div className="productdetials">
        <div>
          <Carousel>
            {data &&
              data.images &&
              data.images?.map((item, i) => (
                <Carousel.Item key={item.url}>
                  {console.log(item)}
                  <img
                    src={item.url}
                    alt={`${i} slide`}
                    className="CarouselImage"
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
        <div className="detail_block1">
          <h2>{data?.name}</h2>
          <p>Product #{params.id}</p>
        </div>
        <div className="detail_block2">
          <ReactStars {...options} />

          <span>{`(${data?.reviews.length} reviews)`}</span>

          <h1>{`₹${data?.price}`}</h1>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductDetails;
