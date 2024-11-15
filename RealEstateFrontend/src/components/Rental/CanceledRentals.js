import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spin, message } from 'antd';
import { useIntl } from 'react-intl';

const CanceledRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    fetchCanceledRentals();
  }, []);

  const fetchCanceledRentals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rentals/canceled');
      if (!response.ok) {
        throw new Error(intl.formatMessage({ id: 'fetch_error' }));
      }
      const data = await response.json();
      setRentals(data);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'fetch_error' }));
    } finally {
      setLoading(false);
    }
  };

  const showModal = (rental) => {
    setSelectedRental(rental);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRental(null);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'contract_id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'tenant_name' }),
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: intl.formatMessage({ id: 'property_name' }),
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: intl.formatMessage({ id: 'owner_name' }),
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span>{status}</span>,
    },
    {
      title: intl.formatMessage({ id: 'action' }),
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => showModal(record)} type="link">
          {intl.formatMessage({ id: 'view_details' })}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>{intl.formatMessage({ id: 'canceled_rentals' })}</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table columns={columns} dataSource={rentals} rowKey="id" />
      )}

      <Modal
        title={intl.formatMessage({ id: 'contract_details' })}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRental ? (
          <div>
            <p><strong>{intl.formatMessage({ id: 'contract_id' })}:</strong> {selectedRental.id}</p>
            <p><strong>{intl.formatMessage({ id: 'tenant_name' })}:</strong> {selectedRental.tenantName}</p>
            <p><strong>{intl.formatMessage({ id: 'property_name' })}:</strong> {selectedRental.propertyName}</p>
            <p><strong>{intl.formatMessage({ id: 'owner_name' })}:</strong> {selectedRental.ownerName}</p>
            <p><strong>{intl.formatMessage({ id: 'status' })}:</strong> {selectedRental.status}</p>
          </div>
        ) : (
          <p>{intl.formatMessage({ id: 'contract_not_found' })}</p>
        )}
      </Modal>
    </div>
  );
};

export default CanceledRentals;
