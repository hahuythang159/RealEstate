import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import './TeamSection.css';

const TeamSection = () => {
    const teamMembers = [
        {
            name: 'Janny Mari',
            title: 'Property Expert',
            image: '/images/LogoRealEstate.png'
        },
        {
            name: 'Michel Smith',
            title: 'Property Expert',
            image: '/images/LogoRealEstate.png'
        },
        {
            name: 'Sara Prova',
            title: 'Property Expert',
            image: '/images/LogoRealEstate.png'
        }
    ];

    return (
        <section className="team-section">
            <div className="team-header">
                <h5>Team Member</h5>
                <h2>Meet The Awesome Team</h2>
                <p>Realar help you easily create a real estate trading website. With the function Register, Login, Post real estate news.</p>
                <button className="view-all-btn">View All Team</button>
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
