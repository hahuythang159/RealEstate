import React, { useEffect, useState, useRef } from 'react';
import Filters from '../components/Filters';
import PropertyList from '../components/PropertyList';
import ImageCarousel from '../components/ImageCarousel';
import TrustedCompanies from '../components/TrustedCompanies';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import Testimonials from '../components/Testimonials';
import Footer from '../pages/Footer';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import '../styles/fadeInOut.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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
  const [interior, setInterior] = useState(null);
  const [sort, setSort] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const propertiesListRef = useRef(null);

  const isImageCarouselVisible = useIntersectionObserver({
    target: '.image-carousel1',
  });
  const isHeroSectionVisible = useIntersectionObserver({
    target: '.hero-section1',
  });
  const isTestimonialsVisible = useIntersectionObserver({
    target: '.testimonials-section1',
  });
  const isTrustedCompaniesVisible = useIntersectionObserver({
    target: '.trusted-companies1',
  });
  const isTeamSectionVisible = useIntersectionObserver({
    target: '.team-section1',
  });
  const isFooterVisible = useIntersectionObserver({ target: '.footer1' });

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
      if (interior) query.append('interior', interior);
      if (sort) query.append('sort', sort);

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
  }, [
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    interior,
    sort,
  ]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const response = await fetch(
        `/api/properties/search?title=${encodeURIComponent(term)}`
      );
      const data = await response.json();
      setProperties(data);

      // Cuộn xuống danh sách bất động sản khi tìm kiếm
      if (propertiesListRef.current) {
        propertiesListRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      fetchProperties();
    }
  }, [searchTerm]);

  const paginatedProperties = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <div
        className={`image-carousel1 ${isImageCarouselVisible ? 'fade-in' : 'fade-out'}`}
      >
        <ImageCarousel />
      </div>
      <div
        className={`trusted-companies1 ${isTrustedCompaniesVisible ? 'fade-in' : 'fade-out'}`}
      >
        <TrustedCompanies />
      </div>
      <div
        className={`hero-section1 ${isHeroSectionVisible ? 'fade-in' : 'fade-out'}`}
      >
        <HeroSection onSearch={handleSearch} />
      </div>
      <div
        className={`team-section1 ${isTeamSectionVisible ? 'fade-in' : 'fade-out'}`}
      >
        <TeamSection />
      </div>
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
        setInterior={setInterior}
        setSort={setSort}
        handleFilterChange={fetchProperties}
      />
      <div ref={propertiesListRef}>
        <PropertyList
          ref={propertiesListRef}
          properties={properties}
          paginatedProperties={paginatedProperties}
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>

      <div
        className={`testimonials-section1 ${isTestimonialsVisible ? 'fade-in' : 'fade-out'}`}
      >
        <Testimonials />
      </div>
      <div className={`footer1 ${isFooterVisible ? 'fade-in' : 'fade-out'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
