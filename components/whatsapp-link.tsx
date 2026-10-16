'use client';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/site.config';
import { track } from '@/lib/analytics';
export function WhatsAppLink({
  children,
  className = 'button primary',
  message,
  icon = false,
}: {
  children: React.ReactNode;
  className?: string;
  message?: string;
  icon?: boolean;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click')}
    >
      {icon && <MessageCircle size={18} />} {children}
    </a>
  );
}
