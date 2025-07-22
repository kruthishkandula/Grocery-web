import { useState } from 'react';
import Button from '@/components/molecule/Button';
import { useAuth } from '@/Provider/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const _handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await register(username, password, email, 'phonenumber');
            if (response) {
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ 
            background: 'linear-gradient(25deg, var(--bs-body-bg), var(--bs-primary), var(--bs-body-bg), var(--bs-secondary))',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="container py-4 my-auto">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col col-xl-10">
                        <div className="col" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0 align-items-center">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src={require('@assets/images/login_2.png')}
                                        alt="register form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem' }} />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 bg-card-custom text-body-custom" style={{ borderRadius: '1rem' }}>
                                        <form>
                                            <div className="d-flex row justify-content-center mb-3 pb-1" >
                                                <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                                <img src={require('@assets/images/logo.png')}
                                                    alt="register form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem', width: '10rem', height: '8rem', objectFit: 'contain' }} />
                                            </div>

                                            <h5 className="fw-normal mb-3 pb-3 text-body-custom" style={{ letterSpacing: '1px' }}>Register a new admin account</h5>

                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label className="text-[20px] form-label text-body-custom">Username</label>
                                                <input
                                                    placeholder='Username'
                                                    type="text"
                                                    className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                                                    value={username}
                                                    onChange={e => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label className="text-[20px] form-label text-body-custom">Email</label>
                                                <input
                                                    placeholder='Email'
                                                    type="email"
                                                    className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label className="form-label text-body-custom">Password</label>
                                                <input
                                                    placeholder='Password'
                                                    type="password"
                                                    className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label className="form-label text-body-custom">Confirm Password</label>
                                                <input
                                                    placeholder='Confirm Password'
                                                    type="password"
                                                    className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                            {error && (
                                                <div className="alert alert-danger" role="alert">
                                                    {error}
                                                </div>
                                            )}
                                            <div className="pt-1 mb-4">
                                                <Button
                                                    onClick={_handleRegister}
                                                    variant='dark'
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Registering...' : 'Register'}
                                                </Button>
                                            </div>
                                            <div className="d-flex row justify-content-between mb-4">
                                                <a className="bold text-primary-custom" href="/login">Already have an account? Login</a>
                                                <div className="mt-2">
                                                    <a href="/terms-and-conditions" className="small text-muted-custom">Terms of use</a>
                                                    <span className="small text-muted-custom"> & </span>
                                                    <a href="/privacy-policy" className="small text-muted-custom">Privacy policy</a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
