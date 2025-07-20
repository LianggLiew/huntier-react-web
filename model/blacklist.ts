"use server"
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'huntier',
    password: 'Intrend1675!',
    port: 5432,
});

export async function inBlackList(loginType: string, loginVal: string): Promise<boolean> {
    try {
        const client = await pool.connect();
        const checkBlacklistQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM otp_blacklist
                WHERE contact_type = $1
                  AND contact_value = $2
                  AND (expires_at IS NULL OR expires_at > NOW())
            ) AS is_blacklisted;
        `;

        const result = await pool.query(checkBlacklistQuery, [loginType, loginVal]);

        client.release();
        return result.rows[0]?.is_blacklisted || false;

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

export async function addToBlacklist(loginType: string, loginVal: string, reason: 'max_attempts' | 'max_resends' | 'manual'
): Promise<boolean> {
    try {
        // Determine the expiration time based on the reason
        let expiration: string | null = null;

        switch (reason) {
            case 'max_attempts':
                expiration = 'NOW() + INTERVAL \'1 minute\'';
                break;
            case 'max_resends':
                expiration = 'NOW() + INTERVAL \'5 minutes\'';
                break;
            case 'manual':
                expiration = 'NULL'; // Forever
                break;
        }

        const insertQuery = `
            INSERT INTO otp_blacklist (contact_value, contact_type, reason, expires_at)
            VALUES ($1, $2, $3, ${expiration})
            ON CONFLICT (contact_value, contact_type) 
            DO UPDATE SET 
                reason = EXCLUDED.reason,
                expires_at = EXCLUDED.expires_at,
                blacklisted_at = NOW();
        `;

        // Add user to the blacklist
        await pool.query(insertQuery, [loginVal, loginType, reason]);
        console.log('User with login method: %s and loginVal %s is added to blacklist due to %s', loginType, loginVal, reason);

        // Check if user in blacklist
        return await inBlackList(loginType, loginVal);

    } catch (err) {
        console.error('Error adding to blacklist:', err);
        throw err;
    }
}


export async function removeFromBlacklist(loginType: string, loginVal: string): Promise<boolean> {
    try {
        const deleteQuery = `
            DELETE FROM otp_blacklist
            WHERE contact_type = $1
              AND contact_value = $2;
        `;

        const result = await pool.query(deleteQuery, [loginType, loginVal]);
        console.log('User with contact_type: %s and contact_value: %s removed from blacklist', loginType, loginVal);

        return !(await inBlackList(loginType, loginVal));

    } catch (err) {
        console.error('Error removing from blacklist:', err);
        throw err;
    }
}

inBlackList('email', 'user4@example.com')
.then(result => {console.log(result)})