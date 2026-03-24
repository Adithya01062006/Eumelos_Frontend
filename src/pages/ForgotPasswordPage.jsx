import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Step 1
    const [email, setEmail] = useState('');

    // Step 2
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Errors
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email address";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            setFormError("User not registered");
            return;
        }

        setErrors({});
        setStep(2);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setFormError('');
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => {
            if (u.email === email) {
                return { ...u, password: newPassword };
            }
            return u;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setFormSuccess("Password updated successfully");

        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary-light)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div className="flex flex-col items-center mb-6">
                    <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <GraduationCap size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Reset Password</h2>
                </div>

                {formError && (
                    <div style={{ color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#fee2e2' }}>
                        {formError}
                    </div>
                )}

                {formSuccess && (
                    <div style={{ color: '#16a34a', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', backgroundColor: '#dcfce7' }}>
                        {formSuccess}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} noValidate>
                        <div className="form-group mb-6">
                            <label className="form-label" htmlFor="email">Registered Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                            Continue
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordReset} noValidate>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {errors.newPassword && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.newPassword}</div>}
                        </div>

                        <div className="form-group mb-6">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                            Reset Password
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem' }}>
                    <Link to="/login" style={{ fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
