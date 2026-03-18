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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix to get raw base64
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

async function analyzeDocument(
  file: File,
  apiKey: string
): Promise<AnalysisResult> {
  const systemPrompt = `당신은 한국 빌딩 임대 관리 전문가 AI입니다.
업로드된 문서를 분석하여 다음 정보를 JSON 형식으로 추출해주세요:
{
  "documentType": "문서 유형 (계약서/영수증/세금계산서/기타)",
  "summary": "문서 내용 요약 (2-3문장)",
  "keyInfo": {
    "parties": ["관련 당사자들"],
    "amounts": ["금액 정보"],
    "dates": ["중요 날짜"],
    "propertyInfo": "부동산 관련 정보"
  },
  "actionItems": ["필요한 조치 사항들"],
  "riskFlags": ["주의해야 할 사항들"]
}
반드시 유효한 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.`;

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
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 1500,
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

  // Extract JSON from the response (sometimes wrapped in markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON 파싱 오류: 응답에서 JSON을 찾을 수 없습니다");

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

export default function Documents() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") ?? "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
