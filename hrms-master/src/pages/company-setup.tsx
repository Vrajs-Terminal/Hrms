import { useState, useEffect } from 'react';
import {
    Save, Building, Phone,
    Briefcase, Globe,
    Image as ImageIcon, Monitor
} from 'lucide-react';
import api from '../lib/axios';
import './company-setup.css';

export default function CompanySetup() {
    const [formData, setFormData] = useState({
        companyName: '',
        websiteUrl: '',
        timeZone: 'Asia/Kolkata',
        address: '',
        email: '',
        contact: '',
        hrEmail: '',
        pincode: '',
        gst: '',
        pan: '',
        tan: '',
        currency: 'INR (₹)',
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get('/company');
                if (res.data) {
                    setFormData({
                        companyName: res.data.name || '',
                        websiteUrl: res.data.website || '',
                        timeZone: 'Asia/Kolkata', // Hardcoded as extra fields aren't in schema yet
                        address: '',
                        email: '',
                        contact: '',
                        hrEmail: '',
                        pincode: '',
                        gst: '',
                        pan: '',
                        tan: '',
                        currency: 'INR (₹)',
                        instagram: '',
                        facebook: '',
                        linkedin: '',
                        youtube: '',
                        location: ''
                    });
                }
            } catch (error) {
                console.error("Failed to load company", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/company', {
                name: formData.companyName,
                website: formData.websiteUrl,
                tax_info: formData.gst
            });
            alert('Company setup saved successfully!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save company settings');
        }
    };

    if (isLoading) {
        return <div style={{ padding: '2rem' }}>Loading company settings...</div>;
    }

    return (
        <div className="setup-container">
            <div className="setup-header">
                <div>
                    <h1>Company Setup</h1>
                    <p>Manage your official company information and branding</p>
                </div>
                <button className="btn-save" onClick={handleSave}>
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <form className="setup-grid" onSubmit={handleSave}>
                <div className="setup-col">
                    <div className="setup-card">
                        <h3><ImageIcon size={18} color="#3b82f6" /> Company Branding</h3>
                        <div className="image-upload-grid">
                            <div className="image-upload-box">
                                <ImageIcon className="upload-icon" size={24} />
                                <p>Company Logo</p>
                                <span>Main dashboard logo</span>
                            </div>
                            <div className="image-upload-box">
                                <ImageIcon className="upload-icon" size={24} />
                                <p>Thumbnail Logo</p>
                                <span>Compact view</span>
                            </div>
                            <div className="image-upload-box">
                                <Briefcase className="upload-icon" size={24} />
                                <p>Company Photo</p>
                                <span>Profile display</span>
                            </div>
                            <div className="image-upload-box">
                                <Monitor className="upload-icon" size={24} />
                                <p>Login Screen</p>
                                <span>Background image</span>
                            </div>
                        </div>
                    </div>

                    <div className="setup-card" style={{ marginTop: '24px' }}>
                        <h3><Building size={18} color="#f59e0b" /> Basic Information</h3>
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Website URL</label>
                                <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Default Time Zone</label>
                                <select name="timeZone" value={formData.timeZone} onChange={handleChange}>
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                    <option value="US/Eastern">US/Eastern (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Company Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location of company</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="setup-col">
                    <div className="setup-card">
                        <h3><Phone size={18} color="#10b981" /> Contact Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Company Contact *</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>HR / Management Email</label>
                            <input type="email" name="hrEmail" value={formData.hrEmail} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="setup-card" style={{ marginTop: '24px' }}>
                        <h3><Building size={18} color="#8b5cf6" /> Tax & Financial</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>GST Number</label>
                                <input type="text" name="gst" value={formData.gst} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Currency/Symbol *</label>
                                <select name="currency" value={formData.currency} onChange={handleChange} required>
                                    <option value="INR (₹)">INR (₹)</option>
                                    <option value="USD ($)">USD ($)</option>
                                    <option value="EUR (€)">EUR (€)</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>PAN</label>
                                <input type="text" name="pan" value={formData.pan} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>TAN</label>
                                <input type="text" name="tan" value={formData.tan} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="setup-card" style={{ marginTop: '24px' }}>
                        <h3><Globe size={18} color="#ef4444" /> Social Media Accounts</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Instagram (IG)</label>
                                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Username or URL" />
                            </div>
                            <div className="form-group">
                                <label>Facebook (Fb)</label>
                                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Username or URL" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="Company URL" />
                            </div>
                            <div className="form-group">
                                <label>YouTube</label>
                                <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="Channel URL" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
