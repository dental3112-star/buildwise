import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Download,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Printer,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { generatePDF, generateTaxReportPDF } from "../utils/pdfGenerator";

interface TaxPeriod {
  year: number;
  quarter?: number;
  type: "annual" | "quarterly";
}

const annualIncomeSummary = {
  year: 2025,
  totalRentalIncome: 62400000,
  maintenanceFeeIncome: 5760000,
  totalIncome: 68160000,
  maintenanceExpenses: 3720000,
  repairCosts: 1440000,
  propertyTax: 4560000,
  loanInterest: 7800000,
  insurance: 960000,
  totalExpenses: 18480000,
  netIncome: 49680000,
  necessaryExpenses: 22800000, // 60% 인정
  taxableIncome: 26880000,
  estimatedTax: 5376000, // 20% 가정
};

const quarterlyVAT = [
  {
    quarter: "2025 1분기",
    period: "2025.01 ~ 2025.03",
    rentalIncome: 15600000,
    vat: 1560000,
    status: "submitted",
    dueDate: "2025-04-25",
  },
  {
    quarter: "2025 2분기",
    period: "2025.04 ~ 2025.06",
    rentalIncome: 15600000,
    vat: 1560000,
    status: "submitted",
    dueDate: "2025-07-25",
  },
  {
    quarter: "2025 3분기",
    period: "2025.07 ~ 2025.09",
    rentalIncome: 15600000,
    vat: 1560000,
    status: "submitted",
    dueDate: "2025-10-25",
  },
  {
    quarter: "2025 4분기",
    period: "2025.10 ~ 2025.12",
    rentalIncome: 15600000,
    vat: 1560000,
    status: "pending",
    dueDate: "2026-01-25",
  },
];

const taxSchedule = [
  {
    id: 1,
    name: "종합소득세 신고",
    period: "전년도 소득",
    dueDate: "매년 5월 31일",
    status: "upcoming",
    description: "임대소득 포함 전체 소득 신고",
  },
  {
    id: 2,
    name: "부가가치세 신고",
    period: "분기별",
    dueDate: "1·4·7·10월 25일",
    status: "recurring",
    description: "상가 임대 시 부가세 신고 (간이과세자 제외)",
  },
  {
    id: 3,
    name: "재산세 납부",
    period: "연 2회",
    dueDate: "7월·9월",
    status: "recurring",
    description: "7월(주택/건축물 1/2), 9월(나머지 1/2)",
  },
  {
    id: 4,
    name: "종합부동산세",
    period: "연 1회",
    dueDate: "12월 15일",
    status: "recurring",
    description: "공시가격 합산 6억 초과 시",
  },
];

export default function TaxReport() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = async (type: string) => {
    setIsGenerating(true);
    try {
      if (type === "전체") {
        await generatePDF("tax-report-content", `세금리포트_전체_${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (type === "종합소득세") {
        await generateTaxReportPDF(annualIncomeSummary);
      } else {
        await generatePDF("tax-report-content", `${type}_리포트_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      toast.success(`${type} 리포트가 다운로드되었습니다`);
    } catch (error) {
      toast.error("PDF 생성 중 오류가 발생했습니다");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2">세금 리포트</h1>
            <p className="text-sm md:text-base text-gray-600">종합소득세 및 부가세 신고 자료</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2 flex-1 sm:flex-initial">
              <Printer className="size-4" />
              <span className="hidden sm:inline">인쇄</span>
            </Button>
            <Button 
              onClick={() => handleDownloadReport("전체")} 
              className="gap-2 flex-1 sm:flex-initial"
              disabled={isGenerating}
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">PDF 다운로드</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 truncate">연간 총수입</div>
                  <div className="text-base md:text-xl truncate">₩{(annualIncomeSummary.totalIncome / 10000).toFixed(0)}만</div>
                </div>
                <TrendingUp className="size-6 md:size-8 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 truncate">필요경비</div>
                  <div className="text-base md:text-xl truncate">₩{(annualIncomeSummary.necessaryExpenses / 10000).toFixed(0)}만</div>
                </div>
                <DollarSign className="size-6 md:size-8 text-blue-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 truncate">과세표준</div>
                  <div className="text-base md:text-xl truncate">₩{(annualIncomeSummary.taxableIncome / 10000).toFixed(0)}만</div>
                </div>
                <FileText className="size-6 md:size-8 text-orange-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 truncate">예상 세액</div>
                  <div className="text-base md:text-xl text-red-600 truncate">₩{(annualIncomeSummary.estimatedTax / 10000).toFixed(0)}만</div>
                </div>
                <AlertCircle className="size-6 md:size-8 text-red-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="tax-report-content">
        <Tabs defaultValue="income-tax">
          <TabsList>
            <TabsTrigger value="income-tax">종합소득세</TabsTrigger>
            <TabsTrigger value="vat">부가가치세</TabsTrigger>
            <TabsTrigger value="schedule">세금 일정</TabsTrigger>
          </TabsList>

          {/* 종합소득세 */}
          <TabsContent value="income-tax" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>2025년 종합소득세 신고 자료</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      신고기간: 2026년 5월 1일 ~ 5월 31일
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Calendar className="size-3 mr-1" />
                    신고 예정
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm mb-3">수입 내역</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">월세 수입</span>
                        <span>₩{annualIncomeSummary.totalRentalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">관리비 수입</span>
                        <span>₩{annualIncomeSummary.maintenanceFeeIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="font-medium">총 수입</span>
                        <span className="font-medium">₩{annualIncomeSummary.totalIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="text-sm mb-3">필요경비 내역</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">관리비 지출</span>
                        <span>₩{annualIncomeSummary.maintenanceExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">수리·유지비</span>
                        <span>₩{annualIncomeSummary.repairCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">재산세</span>
                        <span>₩{annualIncomeSummary.propertyTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">대출 이자</span>
                        <span>₩{annualIncomeSummary.loanInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">보험료</span>
                        <span>₩{annualIncomeSummary.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-red-200">
                        <span className="font-medium">총 필요경비 (실제)</span>
                        <span className="font-medium">₩{annualIncomeSummary.totalExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-blue-700">
                        <span>필요경비 (60% 인정)</span>
                        <span>₩{annualIncomeSummary.necessaryExpenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm mb-3">과세표준 및 세액</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">총 수입</span>
                        <span>₩{annualIncomeSummary.totalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">필요경비 (60%)</span>
                        <span className="text-red-600">-₩{annualIncomeSummary.necessaryExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-green-200">
                        <span className="font-medium">과세표준</span>
                        <span className="font-medium">₩{annualIncomeSummary.taxableIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg pt-2 border-t border-green-200">
                        <span className="font-medium">예상 세액 (20%)</span>
                        <span className="font-medium text-red-600">₩{annualIncomeSummary.estimatedTax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="mb-2">
                          <strong>주택임대소득 분리과세 안내</strong>
                        </p>
                        <ul className="space-y-1 text-xs">
                          <li>• 연 2천만원 이하: 14% 분리과세 선택 가능 (건강보험료 미반영)</li>
                          <li>• 연 2천만원 초과: 종합소득세 합산 과세</li>
                          <li>• 필요경비: 실제 지출 증빙 또는 60% 인정 중 선택</li>
                          <li>• 본 자료는 참고용이며, 정확한 신고는 세무사와 상담 권장</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>절세 전략</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="mb-1">필요경비 증빙 철저히</h4>
                      <p className="text-sm text-gray-700">
                        수리비, 관리비 등 모든 지출 영수증 보관. 실제 지출이 60%보다 많으면 증빙으로 신고
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="mb-1">분리과세 vs 종합과세 비교</h4>
                      <p className="text-sm text-gray-700">
                        다른 소득이 많으면 14% 분리과세가 유리할 수 있음. 세무사 상담 권장
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="mb-1">등록임대사업자 혜택 검토</h4>
                      <p className="text-sm text-gray-700">
                        장기임대 등록 시 세금 감면 혜택. 단, 의무 준수사항 확인 필요
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 부가가치세 */}
          <TabsContent value="vat" className="space-y-6 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-2">
                    <strong>부가가치세 신고 대상</strong>
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• 상가·사무실 임대: 부가세 신고 의무 (일반과세자/간이과세자)</li>
                    <li>• 주택 임대: 부가세 신고 제외</li>
                    <li>• 간이과세자: 연 매출 8천만원 미만 (세율 1.5~4%)</li>
                    <li>• 일반과세자: 연 매출 8천만원 이상 (세율 10%)</li>
                  </ul>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>2025년 부가가치세 신고 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quarterlyVAT.map((quarter, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          quarter.status === "submitted" ? "bg-green-50" : "bg-yellow-50"
                        }`}>
                          {quarter.status === "submitted" ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : (
                            <Clock className="size-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{quarter.quarter}</span>
                            <Badge variant="outline" className="text-xs">
                              {quarter.period}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            신고마감: {quarter.dueDate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">부가세</div>
                        <div className="text-lg">₩{quarter.vat.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">2025년 연간 부가세 합계</span>
                    <span className="text-xl text-red-600">
                      ₩{(quarterlyVAT.reduce((sum, q) => sum + q.vat, 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>부가세 신고 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm mb-2">신고 일정</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 1기 예정: 4월 25일 (1~3월)</li>
                      <li>• 1기 확정: 7월 25일 (4~6월)</li>
                      <li>• 2기 예정: 10월 25일 (7~9월)</li>
                      <li>• 2기 확정: 다음해 1월 25일 (10~12월)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm mb-2">간이과세자 특례</h4>
                    <p className="text-sm text-gray-700">
                      연 매출 4,800만원 미만 간이과세자는 1년에 1번만 신고 (1월)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 세금 일정 */}
          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>연간 세금 일정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taxSchedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`p-2 rounded-lg ${
                        item.status === "upcoming" ? "bg-yellow-50" : "bg-blue-50"
                      }`}>
                        <Calendar className={`size-5 ${
                          item.status === "upcoming" ? "text-yellow-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.period}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="size-4 text-gray-400" />
                          <span className="text-gray-600">마감: {item.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>세무사 공유 자료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleDownloadReport("종합소득세")}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>종합소득세 신고 자료</span>
                    </div>
                    <Download className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleDownloadReport("부가가치세")}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>부가가치세 신고 자료</span>
                    </div>
                    <Download className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleDownloadReport("연간 수입·지출")}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4" />
                      <span>연간 수입·지출 내역</span>
                    </div>
                    <Download className="size-4" />
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
                  위 자료를 세무사에게 공유하여 정확한 세금 신고를 진행하세요
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}