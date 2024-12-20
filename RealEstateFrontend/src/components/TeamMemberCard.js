import React from 'react';
import '../styles/TeamMemberCard.css';
import { FiPhoneCall } from 'react-icons/fi';

const TeamMemberCard = ({ name, title, image, phone, rating, onClick }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star full">
            ★
          </span>
        ))}
        {[...Array(halfStars)].map((_, index) => (
          <span key={`half-${index}`} className="star half">
            ☆
          </span>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty">
            ☆
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="team-member-card">
      <img src={image} alt={name} className="member-image" onClick={onClick} />
      <div className="member-info">
        <h3>{name}</h3>
        <p>{title}</p>
        {phone && <p className="member-phone">{phone}</p>}
      </div>
      <div className="rating-info">
        {rating !== undefined && (
          <div className="rating">{renderStars(rating)}</div>
        )}
      </div>
      {phone && (
        <div className="contact-icon1">
          <a href={`tel:${phone}`} aria-label={`Call ${name}`}>
            <FiPhoneCall />
          </a>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
