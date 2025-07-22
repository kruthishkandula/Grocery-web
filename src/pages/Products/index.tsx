import { useCategories } from '@/api/cmsApi/categories';
import { useDeleteProduct, useProducts } from '@/api/cmsApi/products';
import AuthErrorAlert from '@/components/atom/AuthErrorAlert';
import LocalImage from '@/components/atom/LocalImage';
import Header from '@/components/molecule/Header';
import { Icon } from '@/components/molecule/Icon';
import { showAlert } from '@/store/alert/alerts';
import { useTheme } from '@/theme/ThemeContext';
import { createEnvFileWithToken } from '@/utility/tokenHelper';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Products() {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        sortBy: "updatedAt",
        sortOrder: "desc" as 'asc' | 'desc',
        searchValue: "",
        priceMin: undefined as number | undefined,
        priceMax: undefined as number | undefined,
        categoryId: undefined as number | undefined,
        isActive: undefined as boolean | undefined
    });

    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [activeStatus, setActiveStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isFiltering, setIsFiltering] = useState(false);

    // Get products with filters
    const { data, isLoading: isLoadingInitial, error, refetch } = useProducts(filters);
    const products = data?.data || [];
    const pagination = data?.meta?.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 };

    // Determine combined loading state
    const isLoading = isLoadingInitial && filters.page === 1; // Only show full loading on initial page load

    // Get categories for filter dropdown
    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];

    // Initialize the delete mutation
    const deleteProductMutation = useDeleteProduct();

    // Apply filters when the filter values change
    const applyFilters = () => {
        setIsFiltering(true); // Show filtering indicator
        setFilters(prev => ({
            ...prev,
            page: 1, // Reset to first page when filters change
            priceMin: minPrice ? Number(minPrice) : undefined,
            priceMax: maxPrice ? Number(maxPrice) : undefined,
            categoryId: selectedCategory ? Number(selectedCategory) : undefined,
            isActive: activeStatus === "" ? undefined : activeStatus === "active"
        }));
    };

    // Listen for when data is loaded after filtering
    useEffect(() => {
        if (!isLoadingInitial && isFiltering) {
            setIsFiltering(false);
        }
    }, [isLoadingInitial, isFiltering]);

    // Reset all filters
    const resetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSelectedCategory("");
        setActiveStatus("");
        setSearchQuery("");

        setFilters({
            page: 1,
            pageSize: 10,
            sortBy: "updatedAt",
            sortOrder: "desc",
            searchValue: "",
            priceMin: undefined,
            priceMax: undefined,
            categoryId: undefined,
            isActive: undefined
        });

        showAlert({
            title: 'Filters Reset',
            message: 'All filters have been reset.',
            type: 'info',
            duration: 3000,
            alignment: 'topRight',
            icon: 'RefreshCwOff',
            close: true
        });
    };

    // Handle search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                page: 1, // Reset to first page on new search
                searchValue: searchQuery
            }));
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.pageCount) return;

        setFilters(prev => ({
            ...prev,
            page: newPage
        }));

        // Scroll to top of the table
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle sort change
    const handleSortChange = (column: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: column,
            sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc'
        }));
    };

    // Helper function to get image URL safely
    const getImageUrl = (product: any) => {
        if (product.images && product.images.length > 0) {
            if (typeof product.images[0] === 'object' && product.images[0].url) {
                return product.images[0].url;
            }
        }
        return 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
    };

    // Format currency
    const formatPrice = (price: string | number) => {
        return Number(price).toFixed(2);
    };

    // Check for authentication error
    const isAuthError = error && (error as Error).message?.includes('Authentication failed');

    // Handle product deletion
    const handleDeleteProduct = async (productId: number, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                // Use the deleteProduct mutation
                const result = await deleteProductMutation.mutateAsync(productId);
                
                // Check if it was a soft delete (product had order references)
                if (result.data?._softDeleted) {
                    showAlert({
                        title: 'Product Deactivated',
                        message: `Product "${productName}" has been deactivated because it has order references. It will no longer appear in active listings.`,
                        type: 'warning',
                        duration: 7000,
                        alignment: 'topRight',
                        icon: 'AlertCircle',
                        close: true
                    });
                } else {
                    showAlert({
                        title: 'Success',
                        message: `Product "${productName}" has been deleted.`,
                        type: 'success',
                        duration: 5000,
                        alignment: 'topRight',
                        icon: 'CheckCircle',
                        close: true
                    });
                }
                
                // Refresh the product list
                refetch();
            } catch (error) {
                showAlert({
                    title: 'Error',
                    message: `Failed to delete product: ${(error as Error).message}`,
                    type: 'error',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'AlertTriangle',
                    close: true
                });
            }
        }
    };

    if (isLoading && filters.page === 1 && filters.searchValue === "" && !isFiltering) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="skeleton-box" style={{ width: '100%', height: 100, margin: '0 auto', borderRadius: 16 }} />
                    <div className="row mt-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div className="col-md-6 mb-3" key={item}>
                                <div className="skeleton-box" style={{ width: '100%', height: 120, borderRadius: 16, margin: '0 auto' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error && !isLoading) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="alert alert-danger">
                        {isAuthError ? (
                            <AuthErrorAlert onFixClick={createEnvFileWithToken} />
                        ) : (
                            <div>
                                <h4>Error Loading Products</h4>
                                <p>There was a problem loading the products. Please try again later.</p>
                                <p>{(error as Error).message || 'Unknown error'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 bg-body-custom">
            <Header data={null} />
            <div className="container-fluid bg-body-custom">
                <div className="row py-4 px-4">
                    <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-body-custom m-0">Products</h2>
                        <Link to="/products/new" className="btn btn-primary">Add New Product</Link>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="col-12 mb-4">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="input-group">
                                            <span className="input-group-text bg-card-custom border-card-custom">
                                                <Icon name="Search" size={18} />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-input-custom text-body-custom border-card-custom"
                                                placeholder="Search by name or description..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            <Icon name="SlidersHorizontal" size={18} className="me-2" />
                                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                                        </button>
                                        {showFilters && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={resetFilters}
                                            >
                                                <Icon name="RefreshCw" size={18} className="me-2" />
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {showFilters && (
                                    <div className="row g-3 mt-3">
                                        <div className="col-md-3">
                                            <label className="form-label text-body-custom">Min Price</label>
                                            <input
                                                type="number"
                                                className="form-control bg-input-custom text-body-custom border-card-custom"
                                                placeholder="Min Price"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-body-custom">Max Price</label>
                                            <input
                                                type="number"
                                                className="form-control bg-input-custom text-body-custom border-card-custom"
                                                placeholder="Max Price"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-body-custom">Category</label>
                                            <select
                                                className="form-select bg-input-custom text-body-custom border-card-custom"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label text-body-custom">Status</label>
                                            <select
                                                className="form-select bg-input-custom text-body-custom border-card-custom"
                                                value={activeStatus}
                                                onChange={(e) => setActiveStatus(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="col-12 d-flex justify-content-end">
                                            <button
                                                className="btn btn-primary"
                                                onClick={applyFilters}
                                            >
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-body">
                                {/* Show a loading overlay only in the product list when filtering or pagination */}
                                {(isFiltering || (isLoadingInitial && filters.page > 1)) && (
                                    <div className="position-absolute inset-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
                                        style={{ zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {
                                    (
                                        isLoading && !(filters.searchValue === "") && (
                                            <div className="position-absolute inset-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
                                                style={{ zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        )
                                    )
                                }

                                {!isLoadingInitial && products.length === 0 && (
                                    <div className="text-center py-5">
                                        <Icon name="SearchX" size={48} className="text-muted mb-3" />
                                        <h4 className="text-body-custom">No products found</h4>
                                        <p className="text-muted-custom">
                                            Try adjusting your search or filter criteria
                                        </p>
                                        <button className="btn btn-outline-primary" onClick={resetFilters}>
                                            <Icon name="RefreshCw" size={16} className="me-2" />
                                            Reset Filters
                                        </button>
                                    </div>
                                )}

                                {products.length > 0 && (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-body-custom">Image</th>
                                                        <th
                                                            className="text-body-custom cursor-pointer"
                                                            onClick={() => handleSortChange('name')}
                                                        >
                                                            Name
                                                            {filters.sortBy === 'name' && (
                                                                <Icon
                                                                    name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                    size={16}
                                                                    className="ms-1"
                                                                />
                                                            )}
                                                        </th>
                                                        <th className="text-body-custom">Category</th>
                                                        <th
                                                            className="text-body-custom cursor-pointer"
                                                            onClick={() => handleSortChange('discountPrice')}
                                                        >
                                                            Price
                                                            {filters.sortBy === 'discountPrice' && (
                                                                <Icon
                                                                    name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                    size={16}
                                                                    className="ms-1"
                                                                />
                                                            )}
                                                        </th>
                                                        <th className="text-body-custom">Status</th>
                                                        <th
                                                            className="text-body-custom cursor-pointer"
                                                            onClick={() => handleSortChange('updatedAt')}
                                                        >
                                                            Last Updated
                                                            {filters.sortBy === 'updatedAt' && (
                                                                <Icon
                                                                    name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                    size={16}
                                                                    className="ms-1"
                                                                />
                                                            )}
                                                        </th>
                                                        <th className="text-body-custom">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td>
                                                                <LocalImage
                                                                    name={getImageUrl(product)}
                                                                    className="img-fluid rounded"
                                                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10 }}
                                                                />
                                                            </td>
                                                            <td className="text-body-custom">
                                                                <div>{product.name}</div>
                                                                <small className="text-muted-custom">{product.shortDescription}</small>
                                                            </td>
                                                            <td className="text-body-custom">
                                                                {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                                                            </td>
                                                            <td>
                                                                <div className="text-primary-custom">
                                                                    {product.currencySymbol} {formatPrice(product.discountPrice)}
                                                                </div>
                                                                {parseFloat(product.basePrice as any) !== parseFloat(product.discountPrice as any) && (
                                                                    <small className="text-muted-custom text-decoration-line-through">
                                                                        {product.currencySymbol} {formatPrice(product.basePrice)}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${product.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td className="text-body-custom">
                                                                {new Date(product.updatedAt).toLocaleDateString()}
                                                            </td>
                                                            <td>
                                                                <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                                                                    <Icon name="SquarePen" size={16} /> Edit
                                                                </Link>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                                >
                                                                    <Icon name="Trash2" size={16} /> Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {pagination.pageCount > 1 && (
                                            <div className="d-flex justify-content-between align-items-center mt-4">
                                                <div className="text-muted-custom">
                                                    Showing {(pagination.page - 1) * pagination.pageSize + 1}-
                                                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} products
                                                </div>
                                                <nav aria-label="Product pagination">
                                                    <ul className="pagination">
                                                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link bg-card-custom text-body-custom border-card-custom"
                                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                                disabled={pagination.page === 1}
                                                            >
                                                                <Icon name="ChevronLeft" size={16} />
                                                            </button>
                                                        </li>

                                                        {/* Page numbers */}
                                                        {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                                                            // Show 2 pages before and after current page, or up to 5 pages total
                                                            let pageNum: number;
                                                            if (pagination.pageCount <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (pagination.page <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (pagination.page >= pagination.pageCount - 2) {
                                                                pageNum = pagination.pageCount - 4 + i;
                                                            } else {
                                                                pageNum = pagination.page - 2 + i;
                                                            }

                                                            return (
                                                                <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                                                                    <button
                                                                        className={`page-link ${pagination.page === pageNum ? 'bg-primary text-white' : 'bg-card-custom text-body-custom'} border-card-custom`}
                                                                        onClick={() => handlePageChange(pageNum)}
                                                                    >
                                                                        {pageNum}
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}

                                                        <li className={`page-item ${pagination.page === pagination.pageCount ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link bg-card-custom text-body-custom border-card-custom"
                                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                                disabled={pagination.page === pagination.pageCount}
                                                            >
                                                                <Icon name="ChevronRight" size={16} />
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
