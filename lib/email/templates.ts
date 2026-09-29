export type EmailAutomation = {
  to: string;
  firstName: string;
  replyTo: string;
  subject: string;
  preview: string;
  body: string;
};

const replyTo = 'info@pebicollections.com';

export function claimReceivedEmail(input:{email:string;firstName:string;orderNumber:string}):EmailAutomation{
  return {
    to: input.email,
    firstName: input.firstName,
    replyTo,
    subject: `claim received · ${input.orderNumber}`,
    preview: 'your pebi picks are waiting for confirmation.',
    body: `Hi ${input.firstName}, your Pebicart claim ${input.orderNumber} was received. I’ll confirm availability and send the next steps soon. Your items are pending until the claim is confirmed.`
  };
}

export function marketingSubscribedEmail(input:{email:string;firstName:string}):EmailAutomation{
  return {
    to: input.email,
    firstName: input.firstName,
    replyTo,
    subject: 'you’re on the pebi list',
    preview: 'new collection drops can now find you first.',
    body: `Hi ${input.firstName}, you opted in to Pebicart collection-drop emails. I’ll only use this list for new drops, collection updates, and occasional Pebicart news. You can unsubscribe anytime.`
  };
}

export function feedbackRequestEmail(input:{email:string;firstName:string;orderNumber:string}):EmailAutomation{
  return {
    to: input.email,
    firstName: input.firstName,
    replyTo,
    subject: 'how did your pebi order go?',
    preview: `a tiny check-in about ${input.orderNumber}.`,
    body: `Hi ${input.firstName}, I hope your Pebicart picks arrived safely. If you have a minute, I’d love to hear how ${input.orderNumber} went. You can reply to this email or message @pebicart on the same platform you used for your claim.`
  };
}
