import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Settings, Users } from 'lucide-react';

const Dashboard = React.lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const RecoveryCenter = React.lazy(() => import('../pages/RecoveryCenter').then(m => ({ default: m.RecoveryCenter })));
const AuditTrail = React.lazy(() => import('../pages/AuditTrail').then(m => ({ default: m.AuditTrail })));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Placeholder for unbuilt pages
const PlaceholderPage = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="h-full flex items-center justify-center">
    <EmptyState
      icon={<Icon size={48} className="text-gray-600" />}
      title={title}
      description="This feature is coming soon in the next update."
    />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'recovery',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecoveryCenter />
          </Suspense>
        ),
      },
      {
        path: 'audit',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AuditTrail />
          </Suspense>
        ),
      },
      {
        path: 'customers',
        element: <PlaceholderPage title="Customers Management" icon={Users} />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" icon={Settings} />,
      },
    ],
  },
]);
