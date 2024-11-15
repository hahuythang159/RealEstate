import React from 'react';
import { useIntl } from 'react-intl';
import './HeroSection.css';
import Statistics from './Statistics';

const HeroSection = () => {
  const intl = useIntl();

  return (
    <section className="hero">
      <div className="hero-content">
        <h2 className="subtitle">{intl.formatMessage({ id: 'hero_section_subtitle' })}</h2>
        <h1 className="title">{intl.formatMessage({ id: 'hero_section_title' })}</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder={intl.formatMessage({ id: 'hero_section_placeholder' })}
          />
        </div>
        <Statistics />
      </div>

      <div className="hero-image">
        <img src="/images/batdongsan1.png" alt="Modern House" />
      </div>
    </section>
  );
};

export default HeroSection;
