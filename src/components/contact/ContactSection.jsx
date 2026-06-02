import React, { useState } from "react";
import "./ContactSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";  

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("https://formsubmit.co/ajax/d7efe01cf1162e21bd24453544316768", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `KrishiDisha Contact: ${formData.subject}`,
          message: formData.message
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact Submit Error:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section" id="contact-section">
      <div className="contact-wrapper">
        <div className="contact-info-side">
          <span className="contact-badge"> Get In Touch</span>
          <h2 className="contact-heading">
            Let's Talk About Your <span className="highlight">Farming Needs</span>
          </h2>
          <p className="contact-subtext">
            Have questions about crop recommendations, fertilizer usage, or need help? We'd love to hear from you.
          </p>
          <div className="contact-details">
            <div className="detail-item">
              <div className="detail-icon"><FontAwesomeIcon icon={faLocationCrosshairs} /></div>
              <div>
                <p className="detail-label">Location</p>
                <p className="detail-value">Sultanpur, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><FontAwesomeIcon icon={faEnvelope} /></div>
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">manojyadav9027@gmail.com</p>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><FontAwesomeIcon icon={faPhone} / ></div>
              <div>
                <p className="detail-label">Phone</p>
                <p className="detail-value">+91 9627587187</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-form-side">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <select id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="">Select a topic</option>
                <option value="crop">Crop Recommendation</option>
                <option value="fertilizer">Fertilizer Advice</option>
                <option value="mandi">Mandi Price Query</option>
                <option value="bug">Report a Bug</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Write your message..." required></textarea>
            </div>
            <button type="submit" className={`contact-submit-btn ${sending ? "sending" : ""}`} disabled={sending}>
              {sending ? (<><span className="spinner"></span> Sending...</>) : (<>Send Message <span className="btn-arrow">→</span></>)}
            </button>
            {submitted && (
              <div className="contact-success-toast">
                <span>✅</span> Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
