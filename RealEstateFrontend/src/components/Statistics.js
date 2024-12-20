import React from 'react';
import { useIntl } from 'react-intl';
import '../styles/Statistics.css';

const Statistics = () => {
  const intl = useIntl();

  return (
    <div className="statistics">
      <div className="stat-item">
        <h3>{intl.formatMessage({ id: 'statistics_satisfied_customers' })}</h3>
        <p>
          {intl.formatMessage({ id: 'statistics_satisfied_customers_label' })}
        </p>
      </div>
      <div className="stat-item">
        <h3>{intl.formatMessage({ id: 'statistics_verified_properties' })}</h3>
        <p>
          {intl.formatMessage({ id: 'statistics_verified_properties_label' })}
        </p>
      </div>
    </div>
  );
};

export default Statistics;
