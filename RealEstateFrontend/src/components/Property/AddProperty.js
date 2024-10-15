  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Form, Input, Select, Button, InputNumber, message } from 'antd';
  import Title from 'antd/es/skeleton/Title';

  const { Option } = Select;

  const AddProperty = () => {
    const [form] = Form.useForm();
    const [property, setProperty] = useState({
      title:'',
      address: '',
      description: '',
      price: '',
      ownerId: '',
      imageUrl: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      propertyType: '',
      usageType: '',
      interior:'',
      provinceId: '',
      districtId: '',
      wardId: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cities, setCities] = useState([]); // Danh sách tỉnh/thành
    const [districts, setDistricts] = useState([]); // Danh sách huyện/quận
    const [wards, setWards] = useState([]); // Danh sách xã/phường
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const navigate = useNavigate();

    // Fetch danh sách tỉnh từ API
    useEffect(() => {
      fetch('https://provinces.open-api.vn/api/p/')
        .then(response => response.json())
        .then(data => {
          setCities(data);  // Đặt dữ liệu vào state
        })
        .catch(err => console.error(err));
    }, []);

    // Fetch danh sách huyện khi người dùng chọn tỉnh
    useEffect(() => {
      if (selectedCity) {
        fetch(`https://provinces.open-api.vn/api/p/${selectedCity}?depth=2`)
          .then(response => response.json())
          .then(data => {
            setDistricts(data.districts || []); // Đặt dữ liệu huyện vào state
          })
          .catch(err => console.error(err));
      }
    }, [selectedCity]);

    // Fetch danh sách xã/phường khi người dùng chọn huyện
    useEffect(() => {
      if (selectedDistrict) {
        fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
          .then(response => response.json())
          .then(data => {
            setWards(data.wards || []);  // Đặt dữ liệu xã/phường vào state
          })
          .catch(err => console.error(err));
      }
    }, [selectedDistrict]);

    // Lấy Owner ID từ localStorage khi component được mount
    useEffect(() => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setProperty(prevProperty => ({
          ...prevProperty,
          ownerId: userId,
        }));
      } else {
        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
        navigate('/login');
      }
    }, [navigate]);

    // Xử lý thay đổi dữ liệu form
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProperty(prev => ({
        ...prev,
        [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || name === "area" ? Number(value) : value
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
      setSelectedDistrict(''); // Reset quận/huyện
      setSelectedWard(''); // Reset xã/phường
    };

    const handleDistrictChange = (value) => {
      setSelectedDistrict(value);
      setSelectedWard(''); // Reset xã/phường
    };

    // Xử lý khi người dùng gửi form
    const handleSubmit = async (values) => {
      
      setError('');
      setSuccess('');

      if (!selectedCity || !selectedDistrict || !selectedWard) {
        setError('Vui lòng chọn tỉnh/thành phố, quận/huyện và phường/xã.');
        return;
      }

      // Tạo dữ liệu bất động sản để gửi
      const propertyData = {
        ...values,
        ownerId: property.ownerId,
        provinceId: selectedCity,
        districtId: selectedDistrict,
        wardId: selectedWard
      };
      console.log(propertyData)

      try {
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.errors ? Object.values(errorData.errors).flat().join(', ') : 'Có lỗi xảy ra. Vui lòng thử lại.');
          return;
        }

        const data = await response.json();
        setSuccess('Thêm bất động sản thành công với ID: ' + data.id);

        message.success('Thêm bất động sản thành công!');
        navigate('/Owner');
      } catch (err) {
        console.error('Catch error:', err);
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    };

    return (
      <div>
        <h2>Thêm Bất Động Sản</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nhập tiêu đề" name="title" rules={[{ required: true, message: 'Hãy nhập tiêu đề' }]}>
            <Input onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Thành phố" required>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="Chọn tỉnh/thành phố"
            >
              {cities.map(city => (
                <Option key={city.code} value={city.code}>{city.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận/Huyện" required>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              placeholder="Chọn quận/huyện"
            >
              {districts.map(district => (
                <Option key={district.code} value={district.code}>{district.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Phường/Xã" required>
            <Select
              value={selectedWard}
              onChange={value => setSelectedWard(value)}
              placeholder="Chọn xã/phường"
            >
              {wards.map(ward => (
                <Option key={ward.code} value={ward.code}>{ward.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Địa chỉ cụ thể" name="address" rules={[{ required: true, message: 'Hãy nhập số nhà/ tên đường' }]}>
            <Input onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Giá" required name="price" rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={value => setProperty({ ...property, price: value })}
              onKeyPress={handleNumberKeyPress}
            />
          </Form.Item>

          <Form.Item label="Hình ảnh" required name="imageUrl">
            <Input onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Phòng ngủ" required name="bedrooms" rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={value => setProperty({ ...property, bedrooms: value })}
              onKeyPress={handleNumberKeyPress}
            />
          </Form.Item>

          <Form.Item label="Phòng tắm" required name="bathrooms" rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={value => setProperty({ ...property, bathrooms: value })}
              onKeyPress={handleNumberKeyPress}
            />
          </Form.Item>

          <Form.Item label="Diện tích (m²)" required name="area" rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              onChange={value => setProperty({ ...property, area: value })}
              onKeyPress={handleNumberKeyPress}
            />
          </Form.Item>

          <Form.Item label="Loại bất động sản" required name="propertyType" rules={[{ required: true, message: 'Vui lòng chọn loại bất động sản' }]}>
            <Select onChange={value => setProperty({ ...property, propertyType: value })}>
              <Option value="Căn hộ/Chung cư">Căn hộ/Chung cư</Option>
              <Option value="Nhà riêng">Nhà riêng</Option>
              <Option value="Đất nền">Đất nền</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Loại hình sử dụng" required name="usageType" rules={[{ required: true, message: 'Vui lòng chọn loại hình sử dụng' }]}>
            <Select onChange={value => setProperty({ ...property, usageType: value })}>
              <Option value="Cho thuê">Cho thuê</Option>
              <Option value="Mua bán">Mua bán</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Tình trạng nội thất"  name="interior">
            <Select onChange={value => setProperty({ ...property, interior: value })}>
              <Option value="Nội thất cao cấp">Nội thất cao cấp</Option>
              <Option value="Nội thất cơ bản">Nội thất cơ bản</Option>
              <Option value="Không có nội thất">Không có nội thất</Option>
            </Select>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit">Thêm bất động sản</Button>
          </Form.Item>
        </Form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    );
  };

  export default AddProperty;
