// src/components/Property/PropertyList.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import PropertyCard from '../Property/PropertyCard'; // Chú ý hai dấu chấm (..) để trở về thư mục cha

const { Title, Paragraph } = Typography;

const PropertyList = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        console.log('useEffect PropertyList')
        const fetchProperties = async () => {
            try {
                const response = await fetch('/api/properties');
                if (!response.ok) {
                    throw new Error('Đã xảy ra lỗi khi lấy dữ liệu');
                }
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        fetchProperties();
    }, []);


    return (
        <Row gutter={[16, 16]}>
            {properties.length === 0 ? (
                <Col span={24}>
                    <p>Không có bất động sản nào để hiển thị.</p>
                </Col>
            ) : (
                properties.map(property => (
                    <Col span={6} key={property.id}>
                        <PropertyCard property={property} />
                    </Col>
                ))
            )}
        </Row>
    );
};

export default PropertyList;
