import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Modal,
  Checkbox,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

function AddRental() {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [rentalData, setRentalData] = useState({
    propertyId: location.state?.propertyId || '',
    tenantId: '',
    startDate: '',
    endDate: '',
    status: 'PendingApproval',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setRentalData((prevData) => ({ ...prevData, tenantId: userId }));
  }, []);

  const calculateEndDate = (startDate, rentalMonths) => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(rentalMonths));
    return endDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (rentalData.propertyId) {
        try {
          const response = await fetch(
            `/api/properties/${rentalData.propertyId}`
          );
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
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });
  }, [rentalData.propertyId]);

  const handleSubmit = (values) => {
    console.log('Dữ liệu gửi đi:', {
      ...rentalData,
      ...values,
      startDate: new Date().toISOString().split('T')[0],
      status: 'PendingApproval',
    });
    if (!isAgreed) {
      message.error('Bạn phải đồng ý với điều khoản để tạo hợp đồng.');
      return;
    }

    localStorage.setItem('propertyId', rentalData.propertyId);
    localStorage.setItem('tenantId', rentalData.tenantId);

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, values.rentalMonths);

    const rentalPayload = {
      ...rentalData,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate,
      status: 'PendingApproval',
    };
    console.log('Dữ liệu gửi đi:', rentalPayload);

    setLoading(true);

    fetch('/api/rentals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rentalPayload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Lỗi khi thêm hợp đồng.');
        }
        return response.json();
      })
      .then((data) => {
        message.success('Hợp đồng đã được thêm và đang chờ duyệt.');
        navigate('/tenant/approval');
      })
      .catch((error) => {
        console.error('Error adding rental:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        }
        message.error('Có lỗi xảy ra khi thêm hợp đồng. Vui lòng thử lại.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (propertyDetail) {
      fetch(`https://provinces.open-api.vn/api/p/${propertyDetail.provinceId}`)
        .then((response) => response.json())
        .then((data) => setProvince(data.name))
        .catch((error) => console.error('Error fetching province:', error));

      fetch(`https://provinces.open-api.vn/api/d/${propertyDetail.districtId}`)
        .then((response) => response.json())
        .then((data) => setDistrict(data.name))
        .catch((error) => console.error('Error fetching district:', error));

      fetch(`https://provinces.open-api.vn/api/w/${propertyDetail.wardId}`)
        .then((response) => response.json())
        .then((data) => setWard(data.name))
        .catch((error) => console.error('Error fetching ward:', error));
    }
  }, [propertyDetail]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Thêm hợp đồng mới</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        {propertyDetail && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={3}>Thông tin bất động sản</Title>
            <Text strong>Giá:</Text> {propertyDetail.price} VNĐ <br />
            <Text strong>Diện tích:</Text> {propertyDetail.area} m² <br />
            <Text strong>Phòng ngủ:</Text> {propertyDetail.bedrooms} <br />
            <Text strong>Phòng tắm:</Text> {propertyDetail.bathrooms} <br />
            <Text strong>Địa chỉ:</Text> {propertyDetail.address}, {ward},{' '}
            {district}, {province} <br />
          </div>
        )}
        <Form.Item
          label="Số tháng thuê"
          name="rentalMonths"
          rules={[
            { required: true, message: 'Vui lòng nhập số tháng thuê!' },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject(
                    'Số tháng thuê phải lớn hơn hoặc bằng 1!'
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" min={1} />
        </Form.Item>
        <Form.Item>
          <strong>Ngày bắt đầu:</strong> {new Date().toLocaleDateString()}
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={showModal}>
            Xem điều khoản
          </Button>
          <Modal
            title="Điều khoản hợp đồng"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>
              1. **Đối tượng hợp đồng**: Bên A (cho thuê) đồng ý cho Bên B
              (thuê) thuê tài sản được mô tả trong hợp đồng này.
            </p>
            <p>
              2. **Thời gian thuê**: Thời gian thuê bắt đầu từ ngày [ngày bắt
              đầu] và kết thúc vào ngày [ngày kết thúc].
            </p>
            <p>
              3. **Giá thuê**: Bên B đồng ý thanh toán cho Bên A số tiền [số
              tiền] VNĐ mỗi tháng.
            </p>
            <p>
              4. **Phương thức thanh toán**: Bên B sẽ thanh toán bằng [phương
              thức thanh toán] vào trước ngày [ngày thanh toán].
            </p>
            <p>
              5. **Trách nhiệm của Bên B**: Bên B có trách nhiệm bảo quản tài
              sản thuê và thông báo kịp thời cho Bên A về mọi sự cố xảy ra.
            </p>
            <p>
              6. **Chấm dứt hợp đồng**: Hợp đồng có thể được chấm dứt theo thỏa
              thuận của hai bên hoặc khi có vi phạm điều khoản hợp đồng.
            </p>
            <p>
              7. **Giải quyết tranh chấp**: Mọi tranh chấp phát sinh từ hợp đồng
              này sẽ được giải quyết thông qua thương lượng hoặc theo quy định
              của pháp luật.
            </p>
          </Modal>
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          >
            Tôi đồng ý với điều khoản
          </Checkbox>
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
