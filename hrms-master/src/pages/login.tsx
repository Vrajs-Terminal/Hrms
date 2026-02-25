import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.png';
import { User, Lock, ArrowRight } from 'lucide-react';
import './login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore(state => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            if (!password) {
                setError('Please enter a password');
                return;
            }
            // For this design, accept any password
            login(username.trim());
        } else {
            setError('Please enter a username');
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
                        <label>Username</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter your username"
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

                    <button type="submit" className="login-btn">
                        <span>Sign In</span>
                        <ArrowRight size={18} />
                    </button>

                    <div className="login-footer">
                        Secure Access Portal • MineHR-Solutions Pvt. Ltd.
                    </div>
                </form>
            </div>
        </div>
    );
}
