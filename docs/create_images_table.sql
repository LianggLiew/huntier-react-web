-- Create images table for storing image URLs
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'company-logo', 'company-photo', 'university-logo', 'avatar'
  entity_id VARCHAR(100) NOT NULL, -- 'trivo-electronics', 'university-malaya', etc.
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_images_category_entity ON images(category, entity_id);

-- Insert sample data
INSERT INTO images (category, entity_id, filename, url, alt_text) VALUES
-- Company Logos
('company-logo', 'manufacturing-excellence', 'manufacturing-excellence-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-logos/manufacturing-excellence-logo.png', 'Manufacturing Excellence Logo'),
('company-logo', 'trivo-electronics', 'trivo-electronics-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-logos/trivo-electronics-logo.png', 'Trivo Electronics Logo'),
('company-logo', 'global-services', 'global-services-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-logos/global-services-logo.png', 'Global Services Logo'),

-- Company Photos  
('company-photo', 'manufacturing-excellence', 'manufacturing-team.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-photos/manufacturing-team.jpg', 'Manufacturing Excellence Team'),
('company-photo', 'trivo-electronics', 'trivo-electronics-team.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-photos/trivo-electronics-team.jpg', 'Trivo Electronics Team'),
('company-photo', 'global-services', 'global-services-team.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/company-photos/global-services-team.jpg', 'Global Services Team'),

-- Avatars
('avatar', 'robert-lee', 'robert-lee.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/robert-lee.jpg', 'Robert Lee'),
('avatar', 'sarah-kim', 'sarah-kim.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/sarah-kim.jpg', 'Sarah Kim'),  
('avatar', 'maria-chen', 'maria-chen.jpg', 'https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/maria-chen.jpg', 'Maria Chen'),

-- University Logos
('university-logo', 'university-malaya', 'university-malaya-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/university-logos/university-malaya-logo.png', 'University of Malaya Logo'),
('university-logo', 'peking-university', 'peking-university-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/university-logos/peking-university-logo.png', 'Peking University Logo'),
('university-logo', 'tsinghua-university', 'tsinghua-university-logo.png', 'https://your-supabase-url.supabase.co/storage/v1/object/public/university-logos/tsinghua-university-logo.png', 'Tsinghua University Logo');

-- Enable RLS (Row Level Security)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON images FOR SELECT USING (true);