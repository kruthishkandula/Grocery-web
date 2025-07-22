import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/molecule/Header';
import { Icon } from '@/components/molecule/Icon';
import LocalImage from '@/components/atom/LocalImage';
import { useTheme } from '@/theme/ThemeContext';
import { useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/api/cmsApi/categories';
import { createEnvFileWithToken } from '@/utility/tokenHelper';
import AuthErrorAlert from '@/components/atom/AuthErrorAlert';
import { FormInput } from '@/components/molecule/Forms/FormInput';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showAlert } from '@/store/alert/alerts';
import GalleryInput from '@/components/molecule/Forms/GalleryInput';

// Import CSS file
import '@/components/molecule/Forms/gallery.css';

// Define Zod schema for form validation
const categorySchema = z.object({
    name: z.string().min(1, { message: 'Category name is required' }).nonempty({
        message: "Field cannot be empty"
    }),
    description: z.string().optional(),
    displayOrder: z.string().default('0'),
    isActive: z.boolean().default(true),
    // The image is now an object with url and thumbnailUrl
    image: z.object({
        url: z.string(),
        thumbnailUrl: z.string().optional()
    }).optional()
});

// TypeScript type derived from Zod schema
type CategoryFormValues = z.infer<typeof categorySchema>;

// Define the payload type to match API expectations
interface CategoryPayload {
    name: string;
    description: string;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string;
}

export default function CategoryDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isNewCategory = id === 'new';
    
    // Get category data if editing
    const { 
        data: categoryData, 
        isLoading: categoryLoading, 
        error: categoryError 
    } = useCategory(isNewCategory ? 0 : parseInt(id || '0'));

    // Mutations for create, update, delete
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();
    
    // Setup form with react-hook-form and zod resolver
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema) as any,
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            displayOrder: '0',
            isActive: true,
            image: undefined
        }
    });

    // Check for authentication errors
    const isAuthError = categoryError?.message?.includes('Authentication failed');
    
    // Set form data when category data is loaded
    useEffect(() => {
        if (isNewCategory) return;
        
        if (categoryData?.data) {
            const category = categoryData.data;
            reset({
                name: category.name || '',
                description: category.description || '',
                displayOrder: String(category.displayOrder || 0),
                isActive: category.isActive ?? true,
                // Format image as object with url and thumbnailUrl
                image: category.imageUrl ? {
                    url: category.imageUrl || '',
                    thumbnailUrl: category.imageUrl || undefined
                } : undefined
            });
        }
    }, [categoryData, isNewCategory, reset]);

    // Submit handler for form
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            const payload: any = {
                name: data.name,
                description: data.description || '',
                isActive: data.isActive,
                displayOrder: parseInt(data.displayOrder || '0'),
                // Use the image URL if provided
                imageUrl: data.image?.url
            };
            
            if (isNewCategory) {
                await createCategoryMutation.mutateAsync(payload);
                showAlert({
                    title: 'Success',
                    message: 'Category created successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
            } else {
                await updateCategoryMutation.mutateAsync({ 
                    id: parseInt(id || '0'), 
                    payload 
                });
                showAlert({
                    title: 'Success',
                    message: 'Category updated successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
            }
            
            navigate('/categories');
        } catch (error) {
            console.error('Error saving category:', error);
            showAlert({
                title: 'Error',
                message: `Failed to save category: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                type: 'error',
                duration: 5000,
                alignment: 'topRight',
                icon: 'AlertTriangle',
                close: true
            });
        }
    };

    const handleDelete = async () => {
        if (isNewCategory) return;
        
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategoryMutation.mutateAsync(parseInt(id || '0'));
                showAlert({
                    title: 'Success',
                    message: 'Category deleted successfully!',
                    type: 'success',
                    duration: 5000,
                    alignment: 'topRight',
                    icon: 'CheckCircle',
                    close: true
                });
                navigate('/categories');
            } catch (error) {
                console.error('Error deleting category:', error);
                showAlert({
                    title: 'Error',
                    message: `Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
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
    const isLoading = !isNewCategory && categoryLoading;

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

    // Error state
    if (isAuthError) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <AuthErrorAlert onFixClick={createEnvFileWithToken} />
                </div>
            </div>
        );
    }

    if (categoryError && !isNewCategory) {
        return (
            <div className="container-fluid p-0">
                <Header data={null} />
                <div className="container-fluid p-5 text-center bg-body-custom">
                    <div className="alert alert-danger">
                        <h4>Error Loading Data</h4>
                        <p>There was a problem loading the category data. Please try again later.</p>
                        <p>{categoryError.message || 'Unknown error'}</p>
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
                        <h2 className="text-body-custom m-0">
                            {id === 'new' ? 'Add New Category' : 'Edit Category'}
                        </h2>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/categories')}
                        >
                            <Icon name="ArrowLeft" size={16} className="me-2" /> Back to Categories
                        </button>
                    </div>

                    <div className="col-12">
                        <div className="card bg-card-custom border-card-custom">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit as any)}>
                                    <div className="row">
                                        <div className="col-md-4 mb-4">
                                            {/* Image Upload using GalleryInput */}
                                            <Controller
                                                name="image"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <GalleryInput
                                                        value={value ? [value] : []}
                                                        onChange={(images) => onChange(images.length > 0 ? images[0] : undefined)}
                                                        folder="categories"
                                                        maxFiles={1}
                                                        maxFileSize={5}
                                                        onUploadComplete={(urls) => {
                                                            console.log('Upload complete:', urls);
                                                        }}
                                                        label="Category Image"
                                                        required={false}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <FormInput
                                                    name="name"
                                                    control={control}
                                                    label="Category Name"
                                                    type="textinput"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <FormInput
                                                    name="description"
                                                    control={control}
                                                    label="Description"
                                                    type="textarea"
                                                    required={false}
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <FormInput
                                                    name="displayOrder"
                                                    control={control}
                                                    label="Display Order"
                                                    type="textinput"
                                                    required={false}
                                                    inputValueType="number"
                                                    inputMode="numeric"
                                                    min="0"
                                                    step="1"
                                                />
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
                                        {!isNewCategory && (
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
                                            onClick={() => navigate('/categories')}
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
                                                isNewCategory ? 'Create Category' : 'Update Category'
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
