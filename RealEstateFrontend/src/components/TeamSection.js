import React from 'react';
import { useIntl } from 'react-intl';
import TeamMemberCard from './TeamMemberCard';
import './TeamSection.css';

const TeamSection = () => {
  const intl = useIntl();

  const teamMembers = [
    {
      name: 'Janny Mari',
      title: 'Property Expert',
      image: '/images/LogoRealEstate.png',
    },
    {
      name: 'Michel Smith',
      title: 'Property Expert',
      image: '/images/LogoRealEstate.png',
    },
    {
      name: 'Sara Prova',
      title: 'Property Expert',
      image: '/images/LogoRealEstate.png',
    },
  ];

  return (
    <section className="team-section">
      <div className="team-header">
        <h5>{intl.formatMessage({ id: 'team_section_header' })}</h5>
        <h2>{intl.formatMessage({ id: 'team_section_title' })}</h2> 
        <p>{intl.formatMessage({ id: 'team_section_description' })}</p> 
        <button className="view-all-btn">
          {intl.formatMessage({ id: 'team_section_view_all' })}
        </button>
      </div>
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={index}
            name={member.name}
            title={member.title}
            image={member.image}
          />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
