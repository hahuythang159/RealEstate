import React from 'react';
import ReactDOM from 'react-dom/client'; // Cập nhật import
import App from './App';
import './index.css'; // Nếu bạn có file CSS toàn cục
import { ConfigProvider } from 'antd';
import frFR from 'antd/locale/fr_FR';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(
    <React.StrictMode>
          <ConfigProvider locale={frFR}>
        <App />
        </ConfigProvider>
    </React.StrictMode>
);
