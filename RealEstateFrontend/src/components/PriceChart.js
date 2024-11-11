import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriceChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/properties/average-price-by-type');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const propertyTypes = data.map(item => item.propertyType);
                    const averagePrices = data.map(item => item.averagePrice);

                    setChartData({
                        labels: propertyTypes,
                        datasets: [
                            {
                                label: 'Average Rental Price by Property Type',
                                data: averagePrices,
                                backgroundColor: 'rgba(75, 192, 192, 0.7)',  // Màu sắc nhẹ nhàng
                                borderColor: 'rgba(75, 192, 192, 1)',      // Màu sắc nổi bật khi có border
                                borderWidth: 2,                             // Thêm border cho các thanh
                                hoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Màu sắc khi hover
                                hoverBorderColor: 'rgba(75, 192, 192, 1)',     // Màu sắc border khi hover
                                hoverBorderWidth: 3,                         // Border dày hơn khi hover
                            },
                        ],
                    });
                } else {
                    console.error("Dữ liệu trả về không hợp lệ:", data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ width: '80%', margin: '0 auto', paddingTop: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Biểu đồ giá thuê trung bình theo loại bất động sản</h2>
            {chartData.labels && chartData.datasets ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ giá thuê trung bình theo loại bất động sản',
                                font: {
                                    size: 20,
                                    weight: 'bold',
                                },
                                color: '#333',
                                padding: { bottom: 20 },
                            },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Màu nền tooltip
                                titleColor: '#fff',                    // Màu chữ tiêu đề
                                bodyColor: '#fff',                     // Màu chữ nội dung tooltip
                                borderColor: 'rgba(75, 192, 192, 1)', // Màu viền tooltip
                                borderWidth: 1,
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#333',  // Màu chữ trong legend
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Loại bất động sản',
                                    color: '#333',
                                    font: {
                                        size: 14,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    color: '#333',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Giá thuê trung bình (VND)',
                                    color: '#333',
                                    font: {
                                        size: 14,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    beginAtZero: true, // Đảm bảo trục y bắt đầu từ 0
                                    color: '#333',
                                    callback: function(value) { return value.toLocaleString(); },  // Hiển thị số dạng có dấu phân cách
                                },
                            },
                        },
                    }}
                />
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default PriceChart;
