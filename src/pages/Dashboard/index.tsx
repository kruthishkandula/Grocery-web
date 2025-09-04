import { useDashboardData } from "@/api/nodeApi/dashboard/api";
import { Category, Product } from "@/api/nodeApi/types";
import LocalImage from "@/components/atom/LocalImage";
import LocalPieChart from "@/components/molecule/Charts/PieChart";
import Header from '@/components/molecule/Header';
import { Icon } from "@/components/molecule/Icon";
import { useAuth } from "@/Provider/AuthContext";
import { _isActiveData } from "@/utility/utility";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Dashboard.css';

interface ChartData {
    category: string;
    orders: number;
}

export default function Dashboard() {
    const [few_products, setFewProducts] = useState<Product[]>([]);
    const [few_categories, setFewCategories] = useState<Category[]>([]);
    const { data: dashboardData, isLoading } = useDashboardData();
    const { userDetails } = useAuth();

    const count_data = [
        { name: 'Total Products', value: dashboardData?.result?.products_count || 0, route: '/products', is_active: true },
        { name: 'Total Orders', value: dashboardData?.result?.orders_count || 0, route: '/orders', is_active: true },
        { name: 'Total Users', value: dashboardData?.result?.user_count || 0, route: '/users', is_active: true },
        { name: 'Active Categories', value: dashboardData?.result?.active_categories_count || 0, route: '/categories', is_active: true },
    ];

    const products = (dashboardData?.result?.data?.few_products || []) as Product[];
    const categories = (dashboardData?.result?.data?.few_categories || []) as Category[];

    const orders_by_category_data: ChartData[] = categories
        .filter(category => category.name)
        .map(category => ({
            category: category.name,
            orders: Math.floor(Math.random() * 50) // Simulated order count
        }));

    const orders_by_product_data: ChartData[] = products
        .slice(0, 5)
        .map(product => ({
            category: product.name,
            orders: Math.floor(Math.random() * 100) // Simulated order count
        }));


    useEffect(() => {
        dashboardData?.result?.data?.few_products && setFewProducts(dashboardData?.result?.data?.few_products);
        dashboardData?.result?.data?.few_categories && setFewCategories(dashboardData?.result?.data?.few_categories);
    }, [dashboardData])

    if (isLoading) {
        return (
            <div className="container-fluid p-0">
                <Header data={dashboardData} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="skeleton-box" style={{ width: '100%', height: 300, margin: '0 auto', borderRadius: 16 }} />
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <div className="skeleton-box" style={{ width: 300, height: 300, borderRadius: 16, margin: '0 auto' }} />
                        </div>
                        <div className="col-md-6">
                            <div className="skeleton-box" style={{ width: 300, height: 300, borderRadius: 16, margin: '0 auto' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 bg-body-custom">
            <Header data={dashboardData} />
            <div className="container-fluid bg-body-custom">
                <div className="col-12 row justify-content-center py-3">
                    {/* counts */}
                    <div style={{
                        rowGap: '10px',
                        columnGap: '10px'
                    }} className="col-12 row justify-content-center align-items-center" >
                        {_isActiveData(count_data)?.map((item: any, index: number) => (
                            <div
                                style={{
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${require('@assets/images/card_bg2.png')})`
                                }}
                                className="flex-grow align-items-center p-3 rounded-3 bg-card-custom border-card-custom shadow count-card"
                                key={index}
                            >
                                <Link
                                    style={{
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }} to={item?.route}>
                                    <div style={{
                                        maxWidth: '60%'
                                    }} className="card-body">
                                        <p className="card-title text-muted-custom">{item.name}</p>
                                        <h2 className="card-text text-primary-custom">{item.value}</h2>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* charts */}
                    <div className="col-12 row mt-4">
                        <div className="col-md-6">
                            <LocalPieChart
                                data={orders_by_category_data}
                                width={300}
                                height={300}
                                title="Orders by Category"
                            />
                        </div>
                        <div className="col-md-5">
                            <LocalPieChart
                                data={orders_by_product_data}
                                width={300}
                                height={300}
                                title="Orders by Products"
                            />
                        </div>
                    </div>

                    {/* products & categories */}
                    <div className="col-12 row align-items-start mt-4 px-4">
                        {few_products.length > 0 && (
                            <div className="col-md-6">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-body-custom">Products</h3>
                                    <Link to="/products" className="text-primary-custom"><h6>See All</h6></Link>
                                </div>
                                <hr className="w-100 border-subtle" />
                                <ul className="list-group gap-2">
                                    {few_products.map((product: Product, index: number) => {
                                        let imageUrl = (product?.image?.url) || 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
                                        return (
                                            <li className="list-group-item bg-card-custom border-card-custom" key={index}>
                                                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex gap-4 justify-content-between align-items-center" >
                                                            <LocalImage
                                                                name={imageUrl}
                                                                className="img-fluid rounded"
                                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 40 }}
                                                            />
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column'
                                                            }} >
                                                                <span className="text-body-custom" >{product.name}</span>
                                                                <span className="fs-5 text-primary-custom" >{userDetails?.currencySymbol} {product.discount_price}</span>
                                                                <span className="fs-6 text-muted-custom text-decoration-line-through" >{userDetails?.currencySymbol} {product.base_price}</span>
                                                                <span className="text-muted-custom text-sm" >{product.short_description}</span>
                                                            </div>
                                                        </div>


                                                        <div>
                                                            <Icon name="SquarePen" size={24} className="text-body-custom" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {few_categories.length > 0 && (
                            <div className="col-md-6">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-body-custom">Categories</h3>
                                    <Link to="/categories" className="text-primary-custom d-flex align-items-center">
                                        <h6 className="mb-0 me-1">See All</h6>
                                        <Icon name="ArrowRight" size={16} />
                                    </Link>
                                </div>
                                <hr className="w-100 border-subtle" />
                                <ul className="list-group gap-2">
                                    {few_categories.map((category: Category, index: number) => {
                                        // Get image URL handling different possible formats from API
                                        const imageUrl = category.imageUrl || 
                                                          (category.imageUrl && typeof category.imageUrl === 'object' ? 
                                                              category.imageUrl : 
                                                              category.imageUrl) || 
                                                          'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
                                        
                                        const isActive = 'isActive' in category ? category.isActive : false;
                                        const description = category.description || '';
                                        
                                        return (
                                            <li className="list-group-item bg-card-custom border-card-custom" key={index}>
                                                <Link to={`/categories/${category.id}`} style={{ textDecoration: 'none' }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex gap-4 justify-content-between align-items-center">
                                                            <LocalImage
                                                                name={imageUrl}
                                                                className="img-fluid rounded"
                                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 40 }}
                                                                cacheTime={10 * 60 * 1000} // 10 minutes cache
                                                            />
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column'
                                                            }}>
                                                                <span className="text-body-custom fw-medium">{category.name}</span>
                                                                <div className="mt-1">
                                                                    <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                                                                        {isActive ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                                <span className="text-muted-custom text-sm mt-1">
                                                                    {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                                                                </span>
                                                                <span className="text-muted-custom mt-1 small">
                                                                    <Icon name="Layers" size={14} className="me-1" />
                                                                    {category.displayOrder !== undefined ? 
                                                                        `Display Order: ${category.displayOrder}` : 
                                                                        category.displayOrder !== undefined ?
                                                                            `Display Order: ${category.displayOrder}` :
                                                                            'No display order set'}
                                                                </span>
                                                            </div>
                                                        </div>


                                                        <div>
                                                            <Icon name="SquarePen" size={24} className="text-body-custom" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
