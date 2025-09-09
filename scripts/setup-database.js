#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = "https://yqthvheodjamdnvstfsx.supabase.co"
const supabaseServiceKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdGh2aGVvZGphbWRudnN0ZnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDUxNjIsImV4cCI6MjA3MzAyMTE2Mn0.p4nPw7H3L3Tax7yhdXNtrLDBCoG66uEHcgyMqgKKro0"

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedCategories() {
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
  
  return true;
}

async function seedProducts() {
  console.log('🛍️  Seeding products...');
  
  const products = [
    {
      id: '650e8400-e29b-41d4-a716-446655440001',
      name: 'Dreamer Matte Lipstick',
      description: 'A long-lastingg matte finish that feels as light as a cloud.',
      price: 18.50,
      slug: 'dreamer-matte-lipstick',
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
      swatch_color: '#FF69B4',
      stock_quantity: 150,
      is_featured: true,
      category_id: '550e8400-e29b-41d4-a716-446655440001'
      
    },
    {
      id: '650e8400-e29b-41d4-a716-446655440002',
      name: 'Sparkle Glossy Lipstick',
      description: 'High-shine, non-sticky formula that keeps your lips looking plump and hydrated.',
      price: 222.00,
      slug: 'sparkle-glossy-lipstick',
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
      image_urls: ['https://images-static.nykaa.com/media/catalog/product/f/e/fe13a82MAYBE00000380_1.jpg'],
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
  
  return true;
}

async function setupDatabase() {
  console.log('🗄️  Setting up Chick Pick database...\n');
  
  try {
    // Check if tables exist
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.error('❌ Database tables not found. Please run the SQL scripts first:');
      console.error('   1. 001_create_tables.sql');
      console.error('   2. 002_enable_rls.sql');
      console.error('   3. 003_create_profile_trigger.sql');
      console.error('You can run these in your Supabase dashboard SQL editor.');
      return;
    }
    
    // Seed categories
    const categoriesSuccess = await seedCategories();
    if (!categoriesSuccess) return;
    
    console.log('');
    
    // Seed products
    const productsSuccess = await seedProducts();
    if (!productsSuccess) return;
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Categories and sample products have been seeded.');
    
  } catch (error) {
    console.error('❌ Error during database setup:', error.message);
  }
}

// Run the setup
setupDatabase().catch(console.error);
