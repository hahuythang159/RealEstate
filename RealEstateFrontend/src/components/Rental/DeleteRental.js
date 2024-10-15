import React from 'react';

function DeleteRental({ id }) {
  const handleDelete = () => {
    fetch(`/api/rentals/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log('Rental deleted');
      })
      .catch(error => console.error('Error deleting rental:', error));
  };

  return <button onClick={handleDelete}>Delete Rental</button>;
}

export default DeleteRental;
