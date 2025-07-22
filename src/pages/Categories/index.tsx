import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/molecule/Header';
import { Icon } from '@/components/molecule/Icon';
import LocalImage from '@/components/atom/LocalImage';
import { useTheme } from '@/theme/ThemeContext';
import { useCategories, useDeleteCategory } from '@/api/cmsApi/categories';
import { createEnvFileWithToken } from '@/utility/tokenHelper';
import AuthErrorAlert from '@/components/atom/AuthErrorAlert';
import { showAlert } from '@/store/alert/alerts';

export default function Categories() {
    const { theme } = useTheme();
    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        sortBy: "displayOrder",
        sortOrder: "asc" as 'asc' | 'desc',
        searchValue: "",
        isActive: undefined as boolean | undefined
    });

    const [showFilters, setShowFilters] = useState(false);
    const [activeStatus, setActiveStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isFiltering, setIsFiltering] = useState(false);

    // Get categories with filters - use enabled to properly control when queries are made
    const { 
        data, 
        isLoading: isLoadingInitial, 
        error, 
        refetch,
        isRefetching
    } = useCategories(filters);
    
    const categories = data?.data || [];
    const pagination = data?.meta?.pagination || { page: 1, pageSize: 10, pageCount: 1, total: 0 };

    // Initialize the delete mutation
    const deleteCategoryMutation = useDeleteCategory();

    // Determine combined loading state
    const isLoading = isLoadingInitial && filters.page === 1; // Only show full loading on initial page load
    const isUpdating = isRefetching || isFiltering;

    // Apply filters when the filter values change - make this a useCallback to prevent unnecessary rerenders
    const applyFilters = useCallback(() => {
        setIsFiltering(true); // Show filtering indicator
        
        setFilters(prev => ({
            ...prev,
            page: 1, // Reset to first page when filters change
            isActive: activeStatus === "" ? undefined : activeStatus === "active"
        }));
    }, [activeStatus]);

    // Listen for when data is loaded after filtering
    useEffect(() => {
        if (!isLoadingInitial && !isRefetching && isFiltering) {
            setIsFiltering(false);
        }
    }, [isLoadingInitial, isRefetching, isFiltering]);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setActiveStatus("");
        setSearchQuery("");

        setFilters({
            page: 1,
            pageSize: 10,
            sortBy: "displayOrder",
            sortOrder: "asc",
            searchValue: "",
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
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== filters.searchValue) {
                setIsFiltering(true);
                setFilters(prev => ({
                    ...prev,
                    page: 1, // Reset to first page on new search
                    searchValue: searchQuery
                }));
            }
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, filters.searchValue]);

    // Handle pagination
    const handlePageChange = useCallback((newPage: number) => {
        if (newPage < 1 || newPage > pagination.pageCount) return;

        setIsFiltering(true);
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));

        // Scroll to top of the table
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pagination.pageCount]);

    // Handle sort change
    const handleSortChange = useCallback((column: string) => {
        setIsFiltering(true);
        setFilters(prev => ({
            ...prev,
            sortBy: column,
            sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc'
        }));
    }, []);

    // Helper function to get image URL safely
    const getImageUrl = useCallback((category: any) => {
        if (typeof category.imageUrl === 'string') {
            return category.imageUrl;
        } else if (category.imageUrl && typeof category.imageUrl === 'object' && category.imageUrl.url) {
            return category.imageUrl.url;
        } else if (category.image_url) {
            return typeof category.image_url === 'string' ? category.image_url : category.image_url.url;
        }
        return 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
    }, []);

    // Check for authentication error
    const isAuthError = error && (error as Error).message?.includes('Authentication failed');

    // Handle category deletion
    const handleDeleteCategory = useCallback(async (categoryId: number, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            try {
                await deleteCategoryMutation.mutateAsync(categoryId);
                
                showAlert({
                    title: 'Success',
                    message: `Category "${categoryName}" has been deleted.`,
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
                
                // Refresh the category list
                refetch();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                // Check if the error is due to products being linked to the category
                const isReferenceError = errorMessage.includes('reference') || 
                                         errorMessage.includes('foreign key constraint') ||
                                         errorMessage.includes('in use');
                
                if (isReferenceError) {
                    showAlert({
                        title: 'Cannot Delete Category',
                        message: `Category "${categoryName}" cannot be deleted because it has products linked to it.`,
                        type: 'warning',
                        duration: 7000,
                        alignment: 'topRight',
                        icon: 'AlertCircle',
                        close: true
                    });
                } else {
                    showAlert({
                        title: 'Error',
                        message: `Failed to delete category: ${errorMessage}`,
                        type: 'error',
                        duration: 5000,
                        alignment: 'topRight',
                        icon: 'AlertTriangle',
                        close: true
                    });
                }
            }
        }
    }, [deleteCategoryMutation, refetch]);

    // Handle manual refresh
    const handleManualRefresh = useCallback(() => {
        setIsFiltering(true);
        refetch();
    }, [refetch]);

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

    if (error && !isFiltering) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="alert alert-danger">
                        {isAuthError ? (
                            <AuthErrorAlert onFixClick={createEnvFileWithToken} />
                        ) : (
                            <div>
                                <h4>Error Loading Categories</h4>
                                <p>There was a problem loading the categories. Please try again later.</p>
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
                        <h2 className="text-body-custom m-0">Categories</h2>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-outline-secondary" 
                                onClick={handleManualRefresh}
                                disabled={isUpdating}
                            >
                                <Icon 
                                    name="RefreshCw" 
                                    size={16} 
                                    className={isUpdating ? "me-1 spin" : "me-1"} 
                                />
                                Refresh
                            </button>
                            <Link to="/categories/new" className="btn btn-primary">
                                <Icon name="Plus" size={16} className="me-1" />
                                Add New Category
                            </Link>
                        </div>
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
                                            {searchQuery && (
                                                <button 
                                                    className="btn btn-outline-secondary border-card-custom" 
                                                    type="button"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    <Icon name="X" size={18} />
                                                </button>
                                            )}
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
                                                disabled={isUpdating}
                                            >
                                                <Icon name="RefreshCw" size={18} className="me-2" />
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {showFilters && (
                                    <div className="row g-3 mt-3">
                                        <div className="col-md-6">
                                            <label className="form-label text-body-custom">Status</label>
                                            <select
                                                className="form-select bg-input-custom text-body-custom border-card-custom"
                                                value={activeStatus}
                                                onChange={(e) => setActiveStatus(e.target.value)}
                                                disabled={isUpdating}
                                            >
                                                <option value="">All</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 d-flex align-items-end">
                                            <button
                                                className="btn btn-primary"
                                                onClick={applyFilters}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                        Applying...
                                                    </>
                                                ) : 'Apply Filters'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-body position-relative">
                                {/* Show a loading overlay only in the category list when filtering or pagination */}
                                {isUpdating && (
                                    <div className="position-absolute d-flex justify-content-center align-items-center"
                                        style={{ zIndex: 10, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {!isUpdating && categories.length === 0 && (
                                    <div className="text-center py-5">
                                        <Icon name="SearchX" size={48} className="text-muted mb-3" />
                                        <h4 className="text-body-custom">No categories found</h4>
                                        <p className="text-muted-custom">
                                            Try adjusting your search or filter criteria
                                        </p>
                                        <button className="btn btn-outline-primary" onClick={resetFilters}>
                                            <Icon name="RefreshCw" size={16} className="me-2" />
                                            Reset Filters
                                        </button>
                                    </div>
                                )}

                                {categories.length > 0 && (
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
                                                            <div className="d-flex align-items-center">
                                                                Name
                                                                {filters.sortBy === 'name' && (
                                                                    <Icon
                                                                        name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                        size={16}
                                                                        className="ms-1"
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                        <th className="text-body-custom">Description</th>
                                                        <th 
                                                            className="text-body-custom cursor-pointer"
                                                            onClick={() => handleSortChange('displayOrder')}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                Display Order
                                                                {filters.sortBy === 'displayOrder' && (
                                                                    <Icon
                                                                        name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                        size={16}
                                                                        className="ms-1"
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                        <th className="text-body-custom">Status</th>
                                                        <th 
                                                            className="text-body-custom cursor-pointer"
                                                            onClick={() => handleSortChange('updatedAt')}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                Last Updated
                                                                {filters.sortBy === 'updatedAt' && (
                                                                    <Icon
                                                                        name={filters.sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                                                                        size={16}
                                                                        className="ms-1"
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                        <th className="text-body-custom">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map((category) => (
                                                        <tr key={category.id}>
                                                            <td>
                                                                <LocalImage
                                                                    name={getImageUrl(category)}
                                                                    className="img-fluid rounded"
                                                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10 }}
                                                                    cacheTime={5 * 60 * 1000} // 5 minutes cache
                                                                />
                                                            </td>
                                                            <td className="text-body-custom">{category.name}</td>
                                                            <td className="text-body-custom">
                                                                {category.description?.length > 50 
                                                                    ? `${category.description.substring(0, 50)}...` 
                                                                    : category.description}
                                                            </td>
                                                            <td className="text-body-custom">{category.displayOrder || 0}</td>
                                                            <td>
                                                                <span className={`badge ${category.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                                    {category.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td className="text-body-custom">
                                                                {new Date(category.updatedAt).toLocaleDateString()}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <Link to={`/categories/${category.id}`} className="btn btn-sm btn-outline-primary">
                                                                        <Icon name="SquarePen" size={16} /> Edit
                                                                    </Link>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDeleteCategory(category.id, category.name)}
                                                                        disabled={isUpdating}
                                                                    >
                                                                        <Icon name="Trash2" size={16} /> Delete
                                                                    </button>
                                                                </div>
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
                                                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} categories
                                                </div>
                                                <nav aria-label="Category pagination">
                                                    <ul className="pagination">
                                                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link bg-card-custom text-body-custom border-card-custom"
                                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                                disabled={pagination.page === 1 || isUpdating}
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
                                                                        disabled={isUpdating}
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
                                                                disabled={pagination.page === pagination.pageCount || isUpdating}
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
