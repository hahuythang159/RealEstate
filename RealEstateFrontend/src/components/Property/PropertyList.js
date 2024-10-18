import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Pagination, Select, Button } from 'antd';
import PropertyCard from '../Property/PropertyCard'; 
const { Title, Paragraph } = Typography;
const { Option } = Select;

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);

    // State cho bộ lọc
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [bedrooms, setBedrooms] = useState(null);
    const [bathrooms, setBathrooms] = useState(null);

    // Hàm gọi API với các tham số lọc
    const fetchProperties = async () => {
        try {
            const query = new URLSearchParams();
            if (minPrice !== null) query.append('minPrice', minPrice);
            if (maxPrice !== null) query.append('maxPrice', maxPrice);
            if (bedrooms) query.append('bedrooms', bedrooms);
            if (bathrooms) query.append('bathrooms', bathrooms);

            const response = await fetch(`/api/properties?${query.toString()}`);
            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi lấy dữ liệu');
            }
            const data = await response.json();
            
            // Lọc các bất động sản không có Rental với trạng thái "Approved"
            const filteredProperties = data.filter(property => 
                !property.rentals || 
                !property.rentals.some(rental => rental.status === "Approved")
            );

            setProperties(filteredProperties);
            setTotal(filteredProperties.length);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [minPrice, maxPrice, bedrooms, bathrooms]); // Gọi lại khi bộ lọc thay đổi

    const paginatedProperties = properties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    // Hàm xử lý khi thay đổi bộ lọc
    const handleFilterChange = () => {
        fetchProperties();
        setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
    };

    return (
        <>
            <Row gutter={[16, 16]} style={{ paddingTop: 20 }}>
                {/* Bộ lọc giá */}
                <Col span={6}>
                    <Select
                        placeholder="Chọn khoảng giá"
                        style={{ width: '100%' }}
                        onChange={value => {
                            switch (value) {
                                case 'below1':
                                    setMinPrice(0);
                                    setMaxPrice(1000000);
                                    break;
                                case '1to2':
                                    setMinPrice(1000000);
                                    setMaxPrice(2000000);
                                    break;
                                case '2to4':
                                    setMinPrice(2000000);
                                    setMaxPrice(4000000);
                                    break;
                                case '4to6':
                                    setMinPrice(4000000);
                                    setMaxPrice(6000000);
                                    break;
                                case '6to8':
                                    setMinPrice(6000000);
                                    setMaxPrice(8000000);
                                    break;
                                case '8to10':
                                    setMinPrice(8000000);
                                    setMaxPrice(10000000);
                                    break;
                                case 'above10':
                                    setMinPrice(10000000);
                                    setMaxPrice(null);
                                    break;
                                default:
                                    setMinPrice(null);
                                    setMaxPrice(null);
                            }
                        }}
                    >
                        <Option value="below1">Giá dưới 1 triệu</Option>
                        <Option value="1to2">Giá 1 - 2 triệu</Option>
                        <Option value="2to4">Giá 2 - 4 triệu</Option>
                        <Option value="4to6">Giá 4 - 6 triệu</Option>
                        <Option value="6to8">Giá 6 - 8 triệu</Option>
                        <Option value="8to10">Giá 8 - 10 triệu</Option>
                        <Option value="above10">Giá trên 10 triệu</Option>
                    </Select>
                </Col>

                {/* Bộ lọc phòng ngủ */}
                <Col span={6}>
                    <Select
                        placeholder="Chọn số phòng ngủ"
                        style={{ width: '100%' }}
                        onChange={value => {
                            if (value === 'above4') {
                                setBedrooms(4); // Lấy các bất động sản có từ 4 phòng ngủ trở lên
                            } else {
                                setBedrooms(value);
                            }
                        }}
                    >
                        <Option value={1}>1 phòng ngủ</Option>
                        <Option value={2}>2 phòng ngủ</Option>
                        <Option value={3}>3 phòng ngủ</Option>
                        <Option value="above4">Trên 4 phòng ngủ</Option>
                    </Select>
                </Col>

                {/* Bộ lọc phòng tắm */}
                <Col span={6}>
                    <Select
                        placeholder="Chọn số phòng tắm"
                        style={{ width: '100%' }}
                        onChange={value => {
                            if (value === 'above4') {
                                setBathrooms(4); // Lấy các bất động sản có từ 4 phòng tắm trở lên
                            } else {
                                setBathrooms(value);
                            }
                        }}
                    >
                        <Option value={1}>1 phòng tắm</Option>
                        <Option value={2}>2 phòng tắm</Option>
                        <Option value={3}>3 phòng tắm</Option>
                        <Option value="above4">Trên 4 phòng tắm</Option>
                    </Select>
                </Col>

                <Col span={6}>
                    <Button type="primary" onClick={handleFilterChange}>
                        Áp dụng bộ lọc
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16, 32]} style={{ paddingTop: 50 }}>
                {paginatedProperties.length === 0 ? (
                    <Col span={24}>
                        <p>Không có bất động sản nào để hiển thị.</p>
                    </Col>
                ) : (
                    paginatedProperties.map(property => (
                        <Col span={6} key={property.id}>
                            <PropertyCard property={property} />
                        </Col>
                    ))
                )}
            </Row>

            {/* Phân trang */}
            {total > pageSize && (
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    style={{ marginTop: 20, textAlign: 'center' }}
                />
            )}
        </>
    );
};

export default PropertyList;
