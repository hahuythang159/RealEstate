import React from 'react';
import { Row, Col, Typography } from 'antd';
import { useIntl } from 'react-intl'; // Import useIntl
import './footer.css';

const { Text, Title } = Typography;

const Footer = () => {
    const intl = useIntl(); // Use intl to fetch translations

    return (
        <div className="footer">
            <Row justify="center" gutter={[16, 16]} style={{ padding: '20px 0' }}>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'about_us_title' })}
                    </Title>
                    <Text style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'about_us_description' })}
                    </Text>
                </Col>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'contact_title' })}
                    </Title>
                    <Text style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'contact_email' })}
                    </Text><br />
                    <Text style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'contact_phone' })}
                    </Text>
                </Col>
                <Col span={6}>
                    <Title level={5} style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'follow_us_title' })}
                    </Title>
                    <Text style={{ color: '#ffffff' }}>
                        {intl.formatMessage({ id: 'follow_us_links' })}
                    </Text>
                </Col>
            </Row>
            <Row justify="center">
                <Text style={{ color: '#ffffff', textAlign: 'center' }}>
                    {intl.formatMessage({ id: 'copyright' })}
                </Text>
            </Row>
        </div>
    );
};

export default Footer;
