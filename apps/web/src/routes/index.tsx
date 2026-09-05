import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const Dashboard = React.lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const RecoveryCenter = React.lazy(() =>
  import('../pages/RecoveryCenter').then((m) => ({ default: m.RecoveryCenter }))
);
const AuditTrail = React.lazy(() => import('../pages/AuditTrail').then((m) => ({ default: m.AuditTrail })));
const Customers = React.lazy(() => import('../pages/Customers').then((m) => ({ default: m.Customers })));
const Settings = React.lazy(() => import('../pages/Settings').then((m) => ({ default: m.Settings })));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const withSuspense = (node: React.ReactNode) => <Suspense fallback={<PageLoader />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(<Dashboard />) },
      { path: 'recovery', element: withSuspense(<RecoveryCenter />) },
      { path: 'audit', element: withSuspense(<AuditTrail />) },
      { path: 'customers', element: withSuspense(<Customers />) },
      { path: 'settings', element: withSuspense(<Settings />) },
    ],
  },
]);
