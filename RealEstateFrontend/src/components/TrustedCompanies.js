import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import './TrustedCompanies.css';

const TrustedCompanies = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleVisitClick = () => {
    navigate('/visit');
  };

  return (
    <div className="trusted-companies">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="trusted-companies-content">
        <h1>
          {intl.formatMessage({ id: 'trusted_companies_title' })}
        </h1>
        <p>
          {intl.formatMessage({ id: 'trusted_companies_description' })}
        </p>
      </div>
      <div className="trusted-companies-button-container">
        <button className="visit-button" onClick={handleVisitClick}>
          {intl.formatMessage({ id: 'visit_button_text' })}
        </button>
      </div>

      <div className="trusted-companies-logos">
        <img src="/images/cty1-removebg-preview.png" alt="ProLine" />
        <img src="/images/cty2-removebg-preview.png" alt="Flash" />
        <img src="/images/cty3-removebg-preview.png" alt="Snowflake" />
        <img src="/images/cty4-removebg-preview.png" alt="DevWise" />
        <img src="/images/cty5-removebg-preview.png" alt="HiTech" />
        <img src="/images/cty6-removebg-preview.png" alt="Invert" />
      </div>
      <hr />
    </div>
  );
};

export default TrustedCompanies;
