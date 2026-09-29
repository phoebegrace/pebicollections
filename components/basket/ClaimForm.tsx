'use client';

import {
  FormEvent,
  useState
} from 'react';

import {
  useRouter
} from 'next/navigation';

import {
  useBasket
} from './BasketProvider';

import type {
  OrderView
} from '@/types';

type ContactPlatform =
  | 'instagram'
  | 'tiktok';

type ClaimResponse = {
  order_number:
    string;

  public_token:
    string;

  demo?: boolean;

  demo_order?:
    OrderView;

  error?: string;
};

export function ClaimForm() {
  const router =
    useRouter();

  const {
    items,
    clear
  } = useBasket();

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState('');

  const [
    platform,
    setPlatform
  ] =
    useState<ContactPlatform>(
      'instagram'
    );

  async function submit(
    e:
      FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError('');

    const fd =
      new FormData(
        e.currentTarget
      );

    const payload = {
      firstName:
        String(
          fd.get(
            'firstName'
          ) || ''
        ).trim(),

      email:
        String(
          fd.get(
            'email'
          ) || ''
        ).trim(),

      preferredContactPlatform:
        platform,

      socialHandle:
        String(
          fd.get(
            'socialHandle'
          ) || ''
        ).trim(),

      marketingOptIn:
        fd.get(
          'marketing'
        ) === 'on',

      notes:
        String(
          fd.get(
            'notes'
          ) || ''
        ).trim(),

      items:
        items.map(
          item => ({
            product_id:
              item.product.id,

            quantity:
              item.quantity
          })
        )
    };

    try {
      const res =
        await fetch(
          '/api/claims',
          {
            method:
              'POST',

            headers: {
              'content-type':
                'application/json'
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );

      const data:
        ClaimResponse =
          await res.json();

      if (!res.ok) {
        setError(
          data.error ||
          'Could not submit claim.'
        );

        setLoading(
          false
        );

        return;
      }

      /*
       * If Supabase has not
       * been configured yet,
       * preserve the temporary
       * local order so the
       * complete UI still works.
       */

      if (
        data.demo &&
        data.demo_order
      ) {
        sessionStorage.setItem(
          `pebicart-demo-order-${data.order_number}`,

          JSON.stringify(
            data.demo_order
          )
        );
      }

      clear();

      const demo =
        data.demo
          ? '&demo=1'
          : '';

      router.push(
        `/order/${encodeURIComponent(
          data.order_number
        )}?token=${encodeURIComponent(
          data.public_token
        )}${demo}`
      );
    } catch (
      caught
    ) {
      const message =
        caught instanceof
        Error
          ? caught.message
          : 'Network error';

      setError(
        `Could not submit your claim: ${message}`
      );

      setLoading(
        false
      );
    }
  }

  if (!items.length) {
    return (
      <div className="empty-state large">
        <span>
          there’s nothing to
          claim yet.
        </span>

        <p>
          Add your picks to the
          basket first.
        </p>
      </div>
    );
  }

  return (
    <form
      className="claim-form"
      onSubmit={submit}
    >
      <div className="form-intro">
        <div className="eyebrow">
          almost yours
        </div>

        <h2>
          where should I find
          you?
        </h2>

        <p>
          Your email is used
          for claim
          confirmations and
          order updates.
          Marketing is
          separate and
          optional.
        </p>
      </div>

      <div className="field-grid">
        <label>
          <span>
            First name *
          </span>

          <input
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="Phoebe"
          />
        </label>

        <label>
          <span>
            Email *
          </span>

          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
        </label>

        <label>
          <span>
            Preferred contact *
          </span>

          <select
            name="preferred"
            value={platform}
            onChange={e =>
              setPlatform(
                e.target.value as
                  ContactPlatform
              )
            }
          >
            <option value="instagram">
              Instagram
            </option>

            <option value="tiktok">
              TikTok
            </option>
          </select>
        </label>

        <label>
          <span>
            {platform ===
            'instagram'
              ? 'Instagram username *'
              : 'TikTok username *'}
          </span>

          <input
            key={platform}
            name="socialHandle"
            required
            autoComplete="off"
            placeholder={
              platform ===
              'instagram'
                ? '@yourinstagram'
                : '@yourtiktok'
            }
          />
        </label>
      </div>

      <p className="microcopy social-handle-note">
        Only one username is
        collected — for the
        platform you selected
        above.
      </p>

      <label>
        <span>
          Anything I should
          know?
        </span>

        <textarea
          name="notes"
          rows={4}
          placeholder="Optional claim or shipping note"
        />
      </label>

      <label className="marketing-check">
        <input
          type="checkbox"
          name="marketing"
        />

        <span>
          Email me when
          Pebicart drops new
          collection items.

          <small>
            Optional. You can
            opt out later.
          </small>
        </span>
      </label>

      {error && (
        <div
          className="form-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        className="button button-primary button-block"
        disabled={loading}
      >
        {loading
          ? 'submitting claim...'
          : 'submit my claim'}
      </button>

      <p className="microcopy">
        By submitting, you’re
        creating a claim
        request, not an
        official receipt or
        completed purchase.
        Items are pending
        until confirmed by
        Pebicart.
      </p>
    </form>
  );
}