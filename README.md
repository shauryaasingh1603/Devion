# Kuber

An AI-powered capital protection platform for NSE investors that functions as a "risk radar" continuously scanning technical, sentiment, institutional, and macro-political dimensions for threats to a user's portfolio.

## Overview

Kuber is powered by Claude via an MCP (Multi-Channel Processor) Server and autonomously fetches live, real-time data from multiple APIs:
- Brave (news and search)
- Kite Connect (stock data)
- Yahoo Finance (fallback and global cues)

## Core Mission

Preservation over prediction – empowering retail investors with institutional-grade tools that alert them before risk events unfold. Kuber is not a trading tool, but a vigilant AI companion that watches the market 24/7 to warn users about developing threats.

## System Architecture

- **MCP Server**: Centralized brain that orchestrates API connections and delivers structured data to Claude
- **Claude**: Fetches data from the MCP at regular intervals and generates natural language insights and risk scores
- **Firebase**: Used for hosting, authentication, Firestore, Realtime DB, and Functions
- **Frontend**: React-based UI with dashboard, watchlist, stock detail, and settings pages

## Development

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```
