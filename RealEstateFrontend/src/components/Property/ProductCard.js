import React, { useState } from 'react';
import { Card, Button, Tooltip, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const ProductCard = ({ property, onDelete }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleViewDetails = () => {
        navigate(`/product/${property.id}`);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/properties/delete/${property.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                notification.success({
                    message: 'Xóa thành công!',
                    description: 'Bất động sản đã được xóa.',
                });
                onDelete(property.id); // Gọi hàm onDelete để cập nhật danh sách bất động sản
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa bất động sản. Vui lòng thử lại sau.',
                });
            }
        } catch (error) {
            console.error('Error deleting property:', error.message);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa bất động sản. Vui lòng thử lại sau.',
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Button type="primary" icon={<EyeOutlined />} onClick={handleViewDetails}>
                    Xem chi tiết
                </Button>
                <Button type="danger" icon={<DeleteOutlined />} onClick={handleDelete}>
                    Xóa
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
