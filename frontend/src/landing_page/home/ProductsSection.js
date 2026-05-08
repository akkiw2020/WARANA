import React from "react";
import { useNavigate } from "react-router-dom";

function ProductsSection() {
  const navigate = useNavigate();

  const products = [
    { name: "Ice Cream", image: "/media/images/Icecream.png", path: "/icecream", desc: "Creamy delights in various flavors." },
    { name: "Water Bottles", image: "/media/images/Waterbottle.png", path: "/waterbottle", desc: "Pure and refreshing drinking water." },
    { name: "Mix Fruit Jam", image: "/media/images/MixFruits.png", path: "/fruitsMix", desc: "Fresh fruit combinations and jams." },
    { name: "Biscuits", image: "/media/images/Biscuits.png", path: "/biscuits", desc: "Crunchy and delicious tea-time snacks." },
    { name: "Festival Specials", image: "/media/images/FestivalSpecial.png", path: "/festival", desc: "Celebrate with our traditional sweets." },
    { name: "Flavoured Milk", image: "/media/images/FlavouredMilk.png", path: "/flavoured", desc: "Nutritious milk with a tasty twist." },
  ];

  return (
    <div className="products-section py-5" id="products">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h6 className="text-success fw-bold text-uppercase ls-1">Our Categories</h6>
          <h2 className="display-5 fw-bold" style={{ color: '#1b5e20' }}>What Are You Looking For?</h2>
          <div style={{ width: '80px', height: '4px', background: '#1b5e20', margin: '15px auto' }}></div>
        </div>
        
        <div className="row g-4">
          {products.map((product, index) => (
            <div className="col-lg-4 col-md-6 mb-4" key={index}>
              <div className="product-card h-100">
                <div className="product-img-wrapper mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                  />
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1b5e20' }}>{product.name}</h4>
                <p className="text-muted mb-4 small">{product.desc}</p>
                <button
                  className="product-btn"
                  onClick={() => navigate(product.path)}
                >
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .ls-1 { letter-spacing: 2px; }
        .product-img-wrapper {
            background: #f1f8e9;
            border-radius: 20px;
            padding: 20px;
            transition: 0.3s;
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .product-card:hover .product-img-wrapper {
            background: #e8f5e9;
        }
      `}</style>
    </div>
  );
}

export default ProductsSection;
