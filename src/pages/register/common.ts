import { z } from "zod"

/**
 * 공통 유틸리티 함수들을 모아놓은 파일
 * 
 * 이 파일은 register 폴더 내의 다른 파일들에서 공통으로 사용되는
 * 유틸리티 함수들을 제공합니다.
 * 
 * 주요 기능:
 * - Zod 스키마에서 기본값을 추출하는 함수
 * - 폼 초기화에 필요한 기본값 생성
 */

/**
 * Zod 스키마에서 기본값을 추출하는 함수
 * 
 * 이 함수는 Zod 스키마 객체를 받아서 해당 스키마의 각 필드에 대한
 * 기본값을 포함한 객체를 반환합니다.
 * 
 * 사용 예시:
 * ```typescript
 * const schema = z.object({
 *   name: z.string(),
 *   email: z.string().email(),
 *   age: z.number().optional()
 * })
 * 
 * const defaults = extractDefaultValues(schema)
 * // 결과: { name: "", email: "", age: undefined }
 * ```
 * 
 * @param schema Zod 스키마 객체
 * @returns 스키마의 기본값 객체
 */
export function extractDefaultValues<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.infer<typeof schema> {
  const shape = schema.shape
  const defaultValues: Record<string, any> = {}

  // 스키마의 각 필드를 순회하면서 기본값을 결정
  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodDefault) {
      // 스키마에 기본값이 명시적으로 정의된 경우
      defaultValues[key] = value._def.defaultValue()
    } else if (value instanceof z.ZodOptional) {
      // 선택적 필드 (optional)인 경우
      defaultValues[key] = undefined
    } else if (value instanceof z.ZodNullable) {
      // null을 허용하는 필드인 경우
      defaultValues[key] = null
    } else {
      // 기본 타입의 경우 타입에 맞는 빈 값으로 초기화
      if (value instanceof z.ZodString) {
        defaultValues[key] = ""
      } else if (value instanceof z.ZodNumber) {
        defaultValues[key] = 0
      } else if (value instanceof z.ZodBoolean) {
        defaultValues[key] = false
      } else if (value instanceof z.ZodArray) {
        defaultValues[key] = []
      } else if (value instanceof z.ZodObject) {
        // 중첩된 객체의 경우 재귀적으로 기본값 추출
        defaultValues[key] = extractDefaultValues(value)
      } else {
        defaultValues[key] = undefined
      }
    }
  }

  return defaultValues as z.infer<typeof schema>
} 