export function track(
  event: 'whatsapp_click' | 'lead_submit',
  data?: { area?: string; momento?: string },
) {
  if (
    typeof window === 'undefined' ||
    localStorage.getItem('analytics-consent') !== 'accepted'
  )
    return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', event, data || {});
}
