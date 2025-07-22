import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * A custom hook that wraps react-hook-form with zod schema validation
 * @param schema - Zod schema for form validation
 * @param options - Additional react-hook-form options
 * @returns Form methods and state from react-hook-form
 */
export function useZodForm<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  type FormValues = z.infer<TSchema>;
  
  const form = useForm<any>({
    ...options,
    resolver: zodResolver(schema),
  });

  return {
    ...form,
    formState: {
      ...form.formState,
    },
  };
}