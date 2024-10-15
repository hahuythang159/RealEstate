import React from 'react';
import './Home.css'; // Import file CSS để định dạng
import { Link } from 'react-router-dom';
import { Layout, Menu, Button, Card, Row, Col } from 'antd'; // Import các thành phần của Ant Design

const { Header, Content, Footer } = Layout;

const Home = () => {
    return (
        <Layout className="home">
            {/* Thanh Điều Hướng */}
            <Header className="navbar">
                <div className="logo">Real Estate</div>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1">
                        <Link to="/">Trang Chủ</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/search">Tìm Kiếm</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/login">Đăng Nhập</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/register">Đăng Ký</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Link to="/add-rental">Thêm Rental</Link>
                    </Menu.Item>
                </Menu>
            </Header>

            {/* Phần Hero */}
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Tìm Kiếm Bất Động Sản Cho Thuê</h1>
                <p>Khám phá những căn hộ tuyệt vời nhất cho thuê ở khu vực của bạn.</p>
                <Button type="primary" className="search-button">Tìm Kiếm</Button>
            </Content>

            {/* Danh Sách Bất Động Sản */}
            <Content style={{ padding: '50px' }}>
                <h2>Bất Động Sản Mới Nhất</h2>
                <Row gutter={16}>
                    {/* Ví dụ Bất Động Sản */}
                    <Col span={8}>
                        <Card title="Nhà 3 Phòng Ngủ" bordered={false}>
                            <p>Địa chỉ: 123 Đường ABC</p>
                            <p>Giá: 10 triệu/tháng</p>
                            <Button>Xem Chi Tiết</Button>
                        </Card>
                    </Col>
                    {/* Thêm nhiều bất động sản */}
                    {/* Bạn có thể thêm nhiều <Col> ở đây */}
                </Row>
            </Content>

            {/* Phần Thông Tin */}
            <Content style={{ padding: '50px' }}>
                <h2>Tại Sao Chọn Chúng Tôi?</h2>
                <ul>
                    <li>Đảm bảo chất lượng</li>
                    <li>Đội ngũ hỗ trợ khách hàng</li>
                    <li>Nhiều lựa chọn bất động sản</li>
                </ul>
            </Content>

            {/* Chân Trang */}
            <Footer className="footer">
                <p>Thông tin liên hệ: 123 Đường XYZ, Số điện thoại: 0123456789</p>
                <p>Liên kết mạng xã hội: Facebook | Twitter | Instagram</p>
            </Footer>
        </Layout>
    );
};

export default Home;
