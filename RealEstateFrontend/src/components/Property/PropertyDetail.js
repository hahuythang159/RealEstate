import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, message, Spin } from 'antd';
import {
  FaBed,
  FaShower,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClipboard,
} from 'react-icons/fa';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useIntl } from 'react-intl';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');
const baseUrl = 'http://localhost:5034/';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const [loading, setLoading] = useState(true);
  const [ward, setWard] = useState(null);
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [owner, setOwner] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const intl = useIntl();

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
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };
  const formatPrice = (price) => {
    let formattedPrice = '';

    if (price >= 1000000) {
      formattedPrice = `${(price / 1000000).toFixed(0)} triệu`;
    } else if (price >= 1000) {
      formattedPrice = `${(price / 1000).toFixed(0)} nghìn`;
    } else {
      formattedPrice = price;
    }

    return `${formattedPrice} / tháng`;
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
  }, []);

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
      userName: userName,
      content: newComment,
    };

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newCommentFromServer = await response.json();
        setComments([...comments, newCommentFromServer]);
        setNewComment('');
        message.success(intl.formatMessage({ id: 'comment_success' }));

        const notificationResponse = await fetch(
          '/api/notifications/on-comment',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
          }
        );

        if (notificationResponse.ok) {
          console.log('Notification sent successfully.');
        } else {
          console.error('Failed to send notification.');
        }
      } else {
        message.error(intl.formatMessage({ id: 'comment_error' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'comment_error' }));
    }
  };

  const handleAvatarClick = (commentUserId) => {
    navigate(`/user/${commentUserId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <Spin tip={intl.formatMessage({ id: 'loading' })} />
      ) : (
        <Card bordered={true}>
          <div
            style={{
              width: '100%',
              height: '600px',
              overflow: 'hidden',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <img
              src={`${baseUrl}${images[activeImage].imageUrl}`}
              alt={intl.formatMessage({ id: 'property_image' })}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Ảnh nhỏ phía dưới */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {images.map((image, index) => (
              <img
                key={image.id}
                src={`${baseUrl}${image.imageUrl}`}
                alt={intl.formatMessage({ id: 'property_thumbnail' })}
                onClick={() => handleThumbnailClick(index)}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  border:
                    activeImage === index
                      ? '2px solid #1890ff'
                      : '2px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ flex: 3, paddingRight: '20px' }}>
              <h3>{property.title}</h3>
              <p>
                <FaDollarSign style={{ marginRight: '8px' }} />
                <strong>{intl.formatMessage({ id: 'price1' })}:</strong>{' '}
                {formatPrice(property.price)}
              </p>
              <p>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                <strong>{intl.formatMessage({ id: 'area1' })}:</strong>{' '}
                {property.area} m²
              </p>
              <p>
                <FaBed style={{ marginRight: '8px' }} />
                <strong>{intl.formatMessage({ id: 'bedrooms1' })}:</strong>{' '}
                {property.bedrooms}
              </p>
              <p>
                <FaShower style={{ marginRight: '8px' }} />
                <strong>
                  {intl.formatMessage({ id: 'bathrooms1' })}:
                </strong>{' '}
                {property.bathrooms}
              </p>
              <p>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                <strong>{intl.formatMessage({ id: 'address1' })}:</strong>{' '}
                {property.address}, {ward}, {district}, {province}
              </p>
              <p>
                <FaClipboard style={{ marginRight: '8px' }} />
                <strong>
                  {intl.formatMessage({ id: 'description1' })}:
                </strong>{' '}
                {property.description}
              </p>
              <p>
                <strong>{intl.formatMessage({ id: 'property_type' })}:</strong>{' '}
                {property.propertyType}
              </p>
              <p>
                <strong>
                  {intl.formatMessage({ id: 'interior_condition' })}:
                </strong>{' '}
                {property.interior}
              </p>
              <p>
                <strong>{intl.formatMessage({ id: 'posted_date' })}:</strong>{' '}
                {dayjs(property.postedDate).format('DD/MM/YYYY HH:mm')} (
                {dayjs(property.postedDate).fromNow()})
              </p>
            </div>

            {owner && (
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderLeft: '1px solid #ddd',
                  paddingLeft: '20px',
                }}
              >
                <img
                  src={`${baseUrl}${owner.avatarUrl}`}
                  alt={owner.userName}
                  width="100"
                  height="100"
                  style={{ borderRadius: '50%', marginBottom: '10px' }}
                  onClick={() => navigate(`/user/${owner.id}`)}
                />
                <p style={{ fontWeight: 'bold' }}>{owner.userName}</p>
              </div>
            )}
          </div>

          {userRole === 'Tenant' && (
            <Button
              type="primary"
              onClick={handleCreateRental}
              style={{ marginBottom: '20px' }}
            >
              {intl.formatMessage({ id: 'create_rental' })}
            </Button>
          )}

          <h3>{intl.formatMessage({ id: 'comments' })}</h3>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <img
                      src={`${baseUrl}${comment.avatarUrl}`}
                      alt={comment.userName}
                      width="40"
                      height="40"
                      style={{ borderRadius: '50%' }}
                      onClick={() => handleAvatarClick(comment.userId)}
                    />
                    <div style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                      {comment.userName}
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'gray',
                        marginLeft: 'auto',
                      }}
                    >
                      {dayjs(comment.createdAt).fromNow()}
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f1f1f1',
                      padding: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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

          <Form layout="inline" onFinish={handleCommentSubmit}>
            <Form.Item style={{ flex: 1 }}>
              <Input.TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={intl.formatMessage({ id: 'comment_placeholder' })}
                rows={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'submit_comment' })}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default PropertyDetail;
