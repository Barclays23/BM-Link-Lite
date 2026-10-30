import type { ShortUrlData } from '../../types/url.types';
import UrlListItem from './UrlListItem';

interface UrlListProps {
  urls: ShortUrlData[];
  isLoading: boolean;
}

export default function UrlList({ urls, isLoading }: UrlListProps) {
  if (isLoading) {
    return <div className="panel empty-state">Loading your links...</div>;
  }

  if (urls.length === 0) {
    return (
      <div className="panel empty-state">
        <h3>No links yet</h3>
        <p>Create your first short URL using the form above.</p>
      </div>
    );
  }

  return (
    <div className="url-list">
      {urls.map((url) => (
        <UrlListItem key={url.id} url={url} />
      ))}
    </div>
  );
}