import React from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './ImageCarousel.css';

const ImageCarousel = () => {
  return (
    <Carousel
      autoplay
      autoplaySpeed={3000} // Thay đổi tốc độ tự động chạy
      dots={true} // Hiển thị các chấm chỉ dẫn
      arrows={true} // Hiển thị mũi tên điều hướng
      prevArrow={<LeftOutlined />}
      nextArrow={<RightOutlined />}
      className="custom-carousel"
    >
      <div className="carousel-item">
        <img
          src="/images/batdongsan1.png"
          alt="Slide 1"
          className="carousel-image"
        />
        <div className="carousel-caption">
          <h3>Chào mừng bạn đến với chúng tôi!</h3>
          <p>Khám phá những bất động sản tuyệt vời ngay hôm nay.</p>
        </div>
      </div>
      <div className="carousel-item">
        <img src="/images/anh2.jpg" alt="Slide 2" className="carousel-image" />
        <div className="carousel-caption">
          <h3>Giới thiệu những căn hộ đẹp nhất</h3>
          <p>Khám phá không gian sống tuyệt vời cho bạn và gia đình.</p>
        </div>
      </div>
      <div className="carousel-item">
        <img src="/images/anh3.jpg" alt="Slide 3" className="carousel-image" />
        <div className="carousel-caption">
          <h3>Bất động sản uy tín, chất lượng</h3>
          <p>
            Chúng tôi cung cấp các dịch vụ tốt nhất cho khách hàng của mình.
          </p>
        </div>
      </div>
    </Carousel>
  );
};

export default ImageCarousel;
