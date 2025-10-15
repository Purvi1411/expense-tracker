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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </h2>
                    {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field mt-1"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field mt-1"
                            />
                        </div>

                        {isRegister && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="input-field mt-1"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (isRegister ? 'Register' : 'Log In')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {isRegister ? (
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <span onClick={() => navigate('/login')} 
                                  className="text-primary hover:text-blue-700 cursor-pointer font-medium">
                                Login
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <span onClick={() => navigate('/register')} 
                                  className="text-primary hover:text-blue-700 cursor-pointer font-medium">
                                Register
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;