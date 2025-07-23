import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send email using Resend
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<EmailResult> {
  try {
    console.log(`📧 Sending email to: ${to}`)
    console.log(`📧 Subject: ${subject}`)
    console.log(`📧 From: Huntier <onboarding@resend.dev>`)
    
    const response = await resend.emails.send({
      from: 'Huntier <onboarding@resend.dev>', // Using your verified domain
      to: [to],
      subject,
      html,
      text,
    })

    console.log('📧 Resend API Response:', JSON.stringify(response, null, 2))

    // Check if response has an error
    if (response.error) {
      console.error('❌ Resend API returned error:', response.error)
      return {
        success: false,
        error: `Resend API Error: ${response.error.error || response.error.message || 'Unknown error'}`,
      }
    }

    // Check if we got a message ID
    const messageId = response.data?.id || response.id
    if (!messageId) {
      console.error('❌ No message ID returned from Resend')
      return {
        success: false,
        error: 'No message ID returned from email service',
      }
    }

    return {
      success: true,
      messageId,
    }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate OTP email HTML template
 */
export function generateOtpEmailHtml(otpCode: string, expirationMinutes: number = 10): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Huntier Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
        }
        .content {
          padding: 30px 0;
          text-align: center;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          display: inline-block;
          margin: 20px 0;
          letter-spacing: 4px;
        }
        .warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          border-top: 2px solid #f0f0f0;
          padding: 20px 0;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Huntier</div>
      </div>
      
      <div class="content">
        <h1>Email Verification</h1>
        <p>Your verification code is:</p>
        
        <div class="otp-code">${otpCode}</div>
        
        <p>This code will expire in <strong>${expirationMinutes} minutes</strong>.</p>
        
        <div class="warning">
          <strong>Security Notice:</strong> Never share this code with anyone. Huntier will never ask for your verification code via phone or email.
        </div>
        
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>This is an automated message from Huntier. Please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} Huntier. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate OTP email text version
 */
export function generateOtpEmailText(otpCode: string, expirationMinutes: number = 10): string {
  return `
Huntier Email Verification

Your verification code is: ${otpCode}

This code will expire in ${expirationMinutes} minutes.

SECURITY NOTICE: Never share this code with anyone. Huntier will never ask for your verification code via phone or email.

If you didn't request this code, please ignore this email.

This is an automated message from Huntier. Please do not reply to this email.

© ${new Date().getFullYear()} Huntier. All rights reserved.
  `.trim()
}

/**
 * Send OTP email
 */
export async function sendOtpEmail(
  email: string,
  otpCode: string,
  expirationMinutes: number = 10
): Promise<EmailResult> {
  const subject = `Your Huntier Verification Code: ${otpCode}`
  const html = generateOtpEmailHtml(otpCode, expirationMinutes)
  const text = generateOtpEmailText(otpCode, expirationMinutes)

  return sendEmail(email, subject, html, text)
}