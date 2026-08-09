"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Banknote, 
  Wallet, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [];

  // Add items based on role
  if (user?.role === "admin" || user?.role === "borrower") {
    menuItems.push({ href: "/dashboard", label: "My Dashboard", icon: LayoutDashboard });
  }
  
  if (user?.role === "admin" || user?.role === "sales") {
    menuItems.push({ href: "/dashboard/sales", label: "Sales (Leads)", icon: Users });
  }

  if (user?.role === "admin" || user?.role === "sanction") {
    menuItems.push({ href: "/dashboard/sanction", label: "Sanction Queue", icon: FileCheck });
  }

  if (user?.role === "admin" || user?.role === "disbursement") {
    menuItems.push({ href: "/dashboard/disbursement", label: "Disbursement", icon: Banknote });
  }

  if (user?.role === "admin" || user?.role === "collection") {
    menuItems.push({ href: "/dashboard/collection", label: "Collections", icon: Wallet });
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 text-gray-900 font-sans">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center text-sm font-semibold">LMS</div>
          System
        </h2>
        <div className="mt-4 flex flex-col">
          <span className="text-sm font-medium text-gray-900">{user?.fullName}</span>
          <span className="text-xs text-gray-600 capitalize bg-gray-200 self-start px-2 py-0.5 rounded-full mt-1 border border-gray-300">
            {user?.role} Role
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "bg-gray-200 text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon className={`mr-3 h-4 w-4 ${isActive ? "text-black" : "text-gray-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 hover:text-black transition-all"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
