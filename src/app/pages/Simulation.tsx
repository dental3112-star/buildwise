import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Home,
  Wrench,
  TrendingUp,
  Scale,
  DoorOpen,
  Cloud,
  AlertTriangle,
  Play,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Scenario {
  id: string;
  title: string;
  icon: any;
  description: string;
  impact: string;
  solution: string;
}

const scenarios: Scenario[] = [
  {
    id: "vacancy",
    title: "공실 발생",
    icon: Home,
    description: "공실 기간 수익 자동 차감 → 최소 필요 납입 호실 수 계산",
    impact: "공실률 20% 시 월 실수익 약 -₩1,040,000 감소",
    solution: "공실 기간 기준 수리·리모델링 적정 예산 가이드 제공",
  },
  {
    id: "repair",
    title: "수리비 급증",
    icon: Wrench,
    description: "월 리비가 임대 수익의 15% 초과 시 경고",
    impact: "수리비 ₩780,000 초과 시 수익성 저하 경고",
    solution: "보수 vs 리모델링 손익분기 계산 제공",
  },
  {
    id: "interest",
    title: "금리 인상",
    icon: TrendingUp,
    description: "대출 이자 변동 입력 시 실수익 재계산",
    impact: "금리 1% 인상 시 월 이자 약 +₩83,000 증가",
    solution: "임대료 조정 필요 금액 자동 안내",
  },
  {
    id: "tax",
    title: "세법 변경",
    icon: Scale,
    description: "임대소득세율 변경 시 영향 시뮬레이션",
    impact: "세율 변경 시 연간 납부세액 자동 재계산",
    solution: "절세 전략 (필요경비 최대화) 안내",
  },
  {
    id: "dispute",
    title: "세입자 분쟁",
    icon: DoorOpen,
    description: "미납·퇴거 거부·원상복구 분쟁 단계별 대응",
    impact: "법적 비용 및 공실 기간 비용 추정",
    solution: "내용증명 템플릿 자동 생성 및 법적 절차 안내",
  },
  {
    id: "disaster",
    title: "재해·화재",
    icon: Cloud,
    description: "건물 보험 정보 등록 및 보험료 관리",
    impact: "재해 발생 시 복구 비용 추정",
    solution: "보험 청구 절차 안내 및 체크리스트",
  },
];

const baselineData = [
  { month: "4월", baseline: 4220, scenario: 4220 },
  { month: "5월", baseline: 4220, scenario: 4220 },
  { month: "6월", baseline: 4220, scenario: 4220 },
  { month: "7월", baseline: 4220, scenario: 4220 },
  { month: "8월", baseline: 4220, scenario: 4220 },
  { month: "9월", baseline: 4220, scenario: 4220 },
];

export default function Simulation() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [vacancyRate, setVacancyRate] = useState([20]);
  const [repairCost, setRepairCost] = useState([780000]);
  const [interestRate, setInterestRate] = useState([1]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSimulationData = () => {
    if (!selectedScenario) return baselineData;

    switch (selectedScenario) {
      case "vacancy":
        const vacancyImpact = (5200000 * vacancyRate[0]) / 100;
        return baselineData.map((d) => ({
          ...d,
          scenario: Math.round(d.baseline - vacancyImpact / 10000),
        }));
      case "repair":
        return baselineData.map((d, i) => ({
          ...d,
          scenario: Math.round(d.baseline - (i % 2 === 0 ? repairCost[0] / 10000 : 0)),
        }));
      case "interest":
        const interestImpact = (10000000 * interestRate[0]) / 100 / 12;
        return baselineData.map((d) => ({
          ...d,
          scenario: Math.round(d.baseline - interestImpact / 10000),
        }));
      default:
        return baselineData;
    }
  };

  const simulationData = getSimulationData();

  const ScenarioCard = ({ scenario }: { scenario: Scenario }) => {
    const Icon = scenario.icon;
    const isSelected = selectedScenario === scenario.id;

    return (
      <Card
        className={`cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-blue-600 shadow-lg" : "hover:shadow-lg"
        }`}
        onClick={() => setSelectedScenario(scenario.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                isSelected ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <Icon
                className={`size-6 ${
                  isSelected ? "text-blue-600" : "text-gray-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700">{scenario.impact}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Play className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700">{scenario.solution}</p>
                </div>
              </div>
            </div>
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
            <h1 className="text-3xl mb-2">운영 시뮬레이션</h1>
            <p className="text-gray-600">6개월 변수 대처 시뮬레이션</p>
          </div>
        </div>

        {/* Safety Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">비상 자금 권장</div>
              <div className="text-xl">3개월치 고정비</div>
              <div className="text-xs text-gray-500 mt-1">약 ₩2,940,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">수리비 적립 권장</div>
              <div className="text-xl">월 수익의 5%</div>
              <div className="text-xs text-gray-500 mt-1">약 ₩260,000/월</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">공실 허용 임계선</div>
              <div className="text-xl">20% 이하 유지</div>
              <div className="text-xs text-gray-500 mt-1">현재: 16.7%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-1">대출 상환비율</div>
              <div className="text-xl">수익의 40% 이하</div>
              <div className="text-xs text-gray-500 mt-1">현재: 11.4%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">시나리오 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      </div>

      {/* Simulation Controls */}
      {selectedScenario && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>시뮬레이션 변수 조정</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedScenario === "vacancy" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>공실률</Label>
                    <Badge>{vacancyRate[0]}%</Badge>
                  </div>
                  <Slider
                    value={vacancyRate}
                    onValueChange={setVacancyRate}
                    min={0}
                    max={50}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    공실률 {vacancyRate[0]}% 적용 시 월 실수익 약 ₩
                    {Math.round(4220 - (5200 * vacancyRate[0]) / 100 / 10)}만으로 감소
                  </p>
                </div>
              </div>
            )}

            {selectedScenario === "repair" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>월 수리비 (원)</Label>
                    <Badge>₩{repairCost[0].toLocaleString()}</Badge>
                  </div>
                  <Slider
                    value={repairCost}
                    onValueChange={setRepairCost}
                    min={0}
                    max={2000000}
                    step={100000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₩0</span>
                    <span>₩2,000,000</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    월 수리비 ₩{repairCost[0].toLocaleString()} 적용 시{" "}
                    {repairCost[0] > 780000 ? (
                      <span className="text-red-600">
                        임대 수익의 15% 초과 - 리모델링 검토 권장
                      </span>
                    ) : (
                      "적정 수준"
                    )}
                  </p>
                </div>
              </div>
            )}

            {selectedScenario === "interest" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>금리 인상폭</Label>
                    <Badge>{interestRate[0]}%p</Badge>
                  </div>
                  <Slider
                    value={interestRate}
                    onValueChange={setInterestRate}
                    min={0}
                    max={5}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0%p</span>
                    <span>5%p</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">
                    금리 {interestRate[0]}%p 인상 시 월 이자 약 ₩
                    {Math.round((10000000 * interestRate[0]) / 100 / 12).toLocaleString()}{" "}
                    증가
                  </p>
                  <p className="text-xs text-gray-700 mt-2">
                    * 대출금 ₩100,000,000 기준
                  </p>
                </div>
              </div>
            )}

            {!["vacancy", "repair", "interest"].includes(selectedScenario) && (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  이 시나리오는 정성적 분석 및 가이드를 제공합니다
                </p>
                <Button variant="outline" className="mt-4">
                  상세 가이드 보기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Simulation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>6개월 수익 예측</CardTitle>
          <p className="text-sm text-gray-600">
            {selectedScenario
              ? scenarios.find((s) => s.id === selectedScenario)?.title +
                " 시나리오 적용"
              : "기본 시나리오 (변수 없음)"}
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={simulationData}>
              <CartesianGrid key="grid-simulation" strokeDasharray="3 3" />
              <XAxis key="xaxis-simulation" dataKey="month" />
              <YAxis key="yaxis-simulation" />
              <Tooltip />
              <Line
                key="line-baseline"
                type="monotone"
                dataKey="baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                name="기본 (변수 없음)"
                strokeDasharray="5 5"
              />
              <Line
                key="line-scenario"
                type="monotone"
                dataKey="scenario"
                stroke="#3b82f6"
                strokeWidth={3}
                name="시나리오 적용"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">6개월 누적 (기본)</div>
              <div className="text-2xl">
                ₩{(baselineData.reduce((sum, d) => sum + d.baseline, 0) / 10).toFixed(0)}만
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">
                6개월 누적 (시나리오 적용)
              </div>
              <div className="text-2xl text-blue-600">
                ₩
                {(
                  simulationData.reduce((sum, d) => sum + d.scenario, 0) / 10
                ).toFixed(0)}
                만
              </div>
              <div className="text-xs text-gray-600 mt-1">
                차이: ₩
                {Math.abs(
                  (baselineData.reduce((sum, d) => sum + d.baseline, 0) -
                    simulationData.reduce((sum, d) => sum + d.scenario, 0)) /
                    10
                ).toFixed(0)}
                만
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Guide */}
      {selectedScenario && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>대처 방안</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedScenario === "vacancy" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="mb-1">임대료 조정 검토</h4>
                      <p className="text-sm text-gray-600">
                        주변 시세 대비 임대료가 과도하게 높지 않은지 확인
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="mb-1">공실 기간 리모델링</h4>
                      <p className="text-sm text-gray-600">
                        공실 기간을 활용한 수리·리모델링으로 임대 경쟁력 강화
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="mb-1">마케팅 강화</h4>
                      <p className="text-sm text-gray-600">
                        부동산 플랫폼 노출 증대 및 중개업소 수수료 인센티브
                      </p>
                    </div>
                  </div>
                </>
              )}

              {selectedScenario === "repair" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="mb-1">보수 vs 리모델링 손익분기 계산</h4>
                      <p className="text-sm text-gray-600">
                        단기 보수가 지속될 경우 전면 리모델링이 경제적
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="mb-1">수리비 적립금 운용</h4>
                      <p className="text-sm text-gray-600">
                        월 임대 수익의 5%를 수리비로 적립하여 급증 대비
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="mb-1">업체 단가 재협상</h4>
                      <p className="text-sm text-gray-600">
                        정기 관리 계약을 통한 수리비 절감
                      </p>
                    </div>
                  </div>
                </>
              )}

              {selectedScenario === "interest" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="mb-1">대출 조건 재협상</h4>
                      <p className="text-sm text-gray-600">
                        고정금리 전환 또는 타 금융사 대환대출 검토
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="mb-1">임대료 조정</h4>
                      <p className="text-sm text-gray-600">
                        계약 갱신 시 금리 인상분 반영한 임대료 인상 협의
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="mb-1">조기 상환 검토</h4>
                      <p className="text-sm text-gray-600">
                        여유 자금 발생 시 원금 일부 상환으로 이자 부담 경감
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}