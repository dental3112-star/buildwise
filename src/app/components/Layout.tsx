import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  DollarSign,
  TrendingUp,
  Building2,
  Menu,
  FileBarChart,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  FileSearch,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";

const menuItems = [
  { path: "/", label: "수익 대시보드", icon: LayoutDashboard },
  { path: "/contracts", label: "계약 관리", icon: FileText },
  { path: "/payments", label: "납입 추적", icon: CreditCard },
  { path: "/income", label: "수익 계산", icon: DollarSign },
  { path: "/simulation", label: "운영 시뮬레이션", icon: TrendingUp },
  { path: "/tax-report", label: "세금 리포트", icon: FileBarChart },
  { path: "/documents", label: "AI 문서 분석", icon: FileSearch },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const unreadNotifications = 4; // Mock data

  // Check if user is logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    toast.success("로그아웃되었습니다");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Building2 className="size-8 text-blue-600" />
              <div>
                <div className="font-bold text-lg">빌딩 수익 관리</div>
                <div className="text-xs text-gray-500">Revenue Manager</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="size-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Link
              to="/notifications"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative",
                location.pathname === "/notifications"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Bell className="size-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm">알림 센터</span>}
              {unreadNotifications > 0 && (
                <Badge className="absolute top-2 left-8 bg-red-500 text-white size-5 flex items-center justify-center p-0 text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === "/settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <SettingsIcon className="size-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm">설정</span>}
            </Link>
          </div>
        </nav>

        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 mb-1">MVP 버전</div>
              <div className="text-sm mb-2">빌딩 관리의 새로운 시작</div>
              <div className="text-xs text-gray-600">1단계 기능 제공 중</div>
            </div>
          </div>
        )}
        
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white"
            >
              <LogOut className="size-5 flex-shrink-0" />
              로그아웃
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}