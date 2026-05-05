-- TABLE: transactions
-- Digunakan untuk mencatat riwayat pembayaran via Midtrans
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT UNIQUE NOT NULL, -- ID unik: misal TOKCER-1714900000
    plan_name TEXT NOT NULL,       -- pro, elite, ultimate
    amount DECIMAL NOT NULL,       -- Harga yang harus dibayar
    tokens_to_add INTEGER,         -- Berapa token yang akan didapat
    status TEXT DEFAULT 'pending', -- pending, settlement, expire, cancel, deny
    payment_type TEXT,             -- gopay, qris, bank_transfer, etc
    snap_token TEXT,               -- Token dari Midtrans untuk modal pop-up
    raw_notification JSONB,        -- Payload asli dari Midtrans (untuk audit)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat transaksi mereka sendiri
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fungsi otomasi updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
