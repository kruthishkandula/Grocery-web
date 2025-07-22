import React, { useState, useEffect, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import LocalImage from '@/components/atom/LocalImage';
import { Icon } from '@/components/molecule/Icon';

type dropdownDataType = {
    id: number;
    name: string;
    value: string;
}[];

type MediaFile = {
    file: File;
    preview: string;
    type: 'image' | 'video';
};

interface FormFieldProps extends React.ComponentProps<'input'> {
    name: string;
    control: any;
    label: string;
    type: 'textinput' | 'dropdown' | 'textarea' | 'imageupload';
    data?: dropdownDataType;
    required?: boolean;
    currencySymbol?: string;
    rows?: number;
    folder?: string;
    maxFiles?: number;
    maxFileSize?: number; // in MB
    acceptedFileTypes?: string;
    onUploadComplete?: (urls: string[]) => void;
    inputValueType?: 'text' | 'number' | 'email' | 'password' | 'tel';
}

// Create a separate component for image upload to avoid hooks inside render callbacks
const ImageUploadField: React.FC<{
    onChange: (value: any) => void;
    value: any;
    error?: any;
    folder: string;
    maxFiles: number;
    maxFileSize: number;
    acceptedFileTypes: string;
    onUploadComplete?: (urls: string[]) => void;
}> = ({
    onChange,
    value,
    error,
    folder,
    maxFiles,
    maxFileSize,
    acceptedFileTypes,
    onUploadComplete,
}) => {
        const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
        const [uploading, setUploading] = useState(false);
        const [uploadProgress, setUploadProgress] = useState(0);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return;

            const newFiles = Array.from(e.target.files);

            // Check if adding these files would exceed the max files limit
            if (mediaFiles.length + newFiles.length > maxFiles) {
                alert(`You can only upload a maximum of ${maxFiles} files.`);
                return;
            }

            // Check file size and type
            const validFiles = newFiles.filter(file => {
                if (file.size > maxFileSize * 1024 * 1024) {
                    alert(`File ${file.name} exceeds the maximum size of ${maxFileSize}MB.`);
                    return false;
                }

                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                if (!isImage && !isVideo) {
                    alert(`File ${file.name} is not a supported media type.`);
                    return false;
                }

                return true;
            });

            // Create preview URLs for valid files
            const newMediaFiles = validFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 'video'
            } as MediaFile)); // Add type assertion here

            setMediaFiles(prev => [...prev, ...newMediaFiles]);

            // Also set the form value (could be file paths or just a boolean indicator)
            onChange(true); // Indicate files are selected
        };

        const removeFile = (index: number) => {
            setMediaFiles(prev => {
                const newFiles = [...prev];
                // Revoke the object URL to avoid memory leaks
                URL.revokeObjectURL(newFiles[index].preview);
                newFiles.splice(index, 1);
                return newFiles;
            });

            if (mediaFiles.length <= 1) {
                onChange(false); // No files selected
            }
        };

        const uploadFiles = async () => {
            if (mediaFiles.length === 0) return;

            setUploading(true);
            setUploadProgress(0);

            try {
                const formData = new FormData();

                // Add all files to FormData
                mediaFiles.forEach(media => {
                    formData.append('images', media.file);
                });

                // Add folder information
                formData.append('folder', folder);

                // Create a custom XMLHttpRequest to track upload progress
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                const uploadPromise = new Promise<string[]>((resolve, reject) => {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                const response = JSON.parse(xhr.responseText);
                                resolve(response.urls || []);
                            } else {
                                reject(new Error('Upload failed'));
                            }
                        }
                    };
                });

                xhr.open('POST', '/uploads/images', true);
                xhr.send(formData);

                const urls = await uploadPromise;

                // Set the form value to the array of uploaded URLs
                onChange(urls);

                // Notify parent component if callback provided
                if (onUploadComplete) {
                    onUploadComplete(urls);
                }

                // Optional: Clear the preview after successful upload
                // setMediaFiles([]);

            } catch (error) {
                console.error('Error uploading files:', error);
                alert('Failed to upload files. Please try again.');
            } finally {
                setUploading(false);
            }
        };

        // Clean up object URLs when component unmounts
        useEffect(() => {
            return () => {
                mediaFiles.forEach(media => {
                    URL.revokeObjectURL(media.preview);
                });
            };
        }, [mediaFiles]);

        return (
            <>
                {/* Preview Gallery */}
                {mediaFiles.length > 0 && (
                    <div className="media-gallery mb-3">
                        <div className="d-flex overflow-auto gap-2 pb-2">
                            {mediaFiles.map((media, index) => (
                                <div key={index} className="position-relative" style={{ minWidth: '150px' }}>
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.preview}
                                            alt={`Preview ${index}`}
                                            className="img-fluid rounded"
                                            style={{ height: '120px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <video
                                            src={media.preview}
                                            className="img-fluid rounded"
                                            style={{ height: '120px', objectFit: 'cover' }}
                                            controls
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                        onClick={() => removeFile(index)}
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
                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled={uploading}
                        >
                            <Icon name="Upload" size={16} className="me-2" />
                            Select Files
                        </button>
                        <input
                            type="file"
                            accept={acceptedFileTypes}
                            onChange={handleFileChange}
                            multiple
                            className="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
                            disabled={uploading || mediaFiles.length >= maxFiles}
                        />
                    </div>

                    {mediaFiles.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={uploadFiles}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading ({uploadProgress}%)
                                </>
                            ) : 'Upload Files'}
                        </button>
                    )}
                </div>

                <small className="text-muted d-block mt-2">
                    Supported formats: images and videos up to {maxFileSize}MB. Maximum {maxFiles} files.
                </small>

                {error && (
                    <div className="invalid-feedback d-block">{error.message}</div>
                )}
            </>
        );
    };

export const FormInput: React.FC<FormFieldProps> = ({
    name,
    control,
    label,
    type = 'textinput',
    data,
    required = false,
    currencySymbol,
    rows = 4,
    folder = 'products',
    maxFiles = 5,
    maxFileSize = 10, // 10MB default
    acceptedFileTypes = 'image/*,video/*',
    onUploadComplete,
    ...rest
}) => {

    switch (type) {
        case 'dropdown':
            return (
                <div className="form-group">
                    <label htmlFor={name} className="form-label text-body-custom">{label} {required ? '*' : ''}</label>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                            <>
                                <select
                                    className={`form-select bg-input-custom text-body-custom border-card-custom ${error ? 'is-invalid' : ''}`}
                                    id={name}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                >
                                    {data?.map((item: any) => (
                                        <option key={item.id} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                    {
                                        data?.length === 0 && (
                                            <option value="" disabled>No Options Found</option>
                                        )
                                    }
                                </select>
                                {error?.message && (
                                    <div className="invalid-feedback">{error.message}</div>
                                )}
                            </>
                        )}
                    />
                </div>
            );

        case 'textarea':
            return (
                <div className="form-group">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                            <>
                                <label htmlFor={name} className="form-label text-body-custom">{`${label} ${required ? '*' : ''}`}</label>
                                <textarea
                                    className={`form-control bg-input-custom text-body-custom border-card-custom ${error ? 'is-invalid' : ''}`}
                                    id={name}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={(e) => onBlur()}
                                    rows={rows}
                                    {...rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
                                />
                                {error && (
                                    <div className="invalid-feedback">{error.message}</div>
                                )}
                            </>
                        )}
                    />
                </div>
            );

        case 'imageupload':
            return (
                <div className="form-group">
                    <label htmlFor={name} className="form-label text-body-custom">{`${label} ${required ? '*' : ''}`}</label>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <ImageUploadField
                                onChange={onChange}
                                value={value}
                                error={error}
                                folder={folder}
                                maxFiles={maxFiles}
                                maxFileSize={maxFileSize}
                                acceptedFileTypes={acceptedFileTypes}
                                onUploadComplete={onUploadComplete}
                            />
                        )}
                    />
                </div>
            );

        default:
            return (
                <div className="form-group">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                            <>
                                <label htmlFor={name} className="form-label text-body-custom">{`${label} ${required ? '*' : ''}`}</label>
                                <div className="input-group">
                                    {currencySymbol && <span className="input-group-text bg-primary text-black">
                                        {currencySymbol || ''}
                                    </span>}
                                    <input
                                        type={rest?.inputValueType || 'text'}
                                        className={`form-control bg-input-custom text-body-custom border-card-custom ${error ? 'is-invalid' : ''}`}
                                        id={name}
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        {...rest}
                                    />
                                </div>
                                {error && (
                                    <div className="invalid-feedback">{error.message}</div>
                                )}
                            </>
                        )}
                    />
                </div>
            );
    }
};
