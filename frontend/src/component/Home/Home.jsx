import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import Product from "./Product";
import "./Home.css";
import Metadata from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import { getalldata } from "../../Actions/productaction";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getalldata());
  }, [dispatch]);

  const data = useSelector((state) => {
    console.log("hello", state.products.products);

    return state.products.products;
  });

  const { loading, error, products } = useSelector((state) => state.products);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title="Ecommerce" />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>Find Amazing Products below</h1>
            <a href="/#container">
              <button>
                scroll <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {data.product?.map((ele) => (
              <Product key={ele._id} product={ele} />
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
