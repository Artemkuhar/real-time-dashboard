import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { AppHeader } from "./ui/components/AppHeader";

export const App = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader />
      <main className="flex-1 min-h-0 overflow-hidden">
        <DashboardPage />
      </main>
    </div>
  );
};
