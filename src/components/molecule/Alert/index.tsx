// components/Alert.js
import { useEffect } from 'react';
import './Alert.css';
import useAlertStore from '@/store/alert/alertStore';
import { Icon } from '../Icon';
import { useTheme } from '@/theme/ThemeContext';

const Alert = () => {
    const { alerts, removeAlert } = useAlertStore();
    const { theme } = useTheme();

    useEffect(() => {
        alerts.forEach(alert => {
            if (alert.duration !== 'none' && alert.duration !== 0) {
                const timer = setTimeout(() => {
                    removeAlert(alert.id);
                }, alert.duration || 3000);

                return () => clearTimeout(timer);
            }
        });
    }, [alerts, removeAlert]);

    return (
        <>
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`alert alert-${alert.type} ${alert.alignment || 'topRight'} ${theme === 'dark' ? 'alert-dark' : ''}`}
                    style={{ animationDuration: `${alert.duration || 3000}ms` }}
                >
                    {alert.icon && (
                        <span className="alert-icon">
                            <Icon name={alert.icon} size={20} />
                        </span>
                    )}
                    <div className="alert-content">
                        <h6 className="alert-title mb-1">{alert.title}</h6>
                        <p className="alert-message mb-0">{alert.message}</p>
                    </div>
                    {alert.close && (
                        <button 
                            onClick={() => removeAlert(alert.id)} 
                            className="alert-close-btn"
                            aria-label="Close alert"
                        >
                            <Icon name="X" size={16} />
                        </button>
                    )}
                    <div
                        className="alert-progress-bar"
                        style={{ 
                            animationDuration: `${alert.duration || 3000}ms`,
                            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
                        }}
                    />
                </div>
            ))}
        </>
    );
};

export default Alert;