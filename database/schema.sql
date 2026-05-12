-- DeSCin Database Schema
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    username   TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    roles      TEXT[] DEFAULT '{}',
    bio        TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address     TEXT UNIQUE NOT NULL,
    balance     BIGINT DEFAULT 0,
    balance_usd DOUBLE PRECISION DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id                   SERIAL PRIMARY KEY,
    name                 TEXT NOT NULL,
    knowledge_area       TEXT DEFAULT '',
    institution          TEXT DEFAULT '',
    resume               TEXT DEFAULT '',
    description          TEXT DEFAULT '',
    status               TEXT DEFAULT 'open',        -- open | funded | closed
    initial_token_price  DOUBLE PRECISION DEFAULT 0,
    total_funding        DOUBLE PRECISION DEFAULT 0,
    target_funding       DOUBLE PRECISION DEFAULT 0,
    founders_percentage  DOUBLE PRECISION DEFAULT 0,
    community_percentage DOUBLE PRECISION DEFAULT 0,
    liquidity_percentage DOUBLE PRECISION DEFAULT 0,
    reserved_percentage  DOUBLE PRECISION DEFAULT 0,
    investors_count      BIGINT DEFAULT 0,
    roi_estimate         DOUBLE PRECISION DEFAULT 0,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investments (
    id              SERIAL PRIMARY KEY,
    wallet_id       INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name    TEXT DEFAULT '',
    amount_invested BIGINT DEFAULT 0,
    current_value   BIGINT DEFAULT 0,
    invested_at     TIMESTAMPTZ DEFAULT NOW(),
    status          TEXT DEFAULT 'active',           -- active | exited | pending
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens (
    id         SERIAL PRIMARY KEY,
    wallet_id  INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    symbol     TEXT NOT NULL,
    amount     BIGINT DEFAULT 0,
    usd_value  BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id             SERIAL PRIMARY KEY,
    tx_hash        TEXT UNIQUE,
    from_address   TEXT,
    to_address     TEXT,
    amount         BIGINT DEFAULT 0,
    status         TEXT DEFAULT 'pending',
    block_sequence BIGINT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id       ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_wallet_id ON investments(wallet_id);
CREATE INDEX IF NOT EXISTS idx_investments_project_id ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_tokens_wallet_id      ON tokens(wallet_id);
CREATE INDEX IF NOT EXISTS idx_projects_status       ON projects(status);
CREATE INDEX IF NOT EXISTS idx_transactions_hash     ON transactions(tx_hash);
