import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks để nhận state và điều hướng

function ContractTerms() {
  const location = useLocation();
  const { rentalData } = location.state; // Nhận dữ liệu từ trang AddRental
  const [agreeViolation, setAgreeViolation] = useState(false);
  const [agreeObligations, setAgreeObligations] = useState(false);
  const [agreeMaintenance, setAgreeMaintenance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAgree = () => {
    if (!agreeViolation || !agreeObligations || !agreeMaintenance) {
      setMessage('Bạn phải đồng ý với tất cả các điều khoản.');
      return;
    }

    setLoading(true);

    // Gửi dữ liệu hợp đồng
    fetch('/api/rentals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rentalData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Lỗi khi thêm hợp đồng.');
        }
        return response.json();
      })
      .then((data) => {
        setMessage('Hợp đồng đã được thêm thành công.');
        navigate('/success'); // Chuyển hướng tới trang thông báo thành công
      })
      .catch((error) => {
        console.error('Error adding rental:', error);
        setMessage('Có lỗi xảy ra khi thêm hợp đồng. Vui lòng thử lại.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Điều khoản hợp đồng</h2>
      <div>
        <h4>Phạt vi phạm hợp đồng:</h4>
        <p>... (Chi tiết về phạt vi phạm)</p>
        <input
          type="checkbox"
          checked={agreeViolation}
          onChange={() => setAgreeViolation(!agreeViolation)}
        />
        <label>Tôi đồng ý với điều khoản phạt vi phạm.</label>
      </div>

      <div>
        <h4>Cam kết và nghĩa vụ:</h4>
        <p>... (Chi tiết về cam kết và nghĩa vụ)</p>
        <input
          type="checkbox"
          checked={agreeObligations}
          onChange={() => setAgreeObligations(!agreeObligations)}
        />
        <label>Tôi đồng ý với điều khoản cam kết và nghĩa vụ.</label>
      </div>

      <div>
        <h4>Điều khoản bảo dưỡng:</h4>
        <p>... (Chi tiết về bảo dưỡng)</p>
        <input
          type="checkbox"
          checked={agreeMaintenance}
          onChange={() => setAgreeMaintenance(!agreeMaintenance)}
        />
        <label>Tôi đồng ý với điều khoản bảo dưỡng.</label>
      </div>

      <button onClick={handleAgree} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Hoàn tất Hợp Đồng'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ContractTerms;
