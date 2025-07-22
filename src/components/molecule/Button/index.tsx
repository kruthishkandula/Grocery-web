import { Icon, IconNames } from "../Icon";

const variantMap = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    info: 'btn-info',
    light: 'btn-light',
    dark: 'btn-dark',
    outline: 'btn-outline-primary',
    'outline-secondary': 'btn-outline-secondary',
    'outline-success': 'btn-outline-success',
    'outline-warning': 'btn-outline-warning',
    'outline-danger': 'btn-outline-danger',
    'outline-info': 'btn-outline-info',
    'outline-light': 'btn-outline-light',
    'outline-dark': 'btn-outline-dark',
    link: 'btn-link',
    ghost: 'btn btn-outline-secondary bg-transparent'
};

const colorMap = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    info: 'btn-info',
    light: 'btn-light',
    dark: 'btn-dark',
    'grocery-fresh': 'btn text-white bg-grocery-fresh border-grocery-fresh',
    'grocery-organic': 'btn text-white bg-grocery-organic border-grocery-organic',
    'grocery-discount': 'btn text-white bg-grocery-discount border-grocery-discount',
    'grocery-premium': 'btn text-white bg-grocery-premium border-grocery-premium',
    'grocery-sale': 'btn text-white bg-grocery-sale border-grocery-sale',
    'accent-mint': 'btn text-dark bg-accent-mint border-accent-mint',
    'accent-lime': 'btn text-white bg-accent-lime border-accent-lime'
};


// ButtonWithIcon Component
const Button = ({
    children,
    icon,
    iconPosition = 'left',
    variant = 'primary',
    color,
    size = 'md',
    weight = 500,
    disabled = false,
    loading = false,
    className = '',
    onClick,
    ...props
}: {
    children?: React.ReactNode;
    icon?: IconNames;
    iconPosition?: 'left' | 'right';
    variant?: keyof typeof variantMap;
    color?: keyof typeof colorMap;
    size?: 'sm' | 'md' | 'lg';
    weight?: number;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    onClick?: () => void;
    [key: string]: any;
}) => {
    // Icon mapping - now using your Icon component
    const iconSizes = {
        sm: 16,
        md: 18,
        lg: 20
    };

    // Size mapping
    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    // Color/variant mapping
    const getButtonClasses = () => {
        if (color) {
            return colorMap[color] || 'btn-primary';
        }
        return variantMap[variant] || 'btn-primary';
    };

    const classes = [
        'btn',
        getButtonClasses(),
        sizeClasses[size] || '',
        `fw-${weight}`,
        'd-flex align-items-center gap-2',
        disabled && 'disabled',
        className
    ].filter(Boolean).join(' ');

    const renderIcon = () => {
        if (loading) {
            return (
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            );
        }

        if (icon) {
            return <Icon name={icon} size={iconSizes[size]} />;
        }

        return null;
    };

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
            onClick={onClick}
        >
            {iconPosition === 'left' && renderIcon()}
            {children && <span>{children}</span>}
            {iconPosition === 'right' && renderIcon()}
        </button>
    );
};

export default Button;