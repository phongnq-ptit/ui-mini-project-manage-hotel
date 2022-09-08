import React from "react";
import { Link } from "react-router-dom";
import "./Page404.css";

const Page404 = () => {
  return (
    <div className="container">
      <img
        className="ops"
        src="https://raw.githubusercontent.com/idindrakusuma/simple-404-template/f32c06a5ed4d22870edfab2802baedd9fc9ca324/assets/images/404.svg"
        alt=""
      />
      <br />
      <h3>
        The page you are looking for was not found.
        <br /> It could be because the url is wrong or not available.
      </h3>
      <br />
      <Link className="buton" to="/">
        Go Back Home
      </Link>
    </div>
  );
};

export default Page404;
