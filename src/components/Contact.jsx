import React from 'react';

const Contact = () => {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const msg = document.getElementById('formMsg');
        const btn = e.target.querySelector('button[type="submit"]');
        if (!document.getElementById('fname').value.trim() || !document.getElementById('femail').value.trim() || !document.getElementById('fmessage').value.trim()) {
            msg.textContent = 'Please fill in all required fields.'; msg.className = 'form-msg error'; return;
        }
        btn.textContent = 'Sending...'; btn.disabled = true;
        setTimeout(() => { msg.textContent = '✅ Message sent! I\'ll get back to you soon.'; msg.className = 'form-msg success'; btn.textContent = 'Send Message'; btn.disabled = false; e.target.reset(); }, 1200);
    };

    return (
        <section id="contact">
            <div className="section-inner">
                <div className="section-label reveal">05 / Contact</div>
                <h2 className="section-title reveal">Let's Connect</h2>
                <p className="contact-sub reveal">Open to Data Engineer roles, internships, and collaborations. Let's talk!</p>
                <div className="contact-grid">
                    <div className="contact-info reveal">
                        <a href="/cdn-cgi/l/email-protection#04656a6f6d70776d6a636c363735363631446369656d682a676b69" className="contact-item">
                            <div className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg></div>
                            <div>
                                <div className="ci-label">Email</div>
                                <div className="ci-value"><span className="__cf_email__" data-cfemail="b7d6d9dcdec3c4ded9d0df858486858582f7d0dad6dedb99d4d8da">[email&#160;protected]</span></div>
                            </div>
                        </a>
                        <a href="tel:+918299657259" className="contact-item">
                            <div className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                            </svg></div>
                            <div>
                                <div className="ci-label">Phone</div>
                                <div className="ci-value">+91 82996 57259</div>
                            </div>
                        </a>
                        <div className="contact-item no-link">
                            <div className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg></div>
                            <div>
                                <div className="ci-label">Location</div>
                                <div className="ci-value">Uttar Pradesh, India</div>
                            </div>
                        </div>
                        <a href="https://github.com/Ankit-singh05" target="_blank" rel="noreferrer" className="contact-item">
                            <div className="ci-icon"><svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg></div>
                            <div>
                                <div className="ci-label">GitHub</div>
                                <div className="ci-value">github.com/Ankit-singh05</div>
                            </div>
                        </a>
                        <a href="https://www.linkedin.com/in/ankit-singh-2b2a71295" target="_blank" rel="noreferrer" className="contact-item">
                            <div className="ci-icon"><svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                <circle cx="4" cy="4" r="2" />
                            </svg></div>
                            <div>
                                <div className="ci-label">LinkedIn</div>
                                <div className="ci-value">linkedin.com/in/ankit-singh-2b2a71295</div>
                            </div>
                        </a>
                    </div>
                    <div className="contact-form reveal">
                        <h3>Send a Message</h3>
                        <form id="contactForm" onSubmit={handleFormSubmit}>
                            <div className="form-row">
                                <div className="form-group"><input type="text" id="fname" placeholder="Your Name" required /></div>
                                <div className="form-group"><input type="email" id="femail" placeholder="Your Email" required /></div>
                            </div>
                            <div className="form-group"><input type="text" placeholder="Subject" /></div>
                            <div className="form-group"><textarea id="fmessage" placeholder="Your Message..." rows="5" required></textarea></div>
                            <button type="submit" className="btn-primary full">Send Message</button>
                            <div id="formMsg" className="form-msg"></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
