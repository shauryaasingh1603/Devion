/**
 * Claude Service for the MCP Server
 * Handles communication with Claude API for generating insights
 */

const { claudeClient, generateInsights } = require('../config/claude');
const { prepareDataForClaude } = require('../utils/dataTransformer');
const { logger, ApiError } = require('../utils/errorHandler');

/**
 * Generate risk analysis for a stock
 * @param {Object} stockData - Normalized stock data
 * @param {Array} newsData - Normalized news data
 * @param {Object} technicalIndicators - Technical indicators
 * @param {Object} institutionalActivity - Institutional activity data
 * @returns {Promise<Object>} - Risk analysis from Claude
 */
const generateRiskAnalysis = async (stockData, newsData, technicalIndicators, institutionalActivity) => {
  try {
    const structuredData = prepareDataForClaude(
      stockData,
      newsData,
      technicalIndicators,
      institutionalActivity
    );
    
    const systemPrompt = `
      You are Kuber, an AI-powered capital protection platform for NSE investors.
      Your core mission is preservation over prediction – empowering retail investors with institutional-grade tools that alert them before risk events unfold.
      
      Analyze the provided stock data, news, technical indicators, and institutional activity to identify potential risks to the investor's capital.
      Focus on identifying threats rather than making price predictions.
      
      Your analysis should include:
      1. Overall risk score (0-100, where higher means more risk)
      2. Key risk factors identified
      3. Technical analysis insights
      4. News sentiment analysis
      5. Institutional activity interpretation
      6. Actionable recommendations for risk mitigation
      
      Format your response as a JSON object with the following structure:
      {
        "riskScore": number,
        "riskLevel": "Low"|"Moderate"|"High"|"Extreme",
        "summary": "Brief summary of overall risk assessment",
        "riskFactors": [
          {
            "factor": "Name of risk factor",
            "severity": "Low"|"Medium"|"High",
            "description": "Description of the risk factor"
          }
        ],
        "technicalAnalysis": {
          "trend": "Bullish"|"Bearish"|"Neutral",
          "keyLevels": {
            "support": [numbers],
            "resistance": [numbers]
          },
          "indicators": {
            "rsi": {
              "value": number,
              "interpretation": "string"
            },
            "macd": {
              "value": number,
              "interpretation": "string"
            }
          }
        },
        "newsSentiment": {
          "score": number,
          "interpretation": "string",
          "keyTopics": [strings]
        },
        "institutionalActivity": {
          "netFlow": number,
          "interpretation": "string"
        },
        "recommendations": [
          {
            "action": "string",
            "rationale": "string"
          }
        ]
      }
    `;
    
    const claudeResponse = await generateInsights(structuredData, systemPrompt);
    
    if (claudeResponse && claudeResponse.content && claudeResponse.content.length > 0) {
      try {
        const contentText = claudeResponse.content[0].text;
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in Claude response');
        }
      } catch (parseError) {
        logger.error(`Error parsing Claude response: ${parseError.message}`);
        throw new ApiError('Failed to parse Claude response', 500, 'claude');
      }
    } else {
      throw new ApiError('Empty or invalid response from Claude', 500, 'claude');
    }
  } catch (error) {
    logger.error(`Error generating risk analysis: ${error.message}`, {
      stack: error.stack,
      stockSymbol: stockData.symbol
    });
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(`Failed to generate risk analysis: ${error.message}`, 500, 'claude');
  }
};

/**
 * Generate portfolio risk summary
 * @param {Array} portfolioData - Array of stock data for portfolio
 * @param {Object} marketData - Overall market data
 * @returns {Promise<Object>} - Portfolio risk summary from Claude
 */
const generatePortfolioRiskSummary = async (portfolioData, marketData) => {
  try {
    const systemPrompt = `
      You are Kuber, an AI-powered capital protection platform for NSE investors.
      Your core mission is preservation over prediction – empowering retail investors with institutional-grade tools that alert them before risk events unfold.
      
      Analyze the provided portfolio data and market conditions to identify potential risks to the investor's overall portfolio.
      Focus on identifying threats rather than making price predictions.
      
      Your analysis should include:
      1. Overall portfolio risk score (0-100, where higher means more risk)
      2. Key risk factors for the portfolio
      3. Sector-specific risks
      4. Correlation analysis
      5. Diversification assessment
      6. Actionable recommendations for portfolio risk mitigation
      
      Format your response as a JSON object with appropriate structure.
    `;
    
    const structuredData = {
      timestamp: new Date().toISOString(),
      portfolioData,
      marketData,
      metadata: {
        dataVersion: '1.0'
      }
    };
    
    const claudeResponse = await generateInsights(structuredData, systemPrompt);
    
    if (claudeResponse && claudeResponse.content && claudeResponse.content.length > 0) {
      try {
        const contentText = claudeResponse.content[0].text;
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in Claude response');
        }
      } catch (parseError) {
        logger.error(`Error parsing Claude portfolio response: ${parseError.message}`);
        throw new ApiError('Failed to parse Claude portfolio response', 500, 'claude');
      }
    } else {
      throw new ApiError('Empty or invalid response from Claude for portfolio analysis', 500, 'claude');
    }
  } catch (error) {
    logger.error(`Error generating portfolio risk summary: ${error.message}`, {
      stack: error.stack
    });
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(`Failed to generate portfolio risk summary: ${error.message}`, 500, 'claude');
  }
};

module.exports = {
  generateRiskAnalysis,
  generatePortfolioRiskSummary
};
