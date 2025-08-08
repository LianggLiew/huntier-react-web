import { NextRequest, NextResponse } from 'next/server'
import { CampusAmbassadorDB } from '@/lib/campus-ambassador-db'

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here for admin access
    // const isAuthenticated = await checkAdminAuth(request)
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const stats = await CampusAmbassadorDB.getApplicationStats()

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get Application Stats Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}