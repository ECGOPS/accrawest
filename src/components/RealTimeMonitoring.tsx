import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Zap, Wrench } from "lucide-react";
import { AnomalyData, fetchRealTimeAnomalies } from "@/utils/realTimeData";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/utils/mockData";
import { Badge } from "./ui/badge";
import React from "react";
import { cn } from "@/lib/utils";

interface RealTimeMonitoringProps {
  selectedDistrict?: string;
  onNewCase?: (anomaly: AnomalyData) => void;
}

const RealTimeMonitoring = ({ selectedDistrict, onNewCase }: RealTimeMonitoringProps) => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const lastToastTime = useRef<number>(0);
  const TOAST_COOLDOWN = 5000; // 5 seconds cooldown between toasts
  const wsRef = useRef<WebSocket | null>(null);

  // Mock meter numbers and customer names for demonstration
  const mockMeters = [
    { number: 'P19100001', name: 'John Doe' },
    { number: 'P19100002', name: 'Jane Smith' },
    { number: 'P19100003', name: 'Robert Johnson' },
    { number: 'P19100004', name: 'Sarah Williams' },
    { number: 'P19100005', name: 'Michael Brown' },
    { number: 'P19100006', name: 'Emily Davis' },
    { number: 'P19100007', name: 'David Wilson' },
    { number: 'P19100008', name: 'Lisa Anderson' }
  ];

  // Mock anomalies for demonstration
  const mockAnomalies: AnomalyData[] = [
    {
      id: '1',
      districtId: 1,
      anomalyType: 'meter_bypass',
      description: 'Meter bypass detected',
      value: 28,
      threshold: 25,
      severity: 'high',
      timestamp: new Date().toISOString(),
      meterNumber: 'P19100001',
      customerName: 'John Doe'
    },
    {
      id: '2',
      districtId: 2,
      anomalyType: 'meter_tampering',
      description: 'Meter tampering detected',
      value: 22,
      threshold: 20,
      severity: 'medium',
      timestamp: new Date().toISOString(),
      meterNumber: 'P19100002',
      customerName: 'Jane Smith'
    },
    {
      id: '3',
      districtId: 3,
      anomalyType: 'direct_connection',
      description: 'Direct connection detected',
      value: 18,
      threshold: 15,
      severity: 'low',
      timestamp: new Date().toISOString(),
      meterNumber: 'P19100003',
      customerName: 'Robert Johnson'
    },
    {
      id: '4',
      districtId: 4,
      anomalyType: 'unauthorized_connection',
      description: 'Unauthorized service connection detected',
      value: 0,
      threshold: 0,
      severity: 'high',
      timestamp: new Date().toISOString()
    }
  ];

  // Function to get district name from ID
  const getDistrictName = (id: number) => {
    const district = districts.find(d => d.id === id);
    return district ? district.name : "Unknown";
  };

  // Map anomaly types to icons
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'meter_bypass':
        return <Wrench className="h-4 w-4 text-red-500" />;
      case 'meter_tampering':
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case 'direct_connection':
        return <Zap className="h-4 w-4 text-red-500" />;
      case 'unauthorized_connection':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Map severity to CSS classes
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 font-medium';
      case 'medium':
        return 'text-orange-500 font-medium';
      case 'low':
        return 'text-yellow-500 font-medium';
      default:
        return 'text-gray-500';
    }
  };

  // Get anomaly type display name
  const getAnomalyTypeDisplay = (type: string) => {
    switch (type) {
      case 'meter_bypass':
        return 'Meter Bypass';
      case 'meter_tampering':
        return 'Meter Tampering';
      case 'direct_connection':
        return 'Direct Connection';
      case 'unauthorized_connection':
        return 'Unauthorized Service Connection';
      default:
        return type;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const newAnomalies = await fetchRealTimeAnomalies();
        
        // Filter anomalies if a district is selected
        const filteredAnomalies = selectedDistrict 
          ? newAnomalies.filter(anomaly => {
              const districtName = getDistrictName(anomaly.districtId);
              return districtName === selectedDistrict;
            })
          : newAnomalies;
        
        if (filteredAnomalies.length > 0) {
          setAnomalies(prev => [...filteredAnomalies, ...prev].slice(0, 5));
          
          // Show toast notification for new anomalies and create cases for high severity
          const now = Date.now();
          if (now - lastToastTime.current >= TOAST_COOLDOWN) {
            filteredAnomalies.forEach(anomaly => {
              const districtName = getDistrictName(anomaly.districtId);
              const meterInfo = anomaly.meterNumber ? ` (Meter: ${anomaly.meterNumber})` : '';
              const caseTitle = `${getAnomalyTypeDisplay(anomaly.anomalyType)} in ${districtName}${meterInfo}`;
              const caseDescription = `High severity anomaly detected: ${anomaly.description}\nConsumption: ${anomaly.value} kWh (Threshold: ${anomaly.threshold} kWh)`;

              toast({
                title: "High Severity Anomaly Detected",
                description: `${caseTitle}\n${caseDescription}`,
                variant: "destructive",
              });

              // Automatically create a case for high severity anomalies
              if (anomaly.severity === 'high' && onNewCase) {
                onNewCase(anomaly);
              }
            });
            lastToastTime.current = now;
          }
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, [toast, selectedDistrict, onNewCase]);

  const handleNewAnomaly = (anomaly: AnomalyData) => {
    setAnomalies(prev => [anomaly, ...prev]);
    
    // Show toast notification with customer name if available
    toast({
      title: `New ${anomaly.severity} severity anomaly detected`,
      description: `${anomaly.anomalyType} in ${anomaly.districtId}${anomaly.meterNumber ? ` - Meter: ${anomaly.meterNumber} (${anomaly.customerName})` : ''}`,
      variant: anomaly.severity === 'high' ? 'destructive' : 'default',
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">Real-Time Monitoring</h3>
            <Badge variant="destructive" className="animate-pulse">
              Live
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">Refreshes every 15s</span>
        </div>
        <div className="space-y-4">
          {anomalies.map((anomaly) => {
            const districtName = districts.find(d => d.id === anomaly.districtId)?.name || 'Unknown';
            const meterInfo = anomaly.meterNumber ? ` (Meter: ${anomaly.meterNumber})` : '';
            
            // Get severity-based styles
            const severityStyles = {
              high: {
                container: 'bg-red-50 border-red-200',
                text: 'text-red-700',
                icon: 'text-red-500'
              },
              medium: {
                container: 'bg-yellow-50 border-yellow-200',
                text: 'text-yellow-700',
                icon: 'text-yellow-500'
              },
              low: {
                container: 'bg-green-50 border-green-200',
                text: 'text-green-700',
                icon: 'text-green-500'
              }
            };

            const styles = severityStyles[anomaly.severity];
            
            // Calculate how much below threshold
            const consumptionDeficit = anomaly.threshold - anomaly.value;
            const percentageBelow = ((consumptionDeficit) / anomaly.threshold) * 100;
            
            // Determine warning level based on how far below threshold
            const getWarningText = () => {
              if (percentageBelow >= 90) return 'Critical: Near-Zero Consumption!';
              if (percentageBelow >= 70) return 'Severe: Extremely Low Consumption!';
              if (percentageBelow >= 50) return 'Warning: Very Low Consumption!';
              return 'Alert: Below Expected Consumption';
            };
            
            return (
              <div
                key={anomaly.id}
                className={`flex items-start justify-between p-3 rounded-lg border-2 ${styles.container}`}
              >
                <div className="flex items-start space-x-3">
                  {React.cloneElement(getAnomalyIcon(anomaly.anomalyType), {
                    className: `${styles.icon} h-4 w-4 animate-pulse`
                  })}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      {getAnomalyIcon(anomaly.anomalyType)}
                      <span className="font-medium">{getAnomalyTypeDisplay(anomaly.anomalyType)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                    <p className="text-sm">
                      Current Consumption: <span className="text-red-500 font-medium">{anomaly.value} kWh</span>
                      <br />
                      Expected Minimum: <span className="font-medium">{anomaly.threshold} kWh</span>
                      <br />
                      <span className="text-red-500 font-medium">
                        {getWarningText()} ({percentageBelow.toFixed(1)}% below normal)
                      </span>
                    </p>
                    {anomaly.meterNumber && (
                      <p className="text-sm">
                        Meter: {anomaly.meterNumber}
                        {anomaly.customerName && ` - ${anomaly.customerName}`}
                      </p>
                    )}
                    <p className="text-sm">
                      District: {getDistrictName(anomaly.districtId)}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "w-fit",
                        anomaly.severity === 'high' ? 'border-red-500 text-red-500' :
                        anomaly.severity === 'medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
                      )}
                    >
                      {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)} Severity
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoring;
