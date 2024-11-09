import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Pagination,
  Select,
  Button,
  Carousel,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import PropertyCard from './Property/PropertyCard';
import Footer from '../pages/Footer';
import TrustedCompanies from './TrustedCompanies';
import HeroSection from './HeroSection';
import TeamSection from './TeamSection';
import Testimonials from './Testimonials';
import ImageCarousel from './ImageCarousel';

const { Title } = Typography;
const { Option } = Select;

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      const data = await response.json();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts);
        setWards([]);
        setSelectedWard(null);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict(null);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  // Lấy danh sách xã khi chọn huyện
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards);
      };
      fetchWards();
    } else {
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams();
      if (minPrice !== null) query.append('minPrice', minPrice);
      if (maxPrice !== null) query.append('maxPrice', maxPrice);
      if (bedrooms) query.append('bedrooms', bedrooms);
      if (bathrooms) query.append('bathrooms', bathrooms);
      if (selectedProvince) query.append('provinceId', selectedProvince);
      if (selectedDistrict) query.append('districtId', selectedDistrict);
      if (selectedWard) query.append('wardId', selectedWard);

      const response = await fetch(`/api/properties?${query.toString()}`);

      if (!response.ok) {
        throw new Error('Đã xảy ra lỗi khi lấy dữ liệu');
      }

      // Phân tích dữ liệu trả về từ API
      const data = await response.json();

      const filteredProperties = data.filter(
        (property) =>
          !property.rentals ||
          !property.rentals.some((rental) => rental.status === 'Approved')
      );
      setProperties(filteredProperties);
      setTotal(filteredProperties.length);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    selectedProvince,
    selectedDistrict,
    selectedWard,
  ]);

  const paginatedProperties = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleFilterChange = () => {
    fetchProperties();
    setCurrentPage(1);
  };

  return (
    <>
      <ImageCarousel />

      <TrustedCompanies />

      <HeroSection />

      <TeamSection />

      <Row gutter={[16, 16]} style={{ paddingTop: 20 }}>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Chọn tỉnh"
            style={{ width: '100%' }}
            onChange={(value) => {
              setSelectedProvince(value);
              setSelectedDistrict(null);
              setSelectedWard(null);
            }}
          >
            {provinces.map((province) => (
              <Option key={province.code} value={province.code}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Chọn huyện"
            style={{ width: '100%' }}
            onChange={(value) => {
              setSelectedDistrict(value);
              setSelectedWard(null);
            }}
            disabled={!selectedProvince}
          >
            {districts.map((district) => (
              <Option key={district.code} value={district.code}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Chọn xã"
            style={{ width: '100%' }}
            onChange={(value) => setSelectedWard(value)}
            disabled={!selectedDistrict}
          >
            {wards.map((ward) => (
              <Option key={ward.code} value={ward.code}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Chọn khoảng giá"
            style={{ width: '100%' }}
            onChange={(value) => {
              switch (value) {
                case 'below1':
                  setMinPrice(0);
                  setMaxPrice(1000000);
                  break;
                case '1to2':
                  setMinPrice(1000000);
                  setMaxPrice(2000000);
                  break;
                case '2to4':
                  setMinPrice(2000000);
                  setMaxPrice(4000000);
                  break;
                case '4to6':
                  setMinPrice(4000000);
                  setMaxPrice(6000000);
                  break;
                case '6to8':
                  setMinPrice(6000000);
                  setMaxPrice(8000000);
                  break;
                case '8to10':
                  setMinPrice(8000000);
                  setMaxPrice(10000000);
                  break;
                case 'above10':
                  setMinPrice(10000000);
                  setMaxPrice(null);
                  break;
                default:
                  setMinPrice(null);
                  setMaxPrice(null);
              }
            }}
          >
            <Option value="below1">Giá dưới 1 triệu</Option>
            <Option value="1to2">Giá 1 - 2 triệu</Option>
            <Option value="2to4">Giá 2 - 4 triệu</Option>
            <Option value="4to6">Giá 4 - 6 triệu</Option>
            <Option value="6to8">Giá 6 - 8 triệu</Option>
            <Option value="8to10">Giá 8 - 10 triệu</Option>
            <Option value="above10">Giá trên 10 triệu</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Chọn số phòng ngủ"
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value === 'above4') {
                setBedrooms(4);
              } else {
                setBedrooms(value);
              }
            }}
          >
            <Option value={1}>1 phòng ngủ</Option>
            <Option value={2}>2 phòng ngủ</Option>
            <Option value={3}>3 phòng ngủ</Option>
            <Option value="above4">Trên 4 phòng ngủ</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Chọn số phòng tắm"
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value === 'above4') {
                setBathrooms(4);
              } else {
                setBathrooms(value);
              }
            }}
          >
            <Option value={1}>1 phòng tắm</Option>
            <Option value={2}>2 phòng tắm</Option>
            <Option value={3}>3 phòng tắm</Option>
            <Option value="above4">Trên 4 phòng tắm</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={handleFilterChange}
            style={{ width: '100%' }}
          >
            Áp dụng bộ lọc
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 32]} style={{ paddingTop: 50, paddingLeft: 50 }}>
        {paginatedProperties.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center' }}>
            <img
              src="/images/anh1.jpg"
              alt="No results"
              style={{ width: '50%', marginBottom: 20 }}
            />
            <p>Không có bất động sản nào để hiển thị.</p>
          </Col>
        ) : (
          paginatedProperties.map((property) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={property.id}
              className="property-card"
            >
              <PropertyCard property={property} />
            </Col>
          ))
        )}
      </Row>

      {total > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          style={{ marginTop: 20, textAlign: 'center' }}
        />
      )}

      <Testimonials />

      <Footer />
    </>
  );
};

export default Home;
