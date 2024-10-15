import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

function ApprovedRentals() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng


  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        await fetchUsers(); // Gọi hàm lấy người dùng
        const response = await fetch('/api/rentals?status=Approved');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách hợp đồng đã duyệt.');
        }
        const data = await response.json();
        setRentals(data);
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
      const response = await fetch('/api/users'); // Giả sử API này trả về danh sách người dùng
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách người dùng.');
      }
      const data = await response.json();
      setUsers(data); // Lưu danh sách người dùng vào state
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
          const user = users.find(user => user.id === text); // Tìm người dùng theo ID
          return user ? user.userName : text; // Nếu tìm thấy, hiển thị tên; nếu không, hiển thị ID
        },
      },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
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
            <p><strong>Ngày bắt đầu:</strong> {new Date(selectedRental.startDate).toLocaleDateString()}</p>
            <p><strong>Ngày kết thúc:</strong> {new Date(selectedRental.endDate).toLocaleDateString()}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedRental.paymentMethod}</p>
            <p><strong>Trạng thái:</strong> {selectedRental.status}</p>
            {/* Thêm thông tin khác nếu cần */}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovedRentals;
