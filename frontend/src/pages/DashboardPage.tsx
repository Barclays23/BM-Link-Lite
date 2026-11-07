import { useEffect, useState } from 'react';

import ShortenUrlForm from '../components/urls/ShortenUrlForm';
import UrlList from '../components/urls/UrlList';
import { urlsService } from '../services/urls.service';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { ShortUrlData } from '../types/url.types';
import Pagination from '../components/urls/Pagination';




export default function DashboardPage() {
   const [urls, setUrls] = useState<ShortUrlData[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   const [currentPage, setCurrentPage] = useState(1);
   const [limit, setLimit] = useState(5);
   const [totalPages, setTotalPages] = useState(0);
   const [totalUrls, setTotalUrls] = useState(0);

   const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');

   const [refreshKey, setRefreshKey] = useState(0);
  

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         setDebouncedSearch(search.trim());
         setCurrentPage(1);
      }, 400);

      return () => clearTimeout(timeoutId);
   }, [search]);


   useEffect(() => {
      let isMounted = true;

      async function loadUrls(): Promise<void> {
         try {
         const response = await urlsService.getMyUrls(
            currentPage,
            limit,
            debouncedSearch,
         );

         if (isMounted) {
            setUrls(response.data);
            setTotalUrls(response.total);
            setTotalPages(response.totalPages);
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

   }, [currentPage, limit, debouncedSearch, refreshKey]);



   const handleCreated = (_createdUrl: ShortUrlData): void => {
      setSearch('');
      setDebouncedSearch('');
      setCurrentPage(1);
      setRefreshKey((current) => current + 1);
   };   


   const handleDelete = async (urlId: string): Promise<void> => {
      try {
         setError('');

         await urlsService.deleteURL(urlId);

         if (urls.length === 1 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
         } else {
            setRefreshKey((current) => current + 1);
         }
      } catch (err: unknown) {
         setError(getErrorMessage(err, 'Could not delete the URL.'));
      }
   };


   const handleLimitChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
   ): void => {
      setLimit(Number(event.target.value));
      setCurrentPage(1);
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

               <span className="count-badge">
                  {totalUrls} links
               </span>
            </div>

            <div className="url-toolbar">
               <input
                  type="search"
                  className="search-input"
                  placeholder="Search original URL or short code..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
               />

               <div className="limit-control">
                  <label htmlFor="limit">Show:</label>

                  <select
                  id="limit"
                  value={limit}
                  onChange={handleLimitChange}
                  >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  </select>

                  <span>per page</span>
               </div>
            </div>

            <UrlList
               urls={urls}
               isLoading={isLoading}
               onDelete={handleDelete}
            />

            {/* Pagination */}
            {!isLoading && (
               <div className="pagination-container">
                  <p className="muted">
                     Showing {totalUrls === 0 ? 0 : (currentPage - 1) * limit + 1}
                     {' - '}
                     {Math.min(currentPage * limit, totalUrls)}
                     {' of '}
                     {totalUrls} links
                  </p>

                  <Pagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={setCurrentPage}
                  />
               </div>
            )}
         </section>
      </main>
   );
}