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
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 text-gray-300">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">LMS</div>
          System
        </h2>
        <div className="mt-4 flex flex-col">
          <span className="text-sm font-medium text-gray-400">{user?.fullName}</span>
          <span className="text-xs text-indigo-400 capitalize bg-indigo-500/10 self-start px-2 py-0.5 rounded-full mt-1 border border-indigo-500/20">
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
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
