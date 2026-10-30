import { useEffect, useState } from 'react';

import ShortenUrlForm from '../components/urls/ShortenUrlForm';
import UrlList from '../components/urls/UrlList';
import { urlsService } from '../services/urls.service';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { ShortUrlData } from '../types/url.types';




export default function DashboardPage() {
  const [urls, setUrls] = useState<ShortUrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUrls(): Promise<void> {
      try {
        const data = await urlsService.getMyUrls();
        if (isMounted) {
          setUrls(data);
          setError('');
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(getErrorMessage(err, 'Could not load your URLs.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUrls();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreated = (createdUrl: ShortUrlData): void => {
    setUrls((currentUrls) => [
      createdUrl,
      ...currentUrls.filter((url) => url.id !== createdUrl.id),
    ]);
  };

  return (
    <main className="dashboard">
      <section className="dashboard-heading">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>URL Dashboard</h1>
        <p className="muted">
          Create short links and manage your links in one place.
        </p>
      </section>

      <ShortenUrlForm onCreated={handleCreated} />

      {error && <div className="alert alert-error">{error}</div>}

      <section className="history-section">
        <div className="section-heading">
          <div>
            <h2>Your links</h2>
            <p className="muted">Your recently created short URLs.</p>
          </div>

          <span className="count-badge">{urls.length} links</span>
        </div>

        <UrlList urls={urls} isLoading={isLoading} />
      </section>
    </main>
  );
}