import React, { useState } from 'react';
import { Card, Button, Tooltip, notification } from 'antd'; // Nhập notification từ antd
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

const PropertyCard = ({ property, userId }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleViewDetails = () => {
        navigate(`/property/${property.id}`);
    };

    const handleFavorite = async () => {
        const userId = localStorage.getItem('userId'); 

        if (!isFavorited) {
            try {
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        propertyId: property.id,
                    }),
                });
    
                // Kiểm tra xem phản hồi có thành công không
                if (response.ok) {
                    const data = await response.json();
                    setIsFavorited(true);
    
                    // Hiển thị thông báo thành công
                    notification.success({
                        message: 'Thành công!',
                        description: 'Đã thêm vào danh sách yêu thích.',
                    });
    
                    console.log('Server response:', data); 
                } else {
                    // Đọc phản hồi lỗi từ server
                    const errorText = await response.text(); // Đọc phản hồi dưới dạng văn bản
                    throw new Error(errorText); // Ném lỗi với thông điệp từ server
                }
            } catch (error) {
                console.error('Error adding favorite:', error.message); 
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể thêm vào danh sách yêu thích. Vui lòng thử lại sau.',
                });
            }
        }
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
            <Tooltip title="Xem chi tiết">
                <Button type="primary" icon={<EyeOutlined />} onClick={handleViewDetails}>
                    Xem chi tiết
                </Button>
            </Tooltip>
            <Tooltip title={isFavorited ? "Đã yêu thích" : "Thêm vào yêu thích"}>
                <Button 
                    type="default" 
                    icon={<HeartOutlined />} 
                    onClick={handleFavorite} 
                    style={{ marginLeft: 8, color: isFavorited ? 'red' : 'inherit' }}
                >
                    {isFavorited ? 'Yêu thích' : 'Thêm yêu thích'}
                </Button>
            </Tooltip>
        </Card>
    );
};

export default PropertyCard;
