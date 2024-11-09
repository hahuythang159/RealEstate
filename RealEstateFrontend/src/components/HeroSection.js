import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h2 className="subtitle">Top-Notch Real Estate Properties</h2>
                <h1 className="title">Find Your Dream Home</h1>
                <div className="search-bar">
                    <input type="text" placeholder="What are you looking for?" />
                    <select>
                        <option>Category</option>
                    </select>
                    <select>
                        <option>Location</option>
                    </select>
                    <button>Search Property</button>
                </div>
            </div>
            <div className="hero-image">
                <img src="/images/anh1.jpg" alt="Modern House" />
            </div>
        </section>
    );
};

export default HeroSection;
