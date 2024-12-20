import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

// Import các trang
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './users/UserList';
import ProfilePage from './users/ProfilePage';
import UserReview from './users/UserReview';
import NotFound from './pages/NotFound';

// Import các thành phần
import AppHeader from './components/Header';
import SocialLinks from './components/SocialLinks';
import Favorites from './components/Favorite/FavoriteList';
import './App.css';
import AddRental from './components/Rental/AddRental';
import AddProperty from './components/Property/AddProperty';
import PropertyDetail from './components/Property/PropertyDetail';
import Home from './components/Home';
import AwaitingApproval from './components/Rental/AwaitingApproval';
import ApprovedRentals from './components/Rental/ApprovedRentals';
import CanceledRentals from './components/Rental/CanceledRentals';
import MyPropertyList from './components/Property/MyPropertyList';
import ProductDetail from './components/Property/ProductDetail';
import ProductList from './components/Property/ProductList';
import VisitPage from './components/VisitPage';
import TrustedCompanies from './components/TrustedCompanies';
import PriceChart from './components/PriceChart';
import ThemeAndLanguageSwitcher from './components/ThemeAndLanguageSwitcher';

// Import các dashboard theo vai trò
import OwnerDashboard from './components/Dashboard/OwnerDashboard';
import TenantDashboard from './components/Dashboard/TenantDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import AccessDenied from './pages/AccessDenied';
import viMessages from './locales/vi.json';
import enMessages from './locales/en.json';
import { IntlProvider } from 'react-intl';
import { useState } from 'react';
import { ConfigProvider, theme } from 'antd';

import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactForm from './components/ContactForm';

const messages = {
  vi: viMessages,
  en: enMessages,
};
const App = () => {
  const [logo] = useState('/images/LogoRealEstate.png');
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const role = localStorage.getItem('role');
  const [locale, setLocale] = useState('vi');

  const renderDashboard = (Component, allowedRoles) => {
    return allowedRoles.includes(role) ? (
      <Component />
    ) : (
      <Navigate to="/access-denied" />
    );
  };

  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };
  const handleLocaleChange = () => {
    setLocale(locale === 'vi' ? 'en' : 'vi');
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: isDarkMode ? '#E0282E' : '#1677FF',
            colorTextBase: isDarkMode ? '#ffffff' : '#000000',
            colorBgContainer: isDarkMode ? '#000000' : '#ffffff',
            Button: {
              colorBg: isDarkMode ? '#262626' : '#e6f7ff',
              colorBgHover: isDarkMode ? '#1890ff' : '#40a9ff',
              colorBorder: isDarkMode ? '#1890ff' : '#40a9ff',
              colorText: isDarkMode ? '#ffffff' : '#000000',
            },
          },
        }}
      >
        <Router>
          <ThemeAndLanguageSwitcher
            isDarkMode={isDarkMode}
            locale={locale}
            onThemeToggle={handleClick}
            onLocaleChange={handleLocaleChange}
          />
          <AppHeader logo={logo} isDarkMode={isDarkMode} />
          <Routes>
            <Route element={renderDashboard(TenantDashboard, 'Tenant')}>
              <Route path="/tenant/profile" element={<ProfilePage />} />
              <Route path="/tenant/favorites" element={<Favorites />} />
              <Route path="/tenant/approval" element={<AwaitingApproval />} />
              <Route path="/tenant/approved" element={<ApprovedRentals />} />
            </Route>
            <Route element={renderDashboard(ManagerDashboard, 'Manager')}>
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/approved" element={<ApprovedRentals />} />
              <Route
                path="/admin/canceled-rentals"
                element={<CanceledRentals />}
              />
            </Route>
            <Route element={renderDashboard(OwnerDashboard, 'Owner')}>
              <Route path="/owner/add-property" element={<AddProperty />} />
              <Route path="/owner/profile" element={<ProfilePage />} />
              <Route path="/owner/approval" element={<AwaitingApproval />} />
              <Route path="/owner/approved" element={<ApprovedRentals />} />
              <Route path="/owner/my-properties" element={<MyPropertyList />} />
              <Route path="/owner/my-product" element={<ProductList />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/add-rental" element={<AddRental />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/trust" element={<TrustedCompanies />} />
            <Route path="/visit" element={<VisitPage />} />
            <Route path="/chart" element={<PriceChart />} />
            <Route path="/user/:userId" element={<UserReview />} />
            <Route path="/contact-us" element={<ContactForm />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <SocialLinks />
        </Router>
      </ConfigProvider>
    </IntlProvider>
  );
};

export default App;
