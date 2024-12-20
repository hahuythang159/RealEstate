import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Modal,
  Checkbox,
} from 'antd';
import { useIntl } from 'react-intl';

const { Title, Text } = Typography;

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

  const intl = useIntl();

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

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (rentalData.propertyId) {
        try {
          const response = await fetch(
            `/api/properties/${rentalData.propertyId}`
          );
          if (!response.ok) {
            throw new Error(intl.formatMessage({ id: 'error_fetch_property' }));
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
    if (!isAgreed) {
      message.error(intl.formatMessage({ id: 'agreement_error' }));
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
          throw new Error(intl.formatMessage({ id: 'error_adding_contract' }));
        }
        return response.json();
      })
      .then((data) => {
        message.success(intl.formatMessage({ id: 'contract_added' }));
        navigate('/tenant/approval');
      })
      .catch((error) => {
        message.error(intl.formatMessage({ id: 'error_adding_contract' }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const contractTerms = [
    'Đối tượng hợp đồng: Bên A (cho thuê) đồng ý cho Bên B (thuê) thuê tài sản được mô tả trong hợp đồng này.',
    'Thời gian thuê: Thời gian thuê bắt đầu từ ngày [ngày bắt đầu] và kết thúc vào ngày [ngày kết thúc].',
    'Giá thuê: Bên B đồng ý thanh toán cho Bên A số tiền [số tiền] VNĐ mỗi tháng.',
    'Phương thức thanh toán: Bên B sẽ thanh toán bằng [phương thức thanh toán] vào trước ngày [ngày thanh toán].',
    'Trách nhiệm của Bên B: Bên B có trách nhiệm bảo quản tài sản thuê và thông báo kịp thời cho Bên A về mọi sự cố xảy ra.',
    'Chấm dứt hợp đồng: Hợp đồng có thể được chấm dứt theo thỏa thuận của hai bên hoặc khi có vi phạm điều khoản hợp đồng.',
    'Giải quyết tranh chấp: Mọi tranh chấp phát sinh từ hợp đồng này sẽ được giải quyết thông qua thương lượng hoặc theo quy định của pháp luật.',
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{intl.formatMessage({ id: 'add_rental_title' })}</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        {propertyDetail && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={3}>
              {intl.formatMessage({ id: 'property_info' })}
            </Title>
            <Text strong>{intl.formatMessage({ id: 'price1' })}:</Text>{' '}
            {propertyDetail.price} VNĐ <br />
            <Text strong>{intl.formatMessage({ id: 'area1' })}:</Text>{' '}
            {propertyDetail.area} m² <br />
            <Text strong>{intl.formatMessage({ id: 'bedrooms1' })}:</Text>{' '}
            {propertyDetail.bedrooms} <br />
            <Text strong>{intl.formatMessage({ id: 'bathrooms1' })}:</Text>{' '}
            {propertyDetail.bathrooms} <br />
            <Text strong>{intl.formatMessage({ id: 'address1' })}:</Text>{' '}
            {propertyDetail.address}, {ward}, {district}, {province} <br />
          </div>
        )}
        <Form.Item
          label={intl.formatMessage({ id: 'rental_months_label' })}
          name="rentalMonths"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'rental_months_error' }),
            },
            {
              validator: (_, value) => {
                if (value <= 2) {
                  return Promise.reject(
                    intl.formatMessage({ id: 'rental_months_invalid' })
                  );
                }
                if (value > 24) {
                  return Promise.reject(
                    intl.formatMessage({ id: 'rental_months_max_error' })
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" min={3} max={24} />
        </Form.Item>
        <Form.Item>
          <strong>{intl.formatMessage({ id: 'start_date_label' })}:</strong>{' '}
          {new Date().toLocaleDateString()}
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={showModal}>
            {intl.formatMessage({ id: 'view_terms_button' })}
          </Button>
          <Modal
            title="Điều khoản hợp đồng"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ style: { marginRight: 8 } }}
            cancelButtonProps={{ style: { marginLeft: 8 } }}
          >
            {contractTerms.map((term, index) => (
              <p key={index}>{term}</p>
            ))}
          </Modal>
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          >
            {intl.formatMessage({ id: 'agree_checkbox' })}
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {intl.formatMessage({ id: 'submit_button' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddRental;
