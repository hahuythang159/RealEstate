import React, { useState, useEffect } from 'react';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("API_URL_HERE/bookings")
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error("Error fetching bookings:", error));
  }, []);

  return (
    <div>
      <h2>Danh sách đặt chỗ</h2>
      <table>
        <thead>
          <tr>
            <th>Bất động sản ID</th>
            <th>Người dùng ID</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.propertyId}</td>
              <td>{booking.userId}</td>
              <td>{booking.startDate}</td>
              <td>{booking.endDate}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
