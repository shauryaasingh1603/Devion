import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    riskThreshold: 70,
    dailySummary: true,
    weeklyReport: true
  });

  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleRiskThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings(prev => ({
      ...prev,
      riskThreshold: parseInt(e.target.value)
    }));
  };

  return (
    <div className="settings-page">
      <header className="container">
        <h1>Settings</h1>
        <p>Manage your notification preferences</p>
      </header>
      
      <main className="container">
        <div className="settings-grid">
          <div className="card notification-settings">
            <h2>Notification Settings</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Alerts</h3>
                <p>Receive risk alerts via email</p>
              </div>
              <div className="setting-control">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.emailAlerts}
                    onChange={() => handleToggleChange('emailAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Receive risk alerts as push notifications</p>
              </div>
              <div className="setting-control">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.pushNotifications}
                    onChange={() => handleToggleChange('pushNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>SMS Alerts</h3>
                <p>Receive risk alerts via SMS</p>
              </div>
              <div className="setting-control">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.smsAlerts}
                    onChange={() => handleToggleChange('smsAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Risk Threshold</h3>
                <p>Minimum risk score to trigger alerts</p>
              </div>
              <div className="setting-control">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={notificationSettings.riskThreshold}
                  onChange={handleRiskThresholdChange}
                />
                <span>{notificationSettings.riskThreshold}</span>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Daily Summary</h3>
                <p>Receive daily portfolio risk summary</p>
              </div>
              <div className="setting-control">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.dailySummary}
                    onChange={() => handleToggleChange('dailySummary')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Weekly Report</h3>
                <p>Receive weekly detailed risk analysis</p>
              </div>
              <div className="setting-control">
                <label className="toggle">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.weeklyReport}
                    onChange={() => handleToggleChange('weeklyReport')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="card account-settings">
            <h2>Account Settings</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Address</h3>
                <p>Update your email address</p>
              </div>
              <div className="setting-control">
                <input type="email" placeholder="your.email@example.com" />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Password</h3>
                <p>Update your password</p>
              </div>
              <div className="setting-control">
                <button className="secondary">Change Password</button>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Phone Number</h3>
                <p>Update your phone number for SMS alerts</p>
              </div>
              <div className="setting-control">
                <input type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button className="primary">Save Changes</button>
          <button className="secondary">Cancel</button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
