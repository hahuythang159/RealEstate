import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState('');

  // Fetch bookings from API
  useEffect(() => {
    axios
      .get('/api/bookings')
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the bookings!', error);
      });
  }, []);

  const handleAddBooking = () => {
    const booking = {
      propertyId: 'some-property-id',
      userId: 'some-user-id',
      date: new Date(),
    }; // Adjust according to your model
    axios
      .post('https://localhost:5001/api/bookings', booking)
      .then((response) => {
        setBookings([...bookings, response.data]);
        setNewBooking('');
      })
      .catch((error) => {
        console.error('There was an error adding the booking!', error);
      });
  };

  return (
    <div>
      <h2>Bookings</h2>
      <div>
        <input
          type="text"
          value={newBooking}
          onChange={(e) => setNewBooking(e.target.value)}
          placeholder="Add a new booking"
        />
        <button onClick={handleAddBooking}>Add Booking</button>
      </div>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.propertyId} - {booking.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
