import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

function AwaitingApproval() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        setCurrentUserRole(role);
        setCurrentUserId(userId);

        const response = await fetch('/api/rentals');
        if (!response.ok) {
          throw new Error(
            intl.formatMessage({ id: 'awaitingApproval.fetch.error' })
          );
        }
        const data = await response.json();

        // Lọc dữ liệu dựa trên role
        const pendingRentals =
          role === 'Owner'
            ? data.filter(
                (rental) =>
                  rental.status === 'PendingApproval' &&
                  rental.propertyOwnerId === userId
              )
            : data.filter(
                (rental) =>
                  rental.status === 'PendingApproval' &&
                  rental.tenantId === userId
              );

        setRentals(pendingRentals);
      } catch (error) {
        message.error(
          intl.formatMessage({ id: 'awaitingApproval.fetch.error' })
        );
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
        throw new Error(
          intl.formatMessage({ id: 'awaitingApproval.usersFetch.error' })
        );
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'awaitingApproval.usersFetch.error' })
      );
    }
  };

  const handleApprove = async (rentalId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rentals/${rentalId}/approve`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(
          intl.formatMessage({ id: 'awaitingApproval.approve.error' })
        );
      }
      message.success(
        intl.formatMessage({ id: 'awaitingApproval.approve.success' })
      );

      setRentals((prevRentals) =>
        prevRentals.filter((rental) => rental.id !== rentalId)
      );
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'awaitingApproval.approve.error' })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rentalId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rentals/${rentalId}/cancel`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(
          intl.formatMessage({ id: 'awaitingApproval.cancel.error' })
        );
      }
      message.success(
        intl.formatMessage({ id: 'awaitingApproval.cancel.success' })
      );

      setRentals((prevRentals) =>
        prevRentals.filter((rental) => rental.id !== rentalId)
      );
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'awaitingApproval.cancel.error' })
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'awaitingApproval.column.id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'awaitingApproval.column.tenant' }),
      dataIndex: 'tenantId',
      key: 'tenantId',
      render: (text) => {
        const user = users.find((user) => user.id === text);
        return user ? user.userName : text;
      },
    },
    {
      title: intl.formatMessage({ id: 'awaitingApproval.column.startDate' }),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: intl.formatMessage({ id: 'awaitingApproval.column.endDate' }),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: intl.formatMessage({ id: 'awaitingApproval.column.status' }),
      dataIndex: 'status',
      key: 'status',
    },
    ...(currentUserRole === 'Owner'
      ? [
          {
            title: intl.formatMessage({ id: 'awaitingApproval.column.action' }),
            key: 'action',
            render: (text, record) => (
              <>
                <Button
                  type="primary"
                  onClick={() => handleApprove(record.id)}
                  disabled={loading}
                  style={{ marginRight: 8 }}
                >
                  {intl.formatMessage({
                    id: 'awaitingApproval.button.approve',
                  })}
                </Button>
                <Button
                  type="danger"
                  onClick={() => handleCancel(record.id)}
                  disabled={loading}
                >
                  {intl.formatMessage({ id: 'awaitingApproval.button.cancel' })}
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{intl.formatMessage({ id: 'awaitingApproval.title' })}</h2>
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
