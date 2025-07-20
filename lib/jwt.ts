/**
 * JWT Token Management Utilities
 * 
 * This module handles JWT (JSON Web Token) operations for the authentication system.
 * It provides functions for generating, verifying, and managing both access tokens
 * and refresh tokens for secure session management.
 * 
 * Security Features:
 * - Short-lived access tokens (15 minutes)
 * - Long-lived refresh tokens (7 days)
 * - Secure random OTP generation
 * - Token validation with issuer/audience verification
 */

import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

// Load JWT secrets from environment variables
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

/**
 * Payload structure for access tokens
 * Contains user information for authenticated requests
 */
export interface JWTPayload {
  userId: string           // User's unique identifier
  email?: string          // User's email (if provided)
  phone?: string          // User's phone (if provided)
  isVerified: boolean     // Whether user has completed verification
  iat?: number           // Token issued at timestamp (added by JWT library)
  exp?: number           // Token expiration timestamp (added by JWT library)
}

/**
 * Payload structure for refresh tokens
 * Contains minimal information for token refresh operations
 */
export interface RefreshTokenPayload {
  userId: string          // User's unique identifier
  tokenId: string        // Unique token identifier for tracking/revocation
  iat?: number          // Token issued at timestamp (added by JWT library)
  exp?: number          // Token expiration timestamp (added by JWT library)
}

/**
 * JWT utility functions for token management
 */
export const jwtUtils = {
  /**
   * Generate a short-lived access token for authenticated requests
   * @param payload - User information to include in token
   * @returns Signed JWT access token string
   */
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '15m',                    // 15 minutes for security
      issuer: 'huntier-job-app',          // Token issuer for validation
      audience: 'huntier-users'           // Token audience for validation
    })
  },

  /**
   * Generate a long-lived refresh token for session management
   * @param userId - User ID to generate refresh token for
   * @returns Object containing the token string and unique token ID
   */
  generateRefreshToken(userId: string): { token: string; tokenId: string } {
    // Generate unique token ID for tracking and potential revocation
    const tokenId = randomBytes(32).toString('hex')
    
    const token = jwt.sign(
      { userId, tokenId }, 
      JWT_REFRESH_SECRET, 
      {
        expiresIn: '7d',                    // 7 days for convenience
        issuer: 'huntier-job-app',          // Token issuer for validation
        audience: 'huntier-users'           // Token audience for validation
      }
    )
    return { token, tokenId }
  },

  /**
   * Verify and decode an access token
   * @param token - JWT access token to verify
   * @returns Decoded token payload or null if invalid
   */
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'huntier-job-app',          // Verify token issuer
        audience: 'huntier-users'           // Verify token audience
      }) as JWTPayload
      return decoded
    } catch (error) {
      console.error('Error verifying access token:', error)
      return null
    }
  },

  /**
   * Verify and decode a refresh token
   * @param token - JWT refresh token to verify
   * @returns Decoded token payload or null if invalid
   */
  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'huntier-job-app',          // Verify token issuer
        audience: 'huntier-users'           // Verify token audience
      }) as RefreshTokenPayload
      return decoded
    } catch (error) {
      console.error('Error verifying refresh token:', error)
      return null
    }
  },

  /**
   * Generate a secure 6-digit OTP code
   * Uses Math.random() for simplicity - in production, consider crypto.randomInt()
   * @returns 6-digit numeric string
   */
  generateOTP(): string {
    // Generate random 6-digit number (100000-999999)
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}