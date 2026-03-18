import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Building2,
  User,
  Bell,
  Shield,
  Download,
  Upload,
  Save,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [buildingInfo, setBuildingInfo] = useState({
    name: "시그니처 빌딩",
    address: "서울시 강남구 테헤란로 123",
    totalFloors: 12,
    totalUnits: 48,
    registrationNumber: "123-45-67890",
  });

  const [ownerInfo, setOwnerInfo] = useState({
    name: "홍길동",
    phone: "010-1234-5678",
    email: "hong@example.com",
    businessNumber: "123-45-67890",
  });

  const handleSaveBuildingInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("건물 정보가 저장되었습니다");
  };

  const handleSaveOwnerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("소유자 정보가 저장되었습니다");
  };

  const handleExportData = () => {
    toast.success("데이터 내보내기를 시작합니다");
  };

  const handleImportData = () => {
    toast.info("데이터 가져오기 기능은 준비 중입니다");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">설정</h1>
        <p className="text-gray-600">앱 설정 및 정보 관리</p>
      </div>

      <Tabs defaultValue="building">
        <TabsList>
          <TabsTrigger value="building">건물 정보</TabsTrigger>
          <TabsTrigger value="owner">소유자 정보</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
          <TabsTrigger value="data">데이터 관리</TabsTrigger>
        </TabsList>

        {/* 건물 정보 */}
        <TabsContent value="building" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                <CardTitle>건물 기본 정보</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveBuildingInfo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buildingName">건물명</Label>
                    <Input
                      id="buildingName"
                      value={buildingInfo.name}
                      onChange={(e) =>
                        setBuildingInfo({ ...buildingInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">건물 등록번호</Label>
                    <Input
                      id="registrationNumber"
                      value={buildingInfo.registrationNumber}
                      onChange={(e) =>
                        setBuildingInfo({
                          ...buildingInfo,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={buildingInfo.address}
                    onChange={(e) =>
                      setBuildingInfo({ ...buildingInfo, address: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">총 층수</Label>
                    <Input
                      id="totalFloors"
                      type="number"
                      value={buildingInfo.totalFloors}
                      onChange={(e) =>
                        setBuildingInfo({
                          ...buildingInfo,
                          totalFloors: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalUnits">총 호실 수</Label>
                    <Input
                      id="totalUnits"
                      type="number"
                      value={buildingInfo.totalUnits}
                      onChange={(e) =>
                        setBuildingInfo({
                          ...buildingInfo,
                          totalUnits: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" className="gap-2">
                  <Save className="size-4" />
                  저장하기
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingType">건물 유형</Label>
                  <select
                    id="buildingType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>오피스텔</option>
                    <option>상가</option>
                    <option>주거용 빌딩</option>
                    <option>복합 건물</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completionYear">준공년도</Label>
                  <Input id="completionYear" type="number" placeholder="2020" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingSpaces">주차 대수</Label>
                  <Input id="parkingSpaces" type="number" placeholder="54" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 소유자 정보 */}
        <TabsContent value="owner" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-blue-600" />
                <CardTitle>소유자 정보</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveOwnerInfo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">이름</Label>
                    <Input
                      id="ownerName"
                      value={ownerInfo.name}
                      onChange={(e) =>
                        setOwnerInfo({ ...ownerInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessNumber">사업자등록번호</Label>
                    <Input
                      id="businessNumber"
                      value={ownerInfo.businessNumber}
                      onChange={(e) =>
                        setOwnerInfo({
                          ...ownerInfo,
                          businessNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">전화번호</Label>
                    <div className="flex gap-2">
                      <Phone className="size-5 text-gray-400 mt-2" />
                      <Input
                        id="ownerPhone"
                        value={ownerInfo.phone}
                        onChange={(e) =>
                          setOwnerInfo({ ...ownerInfo, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">이메일</Label>
                    <div className="flex gap-2">
                      <Mail className="size-5 text-gray-400 mt-2" />
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={ownerInfo.email}
                        onChange={(e) =>
                          setOwnerInfo({ ...ownerInfo, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="gap-2">
                  <Save className="size-4" />
                  저장하기
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>세무사 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taxAccountantName">세무사 이름</Label>
                  <Input id="taxAccountantName" placeholder="김세무" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxAccountantPhone">전화번호</Label>
                    <Input id="taxAccountantPhone" placeholder="02-1234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxAccountantEmail">이메일</Label>
                    <Input
                      id="taxAccountantEmail"
                      type="email"
                      placeholder="tax@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxOfficeName">세무사무소명</Label>
                  <Input id="taxOfficeName" placeholder="세무법인 ABC" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-blue-600" />
                <CardTitle>알림 채널</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="mb-1">이메일 알림</h4>
                    <p className="text-sm text-gray-600">
                      중요 알림을 이메일로 받습니다
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5" />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="mb-1">문자 알림 (SMS)</h4>
                    <p className="text-sm text-gray-600">
                      긴급 알림을 문자로 받습니다
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5" />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="mb-1">카카오톡 알림</h4>
                    <p className="text-sm text-gray-600">
                      카카오톡으로 알림을 받습니다
                    </p>
                  </div>
                  <input type="checkbox" className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>알림 항목</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">계약 만료 알림 (D-90, D-30, D-7)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">월세 미납 알림</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">월세 납입 완료 알림</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">세금 납부 알림</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">월간 수익 리포트</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="size-4" />
                  <label className="text-sm">유지보수 알림</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>알림 시간 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyReportTime">일일 리포트 발송 시간</Label>
                  <Input id="dailyReportTime" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyReportDay">주간 리포트 발송 요일</Label>
                  <select
                    id="weeklyReportDay"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option>월요일</option>
                    <option>화요일</option>
                    <option>수요일</option>
                    <option>목요일</option>
                    <option>금요일</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 데이터 관리 */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-blue-600" />
                <CardTitle>데이터 백업 및 복원</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm mb-2">자동 백업</h4>
                  <p className="text-xs text-gray-700 mb-3">
                    데이터는 매일 자동으로 백업됩니다. 최근 백업: 2026-03-17 03:00
                  </p>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="size-4" />
                    <label className="text-xs">자동 백업 활성화</label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleExportData} className="gap-2 flex-1">
                    <Download className="size-4" />
                    데이터 내보내기 (Export)
                  </Button>
                  <Button
                    onClick={handleImportData}
                    variant="outline"
                    className="gap-2 flex-1"
                  >
                    <Upload className="size-4" />
                    데이터 가져오기 (Import)
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  * 데이터는 JSON 형식으로 내보내기/가져오기됩니다
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>앱 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">버전</span>
                  <span>MVP v1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">마지막 업데이트</span>
                  <span>2026-03-17</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">데이터 저장 위치</span>
                  <span>로컬 브라우저</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">총 저장 데이터</span>
                  <span>약 2.4 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개발 로드맵</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 bg-green-600 rounded-full" />
                    <span className="text-sm font-medium">1단계 MVP (완료)</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    기본 UI/UX, 계약 관리, 납입 추적, 수익 계산, 시뮬레이션
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 bg-yellow-600 rounded-full" />
                    <span className="text-sm font-medium">2단계 고도화 (진행중)</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    AI 계약서 파싱, 세금 리포트, 통장 내역 자동 분석
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 bg-gray-400 rounded-full" />
                    <span className="text-sm font-medium">3단계 플랫폼 (예정)</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    다중 사용자, 클라우드 동기화, 모바일 앱, API 연동
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
