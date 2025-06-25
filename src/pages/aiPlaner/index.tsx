import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";
import PlanSkeleton from "./PlanSkeleton";
import { useState } from "react";
import { useSidoCodes } from "@/hook/useAreaCodes";

// 타입과 컴포넌트를 분리해서 import 합니다.
import GeneratedPlan from "./GeneratedPlan";
import type { DayPlan } from "./GeneratedPlan";

// sidoList 데이터의 타입을 명확하게 정의합니다.
interface Sido {
    code: string;
    name: string;
}

export default function AiPlaner () {
    const [destination, setDestination] = useState("");
    const [duration, setDuration] = useState("3");
    const [interests, setInterests] = useState<string[]>([]);
    const [plan, setPlan] = useState<DayPlan[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { data: sidoList, isLoading: isSidoLoading } = useSidoCodes(false);

    const availableInterests = ["관광지", "문화시설", "축제", "행사"];

    const handleInterestToggle = (interest: string) => {
        setInterests((prevInterests: string[]) => 
            prevInterests.includes(interest) 
                ? prevInterests.filter((i: string) => i !== interest)
                : [...prevInterests, interest]
        );
    };

    // --- 가장 큰 변화: API 요청 로직 전체 수정 ---
    const handleGeneratePlan = async () => {
        if (!destination) {
            setError("목적지를 입력해주세요.");
            return;
        }
        setIsLoading(true);
        setError("");
        setPlan(null);

        try {
            const generatedDays: DayPlan[] = [];
            const durationNumber = parseInt(duration, 10);

            // 1. 여행 기간만큼 반복하며 하루치 계획을 각각 요청합니다.
            for (let i = 1; i <= durationNumber; i++) {
                
                // 2. 프롬프트를 각 날짜에 맞게 수정합니다.
                const dailyPrompt = `
                    ${destination}으로 떠나는 ${duration}일 여행 중, **${i}일차 하루 동안의 여행 계획만** 세워줘.
                    주요 관심사는 ${interests.join(", ")}이야.
                    아침, 점심, 저녁 활동을 추천하고 간단한 설명을 포함해줘.
                    전체 응답을 아래 JSON 스키마에 맞춰서 한국어로 제공해줘.
                    중요: JSON 내부의 모든 문자열 값에 따옴표(")가 포함될 경우, 반드시 백슬래시(\\)를 사용해서 \\" 와 같이 이스케이프 처리해야 해.
                `;
                
                // 3. 스키마도 단일 객체를 받도록 단순화합니다.
                const dailySchema = {
                    type: "OBJECT",
                    properties: {
                        day: { type: "NUMBER", description: `여행 계획의 날짜. 반드시 ${i}로 설정해야 함` },
                        title: { type: "STRING" },
                        morning: { type: "OBJECT", properties: { activity: { type: "STRING" }, description: { type: "STRING" } } },
                        lunch: { type: "OBJECT", properties: { recommendation: { type: "STRING" }, description: { type: "STRING" } } },
                        afternoon: { type: "OBJECT", properties: { activity: { type: "STRING" }, description: { type: "STRING" } } },
                        dinner: { type: "OBJECT", properties: { recommendation: { type: "STRING" }, description: { type: "STRING" } } },
                    },
                    required: ["day", "title", "morning", "lunch", "dinner"]
                };
                
                const payload = { 
                    contents: [{ role: "user", parts: [{ text: dailyPrompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: dailySchema,
                    }
                };

                const apiKey = import.meta.env.VITE_AI_API_KEY;
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`API 요청 실패 (Day ${i}): ${response.statusText}`);
                
                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const jsonText = candidate.content.parts[0].text;
                    const parsedDayPlan = JSON.parse(jsonText);
                    generatedDays.push(parsedDayPlan);
                } else {
                    const blockReason = result.promptFeedback?.blockReason;
                    throw new Error(`Day ${i} 계획 생성 실패: ${blockReason ? `차단됨(${blockReason})` : '유효한 콘텐츠 없음'}`);
                }
            }

            // 4. 모든 날짜의 계획이 성공적으로 생성되면 최종적으로 상태를 업데이트합니다.
            setPlan(generatedDays);

        } catch (e: any) {
            console.error("❌ 여행 계획 생성 중 최종 에러:", e);
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div id="ai-planner" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">AI 여행 플래너</h2>
                    <p className="text-muted-foreground mt-2">
                        AI가 당신만을 위한 특별한 여행을 설계해 드립니다.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto mt-12 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-1">
                           <Label className="mt-1" htmlFor="duration">여행 기간</Label>
                            <div className="mt-2">
                                <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger id="duration">
                                    <SelectValue placeholder="기간 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1일</SelectItem>
                                    <SelectItem value="2">2일</SelectItem>
                                    <SelectItem value="3">3일</SelectItem>
                                    <SelectItem value="5">5일</SelectItem>
                                    <SelectItem value="7">7일</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="md:col-span-2 mt-1">
                            <Label>관심 카테고리 (중복 선택 가능)</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {availableInterests.map((interest) => (
                                    <Button
                                        key={interest}
                                        variant={interests.includes(interest) ? 'default' : 'outline'}
                                        onClick={() => handleInterestToggle(interest)}
                                    >
                                        {interest}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-1 mt-6">
                            <Select
                                onValueChange={(value) => setDestination(value)}
                                disabled={isSidoLoading}
                            >
                                <SelectTrigger className="w-[180px]">
                                <SelectValue
                                    placeholder={ isSidoLoading ? "로딩 중..." : "법정동시도 선택" }
                                />
                                </SelectTrigger>
                                <SelectContent>
                                    {sidoList?.map((sidoItem: Sido) => (
                                        <SelectItem key={sidoItem.code} value={sidoItem.name}>
                                            {sidoItem.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button className="w-full text-lg" size="lg" onClick={handleGeneratePlan} disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />계획 생성 중...</>
                            ) : (
                                <><Wand2 className="mr-2 h-5 w-5" />나만의 여행 계획 생성하기</>
                            )}
                        </Button>
                    </div>
                </Card>

                <div className="max-w-4xl mx-auto mt-8">
                    {isLoading && <PlanSkeleton />}
                    {error && <p className="text-center text-destructive">{error}</p>}
                    {plan && <GeneratedPlan plan={plan} />}
                </div>
            </div>
        </div>
    );
}