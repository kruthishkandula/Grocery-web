import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().max(120, 'Short description must be less than 120 characters').optional(),
  basePrice: z.coerce.number().min(0, 'Base price must be a positive number'),
  discountPrice: z.coerce.number().min(0, 'Discount price must be a positive number'),
  costPrice: z.coerce.number().min(0, 'Cost price must be a positive number'),
  weightUnit: z.string(),
  isActive: z.boolean().default(true),
  currency: z.string().default('INR'),
  currencySymbol: z.string().default('₹'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().nonempty({ message: 'Image URL is required' }),
  brand: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;