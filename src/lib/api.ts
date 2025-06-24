/**
 * Backend API 통신을 위한 유틸리티 함수들
 * 
 * 이 파일은 frontend에서 backend API와의 통신을 담당합니다.
 * 모든 API 호출은 이 파일을 통해 이루어집니다.
 */

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

/**
 * API 응답 타입 정의
 * Backend ApiResponseDto 구조와 일치
 */
export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

/**
 * 회원가입 요청 데이터 타입
 */
export interface RegisterRequest {
  userId: string;
  userPwd: string;
  userName: string;
  userEmail: string;
  phone: string;
}

/**
 * 로그인 요청 데이터 타입
 */
export interface LoginRequest {
  userId: string;
  password: string;
}

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponse {
  access: {
    token: string;
    expiresIn: number;
  };
  refresh: {
    token: string;
    expiresIn: number;
  };
}

/**
 * 이메일 인증 요청 데이터 타입
 */
export interface EmailAuthRequest {
  email: string;
}

/**
 * 이메일 인증 확인 데이터 타입
 */
export interface EmailVerifyRequest {
  email: string;
  code: string;
}

/**
 * 사용자 정보 응답 데이터 타입
 */
export interface UserInfoResponse {
  userId: string;
  userName: string;
  profileImageUrl?: string;
}

/**
 * 공통 API 호출 함수
 * @param endpoint API 엔드포인트
 * @param options fetch 옵션
 * @returns API 응답
 */
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // 응답 본문이 비어있는지 확인
    const text = await response.text();
    let data: ApiResponse<T>;
    
    if (!text) {
      // 빈 응답인 경우 기본 성공 응답 반환
      data = {
        code: "OK",
        message: "요청이 성공하였습니다.",
        data: null as T
      };
    } else {
      // JSON 파싱
      data = JSON.parse(text);
    }
    
    // HTTP 상태 코드가 400 이상이면 에러로 처리
    if (!response.ok) {
      // 에러 응답이지만 JSON 형태로 에러 정보가 포함된 경우
      if (data && data.code && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 회원가입 API 호출
 * @param registerData 회원가입 데이터
 * @returns API 응답
 */
export async function registerUser(registerData: RegisterRequest): Promise<ApiResponse<string>> {
  return apiCall<string>('/api/user/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerData),
  });
}

/**
 * 로그인 API 호출
 * @param loginData 로그인 데이터
 * @returns 로그인 응답 (토큰 포함)
 */
export async function loginUser(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return apiCall<LoginResponse>('/api/user/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });
}

/**
 * 토큰 갱신 API 호출
 * @param refreshToken 리프레시 토큰
 * @returns 새로운 액세스 토큰
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
  return apiCall<{ token: string; expiresIn: number }>('/api/user/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ token: refreshToken }),
  });
}

/**
 * 로그아웃 API 호출
 * @param userId 사용자 ID
 * @returns API 응답
 */
export async function logoutUser(userId: string): Promise<ApiResponse<string>> {
  return apiCall<string>('/api/user/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `userId=${encodeURIComponent(userId)}`,
  });
}

/**
 * 이메일 인증 요청 API 호출
 * @param emailData 이메일 데이터
 * @returns API 응답
 */
export async function requestEmailAuth(emailData: EmailAuthRequest): Promise<void> {
  await apiCall('/api/user/v1/auth/email', {
    method: 'POST',
    body: JSON.stringify(emailData),
  });
}

/**
 * 이메일 인증 확인 API 호출
 * @param verifyData 인증 확인 데이터
 * @returns 인증 성공 여부
 */
export async function verifyEmailAuth(verifyData: EmailVerifyRequest): Promise<boolean> {
  const response = await apiCall<boolean>('/api/user/v1/auth/email/verify', {
    method: 'POST',
    body: JSON.stringify(verifyData),
  });
  
  return response.code === "OK" ? response.data : false;
}

/**
 * 토큰 저장 함수
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

/**
 * 토큰 제거 함수
 */
export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * 액세스 토큰 가져오기
 * @returns 액세스 토큰 또는 null
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * 리프레시 토큰 가져오기
 * @returns 리프레시 토큰 또는 null
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

/**
 * 카카오 로그인 API 호출
 * @param accessToken 카카오 액세스 토큰
 * @returns JWT 토큰
 */
export async function kakaoLogin(accessToken: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/api/user/v1/auth/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 카카오 사용자 정보 조회 API 호출
 * @param userId 사용자 ID (카카오 이메일)
 * @returns 사용자 정보
 */
export async function getUserInfo(userId: string): Promise<UserInfoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/user/v1/auth/user/info?userId=${encodeURIComponent(userId)}`);
  
  if (!response.ok) {
    throw new Error(`사용자 정보 조회 실패: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} 