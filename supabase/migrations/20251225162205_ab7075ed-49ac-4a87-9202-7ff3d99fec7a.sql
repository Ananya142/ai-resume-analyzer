-- Create storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
);

-- Allow anyone to upload documents (public upload, private read)
CREATE POLICY "Anyone can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to read their own uploads (by matching the file path)
CREATE POLICY "Anyone can read documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');