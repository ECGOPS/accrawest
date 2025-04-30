import { districts } from './mockData';

// Types for real-time anomaly data
export interface AnomalyData {
  id: string;
  districtId: number;
  anomalyType: 'meter_bypass' | 'meter_tampering' | 'direct_connection' | 'unauthorized_connection';
  description: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  meterNumber?: string;  // Optional meter number property
  customerName?: string;
}

// Mock customer data
const mockCustomers = [
  { meterNumber: 'P19100001', name: 'John Doe' },
  { meterNumber: 'P19100002', name: 'Jane Smith' },
  { meterNumber: 'P19100003', name: 'Robert Johnson' },
  { meterNumber: 'P19100004', name: 'Sarah Williams' },
  { meterNumber: 'P19100005', name: 'Michael Brown' },
  { meterNumber: 'P19100006', name: 'Emily Davis' },
  { meterNumber: 'P19100007', name: 'David Wilson' },
  { meterNumber: 'P19100008', name: 'Lisa Anderson' }
];

// Function to generate random anomalies for demo purposes
export const generateRandomAnomalies = (count: number = 1): AnomalyData[] => {
  const anomalies: AnomalyData[] = [];
  const anomalyTypes: AnomalyData['anomalyType'][] = [
    'meter_bypass',
    'meter_tampering',
    'direct_connection',
    'unauthorized_connection'
  ];
  
  const severities: AnomalyData['severity'][] = ['low', 'medium', 'high'];
  
  const descriptions = {
    meter_bypass: 'Potential meter bypass detected',
    meter_tampering: 'Meter tampering activity detected',
    direct_connection: 'Illegal direct connection detected',
    unauthorized_connection: 'Unauthorized service connection detected'
  };
  
  // Get random districts
  const randomDistricts = [...districts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, districts.length));
  
  for (const district of randomDistricts) {
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    // Generate values based on severity
    let value, threshold;
    if (severity === 'high') {
      threshold = 75;
      value = Math.round(threshold + 10 + Math.random() * 15);
    } else if (severity === 'medium') {
      threshold = 50;
      value = Math.round(threshold + 5 + Math.random() * 20);
    } else {
      threshold = 25;
      value = Math.round(threshold + Math.random() * 15);
    }

    // Get a random customer for meter-related anomalies
    const customer = type !== 'unauthorized_connection' 
      ? mockCustomers[Math.floor(Math.random() * mockCustomers.length)]
      : undefined;
    
    anomalies.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      districtId: district.id,
      timestamp: new Date().toISOString(),
      anomalyType: type,
      severity,
      value,
      threshold,
      description: descriptions[type],
      meterNumber: customer?.meterNumber,
      customerName: customer?.name
    });
  }
  
  return anomalies;
};

// Initial set of anomalies
export const getInitialAnomalies = (): AnomalyData[] => {
  return generateRandomAnomalies(3);
};

// Get all current anomalies (in a real app, this would fetch from an API)
export const getCurrentAnomalies = (): AnomalyData[] => {
  return [...getInitialAnomalies()];
};

// Function to simulate real-time data fetching
export const fetchRealTimeAnomalies = async (): Promise<AnomalyData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAnomalies = generateRandomAnomalies(Math.floor(Math.random() * 3) + 1);
      resolve(newAnomalies);
    }, 1000);
  });
};
