import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About R's Fashion</h1>
        
        <section className="about-section">
          <h2 className="section-title">Our Story</h2>
          <p className="about-paragraph">
            Welcome to R's Fashion, where style meets sustainability. Founded in 2025, 
            we've been at the forefront of fashion innovation, bringing you the latest 
            trends while maintaining our commitment to ethical practices and environmental 
            responsibility.
          </p>
          <p className="about-paragraph">
            Our journey began with a simple idea: to create a fashion platform that 
            celebrates individuality while promoting sustainable fashion choices. Today, 
            we're proud to be a community-driven platform where fashion enthusiasts can 
            share their style, discover new trends, and connect with like-minded individuals.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="about-paragraph">
            At R's Fashion, we believe that fashion should be accessible, sustainable, 
            and empowering. Our mission is to create a space where everyone can express 
            their unique style while making conscious fashion choices that benefit both 
            people and the planet.
          </p>
          <p className="about-paragraph">
            We're committed to promoting sustainable fashion practices, supporting local 
            artisans, and fostering a community that values both style and substance. 
            Through our platform, we aim to inspire and educate our community about 
            making mindful fashion choices.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">Our Values</h2>
          <ul className="values-list">
            <li>Sustainability in every aspect of our operations</li>
            <li>Ethical fashion practices and fair trade</li>
            <li>Community engagement and support</li>
            <li>Innovation in sustainable fashion</li>
            <li>Transparency in our business practices</li>
          </ul>
        </section>

        <section className="about-section contact-section">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <p>rashenahanif@icloud.com</p>
              <h3>Phone</h3>
              <p>+1 (516) 902-6967</p>
              <h3>Address</h3>
              <p>123 Fashion Street<br />New York, NY 10001</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;