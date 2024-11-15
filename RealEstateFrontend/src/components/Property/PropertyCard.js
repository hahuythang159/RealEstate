import React, { useState, useEffect } from 'react';
import { Card, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/PropertyCard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PropertyCard = ({ property, userId }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(
          `/api/favorites/user/${userId}/${property.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        } else {
          console.error('Failed to load favorite status.');
        }
      } catch (error) {
        console.error('Error fetching favorite status:', error.message);
      }
    };

    fetchFavoriteStatus();
  }, [userId, property.id]);

  // Toggle trạng thái yêu thích
  const handleFavorite = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          propertyId: property.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(!isFavorited);
        notification.success({
          message: 'Thành công!',
          description: data.message,
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
      notification.error({
        message: 'Lỗi',
        description:
          'Không thể thay đổi trạng thái yêu thích. Vui lòng thử lại sau.',
      });
    }
  };

  const baseURL = 'http://localhost:5034/';

  return (
    <Card
      hoverable
      style={{
        width: 100,
        transition: 'transform 0.3s ease-in-out',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      cover={
        <img
          alt="Property"
          src={
            property.images && property.images.length > 0
              ? `${baseURL}${property.images[0].imageUrl}`
              : '/path/to/default-image.jpg'
          }
          style={{ height: '66%', objectFit: 'cover' }}
          onClick={handleViewDetails}
        />
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          padding: '10px',
          height: '34%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="member-info">
          <h3>{property.title}</h3>
          <p>{property.price} VNĐ</p>
        </div>
        <div className="contact-icon" onClick={handleFavorite}>
          <i
            className={
              isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
            }
            style={{ fontSize: '24px', color: isFavorited ? 'red' : 'gray' }}
          ></i>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
