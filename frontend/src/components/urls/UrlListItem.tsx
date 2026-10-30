import { useState } from 'react';
import type { ShortUrlData } from '../../types/url.types';

interface UrlListItemProps {
  url: ShortUrlData;
}

export default function UrlListItem({ url }: UrlListItemProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const handleCopy = async () => {
    setCopied(false);
    setCopyError('');

    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
    } catch {
      setCopyError('Copy failed. Please copy the link manually.');
    }
  };

  return (
    <article className="panel url-card">
      <div className="url-details">
        <a
          className="short-link"
          href={url.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.shortUrl}
        </a>

        <a
          className="original-link"
          href={url.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.originalUrl}
        </a>

        <div className="url-meta">
          <span>{url.clickCount} clicks</span>
          <span>
            Created {new Date(url.createdAt).toLocaleString()}
          </span>
        </div>

        {copyError && (
          <p className="copy-error" role="alert">{copyError}</p>
        )}
      </div>

      <button
        className="button button-outline copy-button"
        type="button"
        onClick={() => void handleCopy()}
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </article>
  );
}