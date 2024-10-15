import React, { useState, useEffect } from 'react';

const RentalList = () => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetch("/api/rentals")
      .then(response => response.json())
      .then(data => setRentals(data))
      .catch(error => console.error("Error fetching rentals:", error));
  }, []);

  return (
    <div>
      <h2>Danh sách hợp đồng cho thuê</h2>
      <table>
        <thead>
          <tr>
            <th>Bất động sản</th>
            <th>Người thuê</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map(rental => (
            <tr key={rental.id}>
              <td>{rental.propertyId}</td>
              <td>{rental.tenantId}</td>
              <td>{rental.startDate}</td>
              <td>{rental.endDate}</td>
              <td>{rental.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
