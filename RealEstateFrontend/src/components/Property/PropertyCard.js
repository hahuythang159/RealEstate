import React, { useState, useEffect } from 'react';
import { Card, Button, Tooltip, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

const PropertyCard = ({ property, userId }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleViewDetails = () => {
        navigate(`/property/${property.id}`);
    };

    // Lấy trạng thái yêu thích khi trang được tải
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`/api/favorites/user/${userId}/${property.id}`);
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
    }, [userId, property.id]); // Chạy lại khi userId hoặc property.id thay đổi

    // Xử lý thêm hoặc bỏ yêu thích
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

            // Kiểm tra phản hồi
            if (response.ok) {
                const data = await response.json();
                setIsFavorited(!isFavorited); // Đảo ngược trạng thái yêu thích
                notification.success({
                    message: 'Thành công!',
                    description: data.message, // Thông báo từ server
                });

            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể thay đổi trạng thái yêu thích. Vui lòng thử lại sau.',
            });
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
