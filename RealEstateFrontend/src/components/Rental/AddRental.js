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
import { useIntl } from 'react-intl'; // Import useIntl

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

  const intl = useIntl(); // Use intl for translations

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

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{intl.formatMessage({ id: 'add_rental_title' })}</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        {propertyDetail && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={3}>{intl.formatMessage({ id: 'property_info' })}</Title>
            <Text strong>{intl.formatMessage({ id: 'price1' })}:</Text> {propertyDetail.price} VNĐ <br />
            <Text strong>{intl.formatMessage({ id: 'area1' })}:</Text> {propertyDetail.area} m² <br />
            <Text strong>{intl.formatMessage({ id: 'bedrooms1' })}:</Text> {propertyDetail.bedrooms} <br />
            <Text strong>{intl.formatMessage({ id: 'bathrooms1' })}:</Text> {propertyDetail.bathrooms} <br />
            <Text strong>{intl.formatMessage({ id: 'address1' })}:</Text> {propertyDetail.address}, {ward}, {district}, {province} <br />
          </div>
        )}
        <Form.Item
          label={intl.formatMessage({ id: 'rental_months_label' })}
          name="rentalMonths"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'rental_months_error' }) },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject(
                    intl.formatMessage({ id: 'rental_months_invalid' })
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
          <strong>{intl.formatMessage({ id: 'start_date_label' })}:</strong> {new Date().toLocaleDateString()}
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={showModal}>
            {intl.formatMessage({ id: 'view_terms_button' })}
          </Button>
          <Modal
            title={intl.formatMessage({ id: 'terms_modal_title' })}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {intl.formatMessage({ id: 'contract_terms' }).split(',').map((term, index) => (
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
