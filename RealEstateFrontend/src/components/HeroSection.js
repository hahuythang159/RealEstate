import React from 'react';
import './HeroSection.css';
import Statistics from './Statistics';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2 className="subtitle">Bất động sản hàng đầu</h2>
        <h1 className="title">Tìm căn nhà mơ ước của bạn</h1>
        <div className="search-bar">
          <input type="text" placeholder="What are you looking for?" />
        </div>
        <Statistics/>

      </div>

      <div className="hero-image">
        <img src="/images/batdongsan1.png" alt="Modern House" />
      </div>

    </section>
    
  );
};

export default HeroSection;
