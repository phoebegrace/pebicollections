'use client';

import {
  useState
} from 'react';

import type {
  OrderView
} from '@/types';

import {
  buildSocialMessage
} from '@/lib/order-summary/message';

export function SocialShareActions({
  order,
  demo = false
}: {
  order: OrderView;
  demo?: boolean;
}) {
  const [
    copied,
    setCopied
  ] = useState(false);

  const token =
    encodeURIComponent(
      order.public_token
    );

  const base =
    `/api/orders/${encodeURIComponent(
      order.order_number
    )}/summary?token=${token}`;

  const message =
    buildSocialMessage(
      order
    );

  async function copy() {
    await navigator
      .clipboard
      .writeText(
        message
      );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(false),
      1800
    );
  }

  async function share() {
    if (
      !navigator.share
    ) {
      return;
    }

    await navigator.share({
      title:
        `Pebicart ${order.order_number}`,

      text:
        message,

      url:
        location.href
    });
  }

  const socialUrl =
    order
      .preferred_contact_platform ===
    'instagram'
      ? 'https://instagram.com/'
      : 'https://www.tiktok.com/';

  return (
    <div className="share-card">
      <div>
        <div className="eyebrow">
          send it to @pebicart
        </div>

        <h2>
          your claim is ready
          to message
        </h2>

        <p>
          Copy the message,
          then open{' '}
          {order
            .preferred_contact_platform ===
          'instagram'
            ? 'Instagram'
            : 'TikTok'}.
        </p>

        {demo && (
          <p className="microcopy">
            Local preview mode
            is active. Connect
            Supabase to enable
            server-generated
            PNG/PDF summaries
            and permanent order
            tracking.
          </p>
        )}
      </div>

      <textarea
        readOnly
        value={message}
        aria-label="Generated social message"
      />

      <div className="share-actions">
        <button
          className="button button-primary"
          onClick={copy}
        >
          {copied
            ? 'copied'
            : 'copy message'}
        </button>

        {!demo && (
          <>
            <a
              className="button button-secondary"
              href={`${base}&format=png`}
              download={`${order.order_number}.png`}
            >
              download PNG
            </a>

            <a
              className="button button-secondary"
              href={`${base}&format=pdf`}
              download={`${order.order_number}.pdf`}
            >
              download PDF
            </a>
          </>
        )}

        {typeof navigator !==
          'undefined' &&
          'share' in
            navigator && (
            <button
              className="button button-secondary"
              onClick={share}
            >
              share
            </button>
          )}
      </div>

      <div className="social-open">
        <a
          href={socialUrl}
          target="_blank"
          rel="noreferrer"
        >
          open{' '}
          {order
            .preferred_contact_platform ===
          'instagram'
            ? 'Instagram'
            : 'TikTok'}{' '}
          ↗
        </a>
      </div>
    </div>
  );
}