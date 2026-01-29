import { useState } from "react";
import "../styles/contact.css";

function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !message) return;

        setShowToast(true);

        setName("");
        setEmail("");
        setMessage("");

        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    return (
        <div className="contact-page">

            <div className="contact-header">
                <h1>Get in Touch</h1>
                <p>Have feedback, ideas, or just want to say hello?</p>
            </div>

            <div className="contact-wrapper">

                {/* FORM */}
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit">Send Message</button>

                    {/* 🔥 TOAST BELOW BUTTON */}
                    {showToast && (
                        <div className="inline-toast">
                            ✅ Message Sent Successfully
                        </div>
                    )}
                </form>

                {/* INFO */}
                <div className="contact-info">
                    <h3>Contact Info</h3>

                    <div className="info-row">
                        <div className="icon">👤</div>
                        <div>
                            <small>Founder</small>
                            <p>Krupesh Soni</p>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="icon">💼</div>
                        <div>
                            <small>Role</small>
                            <p>Founder & Frontend Developer</p>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="icon">📧</div>
                        <div>
                            <small>Email</small>
                            <p>support@wallrush.in</p>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="icon">📍</div>
                        <div>
                            <small>Location</small>
                            <p>India</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-credit">
                Designed & Developed with ❤️ by <span>Krupesh Soni</span>
            </div>
        </div>
    );
}

export default Contact;
