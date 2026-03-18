import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: number;
  tenantName: string;
  unit: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "late" | "overdue";
  daysLate?: number;
  month: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    tenantName: "김철수",
    unit: "3층 303호",
    amount: 500000,
    dueDate: "2026-03-01",
    paidDate: "2026-03-01",
    status: "paid",
    month: "2026-03",
  },
  {
    id: 2,
    tenantName: "이영희",
    unit: "5층 502호",
    amount: 450000,
    dueDate: "2026-03-01",
    paidDate: "2026-03-02",
    status: "paid",
    month: "2026-03",
  },
  {
    id: 3,
    tenantName: "박민수",
    unit: "7층 701호",
    amount: 600000,
    dueDate: "2026-03-01",
    status: "pending",
    daysLate: 2,
    month: "2026-03",
  },
  {
    id: 4,
    tenantName: "최지훈",
    unit: "4층 405호",
    amount: 550000,
    dueDate: "2026-03-01",
    paidDate: "2026-03-01",
    status: "paid",
    month: "2026-03",
  },
  {
    id: 5,
    tenantName: "정수연",
    unit: "2층 201호",
    amount: 480000,
    dueDate: "2026-03-01",
    status: "late",
    daysLate: 16,
    month: "2026-03",
  },
  {
    id: 6,
    tenantName: "강민지",
    unit: "6층 603호",
    amount: 520000,
    dueDate: "2026-03-01",
    paidDate: "2026-02-28",
    status: "paid",
    month: "2026-03",
  },
  {
    id: 7,
    tenantName: "윤태희",
    unit: "8층 801호",
    amount: 490000,
    dueDate: "2026-03-01",
    paidDate: "2026-03-03",
    status: "paid",
    month: "2026-03",
  },
  {
    id: 8,
    tenantName: "서진우",
    unit: "1층 101호",
    amount: 420000,
    dueDate: "2026-03-01",
    paidDate: "2026-03-01",
    status: "paid",
    month: "2026-03",
  },
];

export default function Payments() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const paidPayments = payments.filter((p) => p.status === "paid");
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const latePayments = payments.filter((p) => p.status === "late");

  const totalExpected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const paymentRate = ((paidPayments.length / payments.length) * 100).toFixed(1);

  const getStatusBadge = (payment: Payment) => {
    switch (payment.status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="size-3" />
            납입 완료
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="size-3" />
            미납 ({payment.daysLate}일)
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-red-100 text-red-800 gap-1">
            <AlertTriangle className="size-3" />
            지연 ({payment.daysLate}일)
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAlertLevel = (daysLate?: number) => {
    if (!daysLate) return null;
    if (daysLate >= 10) return "2단계";
    if (daysLate >= 3) return "1단계";
    return null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`${e.target.files[0].name} 파일이 선택되었습니다`);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile) {
      toast.success("통장 내역이 분석되었습니다");
      setIsDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const PaymentCard = ({ payment }: { payment: Payment }) => {
    const alertLevel = getAlertLevel(payment.daysLate);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="mb-1">{payment.tenantName}</h3>
              <p className="text-sm text-gray-600">{payment.unit}</p>
            </div>
            {getStatusBadge(payment)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">월세 금액</span>
              <span className="text-lg">₩{payment.amount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">납입 기한</span>
              <span>{payment.dueDate}</span>
            </div>

            {payment.paidDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">실제 납입일</span>
                <span className="text-green-600">{payment.paidDate}</span>
              </div>
            )}

            {payment.status !== "paid" && alertLevel && (
              <div
                className={`p-3 rounded-lg ${
                  alertLevel === "2단계" ? "bg-red-50" : "bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={
                      alertLevel === "2단계"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {alertLevel} 알림
                  </Badge>
                  <span className="text-xs text-gray-600">
                    {payment.daysLate}일 지연
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  {alertLevel === "2단계"
                    ? "내용증명 작성 가이드 확인 필요"
                    : "문자 알림 템플릿 발송 권장"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">납입 추적</h1>
            <p className="text-gray-600">2026년 3월 월세 납입 현황</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="size-4" />
                통장 내역 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>통장 내역 업로드</DialogTitle>
                <DialogDescription>
                  은행 앱에서 다운로드한 CSV/Excel 파일을 업로드하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="size-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-sm text-gray-600 mb-4">
                    CSV 또는 Excel 파일을 선택하세요
                  </div>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {selectedFile && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ {selectedFile.name}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm mb-2">자동 분석 기능</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 입금자명과 계약서 정보 자동 매칭</li>
                    <li>• 미납 세입자 자동 감지</li>
                    <li>• 납입 이력 리포트 생성</li>
                  </ul>
                </div>

                <Button
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile}
                  className="w-full"
                >
                  분석 시작
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">총 예상 수입</div>
              <div className="text-2xl">₩{(totalExpected / 10000).toFixed(0)}만</div>
              <div className="text-xs text-gray-500 mt-1">
                {payments.length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">납입 완료</div>
              <div className="text-2xl text-green-600">
                ₩{(totalReceived / 10000).toFixed(0)}만
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {paidPayments.length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">미납 금액</div>
              <div className="text-2xl text-red-600">
                ₩{((totalExpected - totalReceived) / 10000).toFixed(0)}만
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {pendingPayments.length + latePayments.length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">납입율</div>
              <div className="text-2xl text-blue-600">{paymentRate}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {paidPayments.length}/{payments.length} 완료
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Info */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm mb-3">미납 단계 알림 기준</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">1단계</Badge>
              <div>
                <div className="mb-1">납입일 +3일 초과</div>
                <div className="text-gray-600">문자 알림 템플릿 제공</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-red-100 text-red-800">2단계</Badge>
              <div>
                <div className="mb-1">납입일 +10일 초과</div>
                <div className="text-gray-600">내용증명 작성 가이드</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-red-100 text-red-800">3단계</Badge>
              <div>
                <div className="mb-1">연속 2개월 미납</div>
                <div className="text-gray-600">법적 조치 절차 안내</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            전체 ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            납입 완료 ({paidPayments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            미납 ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="late">
            지연 ({latePayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paidPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                미납 세입자 {pendingPayments.length}명
              </span>
            </div>
            <div className="text-sm text-yellow-800">
              납입일 기준 3일 이내 미납 세입자입니다. 문자 알림 발송을 권장합니다.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="late" className="space-y-4">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="size-5 text-red-600" />
              <span className="font-medium text-red-900">
                지연 납입 {latePayments.length}명
              </span>
            </div>
            <div className="text-sm text-red-800">
              납입일 기준 10일 이상 지연된 세입자입니다. 내용증명 발송을 고려하세요.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latePayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
