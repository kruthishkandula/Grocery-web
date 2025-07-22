import React, { useState, useEffect } from 'react';
import { Icon, IconNames } from '@/components/molecule/Icon';
import AuthErrorAlert from '@/components/atom/AuthErrorAlert';
import { createEnvFileWithToken } from '@/utility/tokenHelper';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { Card, Button } from 'react-bootstrap';
import ErrorAnimations from '@/components/atom/ErrorAnimations';

// Update animation imports to use require instead of direct import
// This helps ensure webpack properly processes these JSON files
const dataErrorAnimation = require('@/assets/animations/data-error.json');
const networkErrorAnimation = require('@/assets/animations/network-error.json');
const serverErrorAnimation = require('@/assets/animations/server-error.json');
const authErrorAnimation = require('@/assets/animations/auth-error.json');
const generalErrorAnimation = require('@/assets/animations/general-error.json');

export type ErrorScreenProps = {
    title?: string;
    message?: string;
    errorMessage?: string;
    errorType?: 'auth' | 'data' | 'network' | 'server' | 'unknown';
    retryAction?: () => void;
    backAction?: () => void;
    customAnimation?: any;
};

// Styled components for our error screen
const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
  max-width: 600px;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ColorBar = styled.div<{ color: string }>`
  height: 8px;
  background-color: ${props => props.color};
  width: 100%;
`;

const AnimationContainer = styled.div`
  max-width: 200px;
  margin: 0 auto;
`;

const DetailsSummary = styled.summary`
  cursor: pointer;
  color: var(--bs-primary);
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1);
  }
`;

const TipContainer = styled.div`
  margin-top: 24px;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(var(--bs-body-color-rgb), 0.04);
  font-size: 0.9rem;
  animation: fadeIn 1s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Random tips to show at the bottom of the error screen
const TIPS = [
    "Refreshing the page might resolve temporary issues.",
    "Check your internet connection if you're experiencing network problems.",
    "Try clearing your browser cache if you continue to see errors.",
    "You can contact support if the problem persists.",
    "Some errors resolve themselves after a short time. Try again in a moment."
];

// Replace the Lottie animations with styled icons when animations fail to load
const FallbackAnimation: React.FC<{ iconName: IconNames; color: string }> = ({ iconName, color }) => {
    // For pulsating effect
    const [scale, setScale] = useState(1);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setScale(prev => prev === 1 ? 1.1 : 1);
        }, 1500);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center mb-4">
            <div
                className="position-relative d-inline-flex justify-content-center align-items-center"
                style={{ width: '150px', height: '150px' }}
            >
                {/* Background circle with opacity */}
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: `${color}15`,
                        zIndex: 1
                    }}
                />
                
                {/* Middle circle with animation */}
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: `${color}30`,
                        transition: 'all 1.5s ease',
                        transform: `scale(${scale})`,
                        zIndex: 2
                    }}
                />
                
                {/* Icon container */}
                <div
                    className="position-relative d-inline-flex justify-content-center align-items-center rounded-circle"
                    style={{
                        width: '70px',
                        height: '70px',
                        backgroundColor: `${color}50`,
                        zIndex: 3
                    }}
                >
                    <Icon name={iconName} size={40} color={color} />
                </div>
            </div>
        </div>
    );
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({
    title,
    message,
    errorMessage,
    errorType = 'unknown',
    retryAction,
    backAction,
    customAnimation,
}) => {
    // State for random tip
    const [tip, setTip] = useState<string>("");

    // Set a random tip on mount
    useEffect(() => {
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, []);

    // Default messages based on error type
    const defaultTitles = {
        auth: 'Authentication Error',
        data: 'Data Loading Error',
        network: 'Network Error',
        server: 'Server Error',
        unknown: 'Something Went Wrong',
    };

    const defaultMessages = {
        auth: 'Your session might have expired or you are not authenticated.',
        data: 'There was a problem loading the necessary data.',
        network: 'Please check your internet connection and try again.',
        server: 'Our servers are experiencing issues. Please try again later.',
        unknown: 'An unexpected error occurred. Please try again later.',
    };

    // Colors for different error types
    const errorColors = {
        auth: '#F59E0B', // Amber
        data: '#3B82F6', // Blue
        network: '#10B981', // Emerald
        server: '#EF4444', // Red
        unknown: '#8B5CF6', // Violet
    };

    // Animations for different error types
    const errorAnimations = {
        auth: authErrorAnimation,
        data: dataErrorAnimation,
        network: networkErrorAnimation,
        server: serverErrorAnimation,
        unknown: generalErrorAnimation,
    };

    // Icons for fallback animations
    const errorIcons: Record<string, IconNames> = {
        auth: 'Shield',
        data: 'Database',
        network: 'Wifi',
        server: 'Server',
        unknown: 'AlertTriangle',
    };

    // Set defaults if not provided
    const displayTitle = title || defaultTitles[errorType];
    const displayMessage = message || defaultMessages[errorType];
    const color = errorColors[errorType];
    const animation = customAnimation || errorAnimations[errorType];

    return (
        <ErrorContainer className="container-fluid p-5 bg-body-custom">
            <div className="row justify-content-center w-100">
                <div className="col-md-8 col-lg-6">
                    <StyledCard className="bg-card-custom border-card-custom">
                        <ColorBar color={color} />

                        <Card.Body className="p-4 p-md-5">
                            {/* Auth error special handling */}
                            {errorType === 'auth' ? (
                                <>
                                    {/* Animation */}
                                    <AnimationContainer className="mb-4">
                                        <Lottie
                                            animationData={animation} // Use the selected animation from props
                                            loop={true}
                                            style={{ width: '100%', height: 200 }} // Consistent height
                                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                                        />
                                    </AnimationContainer>

                                    {/* Error heading */}
                                    <h3 className="text-body-custom mb-3 text-center">
                                        {displayTitle}
                                    </h3>

                                    {/* Error message */}
                                    <p className="text-muted-custom mb-4 text-center">
                                        {displayMessage}
                                    </p>

                                    {/* Technical error details (collapsible) */}
                                    {errorMessage && (
                                        <div className="mb-4 text-center">
                                            <details>
                                                <DetailsSummary>Technical Details</DetailsSummary>
                                                <div className="alert alert-secondary mt-2 text-start overflow-auto" style={{ maxHeight: '150px' }}>
                                                    <code>{errorMessage}</code>
                                                </div>
                                            </details>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="d-flex gap-3 justify-content-center mt-4">
                                        {backAction && (
                                            <Button
                                                variant="outline-secondary"
                                                onClick={backAction}
                                                className="d-flex align-items-center"
                                            >
                                                <Icon name="ArrowLeft" size={16} className="me-2" />
                                                Go Back
                                            </Button>
                                        )}

                                        {retryAction && (
                                            <Button
                                                variant="primary"
                                                onClick={retryAction}
                                                className="d-flex align-items-center"
                                            >
                                                <Icon name="RefreshCw" size={16} className="me-2" />
                                                Try Again
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Animation */}
                                    <AnimationContainer className="mb-4">
                                        <Lottie
                                            animationData={animation}
                                            loop={true}
                                            style={{ width: '100%', height: 200 }} // Consistent height
                                            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                                        />
                                    </AnimationContainer>

                                    {/* Error heading */}
                                    <h3 className="text-body-custom mb-3 text-center">
                                        {displayTitle}
                                    </h3>

                                    {/* Error message */}
                                    <p className="text-muted-custom mb-4 text-center">
                                        {displayMessage}
                                    </p>

                                    {/* Technical error details (collapsible) */}
                                    {errorMessage && (
                                        <div className="mb-4 text-center">
                                            <details>
                                                <DetailsSummary>Technical Details</DetailsSummary>
                                                <div className="alert alert-secondary mt-2 text-start overflow-auto" style={{ maxHeight: '150px' }}>
                                                    <code>{errorMessage}</code>
                                                </div>
                                            </details>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="d-flex gap-3 justify-content-center mt-4">
                                        {backAction && (
                                            <Button
                                                variant="outline-secondary"
                                                onClick={backAction}
                                                className="d-flex align-items-center"
                                            >
                                                <Icon name="ArrowLeft" size={16} className="me-2" />
                                                Go Back
                                            </Button>
                                        )}

                                        {retryAction && (
                                            <Button
                                                variant="primary"
                                                onClick={retryAction}
                                                className="d-flex align-items-center"
                                            >
                                                <Icon name="RefreshCw" size={16} className="me-2" />
                                                Try Again
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </StyledCard>

                    {/* Tip at the bottom */}
                    <TipContainer className="text-muted-custom text-center">
                        <Icon name="Lightbulb" size={14} className="me-2" />
                        <span>{tip}</span>
                    </TipContainer>
                </div>
            </div>
        </ErrorContainer>
    );
};

export default ErrorScreen;