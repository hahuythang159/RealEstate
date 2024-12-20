import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, message, Select, Carousel } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');
const baseUrl = 'http://localhost:5034/';

const { Option } = Select;

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const userId = localStorage.getItem('userId');
  const intl = useIntl();

  const fetchProperty = async () => {
    const response = await fetch(`/api/properties/${id}`);
    const data = await response.json();
    setProperty(data);
    setImages(data.images || []);
    form.setFieldsValue(data);
  };

  useEffect(() => {
    fetchProperty();
  }, [id, form]);

  useEffect(() => {
    if (property) {
      fetch(`https://provinces.open-api.vn/api/p/${property.provinceId}`)
        .then((response) => response.json())
        .then((data) => setProvince(data.name))
        .catch((error) => console.error('Error fetching province:', error));

      fetch(`https://provinces.open-api.vn/api/d/${property.districtId}`)
        .then((response) => response.json())
        .then((data) => setDistrict(data.name))
        .catch((error) => console.error('Error fetching district:', error));

      fetch(`https://provinces.open-api.vn/api/w/${property.wardId}`)
        .then((response) => response.json())
        .then((data) => setWard(data.name))
        .catch((error) => console.error('Error fetching ward:', error));
    }
  }, [property]);

  const handleDelete = async () => {
    if (userRole === 'Owner' || userRole === 'Manager') {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      message.success(intl.formatMessage({ id: 'delete_success' }));
      navigate('/owner/my-product');
    } else {
      message.error(intl.formatMessage({ id: 'no_permission' }));
    }
  };

  const handleUpdate = async () => {
    if (userRole === 'Owner') {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        const updatedData = {
          id: id,
          title: values.title,
          description: values.description,
          address: values.address,
          price: values.price,
          ownerId: values.ownerId,
          provinceId: values.provinceId,
          districtId: values.districtId,
          wardId: values.wardId,
          imageUrl: values.imageUrl,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          area: values.area,
          propertyType: values.propertyType,
          interior: values.interior,
          postedDate: values.postedDate,
        };

        const response = await fetch(`/api/properties/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          message.error(intl.formatMessage({ id: 'update_fail' }));
          return;
        }

        message.success(intl.formatMessage({ id: 'update_success' }));
        fetchProperty();
        setEditing(false);
      } catch (error) {
        message.error(intl.formatMessage({ id: 'update_fail' }));
      }
    } else {
      message.error(intl.formatMessage({ id: 'no_permission_edit' }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {property ? (
        <Card
          title={intl.formatMessage({ id: 'property_detail' })}
          bordered={true}
          style={{ maxWidth: '600px', margin: 'auto' }}
        >
          <Carousel autoplay>
            {images.map((image) => (
              <img
                key={image.id}
                src={`${baseUrl}${image.imageUrl}`}
                alt="Ảnh bất động sản"
                style={{ width: '100%', height: '50px', objectFit: 'cover' }}
              />
            ))}
          </Carousel>
          <h3>{property.title}</h3>
          <p>
            <strong>{intl.formatMessage({ id: 'price1' })}:</strong>{' '}
            {property.price} VNĐ
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'area1' })}:</strong>{' '}
            {property.area} m²
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'bedrooms1' })}:</strong>{' '}
            {property.bedrooms}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'bathrooms1' })}:</strong>{' '}
            {property.bathrooms}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'address1' })}:</strong>{' '}
            {property.address}, {ward}, {district}, {province}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'description1' })}:</strong>{' '}
            {property.description}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'property_type' })}:</strong>{' '}
            {property.propertyType}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'interior_condition' })}:</strong>{' '}
            {property.interior}
          </p>
          <p>
            <strong>{intl.formatMessage({ id: 'posted_date' })}:</strong>{' '}
            {dayjs(property.postedDate).format('DD/MM/YYYY HH:mm')}
            <br />({dayjs(property.postedDate).fromNow()})
          </p>

          <div style={{ marginTop: '20px' }}>
            {userRole === 'Owner' && (
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => setEditing(!editing)}
                style={{ marginRight: '10px' }}
              >
                {editing
                  ? intl.formatMessage({ id: 'cancel' })
                  : intl.formatMessage({ id: 'edit' })}
              </Button>
            )}

            {(userRole === 'Manager' || userRole === 'Owner') && (
              <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
                {intl.formatMessage({ id: 'delete' })}
              </Button>
            )}
          </div>

          {editing && (
            <Form
              form={form}
              onFinish={handleUpdate}
              layout="vertical"
              style={{ marginTop: '20px' }}
            >
              <Form.Item
                name="description"
                label={intl.formatMessage({ id: 'description' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'enter_description' }),
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="price"
                label={intl.formatMessage({ id: 'price' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'enter_price' }),
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="interior"
                label={intl.formatMessage({ id: 'interior_condition' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'select_interior_condition',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'select_interior_condition',
                  })}
                >
                  <Option value="Nội thất cơ bản">Nội thất cơ bản</Option>
                  <Option value="Nội thất cao cấp">Nội thất cao cấp</Option>
                  <Option value="Không có nội thất">Không có nội thất</Option>
                </Select>
              </Form.Item>
              <Form.Item name="title" hidden={true}></Form.Item>
              <Form.Item name="address" hidden={true}></Form.Item>
              <Form.Item name="imageUrl" hidden={true}></Form.Item>
              <Form.Item name="propertyType" hidden={true}></Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {intl.formatMessage({ id: 'submit' })}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PropertyDetail;
