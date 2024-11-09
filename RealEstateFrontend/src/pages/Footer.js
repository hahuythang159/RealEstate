import React from 'react';
import { Row, Col, Typography } from 'antd';
import './footer.css';

const { Text, Title } = Typography;

const Footer = () => {
    return (
        <div className="footer">
            <Row justify="center" gutter={[16, 16]} style={{ padding: '20px 0' }}>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>Về Chúng Tôi</Title>
                    <Text style={{ color: '#ffffff' }}>Chúng tôi là một nền tảng kết nối người thuê và chủ nhà, cung cấp dịch vụ thuê bất động sản với nhiều tùy chọn.</Text>
                </Col>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>Liên Hệ</Title>
                    <Text style={{ color: '#ffffff' }}>Email: contact@example.com</Text><br />
                    <Text style={{ color: '#ffffff' }}>Điện thoại: +84 123 456 789</Text>
                </Col>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>Theo Dõi Chúng Tôi</Title>
                    <Text style={{ color: '#ffffff' }}>Facebook | Twitter | Instagram</Text>
                </Col>
            </Row>
            <Row justify="center">
                <Text style={{ color: '#ffffff', textAlign: 'center' }}>
                    &copy; 2024 Real Estate Platform. All rights reserved.
                </Text>
            </Row>
        </div>
    );
};

export default Footer;
