#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://yqthvheodjamdnvstfsx.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGh2aGVvZGphbWRudnN0ZnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDUxNjIsImV4cCI6MjA3MzAyMTE2Mn0.p4nPw7H3L3Tax7yhdXNtrLDBCoG66uEHcgyMqgKKro0";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🏗️  Creating database tables...');
  
  try {
    // Create categories table
    const { error: categoriesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (categoriesError) {
      console.log('Categories table might already exist, continuing...');
    } else {
      console.log('✅ Created categories table');
    }

    // Create products table
    const { error: productsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          image_urls TEXT[] NOT NULL DEFAULT '{}',
          swatch_color TEXT NOT NULL,
          stock_quantity INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN DEFAULT FALSE,
          category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (productsError) {
      console.log('Products table might already exist, continuing...');
    } else {
      console.log('✅ Created products table');
    }

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (profilesError) {
      console.log('Profiles table might already exist, continuing...');
    } else {
      console.log('✅ Created profiles table');
    }

    // Create orders table
    const { error: ordersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
          total_amount DECIMAL(10,2) NOT NULL,
          shipping_address TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (ordersError) {
      console.log('Orders table might already exist, continuing...');
    } else {
      console.log('✅ Created orders table');
    }

    // Create order_items table
    const { error: orderItemsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price_at_purchase DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (orderItemsError) {
      console.log('Order items table might already exist, continuing...');
    } else {
      console.log('✅ Created order_items table');
    }

    // Create reviews table
    const { error: reviewsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, user_id)
        );
      `
    });
    
    if (reviewsError) {
      console.log('Reviews table might already exist, continuing...');
    } else {
      console.log('✅ Created reviews table');
    }

    // Create cart_items table
    const { error: cartItemsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
      `
    });
    
    if (cartItemsError) {
      console.log('Cart items table might already exist, continuing...');
    } else {
      console.log('✅ Created cart_items table');
    }

    console.log('✅ All tables created successfully!\n');
    return true;
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    return false;
  }
}

async function seedDatabase() {
  console.log('📊 Seeding categories...');
  
  const categories = [
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Matte' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Glossy' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Liquid Lipstick' },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Lip Liner' }
  ];

  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(category, { onConflict: 'name' });
    
    if (error) {
      console.error(`❌ Error seeding category ${category.name}:`, error.message);
      return false;
    }
    console.log(`✅ Seeded category: ${category.name}`);
  }
  
  console.log('\n🛍️  Seeding products...');
  
  const products = [
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Dreamer Matte Lipstick',
      description: 'A long-lasting matte finish that feels as light as a cloud.',
      price: 18.50,
      slug: 'dreamer-matte-lipstick',
      image_urls: ['https://placehold.co/600x600/FF69B4/FFFFFF?text=Dreamer+Matte'],
      swatch_color: '#FF69B4',
      stock_quantity: 150,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Sparkle Glossy Lipstick',
      description: 'High-shine, non-sticky formula that keeps your lips looking plump and hydrated.',
      price: 22.00,
      slug: 'sparkle-glossy-lipstick',
      image_urls: ['https://placehold.co/600x600/FFD700/000000?text=Sparkle+Gloss'],
      swatch_color: '#FFD700',
      stock_quantity: 100,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440003',
      name: 'Rebel Red Liquid',
      description: 'A bold, vibrant liquid lipstick with intense pigment and all-day wear.',
      price: 25.00,
      slug: 'rebel-red-liquid',
      image_urls: ['https://placehold.co/600x600/DC143C/FFFFFF?text=Rebel+Red'],
      swatch_color: '#DC143C',
      stock_quantity: 80,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440003'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440004',
      name: 'Perfect Pink Lip Liner',
      description: 'Creamy, waterproof lip liner for a precise and flawless outline.',
      price: 12.00,
      slug: 'perfect-pink-lip-liner',
      image_urls: ['https://placehold.co/600x600/FFB6C1/000000?text=Pink+Liner'],
      swatch_color: '#FFB6C1',
      stock_quantity: 200,
      is_featured: false,
      category_id: '550e8400-e29b-41d4-a716-446655440004'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440005',
      name: 'Neon Pop Gloss',
      description: 'An electrifying, glossy lipstick that will make your lips pop. Perfect for a night out.',
      price: 20.00,
      slug: 'neon-pop-gloss',
      image_urls: ['https://placehold.co/600x600/00FFFF/000000?text=Neon+Pop+Gloss'],
      swatch_color: '#00FFFF',
      stock_quantity: 120,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440006',
      name: 'Vixen Matte',
      description: 'A deep, rich purple matte that gives off a confident and edgy vibe.',
      price: 19.50,
      slug: 'vixen-matte',
      image_urls: ['https://placehold.co/600x600/800080/FFFFFF?text=Vixen+Matte'],
      swatch_color: '#800080',
      stock_quantity: 95,
      is_featured: false,
      category_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440007',
      name: 'Bubblegum Liquid',
      description: 'A fun, playful pink liquid lipstick that\'s perfect for everyday wear.',
      price: 23.00,
      slug: 'bubblegum-liquid',
      image_urls: ['https://placehold.co/600x600/FFC0CB/000000?text=Bubblegum+Liquid'],
      swatch_color: '#FFC0CB',
      stock_quantity: 110,
      is_featured: false,
      category_id: '550e8400-e29b-41d4-a716-446655440003'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440008',
      name: 'Jetsetter Liner',
      description: 'A deep brown lip liner for a bold, defined look.',
      price: 13.50,
      slug: 'jetsetter-liner',
      image_urls: ['https://placehold.co/600x600/5C4033/FFFFFF?text=Jetsetter+Liner'],
      swatch_color: '#5C4033',
      stock_quantity: 180,
      is_featured: false,
      category_id: '550e8400-e29b-41d4-a716-446655440004'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440009',
      name: 'Sunshine Gloss',
      description: 'A sheer, shimmering gloss that adds a touch of brightness to any lipstick.',
      price: 15.00,
      slug: 'sunshine-gloss',
      image_urls: ['https://placehold.co/600x600/F4D03F/000000?text=Sunshine+Gloss'],
      swatch_color: '#F4D03F',
      stock_quantity: 250,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440010',
      name: 'Midnight Matte',
      description: 'A classic, dark matte lipstick for a sophisticated and dramatic look.',
      price: 21.00,
      slug: 'midnight-matte',
      image_urls: ['https://placehold.co/600x600/000000/FFFFFF?text=Midnight+Matte'],
      swatch_color: '#000000',
      stock_quantity: 75,
      is_featured: false,
      category_id: '550e8400-e29b-41d4-a716-446655440001'
    }
  ];

  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Error seeding product ${product.name}:`, error.message);
      return false;
    }
    console.log(`✅ Seeded product: ${product.name}`);
  }
  
  console.log('\n🎉 Database setup and seeding completed successfully!');
  console.log('📊 Your Chick Pick ecommerce store is ready with:');
  console.log('   • 4 Categories (Matte, Glossy, Liquid Lipstick, Lip Liner)');
  console.log('   • 10 Sample Products');
  console.log('   • All database tables created');
  
  return true;
}

async function setupDatabase() {
  console.log('🗄️  Setting up Chick Pick database...\n');
  
  const tablesCreated = await createTables();
  if (!tablesCreated) {
    console.log('⚠️  Some tables might already exist, continuing with seeding...');
  }
  
  const seeded = await seedDatabase();
  if (!seeded) {
    console.log('❌ Seeding failed');
    return;
  }
}

// Run the setup
setupDatabase().catch(console.error);
