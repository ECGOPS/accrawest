
// Mock data for the ECG Fraud Detection Dashboard

export interface FraudType {
  id: number;
  name: string;
  percentage: number;
  amount: number;
  consumptionRatio: number;
  paymentRate: number;
  energyChargeRatio: number;
  detectionSignals: string[];
}

export interface District {
  id: number;
  name: string;
  fraudPercentage: number;
  fraudAmount: number;
  riskScore: number;
  outstandingBalance: number;
  paymentRatio: number;
  consumptionCostRatio: number;
}

// Fraud Types
export const fraudTypes: FraudType[] = [
  {
    id: 1,
    name: "Meter Bypass",
    percentage: 72.60,
    amount: 38723141.58, // 72.60% of total GHS 53,338,211.54
    consumptionRatio: 0.6199,
    paymentRate: 52.70,
    energyChargeRatio: 0.8049,
    detectionSignals: [
      "Sudden drops in power consumption",
      "Consistent consumption regardless of season",
      "Higher than average meter failures",
      "Mismatch between expected and actual consumption"
    ]
  },
  {
    id: 2,
    name: "Meter Tampering",
    percentage: 26.39,
    amount: 14075954.23, // 26.39% of total
    consumptionRatio: 0.6441,
    paymentRate: 48.44,
    energyChargeRatio: 0.7185,
    detectionSignals: [
      "Unusual variability in consumption readings",
      "Broken meter seals or physical damage",
      "History of meter replacements",
      "Significant decrease without change in usage patterns"
    ]
  },
  {
    id: 3,
    name: "Direct Connection",
    percentage: 0.90,
    amount: 480043.90, // 0.90% of total
    consumptionRatio: 0.6754,
    paymentRate: 38.24,
    energyChargeRatio: 0.8156,
    detectionSignals: [
      "Zero or minimal recorded consumption",
      "Visual evidence of wiring irregularities",
      "Distribution line losses in specific clusters",
      "Service calls unrelated to registered connections"
    ]
  },
  {
    id: 4,
    name: "Unauthorized Service Connection",
    percentage: 0.12,
    amount: 64005.85, // 0.12% of total
    consumptionRatio: 0.6755,
    paymentRate: 23.06,
    energyChargeRatio: 0.8036,
    detectionSignals: [
      "Connection without proper documentation",
      "Absence from billing system",
      "Irregular payment history",
      "Inconsistent customer details"
    ]
  }
];

// Districts
export const districts: District[] = [
  {
    id: 1,
    name: "NSAWAM",
    fraudPercentage: 46.85,
    fraudAmount: 24988949.38,
    riskScore: 48.17,
    outstandingBalance: 12144892.64, // Approximate based on overall ratio
    paymentRatio: 0.55,
    consumptionCostRatio: 0.63
  },
  {
    id: 2,
    name: "ACHIMOTA",
    fraudPercentage: 18.22,
    fraudAmount: 9719590.80,
    riskScore: 55.56,
    outstandingBalance: 4723670.65,
    paymentRatio: 0.48,
    consumptionCostRatio: 0.67
  },
  {
    id: 3,
    name: "KANESHIE",
    fraudPercentage: 10.42,
    fraudAmount: 5559180.86,
    riskScore: 36.61,
    outstandingBalance: 2701464.72,
    paymentRatio: 0.51,
    consumptionCostRatio: 0.61
  },
  {
    id: 4,
    name: "DANSOMAN",
    fraudPercentage: 10.24,
    fraudAmount: 5459923.19,
    riskScore: 49.66,
    outstandingBalance: 2653523.87,
    paymentRatio: 0.49,
    consumptionCostRatio: 0.64
  },
  {
    id: 5,
    name: "BORTIANOR",
    fraudPercentage: 6.39,
    fraudAmount: 3407177.98,
    riskScore: 46.68,
    outstandingBalance: 1656088.70,
    paymentRatio: 0.52,
    consumptionCostRatio: 0.62
  },
  {
    id: 6,
    name: "ABLEKUMA",
    fraudPercentage: 3.00,
    fraudAmount: 1599824.33,
    riskScore: 56.28,
    outstandingBalance: 777614.83,
    paymentRatio: 0.47,
    consumptionCostRatio: 0.69
  },
  {
    id: 7,
    name: "AMASAMAN",
    fraudPercentage: 2.70,
    fraudAmount: 1440602.46,
    riskScore: 47.27,
    outstandingBalance: 700133.05,
    paymentRatio: 0.51,
    consumptionCostRatio: 0.63
  },
  {
    id: 8,
    name: "KORLE-BU",
    fraudPercentage: 2.18,
    fraudAmount: 1162962.54,
    riskScore: 51.96,
    outstandingBalance: 565119.27,
    paymentRatio: 0.49,
    consumptionCostRatio: 0.66
  }
];

// Dashboard summary metrics
export const dashboardSummary = {
  totalFraudAmount: 53338211.54,
  outstandingBalance: 25915596.73,
  averageRiskScore: 48.77, // Average of all district risk scores
  totalCases: 1248, // Made up for demonstration purposes
  recoveredAmount: 27422614.81, // totalFraudAmount - outstandingBalance
  recoveryRate: 51.41 // (recoveredAmount / totalFraudAmount) * 100
};

// Function to get risk level based on score
export const getRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score < 45) return "low";
  if (score < 50) return "medium";
  return "high";
};

// Function to format currency (GHS)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 2
  }).format(amount);
};
