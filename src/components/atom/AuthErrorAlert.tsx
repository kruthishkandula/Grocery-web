import React from 'react';

interface AuthErrorAlertProps {
    onFixClick?: () => void;
    apiUrl?: string;
}

const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ 
    onFixClick,
    apiUrl = process.env.REACT_APP_CMS_URL || 'http://localhost:3005/api' 
}) => {
    return (
        <div className="alert alert-danger bg-primary text-white">
            <div className="d-flex align-items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <h4 className="m-0">API Authentication Error</h4>
            </div>

            <p>Unable to connect to the API due to an authentication issue. This means your API token is missing, invalid, or expired.</p>

            <hr />
            
            <h5>How to fix this:</h5>
            <ol className="text-start">
                <li>Check that you have a valid CMS API token</li>
                <li>Ensure the token is properly configured in the environment variables (<code>REACT_APP_CMS_TOKEN</code>)</li>
                <li>Verify that the CMS server is running and accessible at: <code>{apiUrl}</code></li>
                <li>Try restarting the development server</li>
            </ol>
            
            <p className="mt-3">If you're using the default token from tokens.txt, it may have expired. Please get a new token from your CMS administrator.</p>
            
            {onFixClick && (
                <button 
                    className="btn btn-primary mt-2"
                    onClick={onFixClick}
                >
                    Download .env File with Token
                </button>
            )}
        </div>
    );
};

export default AuthErrorAlert;
