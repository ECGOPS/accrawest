
import { districts } from './mockData';

// Types for real-time anomaly data
export interface AnomalyData {
  districtId: number;
  timestamp: Date;
  anomalyType: 'consumption_spike' | 'voltage_irregularity' | 'connection_change' | 'payment_anomaly';
  severity: 'low' | 'medium' | 'high';
  value: number;
  threshold: number;
  description: string;
}

// Function to generate random anomalies for demo purposes
export const generateRandomAnomalies = (count: number = 1): AnomalyData[] => {
  const anomalies: AnomalyData[] = [];
  const anomalyTypes: AnomalyData['anomalyType'][] = [
    'consumption_spike',
    'voltage_irregularity',
    'connection_change',
    'payment_anomaly'
  ];
  
  const severities: AnomalyData['severity'][] = ['low', 'medium', 'high'];
  
  const descriptions = {
    consumption_spike: 'Unusual consumption pattern detected',
    voltage_irregularity: 'Voltage fluctuation outside normal range',
    connection_change: 'Unauthorized connection status change',
    payment_anomaly: 'Irregular payment pattern detected'
  };
  
  // Get random districts
  const randomDistricts = [...districts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, districts.length));
  
  for (const district of randomDistricts) {
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const value = Math.round(Math.random() * 100);
    const threshold = Math.round(50 + Math.random() * 20);
    
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
