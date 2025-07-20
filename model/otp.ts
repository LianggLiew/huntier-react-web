"use server"
import { Pool } from 'pg';
import crypto from 'crypto';

import {inBlackList} from "@/model/blacklist";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'huntier',
    password: 'Intrend1675!',
    port: 5432,
});

function generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
}


export async function matchOTP(loginType: string, loginVal: string, OTPValue: string): Promise<any> {
    try {
        const query = `
            SELECT 1
            FROM otp_verifications
            WHERE contact_type = $1
              AND contact_value = $2
              AND otp_code = $3
              AND expires_at > CURRENT_TIMESTAMP
              AND is_used = false
            LIMIT 1;
        `;

        const result = await pool.query(query, [loginType, loginVal, OTPValue]);
        return (result.rowCount ?? 0) > 0;

    } catch (err) {
        console.error('Error matching OTP:', err);
        throw err;
    }
}


export async function sendOTP(loginType: 'email' | 'phone', loginVal: string): Promise<{ success: boolean; message: string }> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

        // Check if user exists in blacklist
        if (await inBlackList(loginType, loginVal)) {
            return { success: false, message: 'User is blacklisted' };
        }

        // Update existing record or insert new one
        const result = await client.query(
            `INSERT INTO otp_verifications (
                contact_type, contact_value, otp_code, 
                expires_at, is_used, attempt_count, 
                resend_count, last_resend_at
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (contact_value, contact_type) 
             DO UPDATE SET 
                otp_code = EXCLUDED.otp_code,
                expires_at = EXCLUDED.expires_at,
                is_used = EXCLUDED.is_used,
                attempt_count = 0,
                resend_count = 0,
                last_resend_at = EXCLUDED.last_resend_at
             RETURNING *`,
            [
                loginType,
                loginVal,
                otp,
                expiresAt,
                false,
                0,
                1,
                new Date()
            ]
        );

        await client.query('COMMIT');

        // In production, implement actual OTP sending here
        console.log(`OTP ${otp} sent to ${loginType}: ${loginVal}`);
        return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in send_otp:', error);
        return { success: false, message: 'Failed to send OTP' };
    } finally {
        client.release();
    }
}
