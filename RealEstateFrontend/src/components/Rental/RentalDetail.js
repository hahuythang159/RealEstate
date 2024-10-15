import React, { useEffect, useState } from 'react';

function RentalDetail({ id }) {
  const [rental, setRental] = useState(null);

  useEffect(() => {
    fetch(`/api/rentals/${id}`)
      .then(response => response.json())
      .then(data => setRental(data))
      .catch(error => console.error('Error fetching rental:', error));
  }, [id]);

  if (!rental) return <div>Loading...</div>;

  return (
    <div>
      <h2>Rental Detail</h2>
      <p>Property: {rental.property.address}</p>
      <p>Tenant: {rental.tenant.name}</p>
      <p>Start Date: {new Date(rental.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(rental.endDate).toLocaleDateString()}</p>
    </div>
  );
}

export default RentalDetail;
