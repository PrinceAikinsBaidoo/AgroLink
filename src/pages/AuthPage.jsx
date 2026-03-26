import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage({ onLogin, initialView = 'login' }) {
    const [isLogin, setIsLogin] = useState(initialView === 'login');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('farmer');

    // New State for form inputs
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Switch view resets error
    const toggleView = (loginState) => {
        setIsLogin(loginState);
        setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Get users from "database" (localStorage) - initialize if null
        const usersDB = JSON.parse(localStorage.getItem('agrolink_users') || '[]');

        setTimeout(() => {
            setLoading(false);
            
            if (!isLogin) {
                // SIGN UP LOGIC
                // 1. Check if email already exists
                const userExists = usersDB.find(u => u.email === email);
                if (userExists) {
                    setError('An account with this email already exists. Please log in.');
                    return;
                }
                
                // 2. Create the new user object
                const newUser = {
                    id: Date.now(),
                    name: fullName,
                    email: email,
                    password: password, // In a real app never store exact plain text
                    role: role,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
                    joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                };
                
                // 3. Save to database
                usersDB.push(newUser);
                localStorage.setItem('agrolink_users', JSON.stringify(usersDB));
                
                // 4. Log the user in
                onLogin(newUser);
                
            } else {
                // LOGIN LOGIC
                // 1. Find user by email
                const user = usersDB.find(u => u.email === email);
                
                if (!user) {
                    setError('No account found with this email. Please sign up.');
                    return;
                }
                
                // 2. Check password matches
                if (user.password !== password) {
                    setError('Incorrect password. Please try again.');
                    return;
                }
                
                // 3. Successful login
                onLogin(user);
            }
        }, 800);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-blob auth-blob--1"></div>
                <div className="auth-blob auth-blob--2"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card fade-in">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <Leaf size={32} />
                        </div>
                        <h1>{isLogin ? 'Welcome Back' : 'Join AgroLink'}</h1>
                        <p>{isLogin ? 'Enter your details to access your dashboard' : 'Start your journey towards smarter farming'}</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="auth-error-message" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                        {!isLogin && (
                            <div className="form-group">
                                <label><User size={18} /> Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="John Doe" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required 
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label><Mail size={18} /> Email Address</label>
                            <input 
                                type="email" 
                                placeholder="john@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label><Lock size={18} /> Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label><User size={18} /> Select Role</label>
                                <select
                                    className="auth-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="engineer">Farm Engineer</option>
                                </select>
                            </div>
                        )}

                        {isLogin && (
                            <div className="auth-form__options">
                                <label className="remember-me">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <button type="button" className="forgot-password">Forgot password?</button>
                            </div>
                        )}

                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? (
                                <span className="loader"></span>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="auth-social">
                        <button className="social-btn" title="Sign in with Google">
                            <Chrome size={20} />
                        </button>
                        <button className="social-btn" title="Sign in with GitHub">
                            <Github size={20} />
                        </button>
                    </div>

                    <div className="auth-toggle-link">
                        {isLogin ? (
                            <p>Don't have an account? <button type="button" onClick={() => toggleView(false)}>Sign up</button></p>
                        ) : (
                            <p>Already have an account? <button type="button" onClick={() => toggleView(true)}>Sign in</button></p>
                        )}
                    </div>
                </div>
            </div>

            <footer className="auth-footer">
                <p>© 2026 AgroLink. Safe & Secure Agriculture Portal.</p>
            </footer>
        </div>
    );
}
