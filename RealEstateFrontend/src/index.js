import React from 'react';
import ReactDOM from 'react-dom/client'; // Cập nhật import
import App from './App';
import './index.css'; // Nếu bạn có file CSS toàn cục

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
