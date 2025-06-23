import {z} from "zod"
import {extractDefaultValues} from "./common"

/**
 * 사용자 관련 Zod 스키마들을 정의하는 파일
 * 
 * 이 파일은 회원가입과 로그인에 필요한 데이터 검증 스키마를 정의하고,
 * 각 스키마에 대한 기본값을 생성합니다.
 * 
 * Backend API 구조에 맞춰 정의:
 * - SiteUserRegisterDto: userId, userPwd, userName, userEmail, phone
 * - SiteUserLoginDto: userId, password
 * 
 * 파일 구조:
 * 1. 개별 필드 스키마 정의 (userIdSchema, passwordSchema, emailSchema, nameSchema, phoneSchema)
 * 2. 전체 폼 스키마 정의 (signUpSchema, loginSchema)
 * 3. TypeScript 타입 추출
 * 4. 기본값 생성 (common.ts의 extractDefaultValues 함수 활용)
 */

/**
 * 사용자 ID 검증 스키마
 * 
 * 요구사항:
 * - 필수 입력
 * - 최대 20자 (backend DB 제약조건)
 */
const userIdSchema = z
  .string()
  .min(1, {message: "아이디를 입력하세요."})
  .max(20, {message: "아이디는 20자 이하여야 합니다."})

/**
 * 비밀번호 검증 스키마
 * 
 * 요구사항:
 * - 최소 8자 이상
 * - 대문자 1개 이상
 * - 소문자 1개 이상
 * - 숫자 1개 이상
 * - 특수문자 1개 이상
 */
const passwordSchema = z
  .string()
  .regex(/^(?=.*[A-Z])/, "One uppercase letter.")
  .regex(/^(?=.*[a-z])/, "One lowercase letter.")
  .regex(/^(?=.*\d)/, "One digit.")
  .regex(/^(?=.*[\W_])/, "One special character.")
  .min(8, {message: "At least 8 characters."})

/**
 * 이메일 검증 스키마
 * 
 * 요구사항:
 * - 필수 입력
 * - 유효한 이메일 형식
 * - 최대 225자 (backend DB 제약조건)
 */
const emailSchema = z
  .string()
  .min(1, {message: "이메일을 입력하세요."})
  .email({message: "올바른 이메일 형식이 아닙니다."})
  .max(225, {message: "이메일은 225자 이하여야 합니다."})

/**
 * 이름 검증 스키마
 * 
 * 요구사항:
 * - 필수 입력
 * - 최대 20자 (backend DB 제약조건)
 */
const nameSchema = z
  .string()
  .min(1, {message: "이름을 입력하세요."})
  .max(20, {message: "이름은 20자 이하여야 합니다."})

/**
 * 전화번호 검증 스키마
 * 
 * 요구사항:
 * - 필수 입력
 * - 최대 13자 (backend DB 제약조건)
 * - 한국 전화번호 형식 (010-1234-5678)
 */
const phoneSchema = z
  .string()
  .min(1, {message: "전화번호를 입력하세요."})
  .max(13, {message: "전화번호는 13자 이하여야 합니다."})
  .regex(/^01[0-9]-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")

/**
 * 회원가입 폼 스키마
 * 
 * Backend SiteUserRegisterDto와 동일한 구조:
 * - userId: 사용자 아이디
 * - userPwd: 비밀번호
 * - userName: 사용자 이름
 * - userEmail: 이메일
 * - phone: 전화번호
 */
const signUpSchema = z.object({
  userId: userIdSchema,
  userPwd: passwordSchema,
  userName: nameSchema,
  userEmail: emailSchema,
  phone: phoneSchema,
})

/**
 * 로그인 폼 스키마
 * 
 * Backend SiteUserLoginDto와 동일한 구조:
 * - userId: 사용자 아이디
 * - password: 비밀번호
 */
const loginSchema = z.object({
  userId: userIdSchema,
  password: passwordSchema,
})

// TypeScript 타입 정의
// Zod 스키마에서 TypeScript 타입을 자동으로 추출
export type SignUpPayload = z.infer<typeof signUpSchema>
export type LoginPayload = z.infer<typeof loginSchema>

// 스키마들을 객체로 그룹화하여 export
export const userSchemas = {
  signUpSchema,
  loginSchema,
}

// 기본값 생성
// common.ts의 extractDefaultValues 함수를 사용하여 각 스키마의 기본값을 생성
// 이 기본값들은 React Hook Form의 defaultValues로 사용됩니다.
export const userDefaultValues = {
  signUpDefaultValues: extractDefaultValues(signUpSchema),
  loginDefaultValues: extractDefaultValues(loginSchema),
}
