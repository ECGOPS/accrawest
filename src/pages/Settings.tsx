import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, Volume2, Laptop } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useTheme } from '@/components/theme-provider';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = React.useState({
    notifications: {
      enabled: true,
      sound: true,
      desktop: true,
      highRiskOnly: false
    },
    display: {
      theme: theme,
      refreshInterval: 15,
      compactView: false
    },
    monitoring: {
      riskThreshold: 75,
      autoRefresh: true,
      district: 'all'
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };

    // Update state
    setSettings(newSettings);

    // Update theme if theme setting changes
    if (category === 'display' && setting === 'theme') {
      setTheme(value);
    }

    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(newSettings));

    // Only show notifications if they're enabled or if we're enabling them
    if (category === 'notifications' && setting === 'enabled') {
      if (value) {
        toast({
          title: "Notifications enabled",
          description: "You will now receive notifications about important events.",
          duration: 2000,
        });
      }
    } else if (newSettings.notifications.enabled) {
      // Only show other setting updates if notifications are enabled
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
        duration: 2000,
      });
    }
  };

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      // Sync theme with saved settings
      if (parsed.display.theme) {
        setTheme(parsed.display.theme);
      }
    }
  }, [setTheme]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configurations
        </p>
      </div>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Display Settings
          </CardTitle>
          <CardDescription>
            Customize the appearance and behavior of the interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex items-center space-x-4">
              <Select 
                value={settings.display.theme}
                onValueChange={(value) => handleSettingChange('display', 'theme', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme">
                    <div className="flex items-center space-x-2">
                      {settings.display.theme === 'light' && <Sun className="h-4 w-4" />}
                      {settings.display.theme === 'dark' && <Moon className="h-4 w-4" />}
                      {settings.display.theme === 'system' && <Laptop className="h-4 w-4" />}
                      <span>{settings.display.theme.charAt(0).toUpperCase() + settings.display.theme.slice(1)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center space-x-2">
                      <Laptop className="h-4 w-4" />
                      <span>System</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-refresh Interval (seconds)</Label>
              <span className="text-sm text-muted-foreground">
                {settings.display.refreshInterval}s
              </span>
            </div>
            <Slider
              value={[settings.display.refreshInterval]}
              onValueChange={([value]) => handleSettingChange('display', 'refreshInterval', value)}
              min={5}
              max={60}
              step={5}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Show more content in a condensed format
              </p>
            </div>
            <Switch
              checked={settings.display.compactView}
              onCheckedChange={(checked) => handleSettingChange('display', 'compactView', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how you want to receive alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about anomalies and important events
              </p>
            </div>
            <Switch
              checked={settings.notifications.enabled}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={!settings.notifications.enabled ? "text-muted-foreground" : ""}>
                Sound Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Play a sound when new alerts arrive
              </p>
            </div>
            <Switch
              disabled={!settings.notifications.enabled}
              checked={settings.notifications.sound}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={!settings.notifications.enabled ? "text-muted-foreground" : ""}>
                Desktop Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show desktop notifications for alerts
              </p>
            </div>
            <Switch
              disabled={!settings.notifications.enabled}
              checked={settings.notifications.desktop}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'desktop', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={!settings.notifications.enabled ? "text-muted-foreground" : ""}>
                High Risk Alerts Only
              </Label>
              <p className="text-sm text-muted-foreground">
                Only notify for high-risk anomalies
              </p>
            </div>
            <Switch
              disabled={!settings.notifications.enabled}
              checked={settings.notifications.highRiskOnly}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'highRiskOnly', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Monitoring Configuration
          </CardTitle>
          <CardDescription>
            Configure anomaly detection and monitoring preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Risk Score Threshold</Label>
              <span className="text-sm text-muted-foreground">
                {settings.monitoring.riskThreshold}
              </span>
            </div>
            <Slider
              value={[settings.monitoring.riskThreshold]}
              onValueChange={([value]) => handleSettingChange('monitoring', 'riskThreshold', value)}
              min={0}
              max={100}
              step={5}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-refresh Monitoring</Label>
              <p className="text-sm text-muted-foreground">
                Automatically refresh monitoring data
              </p>
            </div>
            <Switch
              checked={settings.monitoring.autoRefresh}
              onCheckedChange={(checked) => handleSettingChange('monitoring', 'autoRefresh', checked)}
            />
          </div>
          <div className="space-y-2">
            <Label>Default District</Label>
            <Select 
              value={settings.monitoring.district}
              onValueChange={(value) => handleSettingChange('monitoring', 'district', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="ablekuma">Ablekuma</SelectItem>
                <SelectItem value="dansoman">Dansoman</SelectItem>
                <SelectItem value="korle-bu">Korle Bu</SelectItem>
                <SelectItem value="kaneshie">Kaneshie</SelectItem>
                <SelectItem value="mamprobi">Mamprobi</SelectItem>
                <SelectItem value="darkuman">Darkuman</SelectItem>
                <SelectItem value="bortianor">Bortianor</SelectItem>
                <SelectItem value="weija">Weija</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => {
          const defaultSettings = {
            notifications: {
              enabled: true,
              sound: true,
              desktop: true,
              highRiskOnly: false
            },
            display: {
              theme: 'system',
              refreshInterval: 15,
              compactView: false
            },
            monitoring: {
              riskThreshold: 75,
              autoRefresh: true,
              district: 'all'
            }
          };

          localStorage.removeItem('appSettings');
          setSettings(defaultSettings);
          setTheme('system');
          
          if (defaultSettings.notifications.enabled) {
            toast({
              title: "Settings reset",
              description: "All settings have been restored to defaults.",
              duration: 2000,
            });
          }
        }}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings; 