import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <Card className="w-[380px]">
      <CardHeader className="text-center">
        <CardTitle>다시 오신 것을 환영합니다!</CardTitle>
        <CardDescription>로그인하여 맞춤 여행을 시작하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {/* 소셜 로그인 버튼 */}
          <div className="flex flex-col space-y-2">
            <Button variant="outline">Google로 로그인</Button>
            <Button variant="outline">Kakao로 로그인</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>
          {/* 이메일/비밀번호 폼 */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="hello@example.com" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">로그인</Button>
        <p className="text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <a href="/signup" className="underline">
            회원가입
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
