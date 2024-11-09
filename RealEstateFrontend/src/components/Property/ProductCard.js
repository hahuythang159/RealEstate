import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const ProductCard = ({ property, onDelete }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleViewDetails = () => {
        navigate(`/product/${property.id}`);

    };
    return (
        <Card
        hoverable
        style={{ width: 300, transition: 'transform 0.2s', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        cover={<img alt={property.title} src={property.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Meta title={property.title} description={`${property.address}`} />
            <p><strong>Giá:</strong> {property.price} VNĐ</p>
            <p><strong>Diện tích:</strong> {property.area} m²</p>
            <p><strong>Loại bất động sản:</strong> {property.propertyType}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Button type="primary" icon={<EyeOutlined />} onClick={handleViewDetails}>
                    Xem chi tiết
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
