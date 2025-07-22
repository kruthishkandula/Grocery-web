import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/molecule/Icon';
import LocalImage from '@/components/atom/LocalImage';
import nodeApi from '@/api/nodeApi';
import { Modal, Button } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './gallery.css';

interface GalleryBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedImages: Array<{ url: string, thumbnailUrl?: string }>) => void;
  folder?: string;
  maxSelection?: number;
  currentSelection?: Array<string>;
}

interface UploadedImage {
  id: number;
  public_id: string;
  url: string;
  format: string;
  resource_type: string;
  folder: string;
  created_at: string;
  updated_at: string;
}

type MediaFile = {
  file: File;
  preview: string;
  type: 'image' | 'video';
};

const GalleryBrowser: React.FC<GalleryBrowserProps> = ({
  isOpen,
  onClose,
  onSelect,
  folder = 'products',
  maxSelection = 5,
  currentSelection = []
}) => {
  // React Query client
  const queryClient = useQueryClient();

  // States
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>(currentSelection);
  const [page, setPage] = useState(1);
  const maxFiles = 5;
  const maxFileSize = 10; // 10MB

  // Define query key that includes folder and page
  const imagesQueryKey = ['gallery-images', folder, page];

  // Fetch images with React Query
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: imagesQueryKey,
    queryFn: async () => {
      const response = await nodeApi.post('/uploads/images/list', {
        page,
        pageSize: 20,
        folder
      });

      return {
        images: response.data?.result?.data || [],
        pagination: response.data?.result?.pagination || {
          page: 1,
          pageSize: 20,
          pageCount: 1,
          total: response.data?.result?.data?.length || 0
        }
      };
    },
    // Don't auto-fetch when component mounts, only when modal is open
    enabled: isOpen,
    // Keep cached data for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Don't refetch on window focus
    refetchOnWindowFocus: false
  });

  // Extract data from query
  const images = data?.images || [];
  const pagination = data?.pagination || { page: 1, pageSize: 20, pageCount: 1, total: 0 };

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImages(currentSelection);
    }
  }, [isOpen, currentSelection]);

  // Force refetch images (invalidate cache)
  const refreshImages = () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['gallery-images', folder] });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImages(prev => {
      // If image is already selected, remove it
      if (prev.includes(image.url)) {
        return prev.filter(url => url !== image.url);
      }

      // If max selection is reached, don't add more
      if (prev.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} images.`);
        return prev;
      }

      // Add the image
      return [...prev, image.url];
    });
  };

  const handleConfirmSelection = () => {
    // Transform selected image URLs to the required format
    const formattedSelection = selectedImages.map(url => ({
      url,
      // Generate thumbnail URL if needed (optional)
      thumbnailUrl: url.replace(/\/upload\//, '/upload/c_thumb,w_200/')
    }));

    onSelect(formattedSelection);
    onClose();
  };

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);

    // Check if adding these files would exceed the max files limit
    if (mediaFiles.length + newFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files at once.`);
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
    } as MediaFile));

    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
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

      // Use axios/fetch for the actual upload
      const response = await nodeApi.post('/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      const uploadedUrls = response.data.urls || [];

      // Clear the previews after successful upload
      setMediaFiles([]);

      // Invalidate React Query cache to show new images
      queryClient.invalidateQueries({ queryKey: ['gallery-images', folder] });

      // Add the uploaded images to selected images if there's room
      if (selectedImages.length + uploadedUrls.length <= maxSelection) {
        setSelectedImages(prev => [...prev, ...uploadedUrls]);
      } else {
        alert(`Only ${maxSelection - selectedImages.length} of the uploaded images were selected due to the selection limit.`);
        setSelectedImages(prev => [
          ...prev,
          ...uploadedUrls.slice(0, maxSelection - selectedImages.length)
        ]);
      }

      // Hide the upload area
      setShowUploadArea(false);
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
    <Modal
      show={isOpen}
      onHide={onClose}
      size="lg"
      centered
      className="gallery-browser-modal"
    >
      <Modal.Header closeButton className="bg-card-custom text-body-custom border-card-custom">
        <Modal.Title>Select Images</Modal.Title>
        <div className="ms-auto d-flex gap-2">
          <Button
            variant={showUploadArea ? "primary" : "outline-primary"}
            onClick={() => setShowUploadArea(!showUploadArea)}
            className="me-2"
          >
            <Icon name="Upload" size={16} className="me-1" />
            {showUploadArea ? 'Hide Upload' : 'Upload New'}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={refreshImages}
            disabled={isFetching}
          >
            <Icon name="RefreshCw" size={16} className={isFetching ? "me-1 spin" : "me-1"} />
            Refresh
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-card-custom text-body-custom">
        {/* Upload Area */}
        {showUploadArea && (
          <div className="upload-area p-3 mb-3 border border-card-custom rounded">
            <h6 className="mb-3 text-body-custom">Upload New Images</h6>

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
                          style={{ height: '120px', width: '150px', objectFit: 'cover' }}
                        />
                      ) : (
                        <video
                          src={media.preview}
                          className="img-fluid rounded"
                          style={{ height: '120px', width: '150px', objectFit: 'cover' }}
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
                  disabled={uploading || mediaFiles.length >= maxFiles}
                >
                  <Icon name="Upload" size={16} className="me-2" />
                  Select Files
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    multiple
                    className="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer"
                    disabled={uploading || mediaFiles.length >= maxFiles}
                  />
                </button>
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

            <small className="text-muted-custom d-block mt-2">
              Supported formats: images and videos up to {maxFileSize}MB. Maximum {maxFiles} files.
            </small>
          </div>
        )}

        {/* Gallery Area */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-5">
            <Icon name="ImageOff" size={48} className="text-muted-custom mb-3" />
            <p className="text-body-custom">No images found in this folder.</p>
            <Button variant="outline-primary" onClick={() => setShowUploadArea(true)}>
              <Icon name="Upload" size={16} className="me-2" />
              Upload Some Images
            </Button>
          </div>
        ) : (
          <div className="gallery-grid">
            <div className="row g-3">
              {images.map((image: UploadedImage) => (
                <div className="col-md-3 col-sm-4 col-6" key={image.id}>
                  <div
                    className={`gallery-item position-relative ${selectedImages.includes(image.url) ? 'selected' : ''}`}
                    onClick={() => handleImageClick(image)}
                  >
                    {/* Using LocalImage component instead of img tag */}
                    <LocalImage
                      name={image.url}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      cacheTime={10 * 60 * 1000} // 10 minutes cache
                    />
                    {selectedImages.includes(image.url) && (
                      <div className="selected-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="bg-primary rounded-circle p-1">
                          <Icon name="Check" size={24} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading indicator for subsequent page loads */}
        {isFetching && !isLoading && (
          <div className="text-center py-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2 text-body-custom">Refreshing images...</span>
          </div>
        )}

        {pagination.pageCount > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav aria-label="Gallery pagination">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isFetching}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(pageNum => (
                  <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isFetching}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === pagination.pageCount ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.pageCount || isFetching}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-card-custom border-card-custom">
        <div className="d-flex justify-content-between w-100">
          <div>
            <small className="text-muted-custom">
              {selectedImages.length} of {maxSelection} images selected
            </small>
          </div>
          <div>
            <Button variant="outline-secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button
              type='button'
              variant="primary"
              onClick={handleConfirmSelection}
              disabled={selectedImages.length === 0}
            >
              Select Images
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default GalleryBrowser;