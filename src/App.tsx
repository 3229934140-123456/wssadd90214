import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { LeadPool } from "@/pages/LeadPool";
import { ConversationPage } from "@/pages/Conversation";
import { Customers } from "@/pages/Customers";
import { Appointments } from "@/pages/Appointments";
import { QualityReview } from "@/pages/Quality";
import { Dashboard } from "@/pages/Dashboard";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadPool />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadPool />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/conversation"
          element={
            <ProtectedRoute>
              <Layout>
                <ConversationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quality"
          element={
            <ProtectedRoute>
              <Layout>
                <QualityReview />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
