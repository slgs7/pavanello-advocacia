import type { ReactNode } from 'react';
import Timeline, {
  type TimelineItem,
} from '@/components/ui/timeline-01-utils/timeline';

// Adapted from the client's TimelineBlock01. Dates and stock photos are replaced
// by legal topics; the site typography and tokens provide the visual treatment.
export default function TimelineBlock01({
  title,
  description,
  items,
}: {
  title?: ReactNode;
  description?: string;
  items: TimelineItem[];
}) {
  return (
    <div className="timeline-block">
      {title && (
        <div className="timeline-intro section-heading">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      )}
      <Timeline items={items} />
      <div className="timeline-end" aria-hidden="true" />
    </div>
  );
}
