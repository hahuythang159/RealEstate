import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const { Option } = Select;

const AddProperty = () => {
  const [form] = Form.useForm();
  const [property, setProperty] = useState({
    title: '',
    address: '',
    description: '',
    price: '',
    ownerId: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: '',
    interior: '',
    provinceId: '',
    districtId: '',
    wardId: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const intl = useIntl();
  const navigate = useNavigate();

  // Fetch danh sách tỉnh từ API
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch danh sách huyện khi người dùng chọn tỉnh
  useEffect(() => {
    if (selectedCity) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedCity}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data.districts || []);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedCity]);

  // Fetch danh sách xã/phường khi người dùng chọn huyện
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          setWards(data.wards || []);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setProperty((prevProperty) => ({
        ...prevProperty,
        ownerId: userId,
      }));
    } else {
      setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]:
        name === 'price' ||
        name === 'bedrooms' ||
        name === 'bathrooms' ||
        name === 'area'
          ? Number(value)
          : value,
    }));
  };

  const handleNumberKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard('');
  };

  const handleUploadChange = ({ fileList }) => {
    setImageFiles(fileList);
  };

  const handleSubmit = async (values) => {
    setError('');
    setSuccess('');

    if (!selectedCity || !selectedDistrict || !selectedWard) {
      setError('Vui lòng chọn tỉnh/thành phố, quận/huyện và phường/xã.');
      return;
    }

    // Tạo FormData và thêm tất cả dữ liệu cùng file ảnh
    const formData = new FormData();

    // Thêm các thuộc tính của Property vào FormData
    formData.append('Property.OwnerId', property.ownerId);
    formData.append('Property.ProvinceId', selectedCity);
    formData.append('Property.DistrictId', selectedDistrict);
    formData.append('Property.WardId', selectedWard);

    // Thêm các trường dữ liệu khác vào formData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(`Property.${key}`, value);
    });

    imageFiles.forEach((file) => {
      formData.append('Images', file.originFileObj);
    });

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend error:', errorData);

        setError(
          errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : 'Có lỗi xảy ra. Vui lòng thử lại.'
        );
        return;
      }
      const data = await response.json();
      setSuccess('Thêm bất động sản thành công với ID: ' + data.id);
      message.success('Thêm bất động sản thành công!');
      navigate('/owner/add-property');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  return (
    <div>
      <h2>{intl.formatMessage({ id: 'add_property' })}</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={intl.formatMessage({ id: 'title' })}
          name="title"
          rules={[{ required: true, message: 'Hãy nhập tiêu đề' }]}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'city' })}>
          <Select
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Chọn tỉnh/thành phố"
          >
            {cities.map((city) => (
              <Option key={city.code} value={city.code}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'district' })}>
          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Chọn quận/huyện"
          >
            {districts.map((district) => (
              <Option key={district.code} value={district.code}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'ward' })}>
          <Select
            value={selectedWard}
            onChange={(value) => setSelectedWard(value)}
            placeholder="Chọn xã/phường"
          >
            {wards.map((ward) => (
              <Option key={ward.code} value={ward.code}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'address' })}
          name="address"
          rules={[{ required: true, message: 'Hãy nhập số nhà/ tên đường' }]}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'description' })}
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'price' })}
          required
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => setProperty({ ...property, price: value })}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'uploadImages' })} required>
          <Upload
            listType="picture-card"
            fileList={imageFiles}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
          >
            {imageFiles.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'bedrooms' })}
          required
          name="bedrooms"
          rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => setProperty({ ...property, bedrooms: value })}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'bathrooms' })}
          required
          name="bathrooms"
          rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => setProperty({ ...property, bathrooms: value })}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'area' })}
          required
          name="area"
          rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            onChange={(value) => setProperty({ ...property, area: value })}
            onKeyPress={handleNumberKeyPress}
          />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'propertyType' })}
          required
          name="propertyType"
          rules={[
            { required: true, message: 'Vui lòng chọn loại bất động sản' },
          ]}
        >
          <Select
            onChange={(value) =>
              setProperty({ ...property, propertyType: value })
            }
          >
            <Option value="Căn hộ/Chung cư">Căn hộ/Chung cư</Option>
            <Option value="Phòng trọ">Phòng trọ</Option>
            <Option value="Nhà riêng">Nhà riêng</Option>
            <Option value="Đất nền">Đất nền</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'interior' })}
          name="interior"
        >
          <Select
            onChange={(value) => setProperty({ ...property, interior: value })}
          >
            <Option value="Nội thất cao cấp">Nội thất cao cấp</Option>
            <Option value="Nội thất cơ bản">Nội thất cơ bản</Option>
            <Option value="Không có nội thất">Không có nội thất</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm bất động sản
          </Button>
        </Form.Item>
      </Form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddProperty;
