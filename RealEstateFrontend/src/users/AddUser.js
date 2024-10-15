import React, { useState } from 'react';

const AddUser = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant'); // Giá trị mặc định

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      userName,
      password,
      role,
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('Thêm người dùng thành công');
        setUserName('');
        setPassword('');
        setRole('tenant');
      } else {
        alert('Thêm người dùng thất bại');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="owner">Chủ bất động sản</option>
          <option value="tenant">Người thuê</option>
          <option value="manager">Quản lý</option>
        </select>
      </div>
      <button type="submit">Thêm người dùng</button>
    </form>
  );
};

export default AddUser;
