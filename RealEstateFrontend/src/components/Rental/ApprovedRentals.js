import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';

function ApprovedRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rentals/approved');
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
      title: 'Mã Hợp Đồng',
      dataIndex: 'id',
      key: 'id',
    },
    
    {
      title: 'Tên Bất Động Sản',
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: 'Tên Chủ Sở Hữu',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: 'Người thuê',
      dataIndex: 'tenantName',
      key: 'tenantName',
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
        <Button
          type="primary"
          onClick={() => handleViewDetails(record)}
          disabled={loading}
        >
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
            <p>
              <strong>Mã Hợp Đồng:</strong> {selectedRental.id}
            </p>
            <p>
              <strong>Người Thuê:</strong> {selectedRental.tenantName}
            </p>
            <p>
              <strong>Bất Động Sản:</strong> {selectedRental.propertyName}
            </p>
            <p>
              <strong>Chủ Sở Hữu:</strong> {selectedRental.ownerName}
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong>{' '}
              {new Date(selectedRental.startDate).toLocaleString()}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong>{' '}
              {new Date(selectedRental.endDate).toLocaleString()}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedRental.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovedRentals;
