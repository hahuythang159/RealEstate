import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, message, List } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIntl } from 'react-intl';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const baseURL = 'http://localhost:5034/';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const [loading, setLoading] = useState(true);
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const userId = localStorage.getItem('userId');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [owner, setOwner] = useState(null);

  const intl = useIntl(); // Lấy đối tượng intl từ react-intl

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok)
        throw new Error(intl.formatMessage({ id: 'fetch_property_error' }));
      const data = await response.json();
      setProperty(data);
      setImages(data.images || []);
      await fetchOwner(data.ownerId);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'fetch_property_error' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchOwner = async (ownerId) => {
    try {
      const response = await fetch(`/api/users/${ownerId}`);
      if (!response.ok)
        throw new Error(intl.formatMessage({ id: 'fetch_owner_error' }));
      const ownerData = await response.json();
      setOwner(ownerData);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'fetch_owner_error' }));
    }
  };

  const fetchComments = async () => {
    const response = await fetch(`/api/comments/${id}`);
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetchProperty();
    fetchComments();
  }, [id]);

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

  const handleCreateRental = () => {
    if (userRole === 'Tenant') {
      navigate(`/add-rental`, { state: { propertyId: id } });
    } else {
      message.error(intl.formatMessage({ id: 'create_rental_error' }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      message.error(intl.formatMessage({ id: 'empty_comment_error' }));
      return;
    }

    const commentData = {
      propertyId: id,
      userId: userId,
      content: newComment,
    };

    const response = await fetch(`/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      const newCommentFromServer = await response.json();
      setComments([...comments, newCommentFromServer]);
      setNewComment('');
      message.success(intl.formatMessage({ id: 'comment_success' }));
    } else {
      message.error(intl.formatMessage({ id: 'comment_error' }));
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
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item>
                <img
                  src={`${baseURL}${image.imageUrl}`}
                  alt="Ảnh Bất động sản"
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </List.Item>
            )}
          />

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
            <strong>{intl.formatMessage({ id: 'description' })}:</strong>{' '}
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
            {dayjs(property.postedDate).format('DD/MM/YYYY HH:mm')} (
            {dayjs(property.postedDate).fromNow()})
          </p>

          {owner && (
            <p>
              <strong>{intl.formatMessage({ id: 'owner' })}:</strong>{' '}
              {owner.userName}
            </p>
          )}

          <div style={{ marginTop: '20px' }}>
            {userRole === 'Tenant' && (
              <Button type="primary" onClick={handleCreateRental}>
                {intl.formatMessage({ id: 'create_rental' })}
              </Button>
            )}
          </div>

          <h3>{intl.formatMessage({ id: 'comments' })}</h3>
          <div>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '10px',
                    }}
                  >
                    <img
                      src={comment.avatar}
                      alt="Avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    />
                    <div style={{ fontWeight: 'bold' }}>{comment.userName}</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f1f1f1',
                      padding: '10px',
                      borderRadius: '8px',
                      flexGrow: 1,
                    }}
                  >
                    {comment.content}
                  </div>
                </div>
              ))
            ) : (
              <p>{intl.formatMessage({ id: 'no_comments' })}</p>
            )}
          </div>

          <Form
            layout="inline"
            onFinish={handleCommentSubmit}
            style={{ marginTop: '20px' }}
          >
            <Form.Item>
              <Input.TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={intl.formatMessage({ id: 'comment_placeholder' })}
                rows={2}
                style={{ width: '400px' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'submit_comment' })}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <p>{intl.formatMessage({ id: 'loading' })}</p>
      )}
    </div>
  );
};

export default PropertyDetail;
