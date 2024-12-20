import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import '../styles/Testimonials.css';

const testimonialsData = [
  {
    quote:
      'Tôi đã mua một số sách từ trang web của TTP và rất hài lòng với trải nghiệm mua hàng của mình. Giao hàng nhanh chóng và sách đến trong tình trạng tốt nhất.',
    name: 'Hà Huy Chiến Thắng',
    position: 'Quản lý Sản phẩm và SEO của Samsung',
    image: '/images/a1.jpg',
  },
  {
    quote:
      'Sản phẩm trên trang web của TTP đa dạng và phong phú. Tôi luôn tìm thấy những cuốn sách mới và thú vị để đọc mỗi khi ghé thăm.',
    name: 'Nguyễn Văn Anh',
    position: 'Nhà phát triển Ứng dụng Di động, Apple',
    image: '/images/a2.jpg',
  },
  {
    quote:
      'Đội ngũ nhân viên của TTP rất chuyên nghiệp và nhiệt tình. Họ luôn sẵn lòng giúp đỡ và tư vấn cho tôi về các cuốn sách phù hợp với sở thích của mình.',
    name: 'Trần Thị Hương',
    position: 'Giám đốc Tiếp thị, Facebook',
    image: '/images/a3.jpg',
  },
  {
    quote:
      'Dịch vụ khách hàng của TTP thực sự ấn tượng. Tôi đã gặp một vấn đề nhỏ khi đặt hàng và họ đã giải quyết nhanh chóng và hiệu quả.',
    name: 'Lê Đình Hải',
    position: 'Trưởng Nhóm Kinh doanh, Amazone',
    image: '/images/a4.jpg',
  },
  {
    quote:
      'Tôi thích cách TTP tổ chức trang web của họ. Rất dễ dàng để tìm kiếm và đặt hàng, không gặp bất kỳ vấn đề nào.',
    name: 'Phạm Thị Mai',
    position: 'Quản lý Sản phẩm, Google',
    image: '/images/a5.jpg',
  },
  {
    quote:
      'Sách của TTP luôn có chất lượng cao và giá cả phải chăng. Tôi đã mua nhiều lần và không hề thất vọng.',
    name: 'Nguyễn Minh Tuấn',
    position: 'Giám đốc Phát triển Sản phẩm, Microsoft',
    image: '/images/a6.jpg',
  },
];

const Testimonials = () => {
  const intl = useIntl(); // Sử dụng hook useIntl để lấy các chuỗi dịch
  const testimonialsWrapperRef = useRef(null);
  const testimonialsRef = useRef([]);

  useEffect(() => {
    const testimonialsWrapper = testimonialsWrapperRef.current;
    const testimonials = testimonialsRef.current;
    const testimonialHeight = testimonials[0]?.offsetHeight + 20;
    let scrollAmount = 0;
    const wrapperHeight = testimonialsWrapper.scrollHeight;

    testimonials.forEach((testimonial) => {
      const clone = testimonial.cloneNode(true);
      testimonialsWrapper.appendChild(clone);
    });

    function scrollTestimonials() {
      scrollAmount += 0.5;
      if (scrollAmount >= wrapperHeight / 2) {
        scrollAmount = 0;
      }
      testimonialsWrapper.style.transform = `translateY(-${wrapperHeight / 2 - scrollAmount}px)`;
      requestAnimationFrame(scrollTestimonials);
    }

    requestAnimationFrame(scrollTestimonials);
  }, []);

  return (
    <div className="testimonials-container">
      <div className="title-section">
        <p>{intl.formatMessage({ id: 'testimonials_header' })}</p>{' '}
        {/* Dịch header "Testimonials" */}
        <h1>{intl.formatMessage({ id: 'testimonials_title' })}</h1>{' '}
        {/* Dịch tiêu đề "Các khách hàng đã nói gì?" */}
        <p>{intl.formatMessage({ id: 'testimonials_description' })}</p>{' '}
        {/* Dịch mô tả */}
      </div>
      <div className="testimonials-section">
        <div className="testimonials-wrapper" ref={testimonialsWrapperRef}>
          {testimonialsData.map((testimonial, index) => (
            <div
              className="testimonial"
              key={index}
              ref={(el) => (testimonialsRef.current[index] = el)}
            >
              <div className="testimonial-content">
                <p>"{testimonial.quote}"</p>
                <div className="customer-info">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>
                      {intl.formatMessage({
                        id: `testimonial_position_${index + 1}`,
                      })}
                    </span>{' '}
                    {/* Dịch vị trí của từng khách hàng */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
