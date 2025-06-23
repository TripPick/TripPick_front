import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userSchemas, userDefaultValues, type LoginPayload } from "../register/user";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 로그인 페이지 컴포넌트
 * 
 * Backend API의 SiteUserLoginDto 구조에 맞춰 구현:
 * - userId: 사용자 아이디
 * - password: 비밀번호
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginPayload>({
    resolver: zodResolver(userSchemas.loginSchema),
    defaultValues: userDefaultValues.loginDefaultValues,
  });

  /**
   * 로그인 폼 제출 처리
   * @param data 폼 데이터 (LoginPayload 타입)
   */
  const onSubmit = async (data: LoginPayload) => {
    // 에러 메시지 초기화
    setLoginError("");
    
    try {
      console.log("로그인 데이터:", data);
      
      // Backend API 호출
      const response = await loginUser(data);
      
      if (response.code === "OK") {
        // AuthContext의 login 함수 호출하여 토큰 저장 및 상태 업데이트
        login(response.data.access.token, response.data.refresh.token);
        
        console.log("로그인 성공!", response);
        alert("로그인이 완료되었습니다!");
        reset();
        
        // 메인 페이지로 이동
        navigate("/");
      } else {
        // 에러 처리
        console.error("로그인 실패:", response.message);
        setLoginError(response.message || "로그인에 실패했습니다.");
      }
      
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      // Backend에서 반환된 에러 메시지 표시
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <CardTitle>다시 오신 것을 환영합니다!</CardTitle>
          <CardDescription>로그인하여 맞춤 여행을 시작하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
            {/* 소셜 로그인 버튼 */}
            <div className="flex flex-col space-y-2">
              <Button type="button" variant="outline">Google로 로그인</Button>
              <Button type="button" variant="outline">Kakao로 로그인</Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는</span>
              </div>
            </div>
            
            {/* 사용자 아이디 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="userId">아이디</Label>
              <Input 
                id="userId" 
                type="text"
                placeholder="아이디를 입력하세요" 
                {...register("userId")}
              />
              {errors.userId && (
                <p className="text-sm text-red-500">{errors.userId.message}</p>
              )}
            </div>
            
            {/* 비밀번호 */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="비밀번호를 입력하세요"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            {/* 로그인 에러 메시지 */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">{loginError}</p>
              </div>
            )}
            
            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link to="/register" className="underline text-blue-600 hover:text-blue-800">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
