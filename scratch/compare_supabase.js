import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const stagingEnv = fs.readFileSync('.env.staging', 'utf8');
const prodEnv = fs.readFileSync('.env.production', 'utf8');

const getEnvValue = (env, key) => {
    const match = env.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
};

const stagingUrl = getEnvValue(stagingEnv, 'VITE_SUPABASE_URL');
const stagingKey = getEnvValue(stagingEnv, 'VITE_SUPABASE_ANON_KEY');
const prodUrl = getEnvValue(prodEnv, 'VITE_SUPABASE_URL');
const prodKey = getEnvValue(prodEnv, 'VITE_SUPABASE_ANON_KEY');

const staging = createClient(stagingUrl, stagingKey);
const prod = createClient(prodUrl, prodKey);

const tablesToProbe = [
    'clients', 'partners', 'profiles', 'marketplace_connections', 
    'ai_configs', 'ai_usage_logs', 'marketplace_data', 
    'products', 'orders', 'waitlist', 'tickets', 
    'payouts', 'commissions'
];

async function getTableColumns(client, tableName) {
    // We try to get columns via a query that returns no rows but gives us the header
    const { data, error } = await client.from(tableName).select('*').limit(0);
    if (error) return null;
    // Note: PostgREST might not return headers if no data. 
    // Let's try to just select one and see.
    const { data: oneRow } = await client.from(tableName).select('*').limit(1);
    if (oneRow && oneRow.length > 0) return Object.keys(oneRow[0]);
    
    // Fallback: try to see if we can get anything from a select
    // Since we can't easily get schema via anon key without RPC, 
    // we'll rely on the app's ability to see data.
    return [];
}

async function compare() {
    console.log('🚀 Supabase Deep Analysis (Staging vs Production)...\n');
    
    for (const table of tablesToProbe) {
        process.stdout.write(`Analyzing ${table}... `);
        
        const { data: sData, error: sErr } = await staging.from(table).select('*').limit(1);
        const { data: pData, error: pErr } = await prod.from(table).select('*').limit(1);

        const sExists = !sErr || sErr.code !== '42P01';
        const pExists = !pErr || pErr.code !== '42P01';

        if (!sExists) {
            console.log('❌ Not in Staging');
            continue;
        }
        if (!pExists) {
            console.log('❌ MISSING IN PRODUCTION');
            continue;
        }

        const sCols = sData && sData[0] ? Object.keys(sData[0]) : [];
        const pCols = pData && pData[0] ? Object.keys(pData[0]) : [];

        if (sCols.length === 0 && pCols.length === 0) {
            console.log('❓ Both empty (cannot compare columns)');
            continue;
        }

        const missingInProd = sCols.filter(c => !pCols.includes(c));
        const missingInStaging = pCols.filter(c => !sCols.includes(c));

        if (missingInProd.length > 0 || missingInStaging.length > 0) {
            console.log('⚠️ MISMATCH');
            if (missingInProd.length > 0) console.log(`   - Missing in Prod: ${missingInProd.join(', ')}`);
            if (missingInStaging.length > 0) console.log(`   - Missing in Staging: ${missingInStaging.join(', ')}`);
        } else {
            console.log('✅ OK');
        }
    }
}

compare().catch(console.error);
