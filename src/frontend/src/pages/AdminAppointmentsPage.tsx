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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  Clock,
  FileText,
  Phone,
  RefreshCw,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConsultationType, Status } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllAppointments,
  useIsCallerAdmin,
  useMarkAppointmentsAsViewed,
  useUpdateAppointmentStatus,
} from "../hooks/useQueries";

type SortField =
  | "dateSubmitted"
  | "preferredDateTime"
  | "patientName"
  | "status";
type SortOrder = "asc" | "desc";

export default function AdminAppointmentsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const updateStatus = useUpdateAppointmentStatus();
  const markAsViewed = useMarkAppointmentsAsViewed();

  const [sortField, setSortField] = useState<SortField>("dateSubmitted");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const isAuthenticated = !!identity;

  // Only fetch appointments after admin check is complete and user is confirmed admin
  const shouldFetchAppointments =
    isAuthenticated && !adminCheckLoading && isAdmin === true;

  const {
    data: appointments,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useGetAllAppointments();

  // Mark old appointments as viewed when admin visits the page
  useEffect(() => {
    if (shouldFetchAppointments && appointments && appointments.length > 0) {
      const hasNewAppointments = appointments.some((a) => a.isNew);
      if (hasNewAppointments) {
        markAsViewed.mutate();
      }
    }
  }, [shouldFetchAppointments, appointments, markAsViewed.mutate]);

  const handleStatusChange = async (
    appointmentId: bigint,
    newStatus: Status,
  ) => {
    try {
      await updateStatus.mutateAsync({ id: appointmentId, status: newStatus });
      toast.success("Appointment status updated successfully");
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error("Status update error:", error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleRefresh = () => {
    refetchAppointments();
    toast.success("Appointments refreshed");
  };

  const sortedAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];

    console.log("Total appointments received:", appointments.length);
    console.log(
      "Appointment statuses:",
      appointments.map((a) => ({
        id: a.id.toString(),
        status: a.status,
        isNew: a.isNew,
      })),
    );

    // First, separate new and old appointments
    const newAppointments = appointments.filter((a) => a.isNew);
    const oldAppointments = appointments.filter((a) => !a.isNew);

    console.log("New appointments:", newAppointments.length);
    console.log("Old appointments:", oldAppointments.length);

    // Sort each group
    const sortFn = (
      a: (typeof appointments)[0],
      b: (typeof appointments)[0],
    ) => {
      let comparison = 0;

      switch (sortField) {
        case "dateSubmitted":
          comparison = a.dateSubmitted.localeCompare(b.dateSubmitted);
          break;
        case "preferredDateTime":
          comparison = a.preferredDateTime.localeCompare(b.preferredDateTime);
          break;
        case "patientName":
          comparison = a.patientName.localeCompare(b.patientName);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    };

    const sortedNew = [...newAppointments].sort(sortFn);
    const sortedOld = [...oldAppointments].sort(sortFn);

    // Return new appointments first, then old ones
    return [...sortedNew, ...sortedOld];
  }, [appointments, sortField, sortOrder]);

  const getStatusBadgeVariant = (
    status: Status,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case Status.confirmed:
        return "default";
      case Status.completed:
        return "secondary";
      case Status.cancelled:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: Status): string => {
    switch (status) {
      case Status.pending:
        return "Pending";
      case Status.confirmed:
        return "Confirmed";
      case Status.cancelled:
        return "Cancelled";
      case Status.completed:
        return "Completed";
      default:
        return status;
    }
  };

  const getConsultationTypeLabel = (type: ConsultationType): string => {
    return type === ConsultationType.online ? "Online" : "Clinic Visit";
  };

  const formatDateTime = (dateTimeStr: string): string => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTimeStr;
    }
  };

  // Access control check - not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-4 p-8">
            <AlertCircle className="h-8 w-8 shrink-0 text-amber-600" />
            <div>
              <h2 className="mb-2 text-xl font-semibold text-amber-900">
                Authentication Required
              </h2>
              <p className="text-amber-800">
                Please login to access the admin appointments management page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading admin check
  if (adminCheckLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Access control check - not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl border-red-200 bg-red-50">
          <CardContent className="flex items-start gap-4 p-8">
            <Shield className="h-8 w-8 shrink-0 text-red-600" />
            <div>
              <h2 className="mb-2 text-xl font-semibold text-red-900">
                Access Denied
              </h2>
              <p className="text-red-800">
                You do not have permission to access this page. Only
                administrators can manage appointments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const newAppointmentsCount = sortedAppointments.filter((a) => a.isNew).length;
  const pendingCount = sortedAppointments.filter(
    (a) => a.status === Status.pending,
  ).length;
  const confirmedCount = sortedAppointments.filter(
    (a) => a.status === Status.confirmed,
  ).length;
  const completedCount = sortedAppointments.filter(
    (a) => a.status === Status.completed,
  ).length;
  const cancelledCount = sortedAppointments.filter(
    (a) => a.status === Status.cancelled,
  ).length;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Shield className="h-4 w-4" style={{ color: "#FF0000" }} />
          <span>Admin Panel</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-emerald-800">
              Appointments Management
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all appointment requests from patients
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            disabled={appointmentsLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${appointmentsLoading ? "animate-spin" : ""}`}
              style={{ color: "#FF0000" }}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-5">
        <Card className="border-gray-300 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Total</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {appointmentsLoading ? "..." : sortedAppointments.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-700">Pending</p>
              <p className="mt-2 text-3xl font-bold text-emerald-800">
                {appointmentsLoading ? "..." : pendingCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">Confirmed</p>
              <p className="mt-2 text-3xl font-bold text-blue-800">
                {appointmentsLoading ? "..." : confirmedCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Completed</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {appointmentsLoading ? "..." : completedCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-red-700">Cancelled</p>
              <p className="mt-2 text-3xl font-bold text-red-800">
                {appointmentsLoading ? "..." : cancelledCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl text-emerald-800">
            <span>All Appointments</span>
            {newAppointmentsCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3 text-white" />
                {newAppointmentsCount} New
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {appointmentsLoading
              ? "Loading appointments..."
              : `Displaying all ${sortedAppointments.length} appointment${sortedAppointments.length !== 1 ? "s" : ""} (pending, confirmed, cancelled, and completed)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                <p className="text-muted-foreground">Loading appointments...</p>
              </div>
            </div>
          ) : !appointments || sortedAppointments.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                No appointments yet
              </p>
              <p className="text-sm text-gray-500">
                Appointments will appear here once patients book them
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]" />
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("patientName")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        <User
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Patient Name
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1 font-semibold">
                        <Phone
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Contact Info
                      </div>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("preferredDateTime")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        <Clock
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Preferred Date/Time
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1 font-semibold">
                        <FileText
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Type
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1 font-semibold">
                        <FileText
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Health Concerns
                      </div>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Status
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("dateSubmitted")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        <Calendar
                          className="h-4 w-4"
                          style={{ color: "#FF0000" }}
                        />
                        Submitted
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id.toString()}
                      className={appointment.isNew ? "bg-emerald-50/50" : ""}
                    >
                      <TableCell>
                        {appointment.isNew && (
                          <Badge
                            variant="destructive"
                            className="whitespace-nowrap text-xs"
                          >
                            New
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          appointment.isNew ? "font-bold" : "font-medium"
                        }
                      >
                        {appointment.patientName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {appointment.contactInfo}
                      </TableCell>
                      <TableCell className="text-sm">
                        {appointment.preferredDateTime}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {getConsultationTypeLabel(
                            appointment.consultationType,
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {appointment.healthConcerns}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={appointment.status}
                          onValueChange={(value) =>
                            handleStatusChange(appointment.id, value as Status)
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  appointment.status,
                                )}
                              >
                                {getStatusLabel(appointment.status)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Status.pending}>
                              Pending
                            </SelectItem>
                            <SelectItem value={Status.confirmed}>
                              Confirmed
                            </SelectItem>
                            <SelectItem value={Status.cancelled}>
                              Cancelled
                            </SelectItem>
                            <SelectItem value={Status.completed}>
                              Completed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDateTime(appointment.dateSubmitted)}
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
