// src/pages/SupportPage.jsx
import React, { useEffect, useContext, useState } from 'react';
import { Mail, Phone, MessageSquare, HelpCircle, Send, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { AppContext } from '../context/Appcontext';
import { Link } from 'react-router-dom'; // Import Link for navigation

const SupportPage = () => {
  const { trackInteraction } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    trackInteraction('page_view', 'support_page');
  }, [trackInteraction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    trackInteraction('input', `support_form_input_${name}`, { value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    trackInteraction('submit', 'support_form_submit_attempt');

    try {
      // Simulate API call for submitting support request
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Support Request:', formData);

      // In a real application, you'd send formData to your backend
      // const response = await fetch('/api/support', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to submit support request');
      // }

      setSuccessMessage('Your support request has been submitted successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      trackInteraction('support', 'support_form_success');
    } catch (err) {
      console.error('Support request error:', err);
      setErrorMessage('Failed to submit your request. Please try again or contact us directly.');
      trackInteraction('support', 'support_form_failure', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center md:p-12">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10 relative md:text-5xl">
        <span className="relative inline-block pb-2">
          Support Center
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></span>
        </span>
      </h1>
      <p className="text-center text-gray-600 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
        We're here to help! Fill out the form below or find answers to common questions.
      </p>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-2 text-base w-full max-w-xl animate-fade-in" role="alert">
          <CheckCircle size={20} />
          <span className="block sm:inline font-medium">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-2 text-base w-full max-w-xl animate-fade-in" role="alert">
          <AlertCircle size={20} />
          <span className="block sm:inline font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-stretch justify-center mb-8 mx-auto">
        {/* Contact Form Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 box-border md:p-8 animate-fade-in-up delay-100 flex-1 mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <MessageSquare size={28} className="text-purple-600" />
            <span>Send Us a Message</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="e.g., Issue with my listing"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-y"
                placeholder="Describe your issue or question in detail..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              disabled={loading}
              onMouseEnter={() => trackInteraction('hover', 'support_form_submit_button')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </section>
        {/* FAQ & Contact Info Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 box-border md:p-8 animate-fade-in-up delay-200 flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <HelpCircle size={28} className="text-orange-600" />
            <span>Quick Help & Contact</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-700">For general inquiries, email us at:</p>
                <a href="mailto:support@realestate.com" className="text-blue-600 hover:underline font-medium" onClick={() => trackInteraction('click', 'support_email_link')}>
                  support@realestate.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-700">Reach our support team:</p>
                <a href="tel:+911234567890" className="text-blue-600 hover:underline font-medium" onClick={() => trackInteraction('click', 'support_phone_link')}>
                  +91 12345 67890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 col-span-full">
              <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Office</h3>
                <p className="text-gray-700">Visit us at:</p>
                <address className="not-italic text-blue-600 hover:underline font-medium">
                  123 Real Estate Blvd, City, Country
                </address>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 leading-relaxed">
              Find quick answers to common questions on our dedicated{' '}
              <Link to="/faq" className="text-blue-600 hover:underline font-medium" onClick={() => trackInteraction('click', 'support_faq_link')}>
                FAQ page
              </Link>.
            </p>
          </div>
        </section>
      </div>
      <style jsx>{`
        /* Animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SupportPage;