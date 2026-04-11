import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/features/admin/layout/AdminLayout";
import { DashboardPage } from "@/features/admin/pages/DashboardPage";
import { ReservationManagePage } from "@/features/admin/pages/ReservationManagePage";
import { SlotManagePage } from "@/features/admin/pages/SlotManagePage";
import { RevenuePage } from "@/features/admin/pages/RevenuePage";
import { DataManagePage } from "@/features/admin/pages/DataManagePage";

import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminRegisterPage } from "@/features/admin/pages/AdminRegisterPage";

export const adminRoutes: RouteObject[] = [
  { path: "/admin/login", element: <AdminLoginPage /> },
  { path: "/admin/register", element: <AdminRegisterPage /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "reservations", element: <ReservationManagePage /> },
      { path: "slots", element: <SlotManagePage /> },
      { path: "revenue", element: <RevenuePage /> },
      { path: "data", element: <DataManagePage /> },
    ],
  },
];
