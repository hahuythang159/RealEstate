import React, { useEffect, useState } from 'react';
import { List, Modal, Typography, Card, Spin, Button, Input, message } from 'antd';

const { Title, Text } = Typography;

const MyPropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const userRole = localStorage.getItem('role');

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

    const showModal = (property) => {
        setSelectedProperty(property);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProperty(null);
    };

    const handleHideProperty = async () => {
        if (selectedProperty) {
            // Cập nhật giao diện ngay lập tức
            const updatedProperties = properties.filter(p => p.id !== selectedProperty.id);
            setProperties(updatedProperties);
            message.success('Đã ẩn bất động sản thành công');
    
            try {
                const response = await fetch(`/api/properties/${selectedProperty.id}/hide`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    // Nếu yêu cầu thất bại, khôi phục lại cập nhật
                    setProperties(properties);
                    const errorText = await response.text();
                    message.error('Không thể ẩn bất động sản: ' + errorText);
                }
            } catch (error) {
                // Nếu có lỗi xảy ra, khôi phục lại cập nhật
                setProperties(properties);
                message.error('Lỗi khi ẩn bất động sản: ' + error.message);
            } finally {
                handleCancel();
            }
        }
    };
    

    const handleEditProperty = async () => {
        if (selectedProperty) {
            try {
                const response = await fetch(`/api/properties/${selectedProperty.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedProperty),
                });

                if (response.ok) {
                    const updatedProperty = await response.json(); // Parse the response JSON
                    setProperties(properties.map(p => (p.id === updatedProperty.id ? updatedProperty : p)));
                    message.success('Cập nhật bất động sản thành công');
                    handleCancel();
                } else {
                    const errorText = await response.text(); // Get error response
                    message.error('Không thể cập nhật bất động sản: ' + errorText); // Show error
                }
            } catch (error) {
                message.error('Lỗi khi cập nhật bất động sản: ' + error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedProperty((prevProperty) => ({
            ...prevProperty,
            [name]: value,
        }));
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Bất động sản của tôi</Title>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={properties}
                renderItem={property => (
                    <List.Item>
                        <Card
                            hoverable
                            onClick={() => showModal(property)}
                            cover={<img alt={property.title} src={property.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />}
                        >
                            <Card.Meta
                                title={property.title}
                                description={
                                    <div>
                                        <Text strong>{`Giá: $${property.price}`}</Text>
                                        <br />
                                        <Text>{`${property.bedrooms} phòng ngủ, ${property.bathrooms} phòng tắm`}</Text>
                                    </div>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
            <Modal
                title="Chi tiết bất động sản"
                visible={isModalVisible}
                footer={[
                    <Button key="edit" onClick={handleEditProperty} disabled={userRole !== 'Owner'}>
                        Lưu
                    </Button>,
                    <Button key="hide" onClick={handleHideProperty} disabled={userRole !== 'Manager' && userRole !== 'Owner'}>
                        Ẩn
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Huỷ
                    </Button>,
                ]}
                onCancel={handleCancel}
            >
                {selectedProperty && (
                    <div>
                        <img alt={selectedProperty.title} src={selectedProperty.imageUrl} style={{ width: '100%', marginBottom: '16px' }} />
                        <p>
                            <strong>Tiêu đề:</strong>
                            <Input name="title" value={selectedProperty.title} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong>
                            <Input name="address" value={selectedProperty.address} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Mô tả:</strong>
                            <Input.TextArea name="description" value={selectedProperty.description} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Giá:</strong>
                            <Input type="number" name="price" value={selectedProperty.price} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Diện tích:</strong>
                            <Input type="number" name="area" value={selectedProperty.area} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Loại hình bất động sản:</strong>
                            <Input name="propertyType" value={selectedProperty.propertyType} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Loại hình sử dụng:</strong>
                            <Input name="interior" value={selectedProperty.interior} onChange={handleChange} />
                        </p>
                        <p>
                            <strong>Thời gian đăng:</strong> {new Date(selectedProperty.postedDate).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyPropertyList;
