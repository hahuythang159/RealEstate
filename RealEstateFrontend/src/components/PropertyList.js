import React from 'react';
import { Row, Col, Pagination } from 'antd';
import { useIntl } from 'react-intl';
import PropertyCard from './Property/PropertyCard';

const PropertyList = ({ properties, paginatedProperties, total, pageSize, currentPage, handlePageChange }) => {
  const intl = useIntl(); 

  return (
    <>
      <Row gutter={[16, 32]} style={{ paddingTop: 50, paddingLeft: 50 }}>
        {paginatedProperties.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center' }}>
            <img
              src="/images/anh1.jpg"
              alt="No results"
              style={{ width: '50%', marginBottom: 20 }}
            />
            <p>{intl.formatMessage({ id: 'no_properties_message' })}</p>
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
    </>
  );
};

export default PropertyList;
