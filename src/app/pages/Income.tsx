import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface IncomeItem {
  id: number;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring: boolean;
}

const mockIncomeData: IncomeItem[] = [
  { id: 1, type: "income", category: "월세", description: "3월 월세 수입", amount: 5200000, date: "2026-03-01", isRecurring: true },
  { id: 2, type: "income", category: "관리비", description: "3월 관리비 수입", amount: 480000, date: "2026-03-01", isRecurring: true },
  { id: 3, type: "expense", category: "관리비", description: "공용 전기·수도", amount: 310000, date: "2026-03-05", isRecurring: true },
  { id: 4, type: "expense", category: "수리비", description: "3층 냉난방 수리", amount: 120000, date: "2026-03-10", isRecurring: false },
  { id: 5, type: "expense", category: "세금", description: "재산세 (월 환산)", amount: 380000, date: "2026-03-15", isRecurring: true },
  { id: 6, type: "expense", category: "대출이자", description: "은행 대출 이자", amount: 650000, date: "2026-03-01", isRecurring: true },
];

const monthlyComparison = [
  { month: "10월", income: 5450, expense: 1620, net: 3830 },
  { month: "11월", income: 5580, expense: 1680, net: 3900 },
  { month: "12월", income: 5330, expense: 1790, net: 3540 },
  { month: "1월", income: 5760, expense: 1860, net: 3900 },
  { month: "2월", income: 5680, expense: 1920, net: 3760 },
  { month: "3월", income: 5680, expense: 1460, net: 4220 },
];

export default function Income() {
  const [items] = useState<IncomeItem[]>(mockIncomeData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalIncome = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const netIncome = totalIncome - totalExpense;

  const incomeItems = items.filter((item) => item.type === "income");
  const expenseItems = items.filter((item) => item.type === "expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("항목이 등록되었습니다");
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">수익 계산</h1>
            <p className="text-gray-600">2026년 3월 수입·지출 상세 내역</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                항목 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>수입·지출 항목 추가</DialogTitle>
                <DialogDescription>
                  새로운 수입 또는 지출 항목을 등록하세요
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">유형</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">수입</SelectItem>
                      <SelectItem value="expense">지출</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">월세</SelectItem>
                      <SelectItem value="maintenance">관리비</SelectItem>
                      <SelectItem value="parking">주차비</SelectItem>
                      <SelectItem value="repair">수리비</SelectItem>
                      <SelectItem value="tax">세금</SelectItem>
                      <SelectItem value="loan">대출이자</SelectItem>
                      <SelectItem value="insurance">보험료</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Input id="description" placeholder="상세 설명" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">금액 (원)</Label>
                  <Input id="amount" type="number" placeholder="500000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">날짜</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recurring" className="size-4" />
                  <Label htmlFor="recurring" className="cursor-pointer">
                    매월 반복
                  </Label>
                </div>
                <Button type="submit" className="w-full">
                  등록하기
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="size-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">총 수입</div>
                  <div className="text-2xl text-green-600">
                    +₩{(totalIncome / 10000).toFixed(0)}만
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {incomeItems.length}개 항목
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <TrendingDown className="size-6 text-red-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">총 지출</div>
                  <div className="text-2xl text-red-600">
                    -₩{(totalExpense / 10000).toFixed(0)}만
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {expenseItems.length}개 항목
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="size-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">실수익</div>
                  <div className="text-2xl text-blue-600">
                    =₩{(netIncome / 10000).toFixed(0)}만
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                수익률 {((netIncome / totalIncome) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calculation Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>실수익 계산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">월 임대 수익 합계</span>
                <span className="text-lg text-green-600">+ ₩5,200,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">관리비 수입</span>
                <span className="text-green-600">+ ₩480,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">관리비 지출 (전기·수도·청소)</span>
                <span className="text-red-600">- ₩310,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">수리·유지보수비</span>
                <span className="text-red-600">- ₩120,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">재산세·종합소득세 (월 환산)</span>
                <span className="text-red-600">- ₩380,000</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">대출 이자 (해당 시)</span>
                <span className="text-red-600">- ₩650,000</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-lg">월 실수익</span>
                <span className="text-2xl text-green-600">= ₩4,220,000</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              ※ 실제 입력 데이터 기반 자동 계산
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>월별 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyComparison}>
                <CartesianGrid key="grid-income" strokeDasharray="3 3" />
                <XAxis key="xaxis-income" dataKey="month" />
                <YAxis key="yaxis-income" />
                <Tooltip />
                <Bar key="bar-income" dataKey="income" fill="#10b981" name="수입" />
                <Bar key="bar-expense" dataKey="expense" fill="#ef4444" name="지출" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tax Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>세금 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">주택임대소득 분리과세</span>
                <Badge className="bg-blue-100 text-blue-800">자동 판별</Badge>
              </div>
              <p className="text-xs text-gray-700">
                연 2천만원 이하 주택임대소득은 분리과세 선택 가능
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">부가가치세 (상가 임대)</span>
                <Badge className="bg-blue-100 text-blue-800">자동 계산</Badge>
              </div>
              <p className="text-xs text-gray-700">
                상가 임대 시 부가세 납부 의무 확인 필요
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">재산세 납부</span>
                <Badge className="bg-yellow-100 text-yellow-800">6월·9월</Badge>
              </div>
              <p className="text-xs text-gray-700">
                매년 7월·9월 재산세 납부 일정 자동 알림
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">종합소득세 신고</span>
                <Badge className="bg-green-100 text-green-800">5월</Badge>
              </div>
              <p className="text-xs text-gray-700">
                매년 5월 종합소득세 신고 자료 자동 생성
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Lists */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="income">수입 ({incomeItems.length})</TabsTrigger>
          <TabsTrigger value="expense">지출 ({expenseItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "income" ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        {item.type === "income" ? (
                          <TrendingUp className="size-5 text-green-600" />
                        ) : (
                          <TrendingDown className="size-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              매월 반복
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                    <div
                      className={`text-lg ${
                        item.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}₩
                      {item.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {incomeItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <TrendingUp className="size-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              매월 반복
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                    <div className="text-lg text-green-600">
                      +₩{item.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {expenseItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <TrendingDown className="size-5 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              매월 반복
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                    <div className="text-lg text-red-600">
                      -₩{item.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}