-- Insert categories
INSERT INTO categories (id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Matte'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Glossy'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Liquid Lipstick'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Lip Liner')
ON CONFLICT (name) DO NOTHING;

-- Insert products
INSERT INTO products (id, name, description, price, slug, image_urls, swatch_color, stock_quantity, is_featured, category_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Dreamer Matte Lipstick', 'A long-lasting matte finish that feels as light as a cloud.', 18.50, 'dreamer-matte-lipstick', ARRAY['https://placehold.co/600x600/FF69B4/FFFFFF?text=Dreamer+Matte'], '#FF69B4', 150, true, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Sparkle Glossy Lipstick', 'High-shine, non-sticky formula that keeps your lips looking plump and hydrated.', 22.00, 'sparkle-glossy-lipstick', ARRAY['https://placehold.co/600x600/FFD700/000000?text=Sparkle+Gloss'], '#FFD700', 100, true, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Rebel Red Liquid', 'A bold, vibrant liquid lipstick with intense pigment and all-day wear.', 25.00, 'rebel-red-liquid', ARRAY['https://placehold.co/600x600/DC143C/FFFFFF?text=Rebel+Red'], '#DC143C', 80, true, '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440004', 'Perfect Pink Lip Liner', 'Creamy, waterproof lip liner for a precise and flawless outline.', 12.00, 'perfect-pink-lip-liner', ARRAY['https://placehold.co/600x600/FFB6C1/000000?text=Pink+Liner'], '#FFB6C1', 200, false, '550e8400-e29b-41d4-a716-446655440004'),
  ('650e8400-e29b-41d4-a716-446655440005', 'Neon Pop Gloss', 'An electrifying, glossy lipstick that will make your lips pop. Perfect for a night out.', 20.00, 'neon-pop-gloss', ARRAY['https://placehold.co/600x600/00FFFF/000000?text=Neon+Pop+Gloss'], '#00FFFF', 120, true, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440006', 'Vixen Matte', 'A deep, rich purple matte that gives off a confident and edgy vibe.', 19.50, 'vixen-matte', ARRAY['https://placehold.co/600x600/800080/FFFFFF?text=Vixen+Matte'], '#800080', 95, false, '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440007', 'Bubblegum Liquid', 'A fun, playful pink liquid lipstick that''s perfect for everyday wear.', 23.00, 'bubblegum-liquid', ARRAY['https://placehold.co/600x600/FFC0CB/000000?text=Bubblegum+Liquid'], '#FFC0CB', 110, false, '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440008', 'Jetsetter Liner', 'A deep brown lip liner for a bold, defined look.', 13.50, 'jetsetter-liner', ARRAY['https://placehold.co/600x600/5C4033/FFFFFF?text=Jetsetter+Liner'], '#5C4033', 180, false, '550e8400-e29b-41d4-a716-446655440004'),
  ('650e8400-e29b-41d4-a716-446655440009', 'Sunshine Gloss', 'A sheer, shimmering gloss that adds a touch of brightness to any lipstick.', 15.00, 'sunshine-gloss', ARRAY['https://placehold.co/600x600/F4D03F/000000?text=Sunshine+Gloss'], '#F4D03F', 250, true, '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440010', 'Midnight Matte', 'A classic, dark matte lipstick for a sophisticated and dramatic look.', 21.00, 'midnight-matte', ARRAY['https://placehold.co/600x600/000000/FFFFFF?text=Midnight+Matte'], '#000000', 75, false, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (slug) DO NOTHING;
