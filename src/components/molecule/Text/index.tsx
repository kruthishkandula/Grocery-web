
let variantClasses: any = {
    h1: 'fs-1',
    h2: 'fs-2',
    h3: 'fs-3',
    h4: 'fs-4',
    h5: 'fs-5',
    h6: 'fs-6',
    body: '',
    small: 'fs-14',
    caption: 'fs-12',
    overline: 'fs-10 text-uppercase ls-wide'
};

let weightClasses: any = {
    100: 'fw-100',
    200: 'fw-200',
    300: 'fw-300',
    400: 'fw-400',
    500: 'fw-500',
    600: 'fw-600',
    700: 'fw-700',
    800: 'fw-800',
    900: 'fw-900'
};

let colorClasses: any = {
    primary: 'text-primary-custom',
    secondary: 'text-secondary-custom',
    success: 'text-success-custom',
    warning: 'text-warning-custom',
    danger: 'text-danger-custom',
    info: 'text-info-custom',
    body: 'text-body-custom',
    muted: 'text-muted-custom',
    'grocery-fresh': 'text-grocery-fresh',
    'grocery-organic': 'text-grocery-organic',
    'grocery-discount': 'text-grocery-discount',
    'grocery-premium': 'text-grocery-premium',
    'grocery-sale': 'text-grocery-sale',
    'status-in-stock': 'text-status-in-stock',
    'status-low-stock': 'text-status-low-stock',
    'status-out-of-stock': 'text-status-out-of-stock',
    'status-discontinued': 'text-status-discontinued',
    'accent-mint': 'text-accent-mint',
    'accent-lime': 'text-accent-lime',
    'gray-400': 'text-gray-400',
    'gray-500': 'text-gray-500',
    'gray-600': 'text-gray-600',
    'gray-700': 'text-gray-700',
    'gray-800': 'text-gray-800',
    'gray-900': 'text-gray-900'
};

type DynamicTextProps = {
    children: React.ReactNode;
    variant?: keyof typeof variantClasses;
    color?: keyof typeof colorClasses;
    size?: number;
    weight?: keyof typeof weightClasses | number;
    className?: string;
    tag?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    [key: string]: any; // Allow additional props
};

const DynamicText = ({
    children,
    variant = 'body',
    tag = 'span',
    color = 'body',
    size = 16,
    weight = 400,
    className = '',
    ...props
}: DynamicTextProps) => {


    console.log('variant', variant)
    const Tag = tag || 'span';

    const classes = [
        variantClasses[variant] || '',
        colorClasses[color] || '',
        weightClasses[weight] || '',
        className
    ].filter(Boolean).join(' ');

    const textStyle = {
        fontSize: variant === 'body' ? `${size}px` : undefined,
        fontWeight: variant === 'body' ? weight : undefined,
        ...props.style
    };

    return (
        <Tag className={classes} style={textStyle} {...props}>
            {children}
        </Tag>
    );
};

export default DynamicText;