import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái cho loader

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu quá trình gửi yêu cầu

    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userName, 
          password,
          confirmPassword,
          // passwordHash: password, // Gửi mật khẩu gốc
          email, 
          phoneNumber, 
          role,
          isTwoFactorEnabled: false, // Giá trị mặc định
          isActive: true // Giá trị mặc định
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data:', errorData); // In ra thông tin lỗi trong console
        setError(errorData.message || 'Đăng ký thất bại.');
      } else {
        setError('');
        alert('Đăng ký thành công');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false); // Kết thúc quá trình
    }
  };

  return (
    <form onSubmit={handleRegister} className="form">
      <div>
        <label htmlFor="userName" className="label">Tên người dùng:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          autoComplete="username"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">Mật khẩu:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">Xác nhận mật khẩu:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="label">Số điện thoại:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          autoComplete="tel"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="role" className="label">Vai trò:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="select"
          autoComplete="off"
        >
          <option value="Owner">Chủ bất động sản</option>
          <option value="Tenant">Người thuê</option>
          <option value="Manager">Quản lý</option>
        </select>
      </div>

      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default RegisterForm;