import { useCategories } from '@/api/cmsApi/categories';
import { useCreateProduct, useDeleteProduct, useProduct, useUpdateProduct } from '@/api/cmsApi/products';
import { FormInput } from '@/components/molecule/Forms/FormInput';
import GalleryInput from '@/components/molecule/Forms/GalleryInput';
import Header from '@/components/molecule/Header';
import { Icon } from '@/components/molecule/Icon';
import { showAlert } from '@/store/alert/alerts';
import { useTheme } from '@/theme/ThemeContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

// Import CSS file
import ErrorScreen from '@/components/molecule/ErrorScreen';
import '@/components/molecule/Forms/gallery.css';
import { findObject } from '@/utility/utility';

// Update the zod schema to work with the image object structure
const productSchema = z.object({
    name: z.string().min(1, { message: 'Product name is required' }).nonempty({
        message: "Field cannot be empty"
    }),
    description: z.string().nonempty({
        message: "Field cannot be empty"
    }),
    shortDescription: z.string().nonempty({
        message: "Field cannot be empty"
    }),
    basePrice: z.string().min(0, { message: 'Base price must be a positive number' }).nonempty({
        message: "Field cannot be empty"
    }),
    discountPrice: z.string().min(0, { message: 'Discount price must be a positive number' }).nonempty({
        message: "Field cannot be empty"
    }),
    costPrice: z.string().min(0, { message: 'Cost price must be a positive number' }).nonempty({
        message: "Field cannot be empty"
    }),
    weightUnit: z.string(),
    isActive: z.boolean(),
    brand: z.string().optional(),
    currency: z.string(),
    currencySymbol: z.string(),
    categoryId: z.string().min(1, { message: 'Category is required' }),
    // The key change - images are now objects with url and thumbnailUrl
    images: z.array(
        z.object({
            url: z.string(),
            thumbnailUrl: z.string().optional()
        })
    )
});

// TypeScript type derived from Zod schema
type ProductFormValues = z.infer<typeof productSchema>;

// You may need to define the payload type to match your API expectations
interface ProductImagePayload {
    url: string;
    thumbnailUrl?: string;
}

interface ProductPayload {
    name: string;
    description: string;
    shortDescription: string;
    basePrice: number;
    discountPrice: number;
    costPrice: number;
    isActive: boolean;
    categoryId: number;
    images: ProductImagePayload[];
    weightUnit: string;
    currency: string;
    currencySymbol: string;
    brand: string;
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isNewProduct = id === 'new';

    // Get categories data
    const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
    const categories = categoriesData?.data?.map((i: any) => {
        return {
            id: i.id,
            name: i.name,
            value: i.name
        };
    }) || [];

    const weightUnits = [
        { id: 0, name: 'Kilogram (kg)', value: 'kg' },
        { id: 1, name: 'Gram (g)', value: 'g' },
        { id: 2, name: 'Pound (lb)', value: 'lb' },
        { id: 3, name: 'Ounce (oz)', value: 'oz' },
        { id: 4, name: 'Piece', value: 'piece' }
    ];

    const currencyOptions = [
        { id: 0, name: 'Indian Rupee (INR)', value: 'INR', symbol: '₹' },
    ];

    // Get product data if editing
    const {
        data: productData,
        isLoading: productLoading,
        error: productError
    } = useProduct(isNewProduct ? 0 : parseInt(id || '0'));

    // Mutations for create, update, delete
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();

    // Setup form with react-hook-form and zod resolver with explicit typing
    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting, isValid, }
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            shortDescription: '',
            basePrice: '0',
            discountPrice: '0',
            costPrice: '0',
            weightUnit: 'kg',
            isActive: true,
            currency: 'INR',
            currencySymbol: '₹',
            categoryId: '',
            images: [], // Initialize as empty array of image objects
            brand: ''
        }
    });

    // Check for authentication errors
    const isAuthError = productError?.message?.includes('Authentication failed') ||
        categoriesError?.message?.includes('Authentication failed');

    // Set form data when product data is loaded
    useEffect(() => {
        if (isNewProduct) return;

        if (productData?.data) {
            const product = productData.data;

            let categoryName = '';
            if (product?.category && typeof product?.category === 'object') {
                categoryName = product.category.name || '';
            } else if (typeof product.categoryId === 'string') {
                let selectedCategoryObj = findObject({
                    data: categories,
                    key: 'id',
                    value: product.categoryId
                });
                categoryName = selectedCategoryObj?.name || '';
            }

            reset({
                name: product.name || '',
                description: product.description || '',
                shortDescription: product.shortDescription || '',
                basePrice: String(product.basePrice || 0),
                discountPrice: String(product.discountPrice || 0),
                costPrice: String(product.costPrice || 0),
                weightUnit: product.weightUnit || 'kg',
                isActive: product.isActive,
                brand: product.brand || '',
                currency: product.currency || 'INR',
                currencySymbol: product.currencySymbol || '₹',
                categoryId: categoryName || '',
                // Format images as objects with url and thumbnailUrl
                images: (product.images || [])
                    .map((img: any) => {
                        if (typeof img === 'object' && img.url) {
                            return {
                                url: typeof img.url === 'string' ? img.url : img.url.url || '',
                                thumbnailUrl: img.thumbnailUrl || undefined
                            };
                        }
                        // Handle string case (legacy data)
                        if (typeof img === 'string') {
                            return {
                                url: img,
                                thumbnailUrl: img.replace(/\/upload\//, '/upload/c_thumb,w_200/')
                            };
                        }
                        return undefined;
                    })
                    .filter(img => img !== undefined),
            });
        }
    }, [productData, isNewProduct, reset]);

    // Update the onSubmit function to handle the images array correctly
    const onSubmit = async (data: ProductFormValues) => {
        try {
            let selectedCategoryObj = findObject({
                data: categories,
                key: 'name',
                value: data.categoryId
            })
            const payload: ProductPayload = {
                name: data.name,
                description: data.description || '',
                shortDescription: data.shortDescription || '',
                basePrice: parseFloat(data.basePrice),
                discountPrice: parseFloat(data.discountPrice),
                costPrice: parseFloat(data.costPrice),
                isActive: data.isActive,
                categoryId: parseInt(selectedCategoryObj?.id),
                // Convert object with url and thumbnailUrl to just object with url property
                images: data.images.map(imgObj => ({ url: imgObj.url })),
                weightUnit: data.weightUnit,
                currency: data.currency,
                currencySymbol: data.currencySymbol,
                brand: data.brand || '',
            };

            if (isNewProduct) {
                await createProductMutation.mutateAsync(payload);
                showAlert({
                    title: 'Success',
                    message: 'Product created successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
            } else {
                await updateProductMutation.mutateAsync({
                    id: parseInt(id || '0'),
                    payload
                });
                showAlert({
                    title: 'Success',
                    message: 'Product updated successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
            }

            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            showAlert({
                title: 'Error',
                message: `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                type: 'error',
                duration: 5000,
                alignment: 'topRight',
                icon: 'AlertTriangle',
                close: true
            });
        }
    };

    const handleDelete = async () => {
        if (isNewProduct) return;

        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProductMutation.mutateAsync(parseInt(id || '0'));
                showAlert({
                    title: 'Success',
                    message: 'Product deleted successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
                navigate('/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                showAlert({
                    title: 'Error',
                    message: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                    type: 'error',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'AlertTriangle',
                    close: true
                });
            }
        }
    };

    // Loading state
    const isLoading = (!isNewProduct && productLoading) || categoriesLoading;

    if (isLoading) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="skeleton-box" style={{ width: '100%', height: 400, margin: '0 auto', borderRadius: 16 }} />
                </div>
            </div>
        );
    }

    if (isAuthError) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <ErrorScreen
                    errorType="auth"
                    backAction={() => navigate('/products')}
                />
            </div>
        );
    }

    if ((!isNewProduct && productError) || categoriesError) {
        const error = productError || categoriesError;
        const isNetworkError = error?.message?.includes('network') || error?.message?.includes('connection');

        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <ErrorScreen
                    errorType={isNetworkError ? "network" : "data"}
                    title="Unable to Load Product Data"
                    message="We couldn't load the necessary information for this product."
                    errorMessage={error?.message || 'Unknown error'}
                    retryAction={() => window.location.reload()}
                    backAction={() => navigate('/products')}
                />
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 bg-body-custom">
            <Header data={null} />
            <div className="container-fluid bg-body-custom">
                <div className="row py-4 px-4">
                    <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-body-custom m-0">
                            {id === 'new' ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/products')}
                        >
                            <Icon name="ArrowLeft" size={16} className="me-2" /> Back to Products
                        </button>
                    </div>

                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit as any)}>
                                    <div className="row align-items-center">
                                        <div className="col-md-4 mb-4">
                                            <Controller
                                                name="images"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <GalleryInput
                                                        value={value}
                                                        onChange={onChange}
                                                        folder={`products`}
                                                        maxFiles={5}
                                                        maxFileSize={10}
                                                        onUploadComplete={(urls) => {
                                                            console.log('Upload complete:', urls);
                                                        }}
                                                        label="Product Images"
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <FormInput
                                                        name="name"
                                                        control={control}
                                                        label="Product Name"
                                                        type="textinput"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <FormInput
                                                        name="brand"
                                                        control={control}
                                                        label="Brand (Optional)"
                                                        type="textinput"
                                                        required={false}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <FormInput
                                                    name="categoryId"
                                                    control={control}
                                                    label="Category"
                                                    type="dropdown"
                                                    data={categories}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <FormInput
                                                    name="shortDescription"
                                                    control={control}
                                                    label="Short Description"
                                                    type="textinput"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <FormInput
                                                    name="description"
                                                    control={control}
                                                    label="Description"
                                                    type="textinput"
                                                    required
                                                />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <FormInput
                                                        name="basePrice"
                                                        control={control}
                                                        label="Base price"
                                                        type="textinput"
                                                        required
                                                        currencySymbol={"₹"}
                                                        min="0"
                                                        step="0.01"
                                                        inputValueType="number"
                                                        inputMode="numeric"
                                                    />
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <FormInput
                                                        name="discountPrice"
                                                        control={control}
                                                        label="Discount Price"
                                                        type="textinput"
                                                        required
                                                        currencySymbol={"₹"}
                                                        min="0"
                                                        step="0.01"
                                                        inputValueType="number"
                                                        inputMode="numeric"

                                                    />
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <FormInput
                                                        name="costPrice"
                                                        control={control}
                                                        label="Cost price"
                                                        type="textinput"
                                                        required
                                                        currencySymbol={"₹"}
                                                        min="0"
                                                        step="0.01"
                                                        inputValueType="number"
                                                        inputMode="numeric"

                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <FormInput
                                                        name="weightUnit"
                                                        control={control}
                                                        label="Weight Unit"
                                                        type="dropdown"
                                                        data={weightUnits}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <FormInput
                                                        name="currency"
                                                        control={control}
                                                        label="Currency"
                                                        type="dropdown"
                                                        data={currencyOptions}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 form-check">
                                                <Controller
                                                    name="isActive"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="isActive"
                                                                checked={field.value}
                                                                onChange={(e) => field.onChange(e.target.checked)}
                                                            />
                                                            <label className="form-check-label text-body-custom" htmlFor="isActive">
                                                                Active
                                                            </label>
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2 mt-3">
                                        {!isNewProduct && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger me-auto"
                                                onClick={handleDelete}
                                            >
                                                <Icon name="Trash2" size={16} className="me-2" /> Delete
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/products')}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!isValid || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                isNewProduct ? 'Create Product' : 'Update Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
