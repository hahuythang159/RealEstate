import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import TeamMemberCard from './TeamMemberCard';
import '../styles/TeamSection.css';

const TeamSection = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch('/api/users/owners');
        if (!response.ok) {
          throw new Error('Failed to fetch owners');
        }
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };

    fetchOwners();
  }, []);

  return (
    <section className="team-section">
      <div className="team-header">
        <h5>{intl.formatMessage({ id: 'team_section_header' })}</h5>
        <h2>{intl.formatMessage({ id: 'team_section_title' })}</h2>
        <p>{intl.formatMessage({ id: 'team_section_description' })}</p>
      </div>
      <div className="team-members">
        {owners.map((owner) => (
          <TeamMemberCard
            key={owner.id}
            name={owner.userName}
            title="Property Owner"
            image={owner.avatarUrl || '/images/default-avatar.png'}
            phone={owner.phoneNumber}
            rating={owner.averageRating}
            onClick={() => navigate(`/user/${owner.id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
