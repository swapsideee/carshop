import { z } from 'zod';

import { HttpError, validateName, validatePhone } from '@/shared/lib';

export const checkoutOptionSchema = z.enum(['pair', 'set']);

const customerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .refine((value) => validateName(value).isValid)
      .transform((value) => validateName(value).cleaned),
    phone: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .refine((value) => validatePhone(value).isValid)
      .transform((value) => validatePhone(value).cleaned),
    email: z.string().trim().email().max(254),
    comment: z.string().trim().max(500).optional().default(''),
  })
  .strict();

const checkoutItemSchema = z
  .object({
    productId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    option: checkoutOptionSchema,
    quantity: z.number().int().min(1).max(10),
  })
  .strict();

export const checkoutRequestSchema = z
  .object({
    customer: customerSchema,
    cartItems: z.array(checkoutItemSchema).min(1).max(20),
  })
  .strict()
  .superRefine((value, ctx) => {
    const keys = new Set<string>();

    value.cartItems.forEach((item, index) => {
      const key = `${item.productId}:${item.option}`;
      if (keys.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Duplicate cart item',
          path: ['cartItems', index],
        });
      }
      keys.add(key);
    });
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutCartItem = CheckoutRequest['cartItems'][number];
export type CheckoutCustomer = CheckoutRequest['customer'];

export function getUniqueCheckoutProductIds(cartItems: CheckoutCartItem[]): number[] {
  return [...new Set(cartItems.map((item) => item.productId))];
}

export function parseCheckoutRequest(body: unknown): CheckoutRequest {
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new HttpError(400, 'Некоректні дані замовлення');
  }

  return parsed.data;
}
