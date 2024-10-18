import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

function ApprovedRentals() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        const response = await fetch('/api/rentals?status=Approved');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách hợp đồng đã duyệt.');
        }
        const data = await response.json();
        const approvedRentals = data.filter(rental => rental.status === 'Approved');
        setRentals(approvedRentals);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        message.error('Có lỗi xảy ra khi lấy danh sách hợp đồng đã duyệt.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách người dùng.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Có lỗi xảy ra khi lấy danh sách người dùng.');
    }
  };

  const handleViewDetails = (rental) => {
    setSelectedRental(rental);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedRental(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRental(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người thuê',
      dataIndex: 'tenantId',
      key: 'tenantId',
      render: (text) => {
        const user = users.find(user => user.id === text); 
        return user ? user.userName : text;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleString(), // Hiển thị giờ, phút, giây
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleString(), // Hiển thị giờ, phút, giây
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record)} disabled={loading}>
          Xem Chi Tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Danh sách hợp đồng đã duyệt</h2>
      <Table
        columns={columns}
        dataSource={rentals}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Chi tiết hợp đồng"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {selectedRental && (
          <div>
            <p><strong>Người thuê:</strong> {selectedRental.tenantId}</p>
            <p><strong>Ngày bắt đầu:</strong> {new Date(selectedRental.startDate).toLocaleString()}</p>
            <p><strong>Ngày kết thúc:</strong> {new Date(selectedRental.endDate).toLocaleString()}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedRental.paymentMethod}</p>
            <p><strong>Trạng thái:</strong> {selectedRental.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovedRentals;
