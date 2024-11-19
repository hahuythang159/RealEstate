import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Import ArcElement for Pie chart
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Register ArcElement for Pie chart,
  LineElement,
  PointElement
);

const PriceChart = () => {
  const [chartData, setChartData] = useState({});
  const [viewMode, setViewMode] = useState('byType');
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  // Định nghĩa mảng màu cho mỗi loại bất động sản
  const typeColors = [
    'rgba(54, 162, 235, 0.7)', // Màu cho loại 1
    'rgba(255, 99, 132, 0.7)', // Màu cho loại 2
    'rgba(75, 192, 192, 0.7)', // Màu cho loại 3
    'rgba(153, 102, 255, 0.7)', // Màu cho loại 4
    'rgba(255, 159, 64, 0.7)', // Màu cho loại 5
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [byTypeResponse, byMonthResponse, byYearResponse] =
          await Promise.all([
            fetch('/api/properties/average-price-by-type'),
            fetch('/api/properties/average-price-by-month'),
            fetch('/api/properties/average-price-by-year'),
          ]);

        if (!byTypeResponse.ok || !byMonthResponse.ok || !byYearResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const [byTypeData, byMonthData, byYearData] = await Promise.all([
          byTypeResponse.json(),
          byMonthResponse.json(),
          byYearResponse.json(),
        ]);

        setChartData({
          byType: {
            labels: byTypeData.map((item) => item.propertyType),
            datasets: [
              {
                label: 'Giá trung bình theo loại bất động sản',
                data: byTypeData.map((item) => item.averagePrice),
                backgroundColor: byTypeData.map(
                  (_, index) => typeColors[index % typeColors.length]
                ), // Áp dụng màu cho mỗi loại
                borderColor: byTypeData.map(
                  (_, index) => typeColors[index % typeColors.length]
                ), // Đặt màu viền giống màu nền
                borderWidth: 2,
              },
              {
                type: 'line', // Biểu đồ đường
                label: 'Xu hướng giá trung bình',
                data: byTypeData.map((item) => item.averagePrice), // Sử dụng dữ liệu thực tế
                borderColor: 'rgba(255, 99, 132, 1)', // Màu đường
                borderWidth: 2,
                tension: 0.4, // Làm mềm đường
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              },
            ],
          },
          byMonth: {
            labels: byMonthData.map((item) => `${item.month}/${item.year}`),
            datasets: [
              {
                label: 'Giá trung bình theo tháng',
                data: byMonthData.map((item) => item.averagePrice),
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
              },
            ],
          },
          byYear: {
            labels: byYearData.map((item) => item.year),
            datasets: [
              {
                label: 'Giá trung bình theo năm',
                data: byYearData.map((item) => item.averagePrice),
                backgroundColor: 'rgba(153, 102, 255, 0.7)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
              },
            ],
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = (xLabel, yLabel) => ({
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    plugins: {
      title: {
        display: true,
        text: `Biểu đồ - ${xLabel}`,
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} VND`;
          },
        },
      },
      legend: {
        labels: { font: { size: 12 } },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
          font: { size: 14, weight: 'bold' },
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
          font: { size: 14, weight: 'bold' },
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  });

  const getChartData = () => {
    switch (viewMode) {
      case 'byType':
        return chartData.byType || {};
      case 'byMonth':
        return chartData.byMonth || {};
      case 'byYear':
        return chartData.byYear || {};
      default:
        return {};
    }
  };

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'bar' ? 'pie' : 'bar'));
  };

  return (
    <div
      style={{
        width: '70%',
        margin: '0 auto',
        paddingTop: '20px',
        backgroundColor: 'rgba(249, 249, 249, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginTop: '20px',
        marginBottom: '10px',
        transition: 'all 0.3s ease',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Thống kê giá thuê bất động sản ở Việt Nam
      </h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {['byType', 'byMonth', 'byYear'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              width: '120px',
              height: '30px',
              margin: '0 15px',
              padding: '8px 16px',
              backgroundColor:
                viewMode === mode
                  ? typeColors[
                      mode === 'byType' ? 0 : mode === 'byMonth' ? 1 : 2
                    ]
                  : '#f0f0f0',
              color: viewMode === mode ? '#fff' : '#333',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '550',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            {mode === 'byType'
              ? 'Theo Loại'
              : mode === 'byMonth'
                ? 'Theo Tháng'
                : 'Theo Năm'}
          </button>
        ))}
        <button
          onClick={toggleChartType}
          style={{
            width: '150px',
            height: '30px',
            margin: '0 15px',
            padding: '8px 16px',
            backgroundColor: chartType === 'bar' ? '#4CAF50' : '#f44336',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '550',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',
          }}
        >
          {chartType === 'bar' ? 'Biểu đồ hình Tròn' : 'Biểu đồ Thanh'}
        </button>
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>
          Đang tải dữ liệu...
        </p>
      ) : chartType === 'bar' ? (
        <Bar
          data={getChartData()}
          options={chartOptions(
            viewMode === 'byType'
              ? 'Loại Bất Động Sản'
              : viewMode === 'byMonth'
                ? 'Tháng'
                : 'Năm',
            'Giá Trung Bình (VND)'
          )}
        />
      ) : (
        <Pie
          data={{
            labels: getChartData().labels,
            datasets: [
              {
                label: 'Giá Trung Bình',
                data: getChartData().datasets[0].data,
                backgroundColor: getChartData().datasets[0].backgroundColor,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const total = context.dataset.data.reduce(
                      (sum, value) => sum + value,
                      0
                    );
                    const percentage = ((context.raw / total) * 100).toFixed(2);
                    return `${context.label}: ${context.raw.toLocaleString()} VND (${percentage}%)`;
                  },
                },
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: { size: 12 },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default PriceChart;
