import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();

    return (  
       <section className='hero-section'>
        <div className='container'>
            <div className='row align-items-center'>
                <div className='col-lg-6 fade-in-up'>
                    <span className="badge bg-success mb-3 px-3 py-2 rounded-pill">100% Pure & Fresh</span>
                    <h1 className='display-3 fw-bold mb-4' style={{ color: '#1b5e20', lineHeight: '1.2' }}>
                        Fresh Dairy Products <br /> 
                        <span className='text-success'>Directly to You</span>
                    </h1>
                    <p className='lead mb-5 text-muted' style={{ fontSize: '1.2rem' }}>
                        Experience the purity and tradition of Warana Milk products. 
                        Bringing nature's finest dairy from our farms to your doorstep.
                    </p>
                    <div className="d-flex gap-3">
                        <button
                            className="shop-btn"
                            onClick={() => navigate("/daily-products")}
                        >
                            Shop Now
                        </button>
                        <button
                            className="btn btn-outline-success rounded-pill px-4 py-3 fw-bold"
                            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Categories
                        </button>
                    </div>
                    <div className="mt-5 d-flex gap-4 align-items-center">
                        <div>
                            <h4 className="fw-bold mb-0">50k+</h4>
                            <p className="text-muted mb-0">Happy Customers</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: '#ddd' }}></div>
                        <div>
                            <h4 className="fw-bold mb-0">20+</h4>
                            <p className="text-muted mb-0">Dairy Varieties</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 text-center mt-5 mt-lg-0'>
                    <div className="position-relative">
                        <div className="hero-blob"></div>
                        <img 
                            src='/media/images/HomePhoto.png' 
                            alt='Fresh Milk Products' 
                            className="img-fluid float-img position-relative z-1"
                            style={{ maxWidth: '90%' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Warana+Dairy'; }}
                        />
                    </div>
                </div>
            </div>
        </div>
        <style>{`
            .hero-blob {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                height: 400px;
                background: #e8f5e9;
                border-radius: 50%;
                filter: blur(40px);
                z-index: 0;
            }
        `}</style>
       </section>
    );
}

export default Hero;
