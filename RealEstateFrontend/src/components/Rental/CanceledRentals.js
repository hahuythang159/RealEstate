import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spin, message } from 'antd';

const CanceledRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchCanceledRentals();
    }, []);

    // Fetch rentals đã bị huỷ
    const fetchCanceledRentals = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rentals/canceled');
            if (!response.ok) {
                throw new Error('Không thể tải danh sách hợp đồng đã huỷ.');
            }
            const data = await response.json();
            setRentals(data);
        } catch (error) {
            message.error('Không thể tải danh sách hợp đồng đã huỷ.');
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị Modal chi tiết hợp đồng
    const showModal = (rental) => {
        setSelectedRental(rental);
        setIsModalVisible(true);
    };

    // Đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRental(null);
    };

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Mã Hợp Đồng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Người Thuê',
            dataIndex: 'tenantName',
            key: 'tenantName',
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
            title: 'Tình Trạng',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span>{status}</span>,
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => showModal(record)} type="link">
                    Xem Chi Tiết
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Danh Sách Hợp Đồng Đã Bị Huỷ</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table columns={columns} dataSource={rentals} rowKey="id" />
            )}

            <Modal
                title="Chi Tiết Hợp Đồng"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedRental ? (
                    <div>
                        <p><strong>Mã Hợp Đồng:</strong> {selectedRental.id}</p>
                        <p><strong>Người Thuê:</strong> {selectedRental.tenantName}</p>
                        <p><strong>Bất Động Sản:</strong> {selectedRental.propertyName}</p>
                        <p><strong>Chủ Sở Hữu:</strong> {selectedRental.ownerName}</p>
                        <p><strong>Ngày Huỷ:</strong> {new Date(selectedRental.startDate).toLocaleDateString()}</p>
                        <p><strong>Tình Trạng:</strong> {selectedRental.status}</p>
                    </div>
                ) : (
                    <p>Không có dữ liệu hợp đồng.</p>
                )}
            </Modal>
        </div>
    );
};

export default CanceledRentals;
