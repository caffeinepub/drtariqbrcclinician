import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Filter, History, RefreshCw, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllAppointments, useIsCallerAdmin } from "../hooks/useQueries";
import { ConsultationType, Status } from "../types";
import type { Appointment } from "../types";

type StatusFilter = "all" | Status;

export default function AdminAppointmentHistoryPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch,
    isFetching,
  } = useGetAllAppointments();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const isAuthenticated = !!identity;

  // Auto-refetch on mount to ensure fresh data
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      refetch();
    }
  }, [isAuthenticated, isAdmin, refetch]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];

    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Sort by most recent first (newest to oldest) using timestamp
    filtered.sort((a, b) => {
      const timeA = Number(a.timestamp);
      const timeB = Number(b.timestamp);
      return timeB - timeA; // Descending order (newest first)
    });

    return filtered;
  }, [appointments, statusFilter]);

  // Manual refresh handler
  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (adminCheckLoading || appointmentsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-muted-foreground">
              Loading appointment history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Access control
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" style={{ color: "#FF0000" }} />
              Access Denied
            </CardTitle>
            <CardDescription className="text-red-700">
              You must be logged in as an administrator to view appointment
              history.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Error state
  if (appointmentsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Appointments</AlertTitle>
          <AlertDescription>
            Failed to load appointment history. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" style={{ color: "#FF0000" }} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Status) => {
    const statusMap: Record<
      Status,
      { variant: "default" | "destructive"; label: string; className: string }
    > = {
      [Status.pending]: {
        variant: "default",
        label: "Pending",
        className:
          "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300",
      },
      [Status.confirmed]: {
        variant: "default",
        label: "Confirmed",
        className:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
      },
      [Status.completed]: {
        variant: "default",
        label: "Completed",
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
      },
      [Status.cancelled]: {
        variant: "destructive",
        label: "Cancelled",
        className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
      },
    };
    const config = statusMap[status] || statusMap[Status.pending];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getConsultationType = (type: ConsultationType) => {
    return type === ConsultationType.online ? "Online" : "Clinic Visit";
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_error) {
      return "Invalid date";
    }
  };

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: Status.pending },
    { label: "Confirmed", value: Status.confirmed },
    { label: "Completed", value: Status.completed },
    { label: "Cancelled", value: Status.cancelled },
  ];

  const totalAppointments = appointments?.length || 0;
  const filteredCount = filteredAppointments.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="h-8 w-8" style={{ color: "#FF0000" }} />
              <h1 className="text-3xl font-bold text-emerald-900">
                Appointment History
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and filter all appointment records ({totalAppointments}{" "}
              total)
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isFetching}
            className="border-emerald-300 text-emerald-800 hover:bg-emerald-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              style={{ color: "#FF0000" }}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" style={{ color: "#FF0000" }} />
            Filter by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                variant={statusFilter === filter.value ? "default" : "outline"}
                className={
                  statusFilter === filter.value
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === "all"
              ? "All Appointments"
              : `${filterButtons.find((f) => f.value === statusFilter)?.label} Appointments`}
          </CardTitle>
          <CardDescription>
            {filteredCount}{" "}
            {filteredCount === 1 ? "appointment" : "appointments"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCount === 0 ? (
            <div className="py-12 text-center">
              <History className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                {totalAppointments === 0
                  ? "No appointment history available"
                  : "No appointments match the selected filter"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {totalAppointments === 0
                  ? "Appointments will appear here once they are submitted."
                  : `Try selecting a different status filter. You have ${totalAppointments} total ${totalAppointments === 1 ? "appointment" : "appointments"}.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">
                      Patient Name
                    </TableHead>
                    <TableHead className="font-semibold">
                      Contact Info
                    </TableHead>
                    <TableHead className="font-semibold">
                      Consultation Type
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">
                      Health Concerns
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={Number(appointment.id)}
                      className="hover:bg-emerald-50/50"
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(appointment.timestamp)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {appointment.patientName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {appointment.contactInfo}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                          {getConsultationType(appointment.consultationType)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div
                          className="truncate text-sm text-gray-600"
                          title={appointment.healthConcerns}
                        >
                          {appointment.healthConcerns}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
