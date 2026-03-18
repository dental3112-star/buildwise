import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "contract" | "payment" | "tax" | "maintenance" | "system";
  title: string;
  message: string;
  date: string;
  priority: "high" | "medium" | "low";
  isRead: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "contract",
    title: "계약 만료 임박 (D-30)",
    message: "3층 303호 김철수님의 계약이 30일 후 만료됩니다. 갱신 의사 확인이 필요합니다.",
    date: "2026-03-17 09:00",
    priority: "high",
    isRead: false,
    actionUrl: "/contracts",
  },
  {
    id: 2,
    type: "payment",
    title: "월세 미납 감지",
    message: "2층 201호 정수연님의 3월 월세가 미납되었습니다. (3일 경과)",
    date: "2026-03-17 08:30",
    priority: "high",
    isRead: false,
    actionUrl: "/payments",
  },
  {
    id: 3,
    type: "tax",
    title: "종합소득세 신고 안내",
    message: "2025년 종합소득세 신고 기간이 2개월 앞으로 다가왔습니다. (5월 1일~31일)",
    date: "2026-03-15 10:00",
    priority: "medium",
    isRead: false,
    actionUrl: "/tax-report",
  },
  {
    id: 4,
    type: "payment",
    title: "월세 납입 완료",
    message: "5층 502호 이영희님의 3월 월세가 납입되었습니다. (₩450,000)",
    date: "2026-03-02 14:20",
    priority: "low",
    isRead: true,
  },
  {
    id: 5,
    type: "contract",
    title: "신규 계약 등록 완료",
    message: "8층 801호 신규 임차인 계약이 등록되었습니다.",
    date: "2026-03-01 11:15",
    priority: "low",
    isRead: true,
  },
  {
    id: 6,
    type: "payment",
    title: "월세 지연 납입 (2단계)",
    message: "2층 201호 정수연님의 월세가 10일 이상 지연되었습니다. 내용증명 발송을 검토하세요.",
    date: "2026-03-16 09:00",
    priority: "high",
    isRead: false,
    actionUrl: "/payments",
  },
  {
    id: 7,
    type: "tax",
    title: "부가가치세 신고 완료",
    message: "2025년 4분기 부가가치세 신고가 완료되었습니다.",
    date: "2026-01-25 16:30",
    priority: "low",
    isRead: true,
  },
  {
    id: 8,
    type: "system",
    title: "월간 수익 리포트 생성",
    message: "2026년 2월 월간 수익 리포트가 생성되었습니다. 실수익 ₩3,280,000",
    date: "2026-03-01 00:00",
    priority: "low",
    isRead: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const filteredNotifications =
    filter === "unread" ? unreadNotifications : notifications;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "contract":
        return <FileText className="size-5 text-blue-600" />;
      case "payment":
        return <CreditCard className="size-5 text-green-600" />;
      case "tax":
        return <Calendar className="size-5 text-orange-600" />;
      case "maintenance":
        return <AlertTriangle className="size-5 text-yellow-600" />;
      case "system":
        return <Bell className="size-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">긴급</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">중요</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">일반</Badge>;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast.success("모든 알림을 읽음으로 표시했습니다");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success("알림이 삭제되었습니다");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">알림 센터</h1>
            <p className="text-gray-600">
              총 {notifications.length}개의 알림 ·{" "}
              <span className="text-red-600">읽지 않음 {unreadNotifications.length}개</span>
            </p>
          </div>
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <CheckCircle className="size-4" />
            모두 읽음 표시
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">
              전체 ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              읽지 않음 ({unreadNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-6">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="size-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">알림이 없습니다</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`hover:shadow-lg transition-shadow ${
                    !notification.isRead ? "border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${
                        !notification.isRead ? "bg-blue-50" : "bg-gray-50"
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <div className="size-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {notification.date}
                          </span>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                읽음 표시
                              </Button>
                            )}
                            {notification.actionUrl && (
                              <Button size="sm" asChild>
                                <a href={notification.actionUrl}>바로가기</a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3 mt-6">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="size-12 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">모든 알림을 확인했습니다</p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            {getPriorityBadge(notification.priority)}
                            <div className="size-2 bg-blue-600 rounded-full" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {notification.date}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              읽음 표시
                            </Button>
                            {notification.actionUrl && (
                              <Button size="sm" asChild>
                                <a href={notification.actionUrl}>바로가기</a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Settings */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-600" />
                <div>
                  <h4 className="mb-1">이메일 알림</h4>
                  <p className="text-sm text-gray-600">
                    중요 알림을 이메일로 받습니다
                  </p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="size-5 text-gray-600" />
                <div>
                  <h4 className="mb-1">문자 알림</h4>
                  <p className="text-sm text-gray-600">
                    긴급 알림을 문자로 받습니다
                  </p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-gray-600" />
                <div>
                  <h4 className="mb-1">푸시 알림</h4>
                  <p className="text-sm text-gray-600">
                    브라우저 푸시 알림을 받습니다
                  </p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="size-5" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm mb-3">알림 종류별 설정</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="size-4" />
                <label>계약 만료 알림 (D-90, D-30, D-7)</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="size-4" />
                <label>월세 미납 알림</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="size-4" />
                <label>세금 납부 알림</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="size-4" />
                <label>월간 수익 리포트</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
