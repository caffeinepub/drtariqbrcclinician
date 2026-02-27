import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetEmailSettings, useEnableEmailNotifications, useDisableEmailNotifications } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: emailSettings, isLoading: emailLoading } = useGetEmailSettings();
  const enableEmailNotifications = useEnableEmailNotifications();
  const disableEmailNotifications = useDisableEmailNotifications();

  const isAuthenticated = !!identity;
  const emailNotificationsEnabled = emailSettings?.isEnabled ?? true;

  if (!isAuthenticated || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-red-200 bg-red-50">
          <CardContent className="flex items-start gap-4 p-6">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div>
              <h3 className="mb-2 font-semibold text-red-900">Access Denied</h3>
              <p className="text-red-800">
                You do not have permission to access this page. Only administrators can manage settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleToggleEmailNotifications = async (enabled: boolean) => {
    try {
      if (enabled) {
        await enableEmailNotifications.mutateAsync(null);
        toast.success('Email notifications enabled successfully');
      } else {
        await disableEmailNotifications.mutateAsync(null);
        toast.success('Email notifications disabled successfully');
      }
    } catch (error) {
      toast.error('Failed to update email notification settings');
      console.error('Email notification toggle error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Settings className="h-4 w-4" style={{ color: '#FF0000' }} />
          <span>Admin Settings</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">System Settings</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Manage system configurations and notification preferences
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Email Notifications Card */}
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <Mail className="h-5 w-5" style={{ color: '#FF0000' }} />
              </div>
              <div>
                <CardTitle className="text-xl text-emerald-800">Email Notifications</CardTitle>
                <CardDescription>
                  Configure automatic email alerts for new appointment requests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loading State */}
            {emailLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                  <p className="text-sm text-gray-600">Loading email settings...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Status Alert */}
                {emailNotificationsEnabled ? (
                  <Alert className="border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4" style={{ color: '#FF0000' }} />
                    <AlertTitle className="text-emerald-800">Email notifications: Enabled</AlertTitle>
                    <AlertDescription className="text-emerald-700">
                      The system is actively sending email alerts to <strong>{emailSettings?.recipientEmail || 'drtariqherbal@gmail.com'}</strong> when new appointments are submitted.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4" style={{ color: '#FF0000' }} />
                    <AlertTitle className="text-amber-800">Email notifications: Disabled</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Enable email notifications to receive automatic alerts for new appointment requests.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Toggle Switch */}
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="text-base font-semibold text-emerald-800">
                      Enable Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive instant email alerts when patients book appointments
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotificationsEnabled}
                    onCheckedChange={handleToggleEmailNotifications}
                    disabled={enableEmailNotifications.isPending || disableEmailNotifications.isPending}
                  />
                </div>

                {/* Email Details */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-800">Email Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient Email:</span>
                      <span className="font-medium text-gray-800">{emailSettings?.recipientEmail || 'drtariqherbal@gmail.com'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notification Type:</span>
                      <span className="font-medium text-gray-800">New Appointment Requests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trigger:</span>
                      <span className="font-medium text-gray-800">Automatic on submission</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`font-semibold ${emailNotificationsEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                        {emailNotificationsEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Content Preview */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Email Content Preview</h4>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                    <div className="mb-3 border-b border-gray-200 pb-3">
                      <p className="font-semibold text-gray-800">Subject: New Online Appointment Request</p>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">New Appointment Request</p>
                      <p><strong>Patient Name:</strong> [Patient Name]</p>
                      <p><strong>Contact Info:</strong> [Email/Phone]</p>
                      <p><strong>Preferred Date & Time:</strong> [Date and Time]</p>
                      <p><strong>Consultation Type:</strong> [Online/Clinic Visit]</p>
                      <p><strong>Health Concerns:</strong> [Patient's concerns]</p>
                    </div>
                  </div>
                </div>

                {/* Information Note */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#FF0000' }} />
                    <div className="text-sm text-blue-800">
                      <p className="mb-2 font-semibold">Important Information</p>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Email notifications are sent immediately when a patient submits an appointment request</li>
                        <li>Emails include all appointment details for quick review</li>
                        <li>You can enable or disable notifications at any time</li>
                        <li>Email system is currently <strong>{emailNotificationsEnabled ? 'enabled and functioning' : 'disabled'}</strong></li>
                        <li>Emails are delivered to <strong>{emailSettings?.recipientEmail || 'drtariqherbal@gmail.com'}</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Future Settings Placeholder */}
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">Additional Settings</CardTitle>
            <CardDescription>
              More configuration options will be available here in future updates
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
