"use server"
import { Pool } from 'pg';
import { addToBlacklist} from "@/model/blacklist";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'huntier',
    password: 'Intrend1675!',
    port: 5432,
});

export async function getData(table_name: string): Promise<any> {
    try {
        // ⚠️ Make sure the table name is a valid identifier (to prevent SQL injection)
        const validTables = ['otp_verifications', 'otp_blacklist']; // whitelist
        if (!validTables.includes(table_name)) {
            throw new Error('Invalid table name');
        }

        const query = `SELECT * FROM ${table_name}`;
        const result = await pool.query(query);
        return result.rows;

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

// Create User


// Attempt Count
export async function getAttemptCnt(loginType: string, loginVal: string): Promise<number> {
    try {
        const checkAttemptCntQuery = `
            SELECT attempt_count
            FROM otp_verifications
            WHERE contact_value = $1
              AND contact_type = $2;
        `;

        const result = await pool.query(checkAttemptCntQuery, [loginVal, loginType]);

        if (result.rows.length > 0) {
            return result.rows[0].attempt_count;
        } else {
            return 0; // or throw an error if the user must exist
        }

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

export async function addAttemptCnt(loginType: string, loginVal: string): Promise<boolean> {
    try {
        // Update the attempt count of the user
        const updateAttemptCntQuery = `
            UPDATE otp_verifications
            SET attempt_count = attempt_count + 1,
                last_attempt_at = CURRENT_TIMESTAMP
            WHERE contact_type= $1
              AND contact_value = $2;
        `;

        await pool.query(updateAttemptCntQuery, [loginType, loginVal]);

        // Add user to the blacklist if attempt count > 5
        if (await getAttemptCnt(loginType, loginVal) > 5){
            await addToBlacklist(loginType, loginVal, 'max_attempts')
        }

        return true;

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

export async function resetAttemptCnt(loginType: string, loginVal: string): Promise<boolean> {
    try {
        // Update the attempt count of the user
        const updateAttemptCntQuery = `
            UPDATE otp_verifications
            SET attempt_count = 0,
            WHERE contact_type= $1
              AND contact_value = $2;
        `;

        await pool.query(updateAttemptCntQuery, [loginType, loginVal]);

        // Check if attempt_count == 0
        return await getAttemptCnt(loginType, loginVal) === 0;
        
    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}


// Resend Count
export async function getResendCnt(loginType: string, loginVal: string): Promise<number> {
    try {
        const checkAttemptCntQuery = `
            SELECT resend_count
            FROM otp_verifications
            WHERE contact_value = $1
              AND contact_type = $2;
        `;

        const result = await pool.query(checkAttemptCntQuery, [loginVal, loginType]);

        if (result.rows.length > 0) {
            return result.rows[0].resend_count;
        } else {
            return 0; // or throw an error if the user must exist
        }

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

export async function addResendCnt(loginType: string, loginVal: string): Promise<boolean> {
    try {
        const updateAttemptCntQuery = `
            UPDATE otp_verifications
            SET resend_count = resend_count + 1,
                last_resend_at = CURRENT_TIMESTAMP
            WHERE contact_type= $1
              AND contact_value = $2;
        `;

        await pool.query(updateAttemptCntQuery, [loginType, loginVal]);

        // Add user to the blacklist if resend count > 5
        if (await getResendCnt(loginType, loginVal) > 5){
            await addToBlacklist(loginType, loginVal, 'max_resends');
        }

        return true;

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

export async function resetResendCnt(loginType: string, loginVal: string): Promise<boolean> {
    try {
        // Update the attempt count of the user
        const updateAttemptCntQuery = `
            UPDATE otp_verifications
            SET resend_count = 0,
            WHERE contact_type= $1
              AND contact_value = $2;
        `;

        await pool.query(updateAttemptCntQuery, [loginType, loginVal]);

        // Check if the resend count is 0
        return await getResendCnt(loginType, loginVal) === 0;

    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}
