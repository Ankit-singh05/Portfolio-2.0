import React from 'react';

const About = () => {
    return (
        <section id="about">
            <div className="section-inner">
                <div className="section-label reveal">01 / About</div>
                <h2 className="section-title reveal">The Story So Far</h2>
                <div className="about-grid">
                    <div className="about-text reveal">
                        <p className="about-lead">B.Tech CSE graduate from AKTU, I began my engineering journey building full-stack .NET applications — then discovered the world of data.</p>
                        <p>Working with real-world datasets exposed me to the challenges of raw, inconsistent data and the satisfaction of turning it into something reliable and useful. I shifted my focus toward <strong>Data Engineering</strong> — building ETL pipelines, working with PySpark on Azure Databricks, and engineering clean, analytics-ready datasets.</p>
                        <p>My software development background gives me an edge: I understand both the data pipeline side and the application layer that consumes it. I'm passionate about <strong>data quality, scalable pipelines</strong>, and the transformative power of clean data in decision-making.</p>
                        <p className="about-objective">🎯 <strong>Career Objective:</strong> Secure a Data Engineer role where I can build robust pipelines, solve complex data challenges, and grow in a cloud-first environment.</p>
                    </div>
                    <div className="about-highlights reveal">
                        <div className="highlight-card">
                            <div className="h-icon">⚡</div>
                            <div>
                                <div className="h-title">Fast Learner</div>
                                <div className="h-desc">Transitioned from .NET dev to Data Engineering with 6-month CETPA certification training</div>
                            </div>
                        </div>
                        <div className="highlight-card">
                            <div className="h-icon">🔧</div>
                            <div>
                                <div className="h-title">Pipeline Builder</div>
                                <div className="h-desc">Built ETL pipelines processing large-scale CSV, JSON, and API data with automated quality checks</div>
                            </div>
                        </div>
                        <div className="highlight-card">
                            <div className="h-icon">☁️</div>
                            <div>
                                <div className="h-title">Cloud Experience</div>
                                <div className="h-desc">Hands-on with Azure Databricks, PySpark distributed processing, and cloud pipeline development</div>
                            </div>
                        </div>
                        <div className="highlight-card">
                            <div className="h-icon">🎓</div>
                            <div>
                                <div className="h-title">Education</div>
                                <div className="h-desc">B.Tech CSE — Dr. A.P.J. Abdul Kalam Technical University (2021–2025)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
