import React from "react";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import Home from "./component/Home/Home.jsx";
import { useSelector } from "react-redux";
import Loader from "./component/layout/loader/loader";
import ProductDetails from "./component/Product/ProductDetails.jsx";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  React.useEffect(() => {
    webfont.load({
      families: ["Roboto", "Droid Sans", "Chilanka"],
    });
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/products/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
