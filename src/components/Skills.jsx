import React from 'react';

const Skills = () => {
    return (
        <section id="skills">
            <div className="section-inner">
                <div className="section-label reveal">02 / Skills</div>
                <h2 className="section-title reveal">Technical Stack</h2>
                <div className="skills-grid">
                    <div className="skill-group reveal">
                        <div className="sg-header"><span className="sg-icon">⚙️</span><span className="sg-title">Data Engineering</span></div>
                        <div className="skill-pills">
                            <div className="pill primary"><span className="pill-name">SQL</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '90%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">Python</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '85%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">PySpark</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '80%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">ETL Pipelines</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '80%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">Data Cleaning</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '75%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">Azure Databricks</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '70%' }}></div>
                                </div>
                            </div>
                            <div className="pill primary"><span className="pill-name">Delta Lake</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '65%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="skill-group reveal">
                        <div className="sg-header"><span className="sg-icon">💻</span><span className="sg-title">Programming</span></div>
                        <div className="skill-pills">
                            <div className="pill secondary"><span className="pill-name">C#</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '75%' }}></div>
                                </div>
                            </div>
                            <div className="pill secondary"><span className="pill-name">ASP.NET MVC</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '70%' }}></div>
                                </div>
                            </div>
                            <div className="pill secondary"><span className="pill-name">HTML</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '80%' }}></div>
                                </div>
                            </div>
                            <div className="pill secondary"><span className="pill-name">CSS</span>
                                <div className="pill-bar">
                                    <div className="pill-fill" style={{ '--w': '75%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="skill-group reveal">
                        <div className="sg-header"><span className="sg-icon">🗄️</span><span className="sg-title">Databases</span></div>
                        <div className="tag-cloud"><span className="tag">MySQL</span><span className="tag">SQL Server</span><span className="tag">SQLite</span></div>
                    </div>
                    <div className="skill-group reveal">
                        <div className="sg-header"><span className="sg-icon">🛠️</span><span className="sg-title">Tools & Formats</span></div>
                        <div className="tag-cloud"><span className="tag">Git</span><span className="tag">GitHub</span><span className="tag">VS Code</span><span className="tag">Jupyter</span><span className="tag">Pandas</span><span className="tag">NumPy</span><span className="tag">REST APIs</span><span className="tag">JSON</span><span className="tag">CSV</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
