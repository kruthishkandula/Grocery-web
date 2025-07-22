import { useState } from 'react';
import Button from '@/components/molecule/Button';
import { useAuth } from '@/Provider/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const _handleForgot = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await forgotPassword(email);
            setSuccess('Password reset instructions sent to your email.');
        } catch (error) {
            setError('Failed to send reset instructions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="vh-100" style={{ background: 'linear-gradient(25deg, #fff, #8AD93B, #ffff, #62BF06)' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="col h-100" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0 align-items-center">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src={require('@assets/images/login_2.png')}
                                        alt="forgot password form"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form>
                                            <div className="d-flex row justify-content-center mb-3 pb-1">
                                                <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                                <img
                                                    src={require('@assets/images/logo.png')}
                                                    alt="forgot password form"
                                                    className="img-fluid"
                                                    style={{ borderRadius: '1rem 0 0 1rem', width: '10rem', height: '8rem' }}
                                                />
                                            </div>

                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                                                Forgot your password?
                                            </h5>

                                            <div data-mdb-input-init className="form-outline mb-4">
                                                <label className="text-[20px] form-label">Enter your email</label>
                                                <input
                                                    placeholder="Email"
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                />
                                            </div>
                                            {error && (
                                                <div className="alert alert-danger" role="alert">
                                                    {error}
                                                </div>
                                            )}
                                            {success && (
                                                <div className="alert alert-success" role="alert">
                                                    {success}
                                                </div>
                                            )}
                                            <div className="pt-1 mb-4">
                                                <Button
                                                    onClick={_handleForgot}
                                                    variant="dark"
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                                </Button>
                                            </div>
                                            <div className="d-flex row justify-content-between mb-4">
                                                <a className="bold text-info" href="/login">Back to Login</a>
                                                <div>
                                                    <a href="/terms-and-conditions" className="small text-muted">Terms of use</a><span className="small text-muted"> & </span>
                                                    <a href="/privacy-policy" className="small text-muted">Privacy policy</a>
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
