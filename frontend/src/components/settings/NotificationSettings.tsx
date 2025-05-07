import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'push' | 'sms';
  frequency?: 'immediate' | 'daily' | 'weekly';
  threshold?: number;
}

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  className = ''
}) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'price-alert',
      name: 'Price Alerts',
      description: 'Get notified when stocks in your watchlist reach your target price',
      enabled: true,
      type: 'push',
      threshold: 5
    },
    {
      id: 'risk-alert',
      name: 'Risk Alerts',
      description: 'Get notified when risk level for your portfolio or watchlist stocks increases',
      enabled: true,
      type: 'email',
      threshold: 70
    },
    {
      id: 'news-alert',
      name: 'News Alerts',
      description: 'Get notified about important news for stocks in your portfolio or watchlist',
      enabled: true,
      type: 'push',
      frequency: 'immediate'
    },
    {
      id: 'market-summary',
      name: 'Market Summary',
      description: 'Receive a daily summary of market movements and your portfolio performance',
      enabled: false,
      type: 'email',
      frequency: 'daily'
    },
    {
      id: 'technical-alert',
      name: 'Technical Indicators',
      description: 'Get notified when technical indicators signal potential buy or sell opportunities',
      enabled: false,
      type: 'push'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleToggle = (id: string) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };
  
  const handleTypeChange = (id: string, type: 'email' | 'push' | 'sms') => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, type } : setting
      )
    );
  };
  
  const handleFrequencyChange = (id: string, frequency: 'immediate' | 'daily' | 'weekly') => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, frequency } : setting
      )
    );
  };
  
  const handleThresholdChange = (id: string, threshold: number) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, threshold } : setting
      )
    );
  };
  
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Notification settings saved successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card 
      title="Notification Settings" 
      className={`notification-settings ${className}`}
    >
      {success && (
        <Alert
          type="success"
          message={success}
          dismissible
          autoClose
          onClose={() => setSuccess(null)}
        />
      )}
      
      {error && (
        <Alert
          type="danger"
          message={error}
          dismissible
          onClose={() => setError(null)}
        />
      )}
      
      <div className="settings-list">
        {settings.map(setting => (
          <div key={setting.id} className="setting-item">
            <div className="setting-header">
              <div className="setting-title">
                <h3>{setting.name}</h3>
                <p className="setting-description">{setting.description}</p>
              </div>
              
              <div className="setting-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={() => handleToggle(setting.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            {setting.enabled && (
              <div className="setting-options">
                <div className="option-group">
                  <label>Notification Type</label>
                  <div className="option-buttons">
                    <button
                      className={`option-button ${setting.type === 'email' ? 'active' : ''}`}
                      onClick={() => handleTypeChange(setting.id, 'email')}
                    >
                      Email
                    </button>
                    <button
                      className={`option-button ${setting.type === 'push' ? 'active' : ''}`}
                      onClick={() => handleTypeChange(setting.id, 'push')}
                    >
                      Push
                    </button>
                    <button
                      className={`option-button ${setting.type === 'sms' ? 'active' : ''}`}
                      onClick={() => handleTypeChange(setting.id, 'sms')}
                    >
                      SMS
                    </button>
                  </div>
                </div>
                
                {setting.frequency !== undefined && (
                  <div className="option-group">
                    <label>Frequency</label>
                    <div className="option-buttons">
                      <button
                        className={`option-button ${setting.frequency === 'immediate' ? 'active' : ''}`}
                        onClick={() => handleFrequencyChange(setting.id, 'immediate')}
                      >
                        Immediate
                      </button>
                      <button
                        className={`option-button ${setting.frequency === 'daily' ? 'active' : ''}`}
                        onClick={() => handleFrequencyChange(setting.id, 'daily')}
                      >
                        Daily
                      </button>
                      <button
                        className={`option-button ${setting.frequency === 'weekly' ? 'active' : ''}`}
                        onClick={() => handleFrequencyChange(setting.id, 'weekly')}
                      >
                        Weekly
                      </button>
                    </div>
                  </div>
                )}
                
                {setting.threshold !== undefined && (
                  <div className="option-group">
                    <label>Threshold ({setting.threshold}%)</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={setting.threshold}
                      onChange={(e) => handleThresholdChange(setting.id, parseInt(e.target.value))}
                      className="threshold-slider"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="settings-actions">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={loading}
          disabled={loading}
        >
          Save Settings
        </Button>
      </div>
    </Card>
  );
};

export default NotificationSettings;
