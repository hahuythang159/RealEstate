import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

function AwaitingApproval() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        const role = localStorage.getItem('role');
        setCurrentUserRole(role);

        const response = await fetch('/api/rentals');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách hợp đồng.');
        }
        const data = await response.json();

        const pendingRentals = data.filter(rental => rental.status === 'PendingApproval');
        setRentals(pendingRentals);
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

  const handleApprove = async (rentalId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rentals/${rentalId}/approve`, {
        method: 'PATCH',
      });
      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error approving rental:', responseData);

        throw new Error('Lỗi khi duyệt hợp đồng.');
      }
      message.success('Hợp đồng đã được duyệt thành công và email đã được gửi.');


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
        const user = users.find(user => user.id === text);
        return user ? user.userName : text;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    ...(currentUserRole === 'Owner' ? [{
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleApprove(record.id)} disabled={loading}>
          Duyệt
        </Button>
      ),
    }] : []),
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
