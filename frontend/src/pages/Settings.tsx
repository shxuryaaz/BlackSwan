import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Key, 
  Mail, 
  MessageSquare, 
  Phone, 
  Brain, 
  Clock, 
  Bell,
  Save,
  TestTube,
  Settings as SettingsIcon,
  Shield,
  Zap,
  AlertTriangle
} from "lucide-react";
import { getApiSettings, saveApiSettings } from "@/integrations/firebase/database";
import { signOutUser } from "@/integrations/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import type { User } from 'firebase/auth';

interface SettingsProps {
  user: User;
}

interface ApiSettings {
  openai_api_key?: string;
  resend_api_key?: string;
  from_email?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  twilio_phone_number?: string;
  automation_enabled?: boolean;
  default_ai_tone?: string;
  reminder_schedule?: string;
  escalation_rules?: string;
}

const Settings = ({ user }: SettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ApiSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [user.uid]);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings for user:', user.uid);
      const data = await getApiSettings(user.uid);
      console.log('Fetched settings:', data);
      if (data) {
        setSettings(data);
      } else {
        console.log('No existing settings found, using defaults');
        setSettings({
          from_email: 'onboarding@resend.dev'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ensure we're using the correct Resend domain for testing
      const settingsToSave = {
        ...settings,
        from_email: settings.from_email || 'onboarding@resend.dev'
      };
      
      console.log('Saving settings:', settingsToSave);
      await saveApiSettings(user.uid, settingsToSave);
      console.log('Settings saved successfully');
      toast({
        title: "Settings saved!",
        description: "Your API settings have been updated successfully.",
      });
      // Refresh settings after saving
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = (service: string) => {
    if (service === 'Resend') {
      if (!settings.resend_api_key) {
        toast({
          title: "Error",
          description: "Please enter your Resend API key first",
          variant: "destructive",
        });
        return;
      }
      
      // Test Resend API connection
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.resend_api_key}`
        },
        body: JSON.stringify({
          from: settings.from_email || 'noreply@blackswan.com',
          to: ['test@example.com'],
          subject: 'Test Email',
          html: '<p>This is a test email to verify your Resend configuration.</p>'
        })
      })
      .then(response => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Resend API connection successful!",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to connect to Resend API",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to connect to Resend API",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Test Connection",
        description: `Testing ${service} connection...`,
      });
    }
  };

  const updateSetting = (key: keyof ApiSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const fixResendEmail = () => {
    updateSetting('from_email', 'onboarding@resend.dev');
    toast({
      title: "Email Fixed",
      description: "Changed to Resend's default domain for testing",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
              <SettingsIcon className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground text-lg">
                Configure your API keys and automation settings for payment reminders.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Configuration */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <span>OpenAI Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure OpenAI API for AI-powered message generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key" className="text-sm font-semibold">OpenAI API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="openai-key"
                        type="password"
                        placeholder="sk-..."
                        value={settings.openai_api_key || ''}
                        onChange={(e) => updateSetting('openai_api_key', e.target.value)}
                        className="input-premium"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection('OpenAI')}
                        className="border-border/50 hover:border-accent/50"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Resend Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure Resend for email delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resend-key" className="text-sm font-semibold">Resend API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="resend-key"
                        type="password"
                        placeholder="re_..."
                        value={settings.resend_api_key || ''}
                        onChange={(e) => updateSetting('resend_api_key', e.target.value)}
                        className="input-premium"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection('Resend')}
                        className="border-border/50 hover:border-accent/50"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                    {!settings.resend_api_key && (
                      <p className="text-sm text-muted-foreground">
                        Your Resend API key: re_je49z9Kb_GmUk85djyoy7GVPtGDC19g8q
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email" className="text-sm font-semibold">From Email</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="from-email"
                        type="email"
                        placeholder="onboarding@resend.dev"
                        value={settings.from_email || ''}
                        onChange={(e) => updateSetting('from_email', e.target.value)}
                        className="input-premium"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting('from_email', 'onboarding@resend.dev')}
                        className="border-border/50 hover:border-accent/50"
                      >
                        Set Default
                      </Button>
                    </div>
                    {!settings.from_email && (
                      <p className="text-sm text-muted-foreground">
                        Recommended: onboarding@resend.dev (for testing)
                      </p>
                    )}
                    {settings.from_email && settings.from_email !== 'onboarding@resend.dev' && (
                      <div className="flex items-center space-x-2 p-3 bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                          This email domain may not be verified in Resend
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fixResendEmail}
                          className="border-yellow-300 hover:border-yellow-400"
                        >
                          Use Resend Domain
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Twilio Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure Twilio for WhatsApp and voice calls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-sid" className="text-sm font-semibold">Account SID</Label>
                    <Input
                      id="twilio-sid"
                      placeholder="AC..."
                      value={settings.twilio_account_sid || ''}
                      onChange={(e) => updateSetting('twilio_account_sid', e.target.value)}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-token" className="text-sm font-semibold">Auth Token</Label>
                    <Input
                      id="twilio-token"
                      type="password"
                      placeholder="..."
                      value={settings.twilio_auth_token || ''}
                      onChange={(e) => updateSetting('twilio_auth_token', e.target.value)}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilio-phone" className="text-sm font-semibold">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="twilio-phone"
                        placeholder="+1234567890"
                        value={settings.twilio_phone_number || ''}
                        onChange={(e) => updateSetting('twilio_phone_number', e.target.value)}
                        className="input-premium"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection('Twilio')}
                        className="border-border/50 hover:border-accent/50"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
                      <Bell className="h-5 w-5 text-accent" />
                    </div>
                    <span>Automation Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure automated reminder scheduling and escalation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Enable Automation</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically send reminders based on due dates
                      </p>
                    </div>
                    <Switch
                      checked={settings.automation_enabled || false}
                      onCheckedChange={(checked) => updateSetting('automation_enabled', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-tone" className="text-sm font-semibold">Default AI Tone</Label>
                    <Select
                      value={settings.default_ai_tone || 'professional'}
                      onValueChange={(value) => updateSetting('default_ai_tone', value)}
                    >
                      <SelectTrigger className="input-premium">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule" className="text-sm font-semibold">Reminder Schedule</Label>
                    <Select
                      value={settings.reminder_schedule || 'daily'}
                      onValueChange={(value) => updateSetting('reminder_schedule', value)}
                    >
                      <SelectTrigger className="input-premium">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="escalation" className="text-sm font-semibold">Escalation Rules</Label>
                    <Textarea
                      id="escalation"
                      placeholder="Define escalation rules for overdue payments..."
                      value={settings.escalation_rules || ''}
                      onChange={(e) => updateSetting('escalation_rules', e.target.value)}
                      rows={4}
                      className="input-premium"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Message Templates</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your reminder message templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Email Template</Label>
                    <Textarea
                      placeholder="Dear {customer_name}, This is a friendly reminder..."
                      rows={3}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">WhatsApp Template</Label>
                    <Textarea
                      placeholder="Hi {customer_name}, just a quick reminder..."
                      rows={3}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Voice Script</Label>
                    <Textarea
                      placeholder="Hello {customer_name}, this is a payment reminder..."
                      rows={3}
                      className="input-premium"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                      <Save className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Save Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Save your configuration to enable all features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="btn-accent w-full"
                  >
                    {saving ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save Settings</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;