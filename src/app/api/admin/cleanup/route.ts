import { NextRequest, NextResponse } from 'next/server'
import { performCleanup, getCleanupStats, DEFAULT_CLEANUP_CONFIG } from '@/lib/cleanup-service'

// Simple API key check for admin endpoints
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_API_KEY || 'huntier-admin-2024'
  
  return authHeader === `Bearer ${adminKey}`
}

/**
 * GET /api/admin/cleanup - Get cleanup statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      )
    }

    const stats = await getCleanupStats()
    
    return NextResponse.json({
      success: true,
      stats,
      config: DEFAULT_CLEANUP_CONFIG,
      message: 'Cleanup statistics retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting cleanup stats:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to get cleanup statistics' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/cleanup - Perform database cleanup
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const config = { ...DEFAULT_CLEANUP_CONFIG, ...body }

    console.log('🧹 Starting manual cleanup via API...')
    const result = await performCleanup(config)

    if (result.success) {
      return NextResponse.json({
        success: true,
        summary: result.summary,
        message: `Cleanup completed successfully. ${result.summary.totalCleaned} records cleaned.`
      })
    } else {
      return NextResponse.json({
        success: false,
        summary: result.summary,
        errors: result.errors,
        message: 'Cleanup completed with some errors'
      }, { status: 207 }) // Multi-status
    }
  } catch (error) {
    console.error('Error performing cleanup:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to perform cleanup' },
      { status: 500 }
    )
  }
}