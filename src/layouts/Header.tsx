import { Button } from "@/components/ui/button";
import { Moon, Sun, User, LogOut } from "lucide-react";
import type React from "react";
import { Link, type NavigateFunction } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  handleScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  navigate: NavigateFunction;
  toggleTheme: () => void;
}

export default function Header({ handleScrollTo, navigate, toggleTheme }: HeaderProps) {
  const { isAuthenticated, userId, logout } = useAuth();

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      // console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      // 오류가 발생해도 메인 페이지로 이동
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img className="bg-transparent w-16" src={Logo} alt="logo" />
          <h1 className="text-xl font-bold">TripPick</h1>
        </div>
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            to="/"
            className="text-sm font-medium hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            홈
          </Link>
          <Link
            to="/#recommendations"
            className="text-sm font-medium hover:underline"
            onClick={(e) => handleScrollTo(e, "recommendations")}
          >
            추천 정보
          </Link>
          <Link
            to="/#themes"
            className="text-sm font-medium hover:underline"
            onClick={(e) => handleScrollTo(e, "themes")}
          >
            테마별 여행
          </Link>
          <Link
            to="/#ai-planner"
            className="text-sm font-medium hover:underline"
            onClick={(e) => handleScrollTo(e, "ai-planner")}
          >
            AI 플래너
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="cursor-pointer" variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
            <span className="sr-only">테마 변경</span>
          </Button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{userId}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                로그인
              </Button>
              <Button onClick={() => navigate("/register")}>
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
      <hr className="border-border" />
    </header>
  );
}
