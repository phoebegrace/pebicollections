import {
  z
} from 'zod';

import {
  createServerSupabaseClient
} from '@/lib/supabase/server';

import {
  hasSupabase
} from '@/lib/config/env';

import {
  sampleProducts
} from '@/lib/products/sample-products';

import type {
  OrderView
} from '@/types';

export const ClaimSchema =
  z.object({
    firstName:
      z.string()
        .trim()
        .min(
          1,
          'First name is required.'
        )
        .max(80),

    email:
      z.string()
        .trim()
        .email(),

    socialHandle:
      z.string()
        .trim()
        .min(
          1,
          'Social username is required.'
        )
        .max(80),

    preferredContactPlatform:
      z.enum([
        'instagram',
        'tiktok'
      ]),

    marketingOptIn:
      z.boolean()
        .default(false),

    notes:
      z.string()
        .trim()
        .max(1000)
        .optional()
        .default(''),

    items:
      z.array(
        z.object({
          product_id:
            z.string()
              .min(1),

          quantity:
            z.number()
              .int()
              .min(1)
              .max(10)
        })
      )
        .min(1)
  });

export type ClaimResult = {
  order_id: string;

  order_number:
    string;

  public_token:
    string;

  subtotal:
    number;

  first_name:
    string;

  email:
    string;

  preferred_contact_platform:
    | 'instagram'
    | 'tiktok';

  social_handle:
    string;

  marketing_opt_in:
    boolean;

  demo?: boolean;

  demo_order?:
    OrderView;
};

function createDemoClaim(
  data:
    z.infer<
      typeof ClaimSchema
    >
): ClaimResult {
  const selected =
    data.items.map(
      item => {
        const product =
          sampleProducts.find(
            p =>
              p.id ===
              item.product_id
          );

        if (!product) {
          throw new Error(
            'INVENTORY: product not found'
          );
        }

        return {
          product,
          quantity:
            item.quantity
        };
      }
    );

  const subtotal =
    selected.reduce(
      (
        sum,
        row
      ) =>
        sum +
        (
          row.product.price ??
          0
        ) *
        row.quantity,
      0
    );

  const stamp =
    Date.now()
      .toString()
      .slice(-6);

  const orderNumber =
    `PEBI-${stamp}`;

  const token =
    crypto.randomUUID();

  const order:
    OrderView = {
      id:
        `demo-${stamp}`,

      order_number:
        orderNumber,

      public_token:
        token,

      status:
        'pending_confirmation',

      first_name:
        data.firstName,

      email:
        data.email
          .toLowerCase(),

      social_handle:
        data.socialHandle,

      instagram_handle:
        data
          .preferredContactPlatform ===
        'instagram'
          ? data.socialHandle
          : null,

      tiktok_handle:
        data
          .preferredContactPlatform ===
        'tiktok'
          ? data.socialHandle
          : null,

      preferred_contact_platform:
        data
          .preferredContactPlatform,

      subtotal,

      shipping_cost:
        null,

      total:
        subtotal,

      courier:
        null,

      tracking_number:
        null,

      tracking_url:
        null,

      created_at:
        new Date()
          .toISOString(),

      items:
        selected.map(
          ({
            product,
            quantity
          }) => ({
            product_id:
              product.id,

            product_title_snapshot:
              product.title,

            member_name_snapshot:
              product.member_name,

            price_snapshot:
              product.price,

            quantity,

            barcode_snapshot:
              product.barcode,

            front_image_snapshot:
              product.front_image
          })
        )
    };

  return {
    order_id:
      order.id,

    order_number:
      orderNumber,

    public_token:
      token,

    subtotal,

    first_name:
      data.firstName,

    email:
      data.email
        .toLowerCase(),

    preferred_contact_platform:
      data
        .preferredContactPlatform,

    social_handle:
      data.socialHandle,

    marketing_opt_in:
      data.marketingOptIn,

    demo: true,

    demo_order:
      order
  };
}

export async function createClaim(
  input: unknown
) {
  const parsed =
    ClaimSchema
      .safeParse(input);

  if (!parsed.success) {
    return {
      ok:
        false as const,

      status:
        400,

      error:
        'Please check your claim details.',

      issues:
        parsed.error
          .flatten()
    };
  }

  const data =
    parsed.data;

  /*
   * LOCAL DEVELOPMENT MODE
   *
   * This allows the form
   * and order-summary flow
   * to work before Supabase
   * credentials are added.
   */

  if (!hasSupabase) {
    try {
      return {
        ok:
          true as const,

        data:
          createDemoClaim(
            data
          )
      };
    } catch (
      error
    ) {
      const message =
        error instanceof
        Error
          ? error.message
          : 'Could not create demo claim.';

      return {
        ok:
          false as const,

        status:
          409,

        error:
          message.replace(
            /^INVENTORY:\s*/,
            ''
          )
      };
    }
  }

  try {
    const supabase =
      await createServerSupabaseClient();

    const {
      data: result,
      error
    } =
      await supabase.rpc(
        'create_claim_atomic',
        {
          p_first_name:
            data.firstName,

          p_email:
            data.email,

          p_social_handle:
            data.socialHandle,

          p_preferred_contact_platform:
            data
              .preferredContactPlatform,

          p_marketing_opt_in:
            data
              .marketingOptIn,

          p_notes:
            data.notes ||
            null,

          p_items:
            data.items
        }
      );

    if (error) {
      const inventory =
        /INVENTORY/i.test(
          error.message
        );

      const migration =
        /create_claim_atomic|function .* does not exist|schema cache/i.test(
          error.message
        );

      return {
        ok:
          false as const,

        status:
          inventory
            ? 409
            : 400,

        error:
          inventory
            ? 'One of your picks was just claimed or is no longer available. Please refresh your basket.'
            : migration
              ? 'The claim database function is not installed yet. Run Supabase migrations 001 and 002, then try again.'
              : error.message.replace(
                  /^.*VALIDATION:\s*/i,
                  ''
                )
      };
    }

    return {
      ok:
        true as const,

      data:
        result as
          ClaimResult
    };
  } catch (
    error
  ) {
    const message =
      error instanceof
      Error
        ? error.message
        : 'Unknown backend error.';

    return {
      ok:
        false as const,

      status:
        500,

      error:
        `Claim backend error: ${message}`
    };
  }
}