import Dashboard from "@/components/Dashboard.jsx";
import AppHeader from "@/components/AppHeader.jsx";
import AppFooter from "@/components/AppFooter.jsx";

function DashboardRoute() {
  return (
    <div className="bg-background flex flex-col w-full h-dvh">
      <AppHeader />
      <div className="flex-1 min-h-0 overflow-hidden">
        <Dashboard />
      </div>
      <AppFooter />
    </div>
  );
}

export default DashboardRoute;
