# 🛠️ Scripts

This folder contains database schemas, deployment scripts, and other automation tools.

## 📋 Available Scripts

### **Database**
- [`supabase-schema.sql`](./supabase-schema.sql) - Complete database schema for Supabase PostgreSQL

## 🗃️ Database Setup

### **Initial Setup**
1. Create a new Supabase project
2. Go to SQL Editor in Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql`

### **Schema Contents**
```sql
-- User management
CREATE TABLE users (...)

-- OTP verification  
CREATE TABLE otp_codes (...)

-- Session management
CREATE TABLE refresh_tokens (...)

-- Security policies (RLS)
-- Indexes for performance
-- Cleanup functions
```

## 🚀 Running Database Scripts

### **Supabase Setup**
```bash
# 1. Copy schema to Supabase SQL Editor
cat scripts/supabase-schema.sql

# 2. Run in Supabase dashboard
# OR use Supabase CLI (if installed)
supabase db reset
```

### **Local Development**
```bash
# If using local Supabase instance
npx supabase start
npx supabase db reset
```

## 📊 Schema Documentation

### **Tables Created**
1. **`users`** - User profiles and authentication data
2. **`otp_codes`** - Temporary verification codes
3. **`refresh_tokens`** - Session management tokens

### **Security Features**
- Row Level Security (RLS) policies
- Service role permissions
- Data validation constraints
- Automatic cleanup triggers

### **Performance Optimizations**
- Indexes on frequently queried columns
- Efficient foreign key relationships
- Cleanup functions for expired data

## 🔧 Adding New Scripts

When adding database changes or automation:

```bash
# Create migration scripts
scripts/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_user_preferences.sql
│   └── 003_job_matching_tables.sql
│
├── deployment/
│   ├── deploy.sh
│   └── rollback.sh
│
└── maintenance/
    ├── cleanup_expired_data.sql
    └── backup.sh
```

## ⚠️ Important Notes

- **Backup first**: Always backup before running schema changes
- **Test locally**: Test migrations on development database first
- **Version control**: Keep all schema changes in git
- **Documentation**: Update this README when adding new scripts