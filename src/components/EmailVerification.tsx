import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestEmailAuth, verifyEmailAuth } from "@/lib/api";

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: (isVerified: boolean) => void;
  disabled?: boolean;
}

/**
 * 이메일 인증 컴포넌트
 * 
 * 이메일 입력 후 인증 코드를 요청하고, 인증 코드를 입력하여 인증을 완료합니다.
 * 인증이 완료되면 부모 컴포넌트에 콜백으로 알립니다.
 */
export function EmailVerification({ 
  email, 
  onVerificationComplete, 
  disabled = false 
}: EmailVerificationProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * 이메일 인증 코드 요청
   */
  const handleRequestVerification = async () => {
    if (!email) {
      setErrorMessage("이메일을 먼저 입력해주세요.");
      return;
    }

    setIsRequesting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await requestEmailAuth({ email });
      setSuccessMessage("인증 코드가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error("인증 코드 요청 실패:", error);
      setErrorMessage("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * 인증 코드 확인
   */
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrorMessage("인증 코드를 입력해주세요.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const isVerified = await verifyEmailAuth({
        email,
        code: verificationCode
      });

      if (isVerified) {
        setIsVerified(true);
        setSuccessMessage("이메일 인증이 완료되었습니다!");
        onVerificationComplete(true);
      } else {
        setErrorMessage("인증 코드가 올바르지 않습니다. 다시 확인해주세요.");
        onVerificationComplete(false);
      }
    } catch (error) {
      console.error("인증 코드 확인 실패:", error);
      setErrorMessage("인증 코드 확인에 실패했습니다. 다시 시도해주세요.");
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 이메일 인증 요청 버튼 */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleRequestVerification}
          disabled={disabled || isRequesting || isVerified}
          className="flex-1"
        >
          {isRequesting ? "전송 중..." : isVerified ? "인증 완료" : "메일 인증"}
        </Button>
      </div>

      {/* 인증 코드 입력 (인증 요청 후에만 표시) */}
      {successMessage && !isVerified && (
        <div className="space-y-2">
          <Label htmlFor="verificationCode">인증 코드</Label>
          <div className="flex gap-2">
            <Input
              id="verificationCode"
              type="text"
              placeholder="6자리 인증 코드를 입력하세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              disabled={isVerifying}
            />
            <Button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifying || !verificationCode}
              className="w-24"
            >
              {isVerifying ? "확인 중..." : "확인"}
            </Button>
          </div>
        </div>
      )}

      {/* 성공 메시지 */}
      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      {/* 인증 완료 표시 */}
      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          이메일 인증이 완료되었습니다
        </div>
      )}
    </div>
  );
} 