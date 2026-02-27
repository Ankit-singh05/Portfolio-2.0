import React from 'react';

const Hero = () => {
    return (
        <section id="hero">
            <div className="hero-bg">
                <div className="grid-lines"></div>
                <div className="orb orb1"></div>
                <div className="orb orb2"></div>
                <div className="orb orb3"></div>
            </div>
            <div className="hero-content">
                <div className="hero-text">
                    <div className="hero-badge reveal"><span className="badge-dot"></span> Open to Opportunities</div>
                    <h1 className="hero-name reveal">Ankit<br /><span className="name-accent">Singh</span></h1>
                    <p className="hero-title reveal">Aspiring Data Engineer
                        <span className="title-tags"><span>SQL</span><span>Python</span><span>PySpark</span><span>ETL</span></span>
                    </p>
                    <p className="hero-tagline reveal">Transforming raw, messy data into clean,<br />meaningful insights that drive real decisions.</p>
                    <div className="hero-ctas reveal">
                        <a href="#projects" className="btn-primary">View My Work</a>
                        <a href="public/Ankit_Singh_Resume.pdf" className="btn-secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Resume
                        </a>
                    </div>
                </div>
                <div className="hero-card reveal">
                    <div className="photo-frame">
                        <img className="photo-real"
                            src="images/ProfileImg.jpeg"
                            alt="Ankit Singh" />
                        <div className="card-stats">
                            <div className="stat"><span className="stat-num">3+</span><span className="stat-lbl">Projects</span></div>
                            <div className="stat-divider"></div>
                            <div className="stat"><span className="stat-num">6mo</span><span className="stat-lbl">Training</span></div>
                            <div className="stat-divider"></div>
                            <div className="stat"><span className="stat-num">10+</span><span className="stat-lbl">Tech Stack</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-hint"><span>Scroll</span>
                <div className="scroll-line"></div>
            </div>
        </section>
    );
};

export default Hero;
