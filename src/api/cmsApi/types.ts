export interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  shortDescription: string;
  basePrice: string | number;
  discountPrice: string | number;
  costPrice: string | number;
  weightUnit: string;
  dimensions?: any | null;
  isActive: boolean;
  currency: string;
  currencySymbol: string;
  barcode: string | null;
  brand: string | null;
  category?: {
    id: number;
    name: string;
    isActive: boolean;
  } | null;
  categoryId: {
    id: number;
    name: string;
  } | number;
  images: Array<{ url: string, thumbnailUrl?: string }>;
  variants: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  _softDeleted?: boolean;
}

export interface CategoryImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: Record<string, any>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  description: string;
  enabledAt: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imageUrl: string;
  imageThumbnailUrl: string;
}

export interface Order {
  id: number;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CMSResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}
