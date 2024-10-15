import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Select, Button, Typography, message } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

function AddRental() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [rentalData, setRentalData] = useState({
    propertyId: location.state?.propertyId || '',
    tenantId: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    paymentMethod: '',
    rentalMonths: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setRentalData(prevData => ({ ...prevData, tenantId: userId }));
  }, []);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (rentalData.propertyId) {
        try {
          const response = await fetch(`/api/properties/${rentalData.propertyId}`);
          if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin bất động sản.');
          }
          const data = await response.json();
          setPropertyDetail(data);
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      }
    };

    fetchPropertyDetail();

    fetch('/api/properties')
      .then(response => response.json())
      .then(data => {
        setProperties(data);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
      });
  }, [rentalData.propertyId]);

  const handleSubmit = (values) => {
    localStorage.setItem('propertyId', rentalData.propertyId);
    localStorage.setItem('tenantId', rentalData.tenantId);
    
    // Tính toán ngày kết thúc dựa trên số tháng thuê
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + values.rentalMonths);
    values.endDate = endDate.toISOString().split('T')[0];

    setLoading(true);

    fetch('/api/rentals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...rentalData,
        ...values,
        startDate: new Date().toISOString().split('T')[0],
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Lỗi khi thêm hợp đồng.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Rental added successfully:', data);
        message.success('Hợp đồng đã được thêm thành công.');
        setRentalData({
          propertyId: '',
          tenantId: rentalData.tenantId,
          startDate: '',
          endDate: '',
          status: 'Active',
          paymentMethod: '',
          rentalMonths: 1,
        });
      })
      .catch(error => {
        console.error('Error adding rental:', error);
        message.error('Có lỗi xảy ra khi thêm hợp đồng. Vui lòng thử lại.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Thêm hợp đồng mới</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        {/* Hiển thị thông tin chi tiết property */}
        {propertyDetail && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={3}>Thông tin bất động sản</Title>
            <Text strong>Giá:</Text> {propertyDetail.price} VNĐ <br />
            <Text strong>Diện tích:</Text> {propertyDetail.area} m² <br />
            <Text strong>Phòng ngủ:</Text> {propertyDetail.bedrooms} <br />
            <Text strong>Phòng tắm:</Text> {propertyDetail.bathrooms} <br />
            <Text strong>Địa chỉ:</Text> {propertyDetail.address} <br />
          </div>
        )}

        <Form.Item
          label="Số tháng thuê"
          name="rentalMonths"
          rules={[{ required: true, message: 'Vui lòng nhập số tháng thuê!' }]}
        >
          <Input type="number" min={1} defaultValue={1} />
        </Form.Item>

        <Form.Item
          label="Phương thức thanh toán"
          name="paymentMethod"
          rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
        >
          <Select placeholder="Chọn phương thức thanh toán">
            <Option value="cash">Tiền mặt</Option>
            <Option value="bank">Tiền khoản</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Hợp Đồng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddRental;
