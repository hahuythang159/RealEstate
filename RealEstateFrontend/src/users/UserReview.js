import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Avatar,
  Rate,
  Button,
  Input,
  message,
  Form,
  Typography,
  Row,
  Col,
  Divider,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl'; // Import react-intl

const { Title, Paragraph } = Typography;

function UserDetail() {
  const { userId } = useParams();
  const intl = useIntl(); // Khởi tạo useIntl
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user data:', error));
  }, [userId]);

  useEffect(() => {
    fetch(`/api/reviews/user/${userId}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [userId]);

  useEffect(() => {
    fetch(`/api/reviews/user/${userId}/average`)
      .then((response) => response.json())
      .then((data) => setAverageRating(data))
      .catch((error) => console.error('Error fetching average rating:', error));
  }, [userId]);

  const handlePostReview = (values) => {
    const { rating, comment } = values;
    const currentTime = moment.utc().format();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      message.error(intl.formatMessage({ id: 'user.loggedOutError' }));
      return;
    }

    const reviewData = {
      targetUserId: userId,
      reviewerId: currentUser.userId,
      rating,
      comment,
      createdAt: currentTime,
    };

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
        message.success(intl.formatMessage({ id: 'user.postSuccess' }));
      })
      .catch((error) => {
        console.error('Error posting review:', error);
        message.error(intl.formatMessage({ id: 'user.postError' }));
      });
  };

  const loadMoreReviews = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <Avatar
              size={128}
              src={user?.avatarUrl}
              icon={<UserOutlined />}
              style={{ marginBottom: '16px' }}
            />
            <Title level={3}>{user?.userName}</Title>
            <Paragraph>
              {intl.formatMessage({ id: 'user.averageRating' })}:
              {averageRating ? (
                <Rate
                  disabled
                  allowHalf
                  value={averageRating}
                  style={{ marginLeft: '8px' }}
                />
              ) : (
                intl.formatMessage({ id: 'user.noRatings' })
              )}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card bordered={false} style={{ marginBottom: '24px' }}>
            <Title level={4}>
              {intl.formatMessage({ id: 'user.postReview' })}
            </Title>
            <Form
              onFinish={handlePostReview}
              layout="vertical"
              initialValues={{ rating: 5 }}
            >
              <Form.Item
                label={intl.formatMessage({ id: 'user.rating' })}
                name="rating"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'user.rating' }),
                  },
                ]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({ id: 'user.comment' })}
                name="comment"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'user.comment' }),
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={intl.formatMessage({ id: 'user.comment' })}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {intl.formatMessage({ id: 'user.postReviewButton' })}
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Divider />
          <Title level={4}>{intl.formatMessage({ id: 'user.reviews' })}</Title>
          {reviews.slice(0, visibleCount).map((review) => (
            <Card key={review.id} style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col>
                  <Link to={`/user/${review.userId}`}>
                    <Avatar
                      size="large"
                      src={review.avatarUrl}
                      icon={<UserOutlined />}
                      style={{ cursor: 'pointer' }}
                    />
                  </Link>
                </Col>
                <Col flex="auto">
                  <Paragraph strong>
                    {review.userName}{' '}
                    <span style={{ color: 'gray', fontSize: '12px' }}>
                      - {moment(review.createdAt).format('DD/MM/YYYY HH:mm')}
                    </span>
                  </Paragraph>
                </Col>
              </Row>
              <Paragraph>{review.comment}</Paragraph>
              <Rate disabled value={review.rating} />
            </Card>
          ))}
          {visibleCount < reviews.length && (
            <Button type="link" onClick={loadMoreReviews}>
              {intl.formatMessage({ id: 'user.loadMore' })}
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default UserDetail;
