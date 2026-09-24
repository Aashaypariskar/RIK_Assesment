import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Details() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      // Send raw unvalidated form values directly to POST /api/details as JSON
      const response = await fetch('/api/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          age: formData.age
        })
      });

      if (response.ok) {
        setMessage('Details submitted successfully.');
        setIsError(false);
        // Reset form
        setFormData({ name: '', mobile: '', age: '' });
        
        // Redirect to Home page after successful submission
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        throw new Error('API submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setMessage('Unable to submit details. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Details</h2>

      {message && (
        <div className={`message ${isError ? 'message-error' : 'message-success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="btn-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
