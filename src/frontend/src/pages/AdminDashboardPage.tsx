import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  History,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Appointment, ConsultationType, Status } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllAppointments,
  useGetAllPatientDetails,
  useGetEmailSettings,
  useGetPaymentDetails,
  useIsCallerAdmin,
  useUpdateAppointmentStatus,
} from "../hooks/useQueries";

type SortField = "name" | "date" | "status" | "none";
type SortDirection = "asc" | "desc";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: appointments, isLoading: appointmentsLoading } =
    useGetAllAppointments();
  const { data: patients, isLoading: patientsLoading } =
    useGetAllPatientDetails();
  const { data: paymentDetails, isLoading: paymentLoading } =
    useGetPaymentDetails();
  const { data: emailSettings, isLoading: emailLoading } =
    useGetEmailSettings();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const [updatingId, setUpdatingId] = useState<bigint | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const isAuthenticated = !!identity;

  // Calculate statistics
  const pendingCount =
    appointments?.filter((a) => a.status === Status.pending).length || 0;
  const completedCount =
    appointments?.filter((a) => a.status === Status.completed).length || 0;
  const totalPatients = patients?.length || 0;
  const emailStatus = emailSettings?.isEnabled ? "Enabled" : "Disabled";

  // Filter and sort appointments
  const filteredAndSortedAppointments = useMemo(() => {
    if (!appointments) return [];

    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.patientName.toLowerCase().includes(search) ||
          a.contactInfo.toLowerCase().includes(search) ||
          a.healthConcerns.toLowerCase().includes(search),
      );
    }

    // Apply sorting
    if (sortField !== "none") {
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "name":
            comparison = a.patientName.localeCompare(b.patientName);
            break;
          case "date":
            comparison = a.dateSubmitted.localeCompare(b.dateSubmitted);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [appointments, statusFilter, searchTerm, sortField, sortDirection]);

  const handleStatusChange = async (
    appointmentId: bigint,
    newStatus: Status,
  ) => {
    setUpdatingId(appointmentId);
    try {
      await updateStatusMutation.mutateAsync({
        id: appointmentId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.completed:
        return "text-green-600 bg-green-50";
      case Status.cancelled:
        return "text-red-600 bg-red-50";
      case Status.confirmed:
        return "text-blue-600 bg-blue-50";
      case Status.pending:
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getConsultationTypeLabel = (type: ConsultationType) => {
    switch (type) {
      case ConsultationType.online:
        return "Online";
      case ConsultationType.clinicVisit:
        return "Clinic Visit";
      default:
        return "Unknown";
    }
  };

  if (!isAuthenticated || adminLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
          <h2 className="text-2xl font-bold text-gray-900">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied. This page is only accessible to administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Appointments Management",
      description: "View and manage all patient bookings",
      icon: Calendar,
      onClick: () => navigate({ to: "/admin/appointments" }),
      stat: pendingCount > 0 ? `${pendingCount} pending` : "All up to date",
      loading: appointmentsLoading,
    },
    {
      title: "Appointment History",
      description: "See all completed and past appointments",
      icon: History,
      onClick: () => navigate({ to: "/admin/appointment-history" }),
      stat:
        completedCount > 0 ? `${completedCount} completed` : "No history yet",
      loading: appointmentsLoading,
    },
    {
      title: "Patients Details",
      description: "List patients with contact and visit info",
      icon: Users,
      onClick: () => navigate({ to: "/admin/patients" }),
      stat: totalPatients > 0 ? `${totalPatients} patients` : "No patients yet",
      loading: patientsLoading,
    },
    {
      title: "Email Settings",
      description: "Manage email notifications and recipient",
      icon: Settings,
      onClick: () => navigate({ to: "/admin/settings" }),
      stat: emailLoading
        ? "Loading..."
        : `Email notifications ${emailStatus.toLowerCase()}`,
      loading: emailLoading,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Manage your clinic operations from one central location
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Appointments
            </CardTitle>
            <Clock className="h-4 w-4" style={{ color: "#FF0000" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentsLoading ? "..." : pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: "#FF0000" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentsLoading ? "..." : completedCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total completed visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4" style={{ color: "#FF0000" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patientsLoading ? "..." : totalPatients}
            </div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Status</CardTitle>
            <Settings className="h-4 w-4" style={{ color: "#FF0000" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailLoading ? "..." : emailStatus}
            </div>
            <p className="text-xs text-muted-foreground">
              Notifications{" "}
              {emailLoading ? "loading" : emailStatus.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 flex items-center gap-2">
                      <Icon className="h-5 w-5" style={{ color: "#FF0000" }} />
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.loading ? "Loading..." : card.stat}
                  </p>
                </div>
                <Button
                  onClick={card.onClick}
                  className="w-full"
                  style={{ backgroundColor: "#FF0000", color: "white" }}
                >
                  Open {card.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Appointments List Section with Filters and Sorting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" style={{ color: "#FF0000" }} />
            All Online Appointments
          </CardTitle>
          <CardDescription>
            Complete list of all patient bookings with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Search Controls */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "#FF0000" }}
                >
                  Status:
                </span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={Status.pending}>Pending</SelectItem>
                    <SelectItem value={Status.confirmed}>Confirmed</SelectItem>
                    <SelectItem value={Status.completed}>Completed</SelectItem>
                    <SelectItem value={Status.cancelled}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "#FF0000" }}
                >
                  Sort by:
                </span>
                <Select
                  value={sortField}
                  onValueChange={(value) => setSortField(value as SortField)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Patient Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                  title={sortDirection === "asc" ? "Ascending" : "Descending"}
                >
                  <ArrowUpDown
                    className="h-4 w-4"
                    style={{ color: "#FF0000" }}
                  />
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Count */}
          {!appointmentsLoading && appointments && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold" style={{ color: "#FF0000" }}>
                  {filteredAndSortedAppointments.length}
                </span>{" "}
                of <span className="font-semibold">{appointments.length}</span>{" "}
                appointments
              </p>
            </div>
          )}

          {/* Appointments Table */}
          {appointmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
              <span className="ml-3 text-gray-600">
                Loading appointments...
              </span>
            </div>
          ) : !appointments || appointments.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                No appointments yet
              </p>
              <p className="text-sm text-gray-500">
                New appointments will appear here
              </p>
            </div>
          ) : filteredAndSortedAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <Search className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                No appointments match your filters
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold hover:opacity-70"
                        style={{ color: "#FF0000" }}
                      >
                        Patient Name
                        {sortField === "name" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead style={{ color: "#FF0000" }}>
                      Contact Info
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-1 font-semibold hover:opacity-70"
                        style={{ color: "#FF0000" }}
                      >
                        Preferred Date/Time
                        {sortField === "date" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead style={{ color: "#FF0000" }}>
                      Consultation Type
                    </TableHead>
                    <TableHead style={{ color: "#FF0000" }}>
                      Health Concerns
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold hover:opacity-70"
                        style={{ color: "#FF0000" }}
                      >
                        Status
                        {sortField === "status" && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead style={{ color: "#FF0000" }}>
                      Date Submitted
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id.toString()}
                      className={appointment.isNew ? "bg-yellow-50" : ""}
                    >
                      <TableCell className="font-medium">
                        {appointment.patientName}
                        {appointment.isNew && (
                          <span
                            className="ml-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold"
                            style={{ color: "#FF0000" }}
                          >
                            New
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {appointment.contactInfo}
                      </TableCell>
                      <TableCell>{appointment.preferredDateTime}</TableCell>
                      <TableCell>
                        {getConsultationTypeLabel(appointment.consultationType)}
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div
                          className="line-clamp-2"
                          title={appointment.healthConcerns}
                        >
                          {appointment.healthConcerns}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={appointment.status}
                          onValueChange={(value) =>
                            handleStatusChange(appointment.id, value as Status)
                          }
                          disabled={updatingId === appointment.id}
                        >
                          <SelectTrigger
                            className={`w-[130px] ${getStatusColor(appointment.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Status.pending}>
                              Pending
                            </SelectItem>
                            <SelectItem value={Status.confirmed}>
                              Confirmed
                            </SelectItem>
                            <SelectItem value={Status.completed}>
                              Completed
                            </SelectItem>
                            <SelectItem value={Status.cancelled}>
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{appointment.dateSubmitted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" style={{ color: "#FF0000" }} />
            Payment Information
          </CardTitle>
          <CardDescription>
            Current supported payment methods and UPI details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentLoading ? (
            <p className="text-sm text-gray-600">Loading payment details...</p>
          ) : paymentDetails ? (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Payment Methods:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paymentDetails.methods.map((method) => (
                    <span
                      key={method.method}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800"
                    >
                      {method.method}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Payment Number:
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentDetails.methods[0]?.number}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">UPI ID:</p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentDetails.methods[0]?.upiId}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email:</p>
                <p className="text-base font-semibold text-gray-900">
                  {paymentDetails.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Currency:</p>
                <p className="text-base font-semibold text-gray-900">
                  {paymentDetails.currency} (₹)
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No payment details available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
