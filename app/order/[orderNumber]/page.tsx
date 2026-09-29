import {
  getOrderForPublicView
} from '@/lib/orders/repository';

import {
  ClaimSummary
} from '@/components/order/ClaimSummary';

import {
  SocialShareActions
} from '@/components/order/SocialShareActions';

import {
  DemoOrderClient
} from '@/components/order/DemoOrderClient';

import {
  PageHero
} from '@/components/ui/PageHero';

export default async function OrderPage({
  params,
  searchParams
}: {
  params:
    Promise<{
      orderNumber:
        string;
    }>;

  searchParams:
    Promise<{
      token?:
        string;

      demo?:
        string;
    }>;
}) {
  const {
    orderNumber
  } = await params;

  const {
    token = '',
    demo = ''
  } =
    await searchParams;

  if (demo === '1') {
    return (
      <>
        <PageHero
          eyebrow="local claim preview"
          title="one little step closer"
          copy="Your claim submitted successfully in local preview mode."
        />

        <section className="section shell">
          <DemoOrderClient
            orderNumber={
              orderNumber
            }
          />
        </section>
      </>
    );
  }

  let order = null;

  try {
    order =
      await getOrderForPublicView(
        orderNumber,
        token
      );
  } catch {}

  if (!order) {
    return (
      <>
        <PageHero
          eyebrow="private order link"
          title="order not found"
          copy="This link may be incomplete, expired, or the backend is not configured yet."
        />

        <section className="section shell">
          <div className="empty-state large">
            <span>
              I couldn’t open
              this claim.
            </span>

            <p>
              Use the exact
              order link
              generated after
              submission.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="your pebi claim"
        title="one little step closer"
        copy="Keep this private link for your order updates."
      />

      <section className="section shell order-layout">
        <ClaimSummary
          order={order}
        />

        <SocialShareActions
          order={order}
        />
      </section>
    </>
  );
}