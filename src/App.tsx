import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "@/store/AppStore";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Assessment from "@/pages/Assessment";
import Documents from "@/pages/Documents";
import Analysis from "@/pages/Analysis";
import Lenders from "@/pages/Lenders";
import Coach from "@/pages/Coach";
import Payment from "@/pages/Payment";
import PackagePage from "@/pages/Package";
import NotFound from "@/pages/NotFound";

function ProtectedLayout() {
  const { state } = useApp();
  if (!state.user) return <Navigate to="/auth" replace />;
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/assessment" element={<Assessment />} />
            <Route path="/app/documents" element={<Documents />} />
            <Route path="/app/analysis" element={<Analysis />} />
            <Route path="/app/lenders" element={<Lenders />} />
            <Route path="/app/coach" element={<Coach />} />
            <Route path="/app/payment" element={<Payment />} />
            <Route path="/app/package" element={<PackagePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
