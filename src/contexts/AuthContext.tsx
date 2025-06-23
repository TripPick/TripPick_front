import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, clearTokens, logoutUser } from '@/lib/api';

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: string | null;
}

/**
 * 인증 컨텍스트 인터페이스
 */
interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => boolean;
}

/**
 * JWT 토큰에서 사용자 정보를 추출하는 함수
 * @param token JWT 토큰
 * @returns 사용자 ID 또는 null
 */
function extractUserIdFromToken(token: string): string | null {
  try {
    // JWT 토큰의 payload 부분을 디코딩
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.userId || null;
  } catch (error) {
    console.error('토큰에서 사용자 ID 추출 실패:', error);
    return null;
  }
}

/**
 * JWT 토큰이 유효한지 확인하는 함수
 * @param token JWT 토큰
 * @returns 토큰 유효성 여부
 */
function isTokenValid(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp * 1000; // 초를 밀리초로 변환
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('토큰 유효성 검사 실패:', error);
    return false;
  }
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider 컴포넌트
 * 인증 상태를 전역적으로 관리합니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    userId: null,
  });

  /**
   * 인증 상태를 확인하는 함수
   */
  const checkAuthStatus = (): boolean => {
    const token = getAccessToken();
    
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        userId: null,
      });
      return false;
    }

    if (!isTokenValid(token)) {
      // 토큰이 만료되었으면 로그아웃 처리
      logout();
      return false;
    }

    const userId = extractUserIdFromToken(token);
    setAuthState({
      isAuthenticated: true,
      accessToken: token,
      userId,
    });
    return true;
  };

  /**
   * 로그인 처리
   */
  const login = (accessToken: string, refreshToken: string) => {
    // 토큰을 localStorage에 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const userId = extractUserIdFromToken(accessToken);
    setAuthState({
      isAuthenticated: true,
      accessToken,
      userId,
    });
  };

  /**
   * 로그아웃 처리
   * Backend logout API를 호출하고 로컬 상태를 정리합니다.
   */
  const logout = async (): Promise<void> => {
    try {
      // Backend logout API 호출
      if (authState.userId) {
        await logoutUser(authState.userId);
        console.log('Backend 로그아웃 성공');
      }
    } catch (error) {
      console.error('Backend 로그아웃 실패:', error);
      // Backend 호출이 실패해도 로컬 상태는 정리
    } finally {
      // 로컬 상태 정리
      clearTokens();
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        userId: null,
      });
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 토큰 만료 체크를 위한 주기적 검사
  useEffect(() => {
    if (authState.isAuthenticated && authState.accessToken) {
      const interval = setInterval(() => {
        if (!isTokenValid(authState.accessToken!)) {
          logout();
        }
      }, 60000); // 1분마다 체크

      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, authState.accessToken]);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * AuthContext를 사용하기 위한 커스텀 훅
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 