import React from 'react';
import Hero from  './Hero';
import Footer from '../Footer';
import AuthoritySection from './AuthoritySection';
import ProductsSection from './ProductsSection';


function HomePage() {
    return (  
        <>
       
        <Hero/>
        <AuthoritySection/>
        <ProductsSection/>
        <Footer/>
        </>
    );
}

export default HomePage;
