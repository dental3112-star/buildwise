import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home,
  AlertCircle,
  Calendar,
  CreditCard
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const stats = [
  {
    title: "월 임대 수익",
    value: "₩5,200,000",
    change: "+240,000",
    changePercent: "+4.8%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    title: "월 실수익",
    value: "₩4,220,000",
    change: "+180,000",
    changePercent: "+4.5%",
    changeType: "increase",
    icon: TrendingUp,
  },
  {
    title: "입주율",
    value: "83%",
    subtitle: "10/12 호실",
    changeType: "neutral",
    icon: Home,
  },
  {
    title: "미납 세입자",
    value: "2명",
    subtitle: "1단계 알림 발송",
    changeType: "warning",
    icon: AlertCircle,
  },
];

const monthlyRevenue = [
  { month: "10월", revenue: 3850, expenses: 1620, net: 2230 },
  { month: "11월", revenue: 4100, expenses: 1680, net: 2420 },
  { month: "12월", revenue: 4850, expenses: 1790, net: 3060 },
  { month: "1월", revenue: 4900, expenses: 1860, net: 3040 },
  { month: "2월", revenue: 5200, expenses: 1920, net: 3280 },
  { month: "3월", revenue: 5200, expenses: 980, net: 4220 },
];

const expenseBreakdown = [
  { id: "maintenance", name: "관리비 지출", value: 310000, color: "#3b82f6" },
  { id: "repair", name: "수리비", value: 120000, color: "#8b5cf6" },
  { id: "tax", name: "재산세", value: 380000, color: "#ec4899" },
  { id: "interest", name: "대출 이자", value: 650000, color: "#f59e0b" },
];

const upcomingEvents = [
  { id: 1, type: "계약 만료", title: "3층 303호 계약 만료 D-30", date: "2026-04-17", priority: "high" },
  { id: 2, type: "납부", title: "재산세 납부 예정", date: "2026-06-15", priority: "medium" },
  { id: 3, type: "계약 만료", title: "5층 502호 계약 만료 D-90", date: "2026-06-15", priority: "low" },
  { id: 4, type: "미납", title: "2층 201호 월세 미납 3일차", date: "2026-03-17", priority: "high" },
];

export default function Dashboard() {
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  const handleChartClick = (data: any) => {
    setSelectedDataPoint(data);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl mb-2">수익 대시보드</h1>
        <p className="text-sm md:text-base text-gray-600">
          빌딩 운영 현황을 한눈에 확인하세요 · 기준일: 2026년 3월 17일
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-2 rounded-lg ${
                    stat.changeType === "warning" ? "bg-red-50" : "bg-blue-50"
                  }`}>
                    <Icon className={`size-5 md:size-6 ${
                      stat.changeType === "warning" ? "text-red-600" : "text-blue-600"
                    }`} />
                  </div>
                  {stat.changePercent && (
                    <div className={`flex items-center gap-1 text-xs md:text-sm ${
                      stat.changeType === "increase" ? "text-green-600" : "text-gray-600"
                    }`}>
                      {stat.changeType === "increase" && <TrendingUp className="size-3 md:size-4" />}
                      <span>{stat.changePercent}</span>
                    </div>
                  )}
                </div>
                <div className="text-lg md:text-2xl mb-1 truncate">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 truncate">{stat.title}</div>
                {stat.change && (
                  <div className="text-xs text-green-600 mt-1 truncate">
                    전월 대비 {stat.change}
                  </div>
                )}
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 mt-1 truncate">{stat.subtitle}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">월별 수익 추이</CardTitle>
            <p className="text-xs md:text-sm text-gray-600">
              임대 수익 · 지출 · 실수익 비교 (단위: 만원)
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <LineChart 
                data={monthlyRevenue}
                onClick={handleChartClick}
              >
                <CartesianGrid key="grid-dashboard-main" strokeDasharray="3 3" />
                <XAxis key="xaxis-dashboard-main" dataKey="month" style={{ fontSize: '12px' }} />
                <YAxis key="yaxis-dashboard-main" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  key="line-revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="임대 수익"
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6, fill: "#3b82f6" }}
                />
                <Line 
                  key="line-expenses"
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="총 지출"
                  dot={{ r: 4, fill: "#ef4444" }}
                  activeDot={{ r: 6, fill: "#ef4444" }}
                />
                <Line 
                  key="line-net"
                  type="monotone" 
                  dataKey="net" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="실수익"
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
            {selectedDataPoint && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium mb-1">{selectedDataPoint.month} 상세</p>
                <div className="space-y-1 text-xs">
                  <p>수입: ₩{selectedDataPoint.revenue?.toLocaleString()}만</p>
                  <p>지출: ₩{selectedDataPoint.expenses?.toLocaleString()}만</p>
                  <p className="font-medium text-green-600">실수익: ₩{selectedDataPoint.net?.toLocaleString()}만</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">이번 달 지출 구성</CardTitle>
            <p className="text-xs md:text-sm text-gray-600">총 지출: ₩980,000</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} className="md:h-[200px]">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => window.innerWidth > 640 ? `${name} ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseBreakdown.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₩${value.toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="size-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700 truncate">{item.name}</span>
                  </div>
                  <span className="flex-shrink-0 ml-2">₩{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>중요 일정 & 알림</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    event.priority === "high"
                      ? "border-red-200 bg-red-50"
                      : event.priority === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {event.priority === "high" ? (
                      <AlertCircle className="size-5 text-red-600" />
                    ) : event.type === "계약 만료" ? (
                      <Calendar className="size-5 text-blue-600" />
                    ) : (
                      <CreditCard className="size-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={`text-xs ${
                          event.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : event.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm">{event.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>이번 달 수익 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">월 임대 수익 합계</span>
                <span className="text-lg text-green-600">+ ₩5,200,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">관리비 수입</span>
                <span className="text-green-600">+ ₩480,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">총 지출</span>
                <span className="text-red-600">- ₩980,000</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-lg">월 실수익</span>
                <span className="text-2xl text-green-600">₩4,220,000</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-5 text-blue-600" />
                  <span className="text-sm">전월 대비</span>
                </div>
                <div className="text-2xl text-blue-600">+28.6% ↑</div>
                <div className="text-xs text-gray-600 mt-1">
                  수리비 절감 효과 (+₩810,000)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}