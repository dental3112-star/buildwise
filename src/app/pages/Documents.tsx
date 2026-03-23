import { useState, useRef, useCallback } from "react";
import {
  FileSearch,
  Upload,
  FileText,
  Image,
  X,
  Loader2,
  Key,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Shield,
  Calendar,
  Receipt,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  uploadedAt: Date;
  analysis?: AnalysisResult;
  isAnalyzing?: boolean;
}

interface FinancialForecast {
  safeMonths: number;
  safetyLevel: "안전" | "주의" | "위험";
  monthlyCashFlow: string;
  expiringContracts: string[];
  taxWarnings: string[];
  recommendations: string[];
  forecast6months: string;
}

interface AnalysisResult {
  documentType: string;
  summary: string;
  keyInfo: {
    parties: string[];
    amounts: string[];
    dates: string[];
    propertyInfo: string;
  };
  actionItems: string[];
  riskFlags: string[];
  financialForecast: FinancialForecast;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getDocumentTypeBadgeColor(docType: string): string {
  if (docType.includes("계약")) return "bg-blue-100 text-blue-700";
  if (docType.includes("영수")) return "bg-green-100 text-green-700";
  if (docType.includes("세금")) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

function getSafetyColors(level: "안전" | "주의" | "위험") {
  if (level === "안전") return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", badge: "bg-green-100 text-green-700" };
  if (level === "주의") return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700" };
  return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", badge: "bg-red-100 text-red-700" };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str ?? "")
        .join(" ");
      fullText += pageText + "\n";
    }
    return fullText.trim();
  } catch {
    return "[PDF 텍스트 추출 실패 - 이미지 기반 PDF일 수 있습니다]";
  }
}

const SYSTEM_PROMPT = `당신은 한국 빌딩 임대 관리 전문가 AI입니다.
업로드된 문서를 분석하여 다음 정보를 반드시 유효한 JSON 형식으로만 반환해주세요:
{
  "documentType": "문서 유형 (계약서/영수증/세금계산서/기타)",
  "summary": "문서 내용 요약 (2-3문장)",
  "keyInfo": {
    "parties": ["관련 당사자들"],
    "amounts": ["금액 정보 (예: 월세 50만원, 보증금 1000만원)"],
    "dates": ["중요 날짜 (예: 계약 만료일, 납부 기한)"],
    "propertyInfo": "부동산 관련 정보 (호수, 주소 등)"
  },
  "actionItems": ["즉시 필요한 조치 사항들"],
  "riskFlags": ["주의해야 할 위험 사항들"],
  "financialForecast": {
    "safeMonths": 12,
    "safetyLevel": "안전",
    "monthlyCashFlow": "월 예상 수익/지출 요약",
    "expiringContracts": ["만료 임박 계약 경고 (예: 3개월 내 만료 예정)"],
    "taxWarnings": ["세금 관련 주의사항 (재산세, 종합소득세 등)"],
    "recommendations": ["AI 추천 조치 사항 3-5개"],
    "forecast6months": "향후 6개월 재무 전망 요약 (2-3문장)"
  }
}
safeMonths는 현재 수익/지출 구조가 유지될 경우 재무적으로 안정적인 예상 기간(개월수)을 숫자로만 입력.
safetyLevel은 "안전"(12개월 이상), "주의"(6-12개월), "위험"(6개월 미만) 중 하나.
반드시 유효한 JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

async function analyzeDocument(
  file: File,
  apiKey: string
): Promise<AnalysisResult> {
  const isImage = file.type.startsWith("image/");
  const isPDF = file.type === "application/pdf";

  let messages: object[];

  if (isImage) {
    const base64 = await fileToBase64(file);
    messages = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: "이 문서 이미지를 분석해주세요.",
          },
        ],
      },
    ];
  } else if (isPDF) {
    const text = await extractTextFromPDF(file);
    messages = [
      {
        role: "user",
        content: `다음은 PDF 문서에서 추출한 텍스트입니다. 분석해주세요:\n\n${text}`,
      },
    ];
  } else {
    const text = await extractTextFromPDF(file);
    messages = [
      {
        role: "user",
        content: `다음 문서를 분석해주세요:\n\n${text}`,
      },
    ];
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ||
        `API 오류: ${response.status}`
    );
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content ?? "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON 파싱 오류: 응답에서 JSON을 찾을 수 없습니다");

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

async function analyzeAllDocuments(
  docs: UploadedDocument[],
  apiKey: string
): Promise<AnalysisResult> {
  const combinedPrompt = `다음은 여러 문서들의 정보입니다. 모든 문서를 종합하여 전체적인 재무 상태와 전망을 분석해주세요:\n\n` +
    docs
      .filter((d) => d.analysis)
      .map((d, i) => `[문서 ${i + 1}: ${d.name}]\n${JSON.stringify(d.analysis, null, 2)}`)
      .join("\n\n---\n\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: combinedPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ||
        `API 오류: ${response.status}`
    );
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content ?? "";

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON 파싱 오류: 응답에서 JSON을 찾을 수 없습니다");

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

function FinancialForecastSection({ forecast }: { forecast: FinancialForecast }) {
  const colors = getSafetyColors(forecast.safetyLevel);

  return (
    <div className="space-y-3">
      {/* Financial Safety Card */}
      <div className={`rounded-xl p-5 border-2 ${colors.bg} ${colors.border}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.badge}`}>
              <Shield className="size-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-0.5">재무 안전 예상 기간</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl font-bold ${colors.text}`}>{forecast.safeMonths}</span>
                <span className={`text-lg font-semibold ${colors.text}`}>개월</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${colors.badge}`}>
              {forecast.safetyLevel === "안전" ? "✓ 안전" : forecast.safetyLevel === "주의" ? "⚠ 주의" : "✕ 위험"}
            </span>
            <p className={`text-sm mt-2 max-w-[200px] ${colors.text} opacity-80`}>
              {forecast.monthlyCashFlow}
            </p>
          </div>
        </div>
      </div>

      {/* 6개월 전망 */}
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">6개월 재무 전망</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{forecast.forecast6months}</p>
      </div>

      {/* Warnings & Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 계약 만료 경고 */}
        {forecast.expiringContracts.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="size-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">계약 만료 경고</span>
            </div>
            <ul className="space-y-1">
              {forecast.expiringContracts.map((item, i) => (
                <li key={i} className="text-xs text-blue-600 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 세금 주의사항 */}
        {forecast.taxWarnings.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Receipt className="size-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700">세금 주의사항</span>
            </div>
            <ul className="space-y-1">
              {forecast.taxWarnings.map((item, i) => (
                <li key={i} className="text-xs text-orange-600 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI 추천 조치 */}
        {forecast.recommendations.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="size-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">AI 추천 조치</span>
            </div>
            <ul className="space-y-1">
              {forecast.recommendations.map((item, i) => (
                <li key={i} className="text-xs text-purple-600 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") ?? "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [combinedAnalysis, setCombinedAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [showCombined, setShowCombined] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveApiKey = () => {
    localStorage.setItem("openai_api_key", apiKey);
    toast.success("API 키가 저장되었습니다");
  };

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const allowed = fileArray.filter(
      (f) =>
        f.type === "application/pdf" ||
        f.type.startsWith("image/")
    );
    if (allowed.length < fileArray.length) {
      toast.error("PDF 및 이미지 파일만 업로드할 수 있습니다");
    }
    const newDocs: UploadedDocument[] = allowed.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.type,
      size: f.size,
      file: f,
      uploadedAt: new Date(),
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
    if (allowed.length > 0) {
      toast.success(`${allowed.length}개 파일이 업로드되었습니다`);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setExpandedDocs((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAnalyze = async (doc: UploadedDocument) => {
    const key = apiKey.trim();
    if (!key) {
      toast.error("OpenAI API 키를 먼저 입력해주세요");
      return;
    }

    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, isAnalyzing: true } : d))
    );

    try {
      const result = await analyzeDocument(doc.file, key);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, isAnalyzing: false, analysis: result } : d
        )
      );
      setExpandedDocs((prev) => new Set([...prev, doc.id]));
      toast.success("AI 분석이 완료되었습니다");
    } catch (err) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, isAnalyzing: false } : d))
      );
      toast.error(
        `분석 오류: ${err instanceof Error ? err.message : "알 수 없는 오류"}`
      );
    }
  };

  const handleAnalyzeAll = async () => {
    const key = apiKey.trim();
    if (!key) {
      toast.error("OpenAI API 키를 먼저 입력해주세요");
      return;
    }
    const analyzedDocs = documents.filter((d) => d.analysis);
    if (analyzedDocs.length === 0) {
      toast.error("먼저 개별 문서를 분석해주세요");
      return;
    }

    setIsAnalyzingAll(true);
    try {
      const result = await analyzeAllDocuments(analyzedDocs, key);
      setCombinedAnalysis(result);
      setShowCombined(true);
      toast.success("전체 종합 분석이 완료되었습니다");
    } catch (err) {
      toast.error(
        `종합 분석 오류: ${err instanceof Error ? err.message : "알 수 없는 오류"}`
      );
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  const analyzedCount = documents.filter((d) => d.analysis).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileSearch className="size-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 문서 분석</h1>
            <p className="text-sm text-gray-500">
              계약서, 영수증, 세금계산서를 업로드하고 AI로 분석하세요
            </p>
          </div>
        </div>
        {documents.length >= 2 && (
          <Button
            onClick={handleAnalyzeAll}
            disabled={isAnalyzingAll || analyzedCount === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0 gap-2"
          >
            {isAnalyzingAll ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                종합 분석 중...
              </>
            ) : (
              <>
                <BarChart3 className="size-4" />
                전체 문서 종합 분석
                {analyzedCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {analyzedCount}
                  </span>
                )}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Required Documents Guide */}
      <Card className="border border-blue-100 bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            📋 정확한 재무 분석을 위해 필요한 서류
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="font-semibold text-blue-700 mb-2">🏠 필수 서류</div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li>• 임대차 계약서 (전체 호실)</li>
                <li>• 월세/관리비 납부 확인서</li>
                <li>• 임대료 수입 내역서</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-100">
              <div className="font-semibold text-orange-700 mb-2">💰 세금 관련</div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li>• 재산세 납부 고지서</li>
                <li>• 종합소득세 신고서</li>
                <li>• 세금계산서 / 영수증</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <div className="font-semibold text-green-700 mb-2">🔧 지출 관련</div>
              <ul className="space-y-1 text-gray-600 text-xs">
                <li>• 수리비 / 유지보수 영수증</li>
                <li>• 대출 이자 납부 내역</li>
                <li>• 관리비 지출 내역서</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3 bg-blue-100 rounded-lg px-3 py-2">
            💡 <strong>팁:</strong> 서류가 많을수록 AI 분석이 정확해져요. 여러 파일 업로드 후 <strong>"전체 문서 종합 분석"</strong>을 사용하면 종합 재무 진단이 가능해요!
          </p>
        </CardContent>
      </Card>

      {/* Combined Analysis Result */}
      {combinedAnalysis && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-indigo-800">
                <BarChart3 className="size-5 text-indigo-600" />
                전체 문서 종합 재무 분석
                <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                  {analyzedCount}개 문서 기준
                </Badge>
              </CardTitle>
              <button
                onClick={() => setShowCombined((v) => !v)}
                className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-400 hover:text-indigo-600"
              >
                {showCombined ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
            </div>
          </CardHeader>
          {showCombined && (
            <CardContent className="space-y-4">
              <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                <p className="text-sm text-gray-700">{combinedAnalysis.summary}</p>
              </div>
              {combinedAnalysis.financialForecast && (
                <FinancialForecastSection forecast={combinedAnalysis.financialForecast} />
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* API Key Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Key className="size-4 text-gray-500" />
            OpenAI API 키 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKey((v) => !v)}
              className="flex-shrink-0"
            >
              {showApiKey ? "숨기기" : "보기"}
            </Button>
            <Button
              size="sm"
              onClick={handleSaveApiKey}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              저장
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            API 키는 브라우저 로컬 스토리지에만 저장되며 외부로 전송되지 않습니다.
          </p>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-10 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-700 mb-1">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-sm text-gray-400">PDF, PNG, JPG, WEBP 지원</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            업로드된 문서 ({documents.length}개)
          </h2>
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              {/* Document Header Row */}
              <div className="flex items-center gap-4 p-4">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  {doc.type.startsWith("image/") ? (
                    <Image className="size-5 text-blue-600" />
                  ) : (
                    <FileText className="size-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{doc.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {formatFileSize(doc.size)} •{" "}
                    {doc.uploadedAt.toLocaleDateString("ko-KR")}
                  </div>
                </div>
                {doc.analysis && (
                  <Badge
                    className={`flex-shrink-0 ${getDocumentTypeBadgeColor(
                      doc.analysis.documentType
                    )}`}
                  >
                    {doc.analysis.documentType}
                  </Badge>
                )}
                {doc.analysis?.financialForecast && (
                  <Badge
                    className={`flex-shrink-0 text-xs ${getSafetyColors(doc.analysis.financialForecast.safetyLevel).badge}`}
                  >
                    <Shield className="size-3 mr-1" />
                    {doc.analysis.financialForecast.safetyLevel}
                  </Badge>
                )}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!doc.analysis && !doc.isAnalyzing && (
                    <Button
                      size="sm"
                      onClick={() => handleAnalyze(doc)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FileSearch className="size-4 mr-1" />
                      AI 분석
                    </Button>
                  )}
                  {doc.isAnalyzing && (
                    <Button size="sm" disabled className="bg-blue-100 text-blue-600">
                      <Loader2 className="size-4 mr-1 animate-spin" />
                      분석 중...
                    </Button>
                  )}
                  {doc.analysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(doc.id)}
                    >
                      {expandedDocs.has(doc.id) ? (
                        <>
                          <ChevronUp className="size-4 mr-1" />
                          접기
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4 mr-1" />
                          결과 보기
                        </>
                      )}
                    </Button>
                  )}
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Analysis Results */}
              {doc.analysis && expandedDocs.has(doc.id) && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                  {/* Summary */}
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="size-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">문서 요약</span>
                    </div>
                    <p className="text-sm text-gray-600">{doc.analysis.summary}</p>
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doc.analysis.keyInfo.parties.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-2">당사자</div>
                        <ul className="space-y-1">
                          {doc.analysis.keyInfo.parties.map((p, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              • {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {doc.analysis.keyInfo.amounts.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-2">금액 정보</div>
                        <ul className="space-y-1">
                          {doc.analysis.keyInfo.amounts.map((a, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              • {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {doc.analysis.keyInfo.dates.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-2">중요 날짜</div>
                        <ul className="space-y-1">
                          {doc.analysis.keyInfo.dates.map((d, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              • {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {doc.analysis.keyInfo.propertyInfo && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-2">부동산 정보</div>
                        <p className="text-sm text-gray-700">
                          {doc.analysis.keyInfo.propertyInfo}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Items */}
                  {doc.analysis.actionItems.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="size-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">필요 조치 사항</span>
                      </div>
                      <ul className="space-y-1">
                        {doc.analysis.actionItems.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risk Flags */}
                  {doc.analysis.riskFlags.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="size-4 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">주의 사항</span>
                      </div>
                      <ul className="space-y-1">
                        {doc.analysis.riskFlags.map((flag, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">!</span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Financial Forecast */}
                  {doc.analysis.financialForecast && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="size-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-gray-700">재무 예측 분석</span>
                      </div>
                      <FinancialForecastSection forecast={doc.analysis.financialForecast} />
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileSearch className="size-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">업로드된 문서가 없습니다</p>
          <p className="text-xs mt-1">위 영역에 파일을 드래그하거나 클릭하여 업로드하세요</p>
        </div>
      )}
    </div>
  );
}
