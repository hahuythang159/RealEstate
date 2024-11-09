import React from 'react';
import { Helmet } from 'react-helmet';
import './VisitPage.css';
import Footer from '../pages/Footer';

const VisitPage = () => {
  return (
    <section className="visit-page">
      <Helmet>
        <title>Khám Phá Các Công Ty Tin Cậy</title>
        <meta
          name="description"
          content="Khám phá các công ty hàng đầu và bất động sản đẳng cấp."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="page-header">
        <p>
          Khám phá những công ty hàng đầu và các bất động sản tuyệt vời của
          chúng tôi!
        </p>
      </div>

      <div className="companies-section">
        <h2>Các Công Ty Hàng Đầu</h2>
        <div className="companies-list">
          <div className="company">
            <img src="/images/cty1-removebg-preview.png" alt="ProLine logo" />
            <p>ProLine - Giải pháp công nghệ tối ưu cho bất động sản.</p>
          </div>
          <div className="company">
            <img src="/images/cty2-removebg-preview.png" alt="Flash logo" />
            <p>Flash - Trải nghiệm tuyệt vời cho khách hàng tìm nhà.</p>
          </div>
          <div className="company">
            <img src="/images/cty3-removebg-preview.png" alt="Snowflake logo" />
            <p>Snowflake - Giải pháp tài chính cho giao dịch bất động sản.</p>
          </div>
          <div className="company">
            <img src="/images/cty4-removebg-preview.png" alt="DevWise logo" />
            <p>DevWise - Công nghệ tiên tiến trong bất động sản.</p>
          </div>
          <div className="company">
            <img src="/images/cty5-removebg-preview.png" alt="HiTech logo" />
            <p>HiTech - Dễ dàng tìm kiếm bất động sản qua công nghệ.</p>
          </div>
          <div className="company">
            <img src="/images/cty6-removebg-preview.png" alt="Invert logo" />
            <p>Invert - Đầu tư bất động sản hiệu quả và thông minh.</p>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default VisitPage;
