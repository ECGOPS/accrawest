
import { districts } from './mockData';

// Types for real-time anomaly data
export interface AnomalyData {
  districtId: number;
  timestamp: Date;
  anomalyType: 'meter_bypass' | 'meter_tampering' | 'direct_connection' | 'unauthorized_connection';
  severity: 'low' | 'medium' | 'high';
  value: number;
  threshold: number;
  description: string;
}

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
    
    anomalies.push({
      districtId: district.id,
      timestamp: new Date(),
      anomalyType: type,
      severity,
      value,
      threshold,
      description: descriptions[type],
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
