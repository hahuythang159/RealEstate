import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import './TrustedCompanies.css';

const TrustedCompanies = () => {
  const navigate = useNavigate();
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
          1,230+ Công ty
          <br />
          tin tưởng chúng tôi
        </h1>
        <p>
          Biến những ngôi nhà thành giấc mơ với tư cách là đại lý bất động sản
          mà bạn mong muốn. Bạn có thể tin cậy vào chúng tôi để giúp bạn tìm
          được một ngôi nhà an toàn. 745.000 ngôi nhà và căn hộ để bán, cho thuê
          hoặc thế chấp.
        </p>
      </div>
      <div className="trusted-companies-button-container">
        <button className="visit-button" onClick={handleVisitClick}>Yêu cầu ghé thăm →</button>
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
