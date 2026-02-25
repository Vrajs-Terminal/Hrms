import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Mail, Lock, ArrowRight, UserPlus, X, User } from 'lucide-react';
import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic Admin Setup State
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleSetupAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!adminName || !adminEmail || !adminPassword) {
            setError('Please fill all fields to create an admin');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/setup-admin', {
                name: adminName,
                email: adminEmail,
                password: adminPassword
            });
            alert('Admin created successfully! You can now log in.');
            setIsSettingUp(false);
            setEmail(adminEmail);
            setPassword(adminPassword);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to setup admin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });

            // Expected response: { token, user }
            const { token, user } = response.data;
            login(token, user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="MineHR Solutions" className="login-logo" />
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter your email"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight size={18} />
                    </button>

                    <div className="login-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <span>Secure Access Portal • MineHR-Solutions Pvt. Ltd.</span>
                        <button
                            type="button"
                            onClick={() => { setIsSettingUp(true); setError(''); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <UserPlus size={14} /> Create First Admin Account
                        </button>
                    </div>
                </form>

                {/* --- Dynamic Setup Overlay --- */}
                {isSettingUp && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'white', borderRadius: '16px', padding: '40px',
                        display: 'flex', flexDirection: 'column', zIndex: 10
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Create Admin Account</h3>
                            <button onClick={() => setIsSettingUp(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSetupAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                            {error && <div className="login-error">{error}</div>}

                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="e.g. John Doe" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Admin Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@company.com" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Secure Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Create a password" />
                                </div>
                            </div>

                            <button type="submit" className="login-btn" style={{ marginTop: 'auto' }} disabled={isLoading}>
                                <span>{isLoading ? 'Creating...' : 'Create Admin Account'}</span>
                            </button>
                        </form>
                    </div>
                )}
                {/* ----------------------------- */}
            </div>
        </div>
    );
}
