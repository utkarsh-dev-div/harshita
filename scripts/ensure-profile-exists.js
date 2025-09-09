require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function ensureProfileExists(userId, userEmail, userName) {
  console.log(`🔧 Ensuring profile exists for user: ${userId}`)

  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingProfile) {
      console.log('✅ Profile already exists')
      return
    }

    // Create profile if it doesn't exist
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: userName || userEmail?.split('@')[0] || 'User',
        email: userEmail,
        role: 'USER'
      })

    if (insertError) {
      throw insertError
    }

    console.log('✅ Profile created successfully')

  } catch (error) {
    console.error('❌ Error ensuring profile exists:', error)
    throw error
  }
}

// If called directly with arguments
if (process.argv.length >= 3) {
  const userId = process.argv[2]
  const userEmail = process.argv[3] || null
  const userName = process.argv[4] || null
  
  ensureProfileExists(userId, userEmail, userName)
    .then(() => {
      console.log('✅ Done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed:', error)
      process.exit(1)
    })
}

module.exports = { ensureProfileExists }
