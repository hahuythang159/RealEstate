import React from 'react';
import { Row, Col, Select, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const { Option } = Select;

const Filters = ({
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  setMinPrice,
  setMaxPrice,
  setBedrooms,
  setBathrooms,
  setInterior,
  setSort,
  handleFilterChange,
}) => {
  const intl = useIntl();
  const handleClearFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setMinPrice(null);
    setMaxPrice(null);
    setBedrooms(null);
    setBathrooms(null);
    setInterior(null);
    setSort(null);
    handleFilterChange();
  };
  const handleSortChange = (value) => {
    setSort(value);
    handleFilterChange();
  };

  return (
    <Row gutter={[16, 16]} style={{ paddingTop: 20 }}>
      {/* Chọn tỉnh */}
      <Col xs={24} sm={8} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_province' })}
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

      {/* Chọn huyện */}
      <Col xs={24} sm={8} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_district' })}
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

      {/* Chọn xã */}
      <Col xs={24} sm={8} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_ward' })}
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

      {/* Chọn khoảng giá */}
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_price_range' })}
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
          <Option value="below1">
            {intl.formatMessage({ id: 'below_1_million' })}
          </Option>
          <Option value="1to2">
            {intl.formatMessage({ id: '1_to_2_million' })}
          </Option>
          <Option value="2to4">
            {intl.formatMessage({ id: '2_to_4_million' })}
          </Option>
          <Option value="4to6">
            {intl.formatMessage({ id: '4_to_6_million' })}
          </Option>
          <Option value="6to8">
            {intl.formatMessage({ id: '6_to_8_million' })}
          </Option>
          <Option value="8to10">
            {intl.formatMessage({ id: '8_to_10_million' })}
          </Option>
          <Option value="above10">
            {intl.formatMessage({ id: 'above_10_million' })}
          </Option>
        </Select>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_sort_by_date' })}
          style={{ width: '100%' }}
          onChange={(value) => setSort(value)}
        >
          <Option value="asc">
            {intl.formatMessage({ id: 'oldest_first' })}
          </Option>
          <Option value="desc">
            {intl.formatMessage({ id: 'newest_first' })}
          </Option>
        </Select>
      </Col>

      {/* Chọn số phòng ngủ */}
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_bedrooms' })}
          style={{ width: '100%' }}
          onChange={(value) => {
            if (value === 'above4') {
              setBedrooms(4);
            } else {
              setBedrooms(value);
            }
          }}
        >
          <Option value={1}>{intl.formatMessage({ id: 'bedroom_1' })}</Option>
          <Option value={2}>{intl.formatMessage({ id: 'bedroom_2' })}</Option>
          <Option value={3}>{intl.formatMessage({ id: 'bedroom_3' })}</Option>
          <Option value="above4">
            {intl.formatMessage({ id: 'bedroom_above_4' })}
          </Option>
        </Select>
      </Col>

      {/* Chọn số phòng tắm */}
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_bathrooms' })}
          style={{ width: '100%' }}
          onChange={(value) => {
            if (value === 'above4') {
              setBathrooms(4);
            } else {
              setBathrooms(value);
            }
          }}
        >
          <Option value={1}>{intl.formatMessage({ id: 'bathroom_1' })}</Option>
          <Option value={2}>{intl.formatMessage({ id: 'bathroom_2' })}</Option>
          <Option value={3}>{intl.formatMessage({ id: 'bathroom_3' })}</Option>
          <Option value="above4">
            {intl.formatMessage({ id: 'bathroom_above_4' })}
          </Option>
        </Select>
      </Col>

      {/* Chọn nội thất */}
      <Col xs={24} sm={12} md={6}>
        <Select
          placeholder={intl.formatMessage({ id: 'select_interior' })}
          style={{ width: '100%' }}
          onChange={(value) => setInterior(value)}
        >
          <Option value="Nội thất cao cấp">
            {intl.formatMessage({ id: 'luxury_interior' })}
          </Option>
          <Option value="Nội thất cơ bản">
            {intl.formatMessage({ id: 'basic_interior' })}
          </Option>
          <Option value="Không có nội thất">
            {intl.formatMessage({ id: 'no_interior' })}
          </Option>
        </Select>
      </Col>

      {/* Áp dụng bộ lọc */}
      <Col xs={24} sm={12} md={6}>
        <Button
          type="default"
          icon={<ClearOutlined />}
          onClick={handleClearFilters}
          style={{ width: '100%' }}
        >
          {intl.formatMessage({ id: 'apply_filter' })}
        </Button>
      </Col>
    </Row>
  );
};

export default Filters;
