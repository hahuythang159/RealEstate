import React, { useEffect, useState } from 'react';
import { message, Row, Col, Spin, Typography } from 'antd';
import PropertyCard from '../Property/PropertyCard'; // Cập nhật đường dẫn này

const { Paragraph } = Typography;

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/api/favorites/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    response.json();
                } else {
                    const data = await response.json();
                    setFavorites(data);
                }
            } catch (error) {
                message.error(`Failed to fetch favorites: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    console.log('favorites', favorites);

    return (
        <div>
            <h2>Danh Sách Bất Động Sản Yêu Thích</h2>
            {loading ? (<Spin tip="Đang tải..." />) 
            : (favorites.length === 0 
                ? (<Typography.Text type="danger">Không có bất động sản nào trong danh sách yêu thích.</Typography.Text>) 
                : (
                <Row gutter={[16, 16]}>
                    {favorites.map(item => (
                        item && (
                            <Col span={6} key={item.propertyId}>
                                <PropertyCard property={item} />
                            </Col>
                        )
                    ))}
                </Row>
            ))}
        </div>
    );
};

export default Favorites;
