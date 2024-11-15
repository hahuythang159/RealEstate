// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import Filters from '../components/Filters';
import PropertyList from '../components/PropertyList';
import ImageCarousel from '../components/ImageCarousel';
import TrustedCompanies from '../components/TrustedCompanies';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import Testimonials from '../components/Testimonials';
import Footer from '../pages/Footer';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

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

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
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

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
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
      const data = await response.json();
      setProperties(data);
      setTotal(data.length);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [minPrice, maxPrice, bedrooms, bathrooms, selectedProvince, selectedDistrict, selectedWard]);

  const paginatedProperties = properties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <ImageCarousel />
      <TrustedCompanies />
      <HeroSection />
      <TeamSection />
      <Filters 
        provinces={provinces}
        districts={districts}
        wards={wards}
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        selectedWard={selectedWard}
        setSelectedProvince={setSelectedProvince}
        setSelectedDistrict={setSelectedDistrict}
        setSelectedWard={setSelectedWard}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setBedrooms={setBedrooms}
        setBathrooms={setBathrooms}
        handleFilterChange={fetchProperties}
      />
      <PropertyList
        properties={properties}
        paginatedProperties={paginatedProperties}
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />      
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
