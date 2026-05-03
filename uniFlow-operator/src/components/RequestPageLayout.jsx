import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function RequestPageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <div className="flex-1 container lg:block flex justify-center items-center flex-col max-w-5xl mx-auto py-10 px-6">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
