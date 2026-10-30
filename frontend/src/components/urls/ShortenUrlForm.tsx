import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { urlsService } from '../../services/urls.service';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { ShortUrlData } from '../../types/url.types';



interface ShortenUrlFormProps {
  onCreated: (url: ShortUrlData) => void;
}

const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'Please enter a URL.')
    .url('Please enter a valid URL.')
    .refine(
      (value) => {
        try {
          const url = new URL(value);

          return (
            url.protocol === 'http:' ||
            url.protocol === 'https:'
          );
        } catch {
          return false;
        }
      },
      'Only HTTP and HTTPS URLs are allowed.',
    )
    .max(2048, 'URL is too long.'),
});

type ShortenUrlFormData = z.infer<
  typeof shortenUrlSchema
>;





export default function ShortenUrlForm({
  onCreated,
}: ShortenUrlFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShortenUrlFormData>({
    resolver: zodResolver(shortenUrlSchema),
  });

  const onSubmit = async (data: ShortenUrlFormData) => {
    try {
      const createdUrl = await urlsService.create(data);

      onCreated(createdUrl);
      reset();

      toast.success('Short URL created successfully');
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Could not shorten this URL.',
        ),
      );
    }
  };

  return (
    <section className="panel shorten-panel">
      <h2>Shorten a URL</h2>

      <form
        className="shorten-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label
            className="sr-only"
            htmlFor="original-url"
          >
            Original URL
          </label>

          <input
            id="original-url"
            type="url"
            placeholder="https://example.com/your-long-link"
            {...register('originalUrl')}
          />

          {errors.originalUrl && (
            <p className="field-error">
              {errors.originalUrl.message}
            </p>
          )}
        </div>

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
    </section>
  );
}