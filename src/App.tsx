import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/Hero";
import NewsSection from "./components/NewsSection";
import GuideSection from "./components/GuideSection";
import DownloadSection from "./components/DownloadSection";
import TopupSection from "./components/TopupSection";
import LiveActivity from "./components/LiveActivity";
import Leaderboard from "./components/Leaderboard";

import { AuthProvider } from "./hooks/useAuth";
import { useDashboard } from "./hooks/useDashboard";

import TransactionHistory from "./components/TransactionHistory";

function AppContent() {
  const { data: dashboard, loading: dashboardLoading } = useDashboard();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8">
          <Hero stats={dashboard.stats} loading={dashboardLoading} />
          <NewsSection />
          <GuideSection />
          <DownloadSection />
          <TransactionHistory />
        </div>
        <aside className="space-y-8">
          <TopupSection />
          <Leaderboard data={dashboard.leaderboard} loading={dashboardLoading} />
        </aside>
      </main>
      <LiveActivity activities={dashboard.activities} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
