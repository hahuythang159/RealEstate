import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { useIntl } from 'react-intl';

function ApprovedRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        setCurrentUserRole(role);
        setCurrentUserId(userId);

        const response = await fetch('/api/rentals/approved');
        if (!response.ok) {
          throw new Error(
            intl.formatMessage({ id: 'awaitingApproval.fetch.error' })
          );
        }
        const data = await response.json();

        // Lọc dữ liệu chỉ cho phép tenant và owner thấy rental của họ
        let filteredRentals = [];
        if (role === 'Manager') {
          filteredRentals = data; // Manager có thể thấy tất cả rental đã duyệt
        } else if (role === 'Owner') {
          filteredRentals = data.filter(
            (rental) => rental.ownerId === userId // Chủ sở hữu chỉ thấy bất động sản của mình
          );
        } else if (role === 'Tenant') {
          filteredRentals = data.filter(
            (rental) => rental.tenantId === userId // Tenant chỉ thấy bất động sản mà họ thuê
          );
        }

        setRentals(filteredRentals);
      } catch (error) {
        message.error(
          intl.formatMessage({ id: 'awaitingApproval.fetch.error' })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [intl]);

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
      title: intl.formatMessage({ id: 'contract.id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'property.name' }),
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: intl.formatMessage({ id: 'owner.name' }),
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: intl.formatMessage({ id: 'tenant.name' }),
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: intl.formatMessage({ id: 'actions' }),
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleViewDetails(record)}
          disabled={loading}
        >
          {intl.formatMessage({ id: 'view.details' })}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{intl.formatMessage({ id: 'approvedRentals.title' })}</h2>
      <Table
        columns={columns}
        dataSource={rentals}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={intl.formatMessage({ id: 'modal.contractDetails' })}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okButtonProps={{ style: { marginRight: 8 } }}
        cancelButtonProps={{ style: { marginLeft: 8 } }}
      >
        {selectedRental && (
          <div>
            <p>
              <strong>{intl.formatMessage({ id: 'contract.id' })}:</strong>{' '}
              {selectedRental.id}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'tenant.name' })}:</strong>{' '}
              {selectedRental.tenantName}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'property.name' })}:</strong>{' '}
              {selectedRental.propertyName}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'owner.name' })}:</strong>{' '}
              {selectedRental.ownerName}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'start.date' })}:</strong>{' '}
              {new Date(selectedRental.startDate).toLocaleString()}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'end.date' })}:</strong>{' '}
              {new Date(selectedRental.endDate).toLocaleString()}
            </p>
            <p>
              <strong>{intl.formatMessage({ id: 'status' })}:</strong>{' '}
              {selectedRental.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovedRentals;
