import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LocalImage from '../atom/LocalImage';
import './Header.css';
import './skeleton.css';
import { Icon } from './Icon';
import { useDashboardData } from '../../api/nodeApi/dashboard/api';
import Button from './Button';
import { useAuth } from '@/Provider/AuthContext';
import { useUserProfile } from '@/api/nodeApi/users/profile';
import { useTheme } from '@/theme/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const navBarOptions = [
  {
    name: 'Orders',
    icon: 'truck',
    link: '/orders',
  },
  {
    name: 'Cart',
    icon: 'cart',
    link: '/cart',
  }
]

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: 0px;
    right: -6px;
  }
`;

export default function Header({
  data: dashboardData
}: {
  data: any
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { logout } = useAuth();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { theme, toggleTheme } = useTheme();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav style={{
      borderRadius: isNavOpen ? '0px' : '0 0 10px 10px',
    }} className="navbar navbar-expand-lg navbar-light custom-header">
      <div className="container-fluid">
        {/* Logo and Brand Section */}
        <div className="header-brand">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <LocalImage
              name="logo_transparent"
              alt="Logo"
              className="logo"
              size={40}
              style={{
                objectFit: 'cover',
              }}
            />
            <p className="brand-name mb-0">GroceryPlus</p>
          </Link>
        </div>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarContent"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className={`navbar-collapse z-20 ${isNavOpen ? 'show' : 'collapse'}`} id="navbarContent">
          {/* Orders and Cart Section */}
          <div className="header-actions ms-auto gap-3 align-items-center">
            {/* Theme Toggle Button */}
            <IconButton 
              className="action-button theme-button"
              onClick={() => {
                toggleTheme();
                setIsNavOpen(false);
              }}
            >
              {theme === 'light' ? (
                <Brightness4Icon sx={{ fontSize: 24, color: '#343a40' }} />
              ) : (
                <Brightness7Icon sx={{ fontSize: 24, color: '#f8f9fa' }} />
              )}
              <span className="action-text ms-2">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </IconButton>

            {
              navBarOptions?.map((item: any, index: number) => {
                const badgeCount = item.name === 'Orders' ? dashboardData?.result?.orders_count || 0 : 0;
                return (
                  <Link key={index} to={item.link} className="action-link">
                    <IconButton
                      key={index}
                      className={`action-button ${item.name.toLowerCase()}-button`}
                      onClick={() => setIsNavOpen(false)}
                    >
                      <Icon name={item.icon} size={28} color={theme === 'light' ? "black" : "white"} className="action-icon" />
                      <CartBadge badgeContent={badgeCount} color="primary" overlap="circular">
                        <span className='action-text'>{item.name}</span>
                      </CartBadge>
                    </IconButton>
                  </Link>
                )
              })
            }


            {/* Profile Section */}
            <div className="profile-section" onClick={() => setIsNavOpen(false)}>
              <Link to={'/profile'} className="action-link"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <LocalImage
                  name="profile"
                  alt="Profile"
                  size={60}
                  className="profile-image"
                  style={{
                    backgroundColor: '#7EE36D',
                    borderRadius: '50%',
                    padding: '6px'
                  }}
                />
                <div className="profile-info">
                  <p className='profile-name'>
                    {isProfileLoading ? <span className="skeleton-box" style={{ width: 80, height: 18 }} /> : userProfile?.name}
                  </p>
                  <p className="profile-phone">
                    {isProfileLoading ? <span className="skeleton-box" style={{ width: 120, height: 14 }} /> : userProfile?.email}
                  </p>
                </div>
              </Link>
              <div>
                <Button color='danger' variant="link" onClick={() => {
                  logout();
                  console.log('Logout clicked');
                }} >Log out</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
