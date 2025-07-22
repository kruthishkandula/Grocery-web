import React, { useState, useEffect } from 'react';
import { Icon, IconNames } from '@/components/molecule/Icon';

interface ErrorAnimationProps {
    type: 'auth' | 'data' | 'network' | 'server' | 'unknown';
    color: string;
}

const ErrorAnimations: React.FC<ErrorAnimationProps> = ({ type, color }) => {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        // Start animation after component mounts
        setAnimate(true);
        
        // Create pulse effect
        const interval = setInterval(() => {
            setAnimate(prev => !prev);
        }, 2000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const renderIcon = () => {
        switch(type) {
            case 'auth':
                return <Icon name={animate ? 'LockOpen' : 'Lock'} color={color} />;
            case 'data':
                return <Icon name={animate ? 'Database' : 'DatabaseIcon'} color={color} />;
            case 'network':
                return <Icon name={animate ? 'Wifi' : 'WifiOff'} color={color} />;
            case 'server':
                return <Icon name={animate ? 'Server' : 'ServerOff'} color={color} />;
            case 'unknown':
            default:
                return <Icon name={animate ? 'HelpCircle' : 'HelpCircleIcon'} color={color} />;
        }
    };

    return (
        <div>
            {renderIcon()}
        </div>
    );
};

export default ErrorAnimations;