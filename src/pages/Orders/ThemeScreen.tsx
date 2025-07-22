import Button from "@/components/molecule/Button";
import DynamicText from "@/components/molecule/Text";
import useAlertStore from "@/store/alert/alertStore";
import { useState } from "react";

export const ThemeScreen = () => {

    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(false);
    const { addAlert } = useAlertStore()

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    const triggerAlert = () => {
        addAlert({
            type: 'success',
            title: 'Success!',
            message: 'This is a success alert',
            duration: 3000,
            close: true,
            alignment: 'topRight',
        });
        addAlert({
            type: 'warning',
            title: 'Warning!',
            message: 'This is a warning alert',
            duration: 6000,
            close: true,
            alignment: 'bottomCenter',
        });
    };

    return (
        <div className="min-vh-100 bg-body-custom text-body-custom p-4">
            <div className="container-fluid">
                {/* Theme Toggle */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <DynamicText variant="h2" color="primary" weight={700}>
                        Dynamic Components Demo
                    </DynamicText>
                    <Button
                        icon="Settings"
                        variant="outline"
                        onClick={toggleTheme}
                    >
                        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </Button>
                </div>

                {/* Text Component Examples */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom mb-4">
                            <div className="card-header bg-surface-elevated">
                                <DynamicText variant="h4" color="primary" weight={600}>
                                    Dynamic Text Component
                                </DynamicText>
                            </div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Typography Variants
                                        </DynamicText>
                                        <DynamicText variant="h1" color="primary" weight={700} className="mb-2">
                                            Heading 1
                                        </DynamicText>
                                        <DynamicText variant="h3" color="grocery-fresh" weight={600} className="mb-2">
                                            Heading 3 - Fresh
                                        </DynamicText>
                                        <DynamicText variant="body" size={16} weight={400} className="mb-2">
                                            Regular body text with custom size
                                        </DynamicText>
                                        <DynamicText variant="small" color="muted" weight={500} className="mb-2">
                                            Small text with muted color
                                        </DynamicText>
                                        <DynamicText variant="caption" color="gray-600" weight={400} className="mb-2">
                                            Caption text for details
                                        </DynamicText>
                                        <DynamicText variant="overline" color="grocery-organic" weight={600}>
                                            Overline Text
                                        </DynamicText>
                                    </div>
                                    <div className="col-md-6">
                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Theme Colors
                                        </DynamicText>
                                        <DynamicText color="primary" weight={600} className="mb-2">
                                            Primary Color
                                        </DynamicText>
                                        <DynamicText color="grocery-fresh" weight={600} className="mb-2">
                                            Fresh Green
                                        </DynamicText>
                                        <DynamicText color="grocery-organic" weight={600} className="mb-2">
                                            Organic Green
                                        </DynamicText>
                                        <DynamicText color="grocery-discount" weight={600} className="mb-2">
                                            Discount Orange
                                        </DynamicText>
                                        <DynamicText color="grocery-premium" weight={600} className="mb-2">
                                            Premium Purple
                                        </DynamicText>
                                        <DynamicText color="grocery-sale" weight={600} className="mb-2">
                                            Sale Red
                                        </DynamicText>
                                        <DynamicText color="accent-mint" weight={600} className="mb-2">
                                            Accent Mint
                                        </DynamicText>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Component Examples */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom mb-4">
                            <div className="card-header bg-surface-elevated">
                                <DynamicText variant="h4" color="primary" weight={600}>
                                    Button Component
                                </DynamicText>
                            </div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Basic Variants
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button icon="ShoppingCart" onClick={triggerAlert} variant="primary">
                                                Add to Cart
                                            </Button>
                                            <Button icon="Heart" variant="secondary">
                                                Wishlist
                                            </Button>
                                            <Button icon="Eye" variant="outline">
                                                View Details
                                            </Button>
                                            <Button icon="Share2" variant="ghost">
                                                Share
                                            </Button>
                                        </div>

                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Sizes
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button icon="Plus" size="sm" variant="primary">
                                                Small
                                            </Button>
                                            <Button icon="Plus" size="md" variant="primary">
                                                Medium
                                            </Button>
                                            <Button icon="Plus" size="lg" variant="primary">
                                                Large
                                            </Button>
                                        </div>

                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Icon Positions
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button icon="Download" iconPosition="left" variant="success">
                                                Download
                                            </Button>
                                            <Button icon="Upload" iconPosition="right" variant="info">
                                                Upload
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Grocery Theme Colors
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button icon="Package" color="grocery-fresh">
                                                Fresh
                                            </Button>
                                            <Button icon="Star" color="grocery-organic">
                                                Organic
                                            </Button>
                                            <Button icon="AlertCircle" color="grocery-discount">
                                                Discount
                                            </Button>
                                            <Button icon="Heart" color="grocery-premium">
                                                Premium
                                            </Button>
                                        </div>

                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Status Actions
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button icon="Check" variant="success">
                                                In Stock
                                            </Button>
                                            <Button icon="AlertCircle" variant="warning">
                                                Low Stock
                                            </Button>
                                            <Button icon="Minus" variant="danger">
                                                Out of Stock
                                            </Button>
                                        </div>

                                        <DynamicText variant="h6" color="secondary" weight={600} className="mb-3">
                                            Interactive States
                                        </DynamicText>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            <Button
                                                icon="truck"
                                                variant="primary"
                                                loading={loading}
                                                onClick={handleLoadingDemo}
                                            >
                                                {loading ? 'Processing...' : 'Ship Order'}
                                            </Button>
                                            <Button icon="Edit" variant="secondary" disabled>
                                                Disabled
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Examples */}
                <div className="row">
                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-header bg-surface-elevated">
                                <DynamicText variant="h4" color="primary" weight={600}>
                                    Grocery Status Examples
                                </DynamicText>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <div className="p-3 border-status-in-stock border rounded" style={{
                                            gap: '20px'
                                        }}>
                                            <DynamicText color="status-in-stock" weight={600} className="mb-2">
                                                ✓ In Stock
                                            </DynamicText>
                                            <DynamicText variant="small" color="muted" style={{
                                                marginLeft: '5px'
                                            }}>
                                                Ready to ship
                                            </DynamicText>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3 border-status-low-stock border rounded">
                                            <DynamicText color="status-low-stock" weight={600} className="mb-2">
                                                ⚠ Low Stock
                                            </DynamicText>
                                            <DynamicText variant="small" color="muted" style={{
                                                marginLeft: '5px'
                                            }}>
                                                Only 5 left
                                            </DynamicText>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3 border-status-out-of-stock border rounded">
                                            <DynamicText color="status-out-of-stock" weight={600} className="mb-2">
                                                ✗ Out of Stock
                                            </DynamicText>
                                            <DynamicText variant="small" color="muted" style={{
                                                marginLeft: '5px'
                                            }}>
                                                Notify when available
                                            </DynamicText>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3 border-status-discontinued border rounded">
                                            <DynamicText color="status-discontinued" weight={600} className="mb-2">
                                                ⊘ Discontinued
                                            </DynamicText>
                                            <DynamicText variant="small" color="muted">
                                                No longer available
                                            </DynamicText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    //     return (
    //         <div>
    //             // Custom font sizes
    //             <h1 className="fs-22">22px Font Size</h1>
    //             <p className="fs-18">18px Font Size</p>
    //             <span className="fs-14">14px Font Size</span><br /><br />

    // // With rem units
    //             <h2 className="fs-1-5">1.5rem Font Size</h2>
    //             <p className="fs-1-25">1.25rem Font Size</p><br /><br />

    // // Custom colors
    //             <p className="text-orange-500">Orange Text</p>
    //             <span className="text-blue-600">Blue Text</span>
    //             <div className="text-purple-400">Purple Text</div><br /><br />

    // // Responsive font sizes
    //             <h1 className="fs-16 fs-md-20 fs-lg-24">Responsive Font</h1><br />

    // // Combined styling
    //             <h3  className="fs-20 fw-600 text-orange-500 ls-wide">
    //                 Custom Styled Text
    //             </h3>
    //         </div>
    //     )
}


