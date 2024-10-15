import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

function AwaitingApproval() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng


  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        const response = await fetch('/api/rentals?status=PendingApproval');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách hợp đồng.');
        }
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        message.error('Có lỗi xảy ra khi lấy danh sách hợp đồng.');
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


  const handleApprove = async (rentalId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rentals/${rentalId}/approve`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Lỗi khi duyệt hợp đồng.');
      }
      message.success('Hợp đồng đã được duyệt thành công.');
      // Cập nhật lại danh sách hợp đồng
      setRentals((prevRentals) => prevRentals.filter((rental) => rental.id !== rentalId));
    } catch (error) {
      console.error('Error approving rental:', error);
      message.error('Có lỗi xảy ra khi duyệt hợp đồng.');
    } finally {
      setLoading(false);
    }
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
        <Button type="primary" onClick={() => handleApprove(record.id)} disabled={loading}>
          Duyệt
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Danh sách hợp đồng đang chờ duyệt</h2>
      <Table
        columns={columns}
        dataSource={rentals}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}

export default AwaitingApproval;
