import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
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
  Plus,
  FileText,
  Calendar,
  AlertTriangle,
  Upload,
  User,
  Building,
  DollarSign,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import * as api from "../utils/api";

interface Contract {
  id: string;
  roomNumber: string;
  tenant: string;
  contact: string;
  deposit: number;
  monthlyRent: number;
  maintenanceFee: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt?: string;
}

const DEMO_CONTRACTS: Contract[] = [
  { id: "c1", roomNumber: "201", tenant: "김철수", contact: "010-1234-5678", deposit: 10000000, monthlyRent: 500000, maintenanceFee: 50000, startDate: "2025-01-01", endDate: "2027-01-01", status: "active" },
  { id: "c2", roomNumber: "301", tenant: "이영희", contact: "010-2345-6789", deposit: 15000000, monthlyRent: 650000, maintenanceFee: 60000, startDate: "2024-06-01", endDate: "2026-06-01", status: "active" },
  { id: "c3", roomNumber: "401", tenant: "박민준", contact: "010-3456-7890", deposit: 12000000, monthlyRent: 580000, maintenanceFee: 55000, startDate: "2025-03-01", endDate: "2027-03-01", status: "active" },
  { id: "c4", roomNumber: "502", tenant: "최수진", contact: "010-4567-8901", deposit: 8000000, monthlyRent: 420000, maintenanceFee: 45000, startDate: "2024-09-01", endDate: "2026-09-01", status: "expiring" },
];

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api.getContracts();
        setContracts(response.contracts || []);
      } catch (error: any) {
        if (error.message === 'DEMO_MODE') {
          setContracts(DEMO_CONTRACTS);
          return;
        }
        console.error("Failed to fetch contracts:", error);
        toast.error("계약 정보를 가져오는 데 실패했습니다");
        setContracts(DEMO_CONTRACTS);
      }
    };

    fetchContracts();
  }, []);

  // Calculate days until expiry for each contract
  const contractsWithDays = contracts.map(contract => {
    const daysUntilExpiry = Math.ceil(
      (new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return { ...contract, daysUntilExpiry };
  });

  // Filter contracts by status
  const activeContracts = contractsWithDays.filter(c => c.daysUntilExpiry > 90);
  const expiringSoon = contractsWithDays.filter(c => c.daysUntilExpiry > 0 && c.daysUntilExpiry <= 90);
  const expiringCritical = contractsWithDays.filter(c => c.daysUntilExpiry <= 0);

  const getStatusBadge = (contract: Contract) => {
    const daysUntilExpiry = new Date(contract.endDate).getTime() - new Date().getTime();
    const days = Math.ceil(daysUntilExpiry / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return <Badge className="bg-red-100 text-red-800">만료됨</Badge>;
    } else if (days <= 30) {
      return <Badge className="bg-red-100 text-red-800">D-{days}</Badge>;
    } else if (days <= 90) {
      return <Badge className="bg-yellow-100 text-yellow-800">D-{days}</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">정상</Badge>;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`${e.target.files[0].name} 파일이 선택되었습니다`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("계약이 등록되었습니다");
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const ContractCard = ({ contract }: { contract: Contract & { daysUntilExpiry: number } }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg">{contract.tenant}</CardTitle>
              {getStatusBadge(contract)}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="size-4" />
              <span>{contract.roomNumber}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">보증금</div>
              <div className="text-lg">₩{(contract.deposit / 10000).toFixed(0)}만</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">월세</div>
              <div className="text-lg">₩{contract.monthlyRent.toLocaleString()}</div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">계약 기간</span>
              <span className="text-gray-900">{contract.endDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="size-3" />
              {contract.startDate} ~ {contract.endDate}
            </div>
          </div>
          {contract.daysUntilExpiry <= 90 && (
            <div className={`p-3 rounded-lg ${
              contract.daysUntilExpiry <= 30 ? "bg-red-50" : "bg-yellow-50"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`size-4 ${
                  contract.daysUntilExpiry <= 30 ? "text-red-600" : "text-yellow-600"
                }`} />
                <span className={`text-sm ${
                  contract.daysUntilExpiry <= 30 ? "text-red-900" : "text-yellow-900"
                }`}>
                  {contract.daysUntilExpiry <= 0
                    ? "계약 만료됨 - 즉시 조치 필요"
                    : contract.daysUntilExpiry <= 30
                    ? "계약 갱신 또는 퇴거 확정 필요"
                    : "재계약 협의 시작 권장"}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">계약 관리</h1>
            <p className="text-gray-600">전체 {contracts.length}건의 계약</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                신규 계약 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>신규 계약 등록</DialogTitle>
                <DialogDescription>
                  임대차 계약 정보를 입력하거나 PDF 계약서를 업로드하세요
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="size-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-3">
                    PDF 계약서를 업로드하면 AI가 자동으로 정보를 추출합니다
                  </div>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  {selectedFile && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ {selectedFile.name}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    * AI 파싱 기능은 2단계 고도화 예정
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-600 mb-4">또는 직접 입력</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenantName">임차인명</Label>
                      <Input id="tenantName" placeholder="홍길동" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">호실</Label>
                      <Input id="unit" placeholder="3층 303호" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deposit">보증금 (원)</Label>
                      <Input id="deposit" type="number" placeholder="30000000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">월세 (원)</Label>
                      <Input id="monthlyRent" type="number" placeholder="500000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">계약 시작일</Label>
                      <Input id="startDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">계약 종료일</Label>
                      <Input id="endDate" type="date" required />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  계약 등록하기
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">전체 계약</div>
                  <div className="text-2xl">{contracts.length}</div>
                </div>
                <FileText className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">정상 계약</div>
                  <div className="text-2xl text-green-600">{activeContracts.length}</div>
                </div>
                <Clock className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">3개월 내 만료</div>
                  <div className="text-2xl text-yellow-600">{expiringSoon.length}</div>
                </div>
                <AlertTriangle className="size-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">만료됨</div>
                  <div className="text-2xl text-red-600">{expiringCritical.length}</div>
                </div>
                <AlertTriangle className="size-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">전체 ({contracts.length})</TabsTrigger>
          <TabsTrigger value="active">정상 ({activeContracts.length})</TabsTrigger>
          <TabsTrigger value="expiring">만료 예정 ({expiringSoon.length})</TabsTrigger>
          <TabsTrigger value="expired">만료됨 ({expiringCritical.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contractsWithDays.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">만료 알림 타임라인</span>
            </div>
            <div className="text-sm text-yellow-800 space-y-1">
              <div>• D-90: 재계약 협의 시작 권장 (세입자 갱신 의사 확인)</div>
              <div>• D-30: 계약 갱신 또는 퇴거 확정 필요</div>
              <div>• D-7: 최종 확인 알림</div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expiringSoon.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-5 text-red-600" />
              <span className="font-medium text-red-900">즉시 조치 필요</span>
            </div>
            <div className="text-sm text-red-800">
              계약이 만료된 호실입니다. 갱신 계약서 등록 또는 공실 전환 처리가 필요합니다.
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expiringCritical.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}