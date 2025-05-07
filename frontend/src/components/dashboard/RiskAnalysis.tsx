import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Card from '../common/Card';
import Loading from '../common/Loading';

interface RiskAnalysisProps {
  className?: string;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ className = '' }) => {
  const { portfolio, riskAnalysis, loading, error } = useSelector((state: RootState) => state.portfolio);
  
  if (loading) {
    return <Loading text="Analyzing portfolio risks..." />;
  }
  
  if (error) {
    return (
      <Card 
        title="Risk Analysis" 
        className={`risk-analysis error ${className}`}
      >
        <div className="error-message">
          <p>Error analyzing portfolio risks: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!portfolio || portfolio.stocks.length === 0) {
    return (
      <Card 
        title="Risk Analysis" 
        className={`risk-analysis empty ${className}`}
      >
        <div className="empty-state">
          <p>Add stocks to your portfolio to see risk analysis.</p>
        </div>
      </Card>
    );
  }
  
  if (!riskAnalysis) {
    return (
      <Card 
        title="Risk Analysis" 
        className={`risk-analysis loading ${className}`}
      >
        <Loading text="Generating risk insights..." />
      </Card>
    );
  }
  
  const { overallRiskScore, technicalRiskScore, sentimentRiskScore, marketRiskScore } = riskAnalysis;
  
  const { riskFactors, recommendations } = riskAnalysis;
  
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };
  
  return (
    <Card 
      title="Risk Analysis" 
      className={`risk-analysis ${className}`}
    >
      <div className="risk-scores">
        <div className={`risk-score overall ${getRiskColor(overallRiskScore)}`}>
          <span className="score-label">Overall Risk</span>
          <span className="score-value">{overallRiskScore}</span>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${overallRiskScore}%` }}></div>
          </div>
        </div>
        
        <div className="risk-dimensions">
          <div className={`risk-score ${getRiskColor(technicalRiskScore)}`}>
            <span className="score-label">Technical</span>
            <span className="score-value">{technicalRiskScore}</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${technicalRiskScore}%` }}></div>
            </div>
          </div>
          
          <div className={`risk-score ${getRiskColor(sentimentRiskScore)}`}>
            <span className="score-label">Sentiment</span>
            <span className="score-value">{sentimentRiskScore}</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${sentimentRiskScore}%` }}></div>
            </div>
          </div>
          
          <div className={`risk-score ${getRiskColor(marketRiskScore)}`}>
            <span className="score-label">Market</span>
            <span className="score-value">{marketRiskScore}</span>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${marketRiskScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="risk-insights">
        <div className="risk-factors">
          <h4>Risk Factors</h4>
          <ul>
            {riskFactors.map((factor, index) => (
              <li key={index} className={getRiskColor(factor.severity)}>
                <span className="factor-name">{factor.name}</span>
                <span className="factor-description">{factor.description}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="risk-recommendations">
          <h4>Recommendations</h4>
          <ul>
            {recommendations.map((recommendation, index) => (
              <li key={index}>
                <span className="recommendation-text">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RiskAnalysis;
