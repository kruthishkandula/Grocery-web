import React, { useState } from 'react';
import { Icon } from '@/components/molecule/Icon';
import LocalImage from '@/components/atom/LocalImage';
import GalleryBrowser from './GalleryBrowser';

interface GalleryInputProps {
    value: Array<{ url: string, thumbnailUrl?: string }>;
    onChange: (images: Array<{ url: string, thumbnailUrl?: string }>) => void;
    folder: string;
    maxFiles?: number;
    maxFileSize?: number; // in MB
    onUploadComplete?: (images: Array<{ url: string, thumbnailUrl?: string }>) => void;
    label?: string;
    required?: boolean;
}

const GalleryInput: React.FC<GalleryInputProps> = ({
    value = [],
    onChange,
    folder = 'products',
    maxFiles = 5,
    onUploadComplete,
    label = 'Product Images',
    required = false,
}) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    
    // Extract URLs from value objects for display purposes
    const imageUrls = value.map(img => img.url);

    const removeExistingImage = (index: number) => {
        const newImages = [...value];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const handleGallerySelect = (selectedImages: Array<{ url: string, thumbnailUrl?: string }>) => {
        // Make sure we don't exceed the maximum number of files
        if (value.length + selectedImages.length > maxFiles) {
            alert(`You can only have a maximum of ${maxFiles} images. Please select fewer images.`);
            return;
        }

        // Create a set of existing URLs to avoid duplicates
        const existingUrls = new Set(value.map(img => img.url));

        // Filter out any duplicates from the selected images
        const newImages = selectedImages.filter(img => !existingUrls.has(img.url));

        // Combine with existing images
        const allImages = [...value, ...newImages];

        // Update form value
        onChange(allImages);

        // Notify parent if needed
        if (onUploadComplete && newImages.length > 0) {
            onUploadComplete(allImages);
        }
    };

    return (
        <div className="form-group">
            <label className="form-label text-body-custom">{`${label} ${required ? '*' : ''}`}</label>

            {/* Gallery Browser Modal */}
            <GalleryBrowser
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelect={handleGallerySelect}
                folder={folder}
                maxSelection={maxFiles}
                currentSelection={imageUrls}
            />

            {/* Existing Images Gallery */}
            {value.length > 0 && (
                <div className="media-gallery mb-3">
                    <h6 className="text-muted-custom mb-2 text-decoration-underline">Selected Images</h6>
                    <div className="d-flex overflow-auto gap-2 pb-2">
                        {value.map((image, index) => (
                            <div key={`existing-${index}`} className="position-relative" style={{ minWidth: '150px' }}>
                                <LocalImage
                                    name={image.url}
                                    className="img-fluid rounded"
                                    style={{ height: '120px', width: '150px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                    onClick={() => removeExistingImage(index)}
                                >
                                    <Icon name="X" size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Controls */}
            <div className="d-flex gap-2 align-items-center">
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setIsGalleryOpen(true)}
                    disabled={value.length >= maxFiles}
                >
                    <Icon name="Image" size={16} className="me-2" />
                    Browse & Upload Images
                </button>
            </div>

            <small className="text-muted-custom d-block mt-2">
                Supported formats: images and videos. Maximum {maxFiles} files.
                {value.length > 0 && ` (${value.length} / ${maxFiles} used)`}
            </small>
        </div>
    );
};

export default GalleryInput;