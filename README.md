# ECG Accra West Fraud Detection Dashboard

A modern, real-time dashboard for monitoring and detecting fraudulent activities across eight districts in ECG's Accra West operational area. This dashboard provides comprehensive insights into various types of electricity fraud, risk assessments, and anomaly detection.

## Features

### 1. Real-Time Monitoring
- Live anomaly feed with severity-based highlighting
- Automatic updates every 15 seconds
- Visual indicators for different types of anomalies:
  - Meter Bypass (🔸)
  - Meter Tampering (🔧)
  - Direct Connection (⚠️)
  - Unauthorized Service Connection (⚡)
- Severity-based notifications with color-coded alerts (High: Red, Medium: Orange, Low: Yellow)

### 2. Fraud Type Analysis
- Detailed breakdown of four major fraud types:
  - Meter Bypass
  - Meter Tampering
  - Direct Connection
  - Unauthorized Service Connection
- Key metrics for each fraud type:
  - Consumption Ratio
  - Payment Rate
  - Energy Charge Ratio
  - Detection Signals

### 3. Geographic Risk Assessment
- District-wise risk visualization
- Color-coded risk levels
- Fraud amount distribution
- Interactive district filtering

### 4. District Performance Metrics
- Risk Score Rankings
- Fraud Amount Rankings
- Percentage contribution to total fraud
- Outstanding balance tracking
- Recovery rate monitoring

### 5. Key Performance Indicators
- Total Fraud Amount
- Outstanding Balance
- Average Risk Score
- Total Cases
- Recovery Rate

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Tailwind CSS with custom components
- **State Management**: React Hooks
- **Data Visualization**: Custom components with real-time updates
- **Notifications**: Toast notifications for real-time alerts

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd accra-west-fraud-alert
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── FraudMap.tsx    # Geographic visualization
│   ├── FraudTypeCard.tsx    # Fraud type analysis cards
│   ├── MetricsOverview.tsx  # KPI components
│   ├── RealTimeMonitoring.tsx    # Real-time anomaly feed
│   ├── RiskScoreTable.tsx   # District rankings
│   └── ui/             # Reusable UI components
├── utils/
│   ├── mockData.ts     # Sample data structure
│   └── realTimeData.ts # Real-time data simulation
└── hooks/              # Custom React hooks
```

## Customization

### District Configuration
Add or modify districts in `src/utils/mockData.ts`:
```typescript
export const districts = [
  {
    id: number,
    name: string,
    riskScore: number,
    fraudAmount: number,
    // ...other properties
  }
];
```

### Fraud Types
Modify fraud types and their properties in `src/utils/mockData.ts`:
```typescript
export const fraudTypes = [
  {
    id: number,
    name: string,
    percentage: number,
    // ...other properties
  }
];
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ECG Accra West Region for project requirements and domain expertise
- Icons provided by Lucide Icons
- UI components inspired by shadcn/ui

## Develop by

Kofi Sarkodie
Cyril Ameko
Kenneth Kofi Davordzie
