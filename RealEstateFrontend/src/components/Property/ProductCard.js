import React, { useState } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProductCard.css';

const ProductCard = ({ property }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/product/${property.id}`);
  };

  const baseURL = 'http://localhost:5034/';
  const defaultImage = '/images/nullRealEstate.jpg';

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
              : defaultImage
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

export default ProductCard;
