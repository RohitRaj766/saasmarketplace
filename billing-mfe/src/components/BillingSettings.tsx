import { useState } from 'react';
import './BillingSettings.css';

interface BillingSettingsProps {
  user: any;
}

export function BillingSettings({ user }: BillingSettingsProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="billing-settings">
      <div className="settings-card">
        <h2>Billing Settings</h2>

        <div className="settings-section">
          <h3>Payment Method</h3>
          <div className="form-group">
            <label>
              <input
                type="radio"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
            <label>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Auto-Pay</h3>
          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={autoPayEnabled}
                onChange={(e) => setAutoPayEnabled(e.target.checked)}
              />
              Enable automatic payments for invoices
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Billing Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Name</label>
              <p>{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave} className="btn-save">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
