
-- Add external source fields to the services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Add external source fields to service_photos table
ALTER TABLE public.service_photos
ADD COLUMN IF NOT EXISTS source TEXT;

-- Add external source fields to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS external_review_url TEXT;

-- Add external source fields to review_photos table
ALTER TABLE public.review_photos
ADD COLUMN IF NOT EXISTS source TEXT;

-- Create indexes on the external_id field for faster lookups
CREATE INDEX IF NOT EXISTS services_external_id_idx ON public.services(external_id);

COMMENT ON COLUMN public.services.source IS 'The source of the service data (internal, google_maps, instagram, facebook, etc.)';
COMMENT ON COLUMN public.services.external_id IS 'ID of the service in the external platform';
COMMENT ON COLUMN public.services.external_url IS 'URL to the service page on the external platform';
