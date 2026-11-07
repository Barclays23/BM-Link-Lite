import { useState } from 'react';
import type { ShortUrlData } from '../../types/url.types';



interface UrlListItemProps {
  url: ShortUrlData;
  onDelete: (urlId: string) => Promise<void>;
}


const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};



export default function UrlListItem({ url, onDelete }: UrlListItemProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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


  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this short URL?',
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(url.id);
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <article className="panel url-card">
      <span className="url-icon" aria-hidden="true">
        <svg {...iconProps} width={20} height={20}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </span>

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
          title={url.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.originalUrl}
        </a>

        <div className="url-meta">
          <span>{url.clickCount} clicks</span>
          <span>Created {new Date(url.createdAt).toLocaleString()}</span>
        </div>

        {copyError && (
          <p className="copy-error" role="alert">
            {copyError}
          </p>
        )}
      </div>

      <button
        className={`button button-outline copy-button${copied ? ' is-copied' : ''}`}
        type="button"
        onClick={() => void handleCopy()}
      >
        {copied ? (
          <svg {...iconProps}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg {...iconProps}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {copied ? 'Copied!' : 'Copy link'}
      </button>

      <button
        className="button button-danger"
        type="button"
        disabled={isDeleting}
        onClick={() => void handleDelete()}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </article>
  );
}