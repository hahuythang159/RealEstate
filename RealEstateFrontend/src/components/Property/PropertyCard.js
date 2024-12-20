import React, { useState, useEffect } from 'react';
import { Card, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/PropertyCard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const baseURL = 'http://localhost:5034/';

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

  return (
    <Card
      hoverable
      style={{
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      cover={
        <img
          alt="Property"
          src={
            property.images && property.images.length > 0
              ? `${baseURL}${property.images[0].imageUrl}`
              : '/images/nullRealEstate.jpg'
          }
          style={{
            height: '200px',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
          onClick={handleViewDetails}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="contact-icon" onClick={handleFavorite}>
        <i
          className={isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}
          style={{
            color: isFavorited ? 'red' : '#ccc',
          }}
        ></i>
      </div>
      <div
        style={{
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: '100px',
          gap: '10px',
        }}
      >
        <div className="member-info">
          <h3 style={{ margin: 0 }}>{property.title}</h3>
          <p style={{ paddingTop: 20, margin: 0 }}>{property.price} VNĐ</p>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
