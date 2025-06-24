import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const KakaoLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const hasProcessedToken = useRef(false);

  // URL 파라미터에서 토큰 또는 에러 확인 (OAuth2 콜백 후)
  useEffect(() => {
    // 이미 토큰을 처리했다면 다시 처리하지 않음
    if (hasProcessedToken.current) {
      return;
    }

    console.log("KakaoLoginButton useEffect 실행됨");
    console.log("현재 URL 파라미터:", Object.fromEntries(searchParams.entries()));
    
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    console.log("토큰:", token);
    console.log("에러:", error);
    console.log("메시지:", message);
    
    if (error) {
      console.error("카카오 OAuth2 에러 발생:", error, message);
      hasProcessedToken.current = true;
      
      let errorMessage = "카카오 로그인에 실패했습니다.";
      
      switch (error) {
        case 'access_denied':
          errorMessage = "사용자가 로그인을 취소했습니다.";
          break;
        case 'no_code':
          errorMessage = "인증 코드를 받지 못했습니다.";
          break;
        case 'jwt_failed':
          errorMessage = "JWT 토큰 생성에 실패했습니다.";
          break;
        case 'server_error':
          errorMessage = `서버 오류: ${message || '알 수 없는 오류'}`;
          break;
        default:
          errorMessage = `카카오 로그인 오류: ${error}`;
      }
      
      alert(errorMessage);
      return;
    }
    
    if (token) {
      console.log("OAuth2 콜백으로부터 토큰 받음:", token);
      console.log("토큰 길이:", token.length);
      
      hasProcessedToken.current = true;
      
      try {
        // AuthContext를 통해 로그인 처리
        login(token, token);
        console.log("AuthContext 로그인 완료");
        console.log("메인 페이지로 이동");
        
        // URL 파라미터 정리
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        navigate("/");
      } catch (error) {
        console.error("AuthContext 로그인 중 오류:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
      }
    } else {
      console.log("토큰이 없습니다.");
    }
  }, [searchParams]); // login, navigate 제거

  const handleLogin = async () => {
    console.log("카카오 OAuth2 로그인 시작...");
    setIsLoading(true);

    try {
      // 카카오 OAuth2 인증 URL 생성 - 수동으로 URL 구성
      const clientId = '0eaeed688e2125753c1a0ebf4df023be';
      const redirectUri = encodeURIComponent('http://localhost:8085/api/user/v1/auth/kakao/callback');
      const scope = encodeURIComponent('profile_nickname,account_email');
      
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      
      console.log("카카오 OAuth2 인증 URL:", kakaoAuthUrl);
      console.log("리다이렉트 URI (인코딩 전):", 'http://localhost:8085/api/user/v1/auth/kakao/callback');
      console.log("리다이렉트 URI (인코딩 후):", redirectUri);
      
      // URL이 올바른지 확인 (인코딩된 상태에서도 체크)
      if (!kakaoAuthUrl.includes('/callback') && !kakaoAuthUrl.includes('%2Fcallback')) {
        console.error("URL에 /callback이 포함되지 않았습니다!");
        setIsLoading(false);
        return;
      }
      
      console.log("URL 검증 통과, 카카오 OAuth2 페이지로 리다이렉트");
      
      // 카카오 OAuth2 인증 페이지로 리다이렉트
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error("카카오 OAuth2 로그인 시작 실패:", error);
      alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "Kakao로 로그인"}
      </Button>
    </div>
  );
};

export default KakaoLoginButton;
