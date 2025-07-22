import Button from '@/components/molecule/Button';
import { useAuth } from '@/Provider/AuthContext';
import { useAuthStore } from '@/store/auth/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setUserLoggedIn } = useAuthStore();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const _handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response) {
        console.log('Login successful');

        // Short timeout to ensure store updates before navigation
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 50);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-grocery-gradient min-vh-100 d-flex flex-column" style={{ 
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
                    alt="login form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem' }} />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 bg-card-custom text-body-custom" style={{ borderRadius: '1rem' }}>
                    <form autoComplete="off">
                      <div className="d-flex row justify-content-center mb-3 pb-1" >
                        <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                        <img src={require('@assets/images/logo.png')}
                          alt="login form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem', width: '10rem', height: '8rem', objectFit: 'contain' }} />
                      </div>

                      <h5 className="fw-normal mb-3 pb-3 text-body-custom" style={{ letterSpacing: '1px' }}>Sign into your admin account</h5>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="text-[20px] form-label text-body-custom">Enter username or email</label>
                        <input
                          placeholder='Username or Email'
                          type="text"
                          id="form2Example17"
                          className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoComplete="off"
                        />
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <label className="form-label text-body-custom">Password</label>
                        <input
                          placeholder='Password'
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg bg-form-color text-form-color border-form-color"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="off"
                        />
                      </div>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <div className="pt-1 mb-4">
                        <Button
                          onClick={_handleLogin}
                          variant='dark'
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Login'}
                        </Button>
                      </div>

                      <a className="small text-info-custom" href="/forgot-password">Forgot password?</a>
                      <p className="mb-3 pb-lg-2 text-body-custom" onClick={() => {
                        navigate('/register');
                      }} style={{ cursor: 'pointer' }}>Don't have an account? <span
                        className="text-primary-custom" style={{ textDecoration: 'underline' }}>Register here</span></p>
                      <div className="mt-2">
                        <a href="/terms-and-conditions" className="small text-muted-custom">Terms of use</a>
                        <span className="small text-muted-custom me-2"> · </span>
                        <a href="/privacy-policy" className="small text-muted-custom">Privacy policy</a>
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
  )
}
