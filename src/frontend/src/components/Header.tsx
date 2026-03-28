import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  History,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetNewAppointmentsCount } from "../hooks/useQueries";

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: newAppointmentsCount } = useGetNewAppointmentsCount();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";
  const authText =
    loginStatus === "logging-in"
      ? "Logging in..."
      : isAuthenticated
        ? "Logout"
        : "Login";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleDashboardClick = () => {
    navigate({ to: "/admin/dashboard" });
    setIsOpen(false);
  };

  const handleNotificationClick = () => {
    navigate({ to: "/admin/appointments" });
    setIsOpen(false);
  };

  const handleHistoryClick = () => {
    navigate({ to: "/admin/appointment-history" });
    setIsOpen(false);
  };

  const handlePatientsClick = () => {
    navigate({ to: "/admin/patients" });
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    navigate({ to: "/admin/settings" });
    setIsOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/appointments", label: "Appointments" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200 bg-emerald-700 backdrop-blur supports-[backdrop-filter]:bg-emerald-700/95">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/dr-brc-logo-transparent.dim_200x200.png"
            alt="Dr BRC Logo"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-white">Dr BRC Clinician</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors hover:opacity-80 active:opacity-80 focus:opacity-80"
              style={{ color: "#FF0000" }}
              activeProps={{
                className:
                  "font-semibold underline decoration-2 underline-offset-4",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Admin Icons and Auth Button */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              {/* My Dashboard Button */}
              <button
                type="button"
                onClick={handleDashboardClick}
                className="hidden flex-col items-center gap-0.5 rounded-lg p-2 transition-opacity hover:opacity-80 active:opacity-80 lg:flex"
                aria-label="My Dashboard"
              >
                <LayoutDashboard
                  className="h-5 w-5"
                  style={{ color: "#FF0000" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#FF0000" }}
                >
                  My Dashboard
                </span>
              </button>

              {/* Settings Icon */}
              <button
                type="button"
                onClick={handleSettingsClick}
                className="hidden flex-col items-center gap-0.5 rounded-lg p-2 transition-opacity hover:opacity-80 active:opacity-80 lg:flex"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" style={{ color: "#FF0000" }} />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#FF0000" }}
                >
                  Settings
                </span>
              </button>

              {/* Patients Details Icon */}
              <button
                type="button"
                onClick={handlePatientsClick}
                className="hidden flex-col items-center gap-0.5 rounded-lg p-2 transition-opacity hover:opacity-80 active:opacity-80 lg:flex"
                aria-label="Patients Details"
              >
                <Users className="h-5 w-5" style={{ color: "#FF0000" }} />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#FF0000" }}
                >
                  Patients
                </span>
              </button>

              {/* Appointment History Icon */}
              <button
                type="button"
                onClick={handleHistoryClick}
                className="hidden flex-col items-center gap-0.5 rounded-lg p-2 transition-opacity hover:opacity-80 active:opacity-80 lg:flex"
                aria-label="Appointment History"
              >
                <History className="h-5 w-5" style={{ color: "#FF0000" }} />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#FF0000" }}
                >
                  History
                </span>
              </button>

              {/* Notification Bell Icon */}
              <button
                type="button"
                onClick={handleNotificationClick}
                className="hidden flex-col items-center gap-0.5 rounded-lg p-2 transition-opacity hover:opacity-80 active:opacity-80 lg:flex"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell className="h-5 w-5" style={{ color: "#FF0000" }} />
                  {newAppointmentsCount && Number(newAppointmentsCount) > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {Number(newAppointmentsCount)}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "#FF0000" }}
                >
                  Appointments
                </span>
              </button>
            </>
          )}

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? "outline" : "default"}
            className={
              isAuthenticated
                ? "border-white text-white hover:bg-emerald-600"
                : "bg-white text-emerald-700 hover:bg-emerald-50"
            }
          >
            {authText}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-emerald-600 active:bg-emerald-600"
              >
                <Menu className="h-6 w-6" style={{ color: "#FF0000" }} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:opacity-80 active:opacity-80"
                    style={{ color: "#FF0000" }}
                    activeProps={{ className: "font-semibold" }}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <div className="my-2 border-t border-gray-200" />
                    <button
                      type="button"
                      onClick={handleDashboardClick}
                      className="flex items-center gap-2 text-left text-lg font-medium transition-opacity hover:opacity-80 active:opacity-80"
                      style={{ color: "#FF0000" }}
                    >
                      <LayoutDashboard
                        className="h-5 w-5"
                        style={{ color: "#FF0000" }}
                      />
                      My Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleSettingsClick}
                      className="flex items-center gap-2 text-left text-lg font-medium transition-opacity hover:opacity-80 active:opacity-80"
                      style={{ color: "#FF0000" }}
                    >
                      <Settings
                        className="h-5 w-5"
                        style={{ color: "#FF0000" }}
                      />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={handlePatientsClick}
                      className="flex items-center gap-2 text-left text-lg font-medium transition-opacity hover:opacity-80 active:opacity-80"
                      style={{ color: "#FF0000" }}
                    >
                      <Users className="h-5 w-5" style={{ color: "#FF0000" }} />
                      Patients
                    </button>
                    <button
                      type="button"
                      onClick={handleHistoryClick}
                      className="flex items-center gap-2 text-left text-lg font-medium transition-opacity hover:opacity-80 active:opacity-80"
                      style={{ color: "#FF0000" }}
                    >
                      <History
                        className="h-5 w-5"
                        style={{ color: "#FF0000" }}
                      />
                      History
                    </button>
                    <button
                      type="button"
                      onClick={handleNotificationClick}
                      className="flex items-center gap-2 text-left text-lg font-medium transition-opacity hover:opacity-80 active:opacity-80"
                      style={{ color: "#FF0000" }}
                    >
                      <Bell className="h-5 w-5" style={{ color: "#FF0000" }} />
                      Appointments
                      {newAppointmentsCount &&
                        Number(newAppointmentsCount) > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {Number(newAppointmentsCount)}
                          </span>
                        )}
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
