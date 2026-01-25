# Database Schema - OptiFlow SaaS

## Complete Schema Design

### Core Tables

#### 1. tenants
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  
  -- Subscription
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  subscription_status VARCHAR(50) DEFAULT 'trial',
  trial_ends_at TIMESTAMP,
  subscription_starts_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Billing
  billing_email VARCHAR(255),
  billing_address JSONB,
  
  -- Metadata
  industry VARCHAR(100),
  company_size VARCHAR(50),
  timezone VARCHAR(100) DEFAULT 'UTC',
  currency VARCHAR(3) DEFAULT 'USD'
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_active ON tenants(is_active);
```

#### 2. tenant_features (Module Subscriptions)
```sql
CREATE TABLE tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Feature details
  feature_key VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  
  -- Subscription
  subscribed_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  
  -- Usage limits
  usage_limit INTEGER,
  usage_current INTEGER DEFAULT 0,
  
  -- Pricing
  monthly_price DECIMAL(10, 2),
  
  -- Config
  config JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tenant_id, feature_key)
);

CREATE INDEX idx_tenant_features_tenant ON tenant_features(tenant_id);
CREATE INDEX idx_tenant_features_enabled ON tenant_features(tenant_id, is_enabled);
```

#### 3. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Authentication
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  phone VARCHAR(50),
  
  -- Role & Permissions
  role VARCHAR(50) DEFAULT 'user',
  permissions JSONB DEFAULT '[]',
  department VARCHAR(100),
  job_title VARCHAR(100),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  
  -- Invitation
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP,
  invitation_accepted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(tenant_id, is_active);
```

#### 4. refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  
  -- Device tracking
  device_info JSONB,
  ip_address VARCHAR(45)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

### Business Logic Tables

#### 5. orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Order details
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Customer
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_address JSONB,
  
  -- Financial
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Line items
  items JSONB NOT NULL,
  
  -- Fulfillment
  delivery_date DATE,
  delivery_address JSONB,
  tracking_number VARCHAR(100),
  
  -- Metadata
  notes TEXT,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(tenant_id, created_at DESC);
```

#### 6. invoices
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Invoice details
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  
  -- Customer
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_address JSONB,
  
  -- Financial
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  amount_due DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Line items
  items JSONB NOT NULL,
  
  -- Payment terms
  due_date DATE NOT NULL,
  payment_terms VARCHAR(100),
  
  -- Payment tracking
  paid_at TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  
  -- Metadata
  notes TEXT,
  terms_and_conditions TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_status ON invoices(tenant_id, status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_due_date ON invoices(tenant_id, due_date);
```

### Audit & Analytics Tables

#### 7. audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action details
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_id VARCHAR(100),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(tenant_id, created_at DESC);
```

#### 8. usage_metrics
```sql
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Metric details
  metric_type VARCHAR(100) NOT NULL,
  metric_value DECIMAL(12, 2) NOT NULL,
  
  -- Dimensions
  feature_key VARCHAR(100),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Time
  recorded_at TIMESTAMP DEFAULT NOW(),
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_usage_metrics_tenant ON usage_metrics(tenant_id);
CREATE INDEX idx_usage_metrics_type ON usage_metrics(tenant_id, metric_type);
CREATE INDEX idx_usage_metrics_recorded ON usage_metrics(tenant_id, recorded_at DESC);
```

#### 9. notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Action
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

## Sample Data Structure

### Atlassian Tenant
```json
{
  "id": "atlassian-uuid",
  "name": "Atlassian",
  "slug": "atlassian",
  "subscription_tier": "professional",
  "subscription_status": "active",
  "features": [
    {
      "feature_key": "orders",
      "is_enabled": true,
      "monthly_price": 49.00
    },
    {
      "feature_key": "billing",
      "is_enabled": true,
      "monthly_price": 39.00
    },
    {
      "feature_key": "analytics",
      "is_enabled": true,
      "monthly_price": 29.00
    }
  ],
  "users": 10,
  "theme": {
    "primaryColor": "#0052CC",
    "logo": "/logos/atlassian.png"
  }
}
```

### Zoho Tenant
```json
{
  "id": "zoho-uuid",
  "name": "Zoho Corporation",
  "slug": "zoho",
  "subscription_tier": "starter",
  "subscription_status": "active",
  "features": [
    {
      "feature_key": "orders",
      "is_enabled": true,
      "monthly_price": 49.00
    },
    {
      "feature_key": "admin",
      "is_enabled": true,
      "monthly_price": 19.00
    }
  ],
  "users": 10,
  "theme": {
    "primaryColor": "#E42527",
    "logo": "/logos/zoho.png"
  }
}
```

