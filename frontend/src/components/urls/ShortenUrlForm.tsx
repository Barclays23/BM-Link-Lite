import { useState, type FormEvent } from 'react';
import { urlsService } from '../../services/urls.service';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { ShortUrlData } from '../../types/url.types';

interface ShortenUrlFormProps {
  onCreated: (url: ShortUrlData) => void;
}

export default function ShortenUrlForm({
  onCreated,
}: ShortenUrlFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const createdUrl = await urlsService.create({
        originalUrl: originalUrl.trim(),
      });

      onCreated(createdUrl);
      setOriginalUrl('');
      setSuccess('Your short link has been created.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not shorten this URL.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel shorten-panel">
      <h2>Shorten a URL</h2>

      <form className="shorten-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="original-url">
          Original URL
        </label>

        <input
          id="original-url"
          type="url"
          placeholder="https://example.com/your-long-link"
          value={originalUrl}
          onChange={(event) => setOriginalUrl(event.target.value)}
          maxLength={2048}
          required
        />

        <button
          className="button button-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>

      <p className="hint">
        Enter a complete URL starting with http:// or https://.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </section>
  );
}