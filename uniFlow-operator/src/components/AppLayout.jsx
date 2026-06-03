import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full h-dvh">
        <AppHeader />
        <main className="flex-1 flex bg-background flex-col min-h-0 overflow-hidden">
          <SidebarTrigger />
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
