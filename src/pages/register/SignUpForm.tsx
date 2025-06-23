import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userSchemas, userDefaultValues, type SignUpPayload } from "./user";
import { registerUser } from "@/lib/api";
import { EmailVerification } from "@/components/EmailVerification";

/**
 * 회원가입 폼 컴포넌트
 * 
 * Backend API의 SiteUserRegisterDto 구조에 맞춰 구현:
 * - userId: 사용자 아이디
 * - userPwd: 비밀번호
 * - userName: 사용자 이름
 * - userEmail: 이메일 (인증 필요)
 * - phone: 전화번호
 */
export function SignUpForm() {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignUpPayload>({
    resolver: zodResolver(userSchemas.signUpSchema),
    defaultValues: userDefaultValues.signUpDefaultValues,
  });

  // 이메일 값 감시
  const watchedEmail = watch("userEmail");

  /**
   * 이메일 인증 완료 처리
   * @param isVerified 인증 완료 여부
   */
  const handleEmailVerificationComplete = (isVerified: boolean) => {
    setIsEmailVerified(isVerified);
  };

  /**
   * 회원가입 폼 제출 처리
   * @param data 폼 데이터 (SignUpPayload 타입)
   */
  const onSubmit = async (data: SignUpPayload) => {
    // 이메일 인증이 완료되지 않았으면 회원가입 불가
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      console.log("회원가입 데이터:", data);
      
      // Backend API 호출
      const response = await registerUser(data);
      
      if (response.code === "OK") {
        // 회원가입 성공 처리
        console.log("회원가입 성공!", response);
        // alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        reset();
        setIsEmailVerified(false);
        // 로그인 페이지로 이동
        navigate("/login");
      } else {
        // 에러 처리
        console.error("회원가입 실패:", response.message);
        alert(response.message || "회원가입에 실패했습니다.");
      }
      
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>
          계정을 생성하기 위해 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* 사용자 아이디 */}
          <div className="grid gap-2">
            <Label htmlFor="userId">아이디</Label>
            <Input
              id="userId"
              type="text"
              placeholder="사용자 아이디를 입력하세요"
              {...register("userId")}
            />
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="grid gap-2">
            <Label htmlFor="userPwd">비밀번호</Label>
            <Input
              id="userPwd"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("userPwd")}
            />
            {errors.userPwd && (
              <p className="text-sm text-red-500">{errors.userPwd.message}</p>
            )}
          </div>

          {/* 사용자 이름 */}
          <div className="grid gap-2">
            <Label htmlFor="userName">이름</Label>
            <Input
              id="userName"
              type="text"
              placeholder="이름을 입력하세요"
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="grid gap-2">
            <Label htmlFor="userEmail">이메일</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="이메일을 입력하세요"
              {...register("userEmail")}
            />
            {errors.userEmail && (
              <p className="text-sm text-red-500">{errors.userEmail.message}</p>
            )}
            
            {/* 이메일 인증 컴포넌트 */}
            <EmailVerification
              email={watchedEmail}
              onVerificationComplete={handleEmailVerificationComplete}
              disabled={!watchedEmail || !!errors.userEmail}
            />
          </div>

          {/* 전화번호 */}
          <div className="grid gap-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="010-1234-5678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !isEmailVerified}
          >
            {isSubmitting ? "처리 중..." : !isEmailVerified ? "이메일 인증 필요" : "회원가입"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-sm text-center">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="underline text-blue-600 hover:text-blue-800">
            로그인
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}