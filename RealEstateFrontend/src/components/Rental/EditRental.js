import React, { useState, useEffect } from 'react';

function EditRental({ id }) {
  const [rentalData, setRentalData] = useState({
    propertyId: '',
    tenantId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetch(`/api/rentals/${id}`)
      .then(response => response.json())
      .then(data => setRentalData(data))
      .catch(error => console.error('Error fetching rental:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/rentals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rentalData),
    })
      .then(() => {
        console.log('Rental updated');
      })
      .catch(error => console.error('Error updating rental:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Property ID"
        value={rentalData.propertyId}
        onChange={(e) => setRentalData({ ...rentalData, propertyId: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tenant ID"
        value={rentalData.tenantId}
        onChange={(e) => setRentalData({ ...rentalData, tenantId: e.target.value })}
      />
      <input
        type="date"
        value={rentalData.startDate}
        onChange={(e) => setRentalData({ ...rentalData, startDate: e.target.value })}
      />
      <input
        type="date"
        value={rentalData.endDate}
        onChange={(e) => setRentalData({ ...rentalData, endDate: e.target.value })}
      />
      <button type="submit">Update Rental</button>
    </form>
  );
}

export default EditRental;
