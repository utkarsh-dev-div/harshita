require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixMissingProfiles() {
  console.log('🔧 Fixing missing user profiles...')

  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      throw authError
    }

    console.log(`📊 Found ${authUsers.users.length} users in auth.users`)

    // Get all existing profiles
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')

    if (profilesError) {
      throw profilesError
    }

    const existingProfileIds = new Set(existingProfiles.map(p => p.id))
    console.log(`📊 Found ${existingProfiles.length} existing profiles`)

    // Find users without profiles
    const usersWithoutProfiles = authUsers.users.filter(user => !existingProfileIds.has(user.id))
    
    if (usersWithoutProfiles.length === 0) {
      console.log('✅ All users already have profiles!')
      return
    }

    console.log(`🔍 Found ${usersWithoutProfiles.length} users without profiles`)

    // Create profiles for users without them
    const profilesToCreate = usersWithoutProfiles.map(user => ({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: 'USER'
    }))

    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profilesToCreate)

    if (insertError) {
      throw insertError
    }

    console.log(`✅ Successfully created ${profilesToCreate.length} missing profiles`)
    
    // List the created profiles
    profilesToCreate.forEach(profile => {
      console.log(`   - ${profile.name} (${profile.email})`)
    })

  } catch (error) {
    console.error('❌ Error fixing missing profiles:', error)
    process.exit(1)
  }
}

fixMissingProfiles()
