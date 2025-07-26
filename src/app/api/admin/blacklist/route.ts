import { NextRequest, NextResponse } from 'next/server'
import { 
  getActiveBlacklistEntries, 
  getBlacklistStats, 
  manuallyBlacklistContact,
  removeFromBlacklist,
  searchBlacklistEntries 
} from '@/lib/blacklist-management'
import { ContactType } from '@/lib/blacklist'

// Simple API key check for admin endpoints
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_API_KEY || 'huntier-admin-2024'
  
  return authHeader === `Bearer ${adminKey}`
}

/**
 * GET /api/admin/blacklist - Get blacklist entries with optional search
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const contactType = searchParams.get('contactType') as ContactType
    const action = searchParams.get('action')

    // Handle different GET actions
    if (action === 'stats') {
      const stats = await getBlacklistStats()
      return NextResponse.json({
        success: true,
        stats,
        message: 'Blacklist statistics retrieved successfully'
      })
    }

    let result
    if (search) {
      // Search blacklist entries
      const entries = await searchBlacklistEntries(search, contactType)
      result = {
        entries,
        total: entries.length,
        hasMore: false
      }
    } else {
      // Get paginated blacklist entries
      result = await getActiveBlacklistEntries(page, limit)
    }

    return NextResponse.json({
      success: true,
      ...result,
      page,
      limit,
      message: 'Blacklist entries retrieved successfully'
    })

  } catch (error) {
    console.error('Error getting blacklist entries:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to retrieve blacklist entries' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blacklist - Add contact to blacklist
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

    const body = await request.json()
    const { contactValue, contactType, durationHours = 24, reason = 'Manual admin block' } = body

    // Validate input
    if (!contactValue || !contactType) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'contactValue and contactType are required' },
        { status: 400 }
      )
    }

    if (!['email', 'phone'].includes(contactType)) {
      return NextResponse.json(
        { error: 'Invalid contact type', message: 'contactType must be email or phone' },
        { status: 400 }
      )
    }

    const result = await manuallyBlacklistContact(
      contactValue,
      contactType as ContactType,
      durationHours,
      reason
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Contact ${contactValue} has been blacklisted for ${durationHours} hours`
      })
    } else {
      return NextResponse.json(
        { error: 'Blacklist failed', message: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error adding to blacklist:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to add contact to blacklist' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/blacklist - Remove contact from blacklist
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { contactValue, contactType } = body

    // Validate input
    if (!contactValue || !contactType) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'contactValue and contactType are required' },
        { status: 400 }
      )
    }

    if (!['email', 'phone'].includes(contactType)) {
      return NextResponse.json(
        { error: 'Invalid contact type', message: 'contactType must be email or phone' },
        { status: 400 }
      )
    }

    const result = await removeFromBlacklist(contactValue, contactType as ContactType)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Contact ${contactValue} has been removed from blacklist`
      })
    } else {
      return NextResponse.json(
        { error: 'Unblacklist failed', message: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error removing from blacklist:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to remove contact from blacklist' },
      { status: 500 }
    )
  }
}