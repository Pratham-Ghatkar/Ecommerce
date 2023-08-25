import React from "react";
import playstore from "../../../images/playstore.png";
import appstore from "../../../images/Appstore.png";
import "../Footer/footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftfooter">
        <h4>Download our AP4</h4>
        <p>Download app from android & Ios mobile phone</p>
        <img src={playstore} alt="playstore" />
        <img src={appstore} alt="Appstore" />
      </div>
      <div className="midfooter">
        <h1>ECOMMERCE</h1>
        <p>High quality is our first priority</p>
        <p>Copyright 2023 &copy; Pratham Ghatkar</p>
      </div>
      <div className="rightfooter">
        <h4>Follow us</h4>
        <a href="http://instagram.com/pratham_ghatkar">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
