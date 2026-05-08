import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Icecream from "./FruitsMix";
import Footer from "../Footer";

function FruitsHomepage() {
  const navigate = useNavigate();

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product.id || product.name.replace(/\s/g, "_"),
          productName: product.name,
          price: product.price,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to Cart ✅");
      navigate("/cart");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart");
    }
  };

  return (
    <>
      <Icecream addToCart={addToCart} />
      <Footer />
    </>
  );
}

export default FruitsHomepage;