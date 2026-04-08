import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, ArrowUpDown, Loader2, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllPatientDetails, useIsCallerAdmin } from "../hooks/useQueries";
import { PatientStatus, Status } from "../types";

type SortField =
  | "name"
  | "appointmentCount"
  | "mostRecentAppointmentDate"
  | "status";
type SortDirection = "asc" | "desc";

export default function AdminPatientsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const {
    data: patients,
    isLoading: patientsLoading,
    error,
  } = useGetAllPatientDetails();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>(
    "mostRecentAppointmentDate",
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const isAuthenticated = !!identity;

  // Filter and sort patients - MUST be called before any conditional returns
  const filteredAndSortedPatients = useMemo(() => {
    if (!patients) return [];

    // Filter by search term
    let filtered = patients;
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(lowerSearch) ||
          patient.contactInfo.email.toLowerCase().includes(lowerSearch) ||
          patient.contactInfo.phone.toLowerCase().includes(lowerSearch),
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "appointmentCount":
          comparison = Number(a.appointmentCount) - Number(b.appointmentCount);
          break;
        case "mostRecentAppointmentDate":
          comparison =
            new Date(a.mostRecentAppointmentDate).getTime() -
            new Date(b.mostRecentAppointmentDate).getTime();
          break;
        case "status": {
          const statusOrder = {
            [PatientStatus.active]: 0,
            [PatientStatus.inactive]: 1,
          };
          comparison =
            statusOrder[a.lastVisitStatus] - statusOrder[b.lastVisitStatus];
          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [patients, searchTerm, sortField, sortDirection]);

  const totalPatients = patients?.length || 0;
  const activePatients =
    patients?.filter((p) => p.lastVisitStatus === PatientStatus.active)
      .length || 0;
  const inactivePatients = totalPatients - activePatients;

  // Show loading state while checking admin status
  if (adminCheckLoading || patientsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
            <p className="mt-4 text-muted-foreground">
              Loading patient details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication and admin status
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You must be logged in as an administrator to view
            patient details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load patient details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: PatientStatus) => {
    if (status === PatientStatus.active) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Active
        </Badge>
      );
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  const getAppointmentStatusBadge = (status: Status) => {
    if (status === Status.pending) {
      return (
        <Badge
          variant="outline"
          className="border-yellow-300 bg-yellow-50 text-yellow-800"
        >
          Pending
        </Badge>
      );
    }
    if (status === Status.confirmed) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          Confirmed
        </Badge>
      );
    }
    if (status === Status.cancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return <Badge variant="secondary">Completed</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8" style={{ color: "#FF0000" }} />
          <h1 className="text-3xl font-bold text-emerald-900">
            Patient Details
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage and view all patients who have booked appointments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Patients</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">
              {totalPatients}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Patients</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">
              {activePatients}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive Patients</CardDescription>
            <CardTitle className="text-3xl text-gray-600">
              {inactivePatients}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>
            {filteredAndSortedPatients.length} patient
            {filteredAndSortedPatients.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedPatients.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                {searchTerm
                  ? "No patients found matching your search"
                  : "No patients found"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Patients will appear here once appointments are booked"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-emerald-700"
                      >
                        Patient Name
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("appointmentCount")}
                        className="flex items-center gap-1 hover:text-emerald-700"
                      >
                        Appointments
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
                        onClick={() => handleSort("mostRecentAppointmentDate")}
                        className="flex items-center gap-1 hover:text-emerald-700"
                      >
                        Recent Visit
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                    <TableHead>Last Status</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 hover:text-emerald-700"
                      >
                        Activity
                        <ArrowUpDown
                          className="h-3 w-3"
                          style={{ color: "#FF0000" }}
                        />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPatients.map((patient, index) => (
                    <TableRow key={`${patient.name}-${index}`}>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="text-muted-foreground">
                            {patient.contactInfo.email ||
                              patient.contactInfo.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold">
                          {Number(patient.appointmentCount)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {patient.mostRecentAppointmentDate}
                      </TableCell>
                      <TableCell>
                        {getAppointmentStatusBadge(
                          patient.status as unknown as Status,
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          patient.lastVisitStatus as unknown as PatientStatus,
                        )}
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
