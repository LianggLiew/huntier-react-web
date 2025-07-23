import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface SmsResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send SMS using AWS SNS
 */
export async function sendSms(
  phoneNumber: string,
  message: string
): Promise<SmsResult> {
  try {
    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', // Use Transactional for OTP messages
        },
      },
    })

    const response = await snsClient.send(command)

    return {
      success: true,
      messageId: response.MessageId,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Format OTP SMS message
 */
export function formatOtpSmsMessage(otpCode: string, expirationMinutes: number = 10): string {
  return `Your Huntier verification code is: ${otpCode}. This code will expire in ${expirationMinutes} minutes. Do not share this code with anyone.`
}