import React, { useState } from 'react';
import Images, { ImageNames } from '@/constants/images';
import { CMS_URL } from '@/utility/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './ImageStyles.css';

export type ImageProps = {
    name: ImageNames | string;
    alt?: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    cacheTime?: number; // Cache time in milliseconds
}

// Default placeholder image
const DEFAULT_PLACEHOLDER = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

export default function LocalImage({ 
    name, 
    alt = 'Image', 
    size = 100, 
    width = 100, 
    height = 100, 
    className, 
    style,
    placeholder = DEFAULT_PLACEHOLDER,
    cacheTime = 5 * 60 * 1000 // Default 5 minutes
}: ImageProps) {
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();
    
    // Determine the source URL based on the name prop
    const determineSourceUrl = (): string => {
        if (Object.prototype.hasOwnProperty.call(Images, name)) {
            const LocalIcon = Images[name as ImageNames];
            return LocalIcon;
        } else if (typeof name === 'string') {
            if (name.startsWith('http://') || name.startsWith('https://')) {
                return name;
            } else if (name.startsWith('/uploads/')) {
                // Handle CMS images that might have relative paths
                return `${CMS_URL}${name}`;
            } else if (name.startsWith('/')) {
                return `https://kasukutrade.com/public/assets/img/placeholder.jpg`;
            } else {
                // If the image path doesn't match any of the conditions, use a placeholder
                return placeholder;
            }
        } else {
            return Images['logo'];
        }
    };
    
    const sourceUrl = determineSourceUrl();
    
    // Skip caching for local assets or imported images
    const shouldUseCache = sourceUrl.startsWith('http') && 
                         !Object.values(Images).includes(sourceUrl);
    
    // Use React Query for image caching
    const { data: cachedSrc, isLoading } = useQuery({
        queryKey: ['image', sourceUrl],
        queryFn: async () => {
            // For remote images, prefetch them
            if (shouldUseCache) {
                try {
                    // Create a promise that resolves when the image is loaded
                    const imagePromise = new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = sourceUrl;
                        img.onload = () => resolve(sourceUrl);
                        img.onerror = () => reject(new Error('Image failed to load'));
                    });
                    
                    return await imagePromise;
                } catch (error) {
                    console.error('Error prefetching image:', error);
                    return placeholder;
                }
            }
            
            // For local assets, just return the URL
            return sourceUrl;
        },
        staleTime: cacheTime, // Time before refetching
        gcTime: cacheTime, // Time before removing from cache (React Query v5+)
        enabled: shouldUseCache && !imageError,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    });
    
    // Prefetch common images when encountered
    React.useEffect(() => {
        if (shouldUseCache && !imageError) {
            // Prefetch the image so it's available for next time
            queryClient.prefetchQuery({
                queryKey: ['image', sourceUrl],
                queryFn: () => Promise.resolve(sourceUrl),
                staleTime: cacheTime
            });
        }
    }, [sourceUrl, shouldUseCache, imageError, queryClient, cacheTime]);
    
    // Handle image loading error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageError(true);
        e.currentTarget.src = placeholder;
    };
    
    // Determine the final source to use
    const finalSrc: string = imageError
        ? placeholder
        : (typeof (shouldUseCache ? cachedSrc : sourceUrl) === 'string'
            ? (shouldUseCache ? (cachedSrc as string) || placeholder : sourceUrl)
            : placeholder);

    return (
        <>
            {isLoading ? (
                // Skeleton loader while image is loading
                <div 
                    className={`local-image-skeleton ${className || ''}`}
                    style={{
                        width: size || width,
                        height: size || height,
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        ...style
                    }}
                />
            ) : (
                <img
                    src={finalSrc}
                    alt={alt}
                    width={size || width}
                    height={size || height}
                    className={`local-image ${className || ''}`}
                    style={{ ...style }}
                    onError={handleImageError}
                    loading="lazy" // Use native lazy loading
                />
            )}
        </>
    );
}

// Add this to your CSS or create a new style component
export const ImageStyles = `
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

.local-image-skeleton {
  display: inline-block;
}
`;
