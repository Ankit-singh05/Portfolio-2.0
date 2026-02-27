import React from 'react';

const Navbar = () => {
    return (
        <nav id="navbar">
            <div className="nav-inner">
                <a className="nav-logo" href="#hero">AS<span className="dot">.</span></a>
                <ul className="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#certifications">Certifications</a></li>
                    <li><a href="#game" style={{ color: 'var(--accent)' }}>🎮 Play</a></li>
                    <li><a href="#game" style={{ color: 'var(--accent)' }}>🎮 Play</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <a className="btn-resume" href="#">Download CV</a>
                <button className="hamburger" id="hamburger"><span></span><span></span><span></span></button>
            </div>
            <div className="mobile-menu" id="mobileMenu">
                <a href="#about" className="mob-link">About</a>
                <a href="#skills" className="mob-link">Skills</a>
                <a href="#projects" className="mob-link">Projects</a>
                <a href="#certifications" className="mob-link">Certifications</a>
                <a href="#game" className="mob-link" style={{ color: 'var(--accent)' }}>🎮 Play Game</a>
                <a href="#game" className="mob-link accent">🎮 Play Game</a>
                <a href="#contact" className="mob-link">Contact</a>
                <a href="#" className="mob-link accent">Download CV</a>
            </div>
        </nav>
    );
};

export default Navbar;
