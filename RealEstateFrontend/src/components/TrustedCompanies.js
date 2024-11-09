import React from 'react';
import './TrustedCompanies.css';

const TrustedCompanies = () => {
  return (
    <div className="trusted-companies">
      <div className="trusted-companies-content">
        <h1>1,230+ Companies<br />Trust us.</h1>
        <p>
          Turning homes into dreams as your go-to real estate agent. You can rely on us to help you find a safe home. 
          745,000 houses and flats for sale, rent, or mortgage.
        </p>
        <button className="visit-button">Request a visit →</button>
      </div>
      <div className="trusted-companies-logos">
        <img src="/images/LogoRealEstate.png" alt="ProLine" />
        <img src="/images/LogoRealEstate.png" alt="Flash" />
        <img src="/images/LogoRealEstate.png" alt="Snowflake" />
        <img src="/images/LogoRealEstate.png" alt="DevWise" />
        <img src="/images/LogoRealEstate.png" alt="HiTech" />
        <img src="/images/LogoRealEstate.png" alt="Invert" />
      </div>
    </div>
  );
};

export default TrustedCompanies;
