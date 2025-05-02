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
    meter_bypass: 'Suspiciously low consumption detected - possible meter bypass',
    meter_tampering: 'Suspiciously low consumption detected - possible meter tampering',
    direct_connection: 'Unusually low consumption pattern detected - possible direct connection',
    unauthorized_connection: 'Zero or minimal consumption detected - possible unauthorized connection'
  };
  
  // Get random districts
  const randomDistricts = [...districts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, districts.length));
  
  for (const district of randomDistricts) {
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    // Generate values based on severity (consumption in kWh)
    let value, threshold;
    
    // Set normal expected thresholds based on severity
    if (severity === 'high') {
      threshold = 500;  // Minimum expected for high usage customer
      value = Math.round(Math.random() * 50);  // 0-50 kWh (extremely suspicious)
    } else if (severity === 'medium') {
      threshold = 300;  // Minimum expected for medium usage customer
      value = Math.round(50 + Math.random() * 50);  // 50-100 kWh (very suspicious)
    } else {
      threshold = 200;   // Minimum expected for low usage customer
      value = Math.round(100 + Math.random() * 50);  // 100-150 kWh (suspicious)
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
