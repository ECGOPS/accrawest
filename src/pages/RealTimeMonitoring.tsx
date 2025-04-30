import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RealTimeMonitoring from "@/components/RealTimeMonitoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districts } from "@/utils/mockData";
import { useState } from "react";

const RealTimeMonitoringPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real-Time Monitoring</h1>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.name}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <RealTimeMonitoring selectedDistrict={selectedDistrict === "all" ? undefined : selectedDistrict} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="font-medium">High Severity</span>
                  </div>
                  <span className="text-sm text-muted-foreground">12 alerts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="font-medium">Medium Severity</span>
                  </div>
                  <span className="text-sm text-muted-foreground">8 alerts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Low Severity</span>
                  </div>
                  <span className="text-sm text-muted-foreground">5 alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New anomaly detected</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoringPage; 