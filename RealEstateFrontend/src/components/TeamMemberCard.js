import React from 'react';
import './TeamMemberCard.css';
import { FiPhoneCall } from 'react-icons/fi';

const TeamMemberCard = ({ name, title, image }) => {
    return (
        <div className="team-member-card">
            <img src={image} alt={name} className="member-image" />
            <div className="member-info">
                <h3>{name}</h3>
                <p>{title}</p>
            </div>
            <div className="contact-icon">
                <FiPhoneCall />
            </div>
        </div>
    );
};

export default TeamMemberCard;
