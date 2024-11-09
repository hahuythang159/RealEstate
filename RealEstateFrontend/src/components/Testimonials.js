import React, { useEffect, useRef } from 'react';
import './Testimonials.css';

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
        <p>Testimonials</p>
        <h1>Các khách hàng đã nói gì?</h1>
        <p>
          Đọc những gì khách hàng hài lòng nói về sản phẩm/dịch vụ của chúng
          tôi. Chúng tôi tự hào cung cấp dịch vụ khách hàng đặc biệt và đánh giá
          cao phản hồi của họ. Chúng tôi luôn đánh giá cao mọi phản hồi để có
          thể cải thiện hơn trong tương lai. Cảm ơn quý khách đã tin tưởng và
          ủng hộ chúng tôi!
        </p>
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
                    <span>{testimonial.position}</span>
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
