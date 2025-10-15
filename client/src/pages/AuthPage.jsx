import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

// AuthPage is a component that renders either the Login or Register view
const AuthPage = ({ isRegister = false }) => {
    // Hooks for global state and navigation
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Local state for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '', // Only needed for registration
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handles changes to input fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles form submission (Login or Register)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Determine the correct API endpoint based on the prop
        const endpoint = isRegister ? '/auth/register' : '/auth/login';

        if (isRegister && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const { email, password } = formData;
            
            // 🛑 Call the secure backend endpoint
            const response = await axiosInstance.post(endpoint, { email, password });

            // On success, extract the token and user data
            const { token, email: userEmail, _id: userId } = response.data;

            if (token) {
                // Use the context function to log the user in globally
                login(token, { email: userEmail, id: userId });
                // Redirect to the protected dashboard page
                navigate('/dashboard'); 
            }
            
        } catch (err) {
            // Handle errors (e.g., 400 Invalid Credentials, 500 Server Error)
            const message = err.response?.data?.message || 'Authentication failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isRegister ? 'Register' : 'Log In')}
                </button>
            </form>

            <div className="auth-footer">
                {isRegister ? (
                    <p>Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>Login</span></p>
                ) : (
                    <p>Don't have an account? <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>Register</span></p>
                )}
            </div>
        </div>
    );
};

export default AuthPage;