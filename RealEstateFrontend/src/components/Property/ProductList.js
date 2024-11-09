import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Pagination } from 'antd';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        const fetchProperties = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`/api/properties/my-properties?userId=${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProperties(data);
                    } else {
                        message.error('Không thể tải danh sách bất động sản: ' + response.statusText);
                    }
                } catch (error) {
                    message.error('Lỗi khi tải bất động sản: ' + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                message.error('Không tìm thấy userId trong localStorage');
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleDeleteProperty = (propertyId) => {
        setProperties((prev) => prev.filter((property) => property.id !== propertyId));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Tính toán các sản phẩm cần hiển thị cho trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const currentProperties = properties.slice(startIndex, startIndex + pageSize);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <>
            <Row gutter={16} style={{padding:'24px'}}>
                {currentProperties.map((property) => (
                    <Col span={8} key={property.id} style={{paddingBottom:'24px'}}>
                        <ProductCard property={property} onDelete={handleDeleteProperty} />
                    </Col>
                ))}
            </Row>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={properties.length}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </>
    );
};

export default ProductList;
