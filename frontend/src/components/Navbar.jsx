import React from "react";
import '../App.css';

const Navbar = ({ categories }) => {

  return (
    <div className="category-lists">
      {categories?.map((item, index) => {
        return (
          <div className="category-name" key={index}>
            <h2>{item}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default Navbar;
