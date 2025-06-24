import { useState, useEffect } from "react";
import { searchApi } from "@/api/search"; // searchApi 임포트 경로 확인!

// 백엔드의 ApiResponseDto 타입을 여기에 맞게 정의하거나 가져와야 합니다.
// (이전에 설명드린 TypeScript 인터페이스와 동일)
interface ApiResponseDto<T> {
  code: string; // Java의 private String code; 에 해당
  message: string; // Java의 private String message; 에 해당
  data: T; // Java의 private T data; 에 해당
}

function ApiTestPage() {
  const [cat1List, setCat1List] = useState<string[]>([]); // 대분류 목록을 저장할 상태
  const [loading, setLoading] = useState<boolean>(false); // API 호출 중인지 나타내는 상태
  const [error, setError] = useState<string | null>(null); // 오류 메시지를 저장할 상태

  // API를 호출하는 함수
  const fetchCat1Categories = async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 이전 오류 초기화
    try {
      // searchApi의 getDistinctCat1 함수 호출
      const response = await searchApi.getDistinctCat1();

      console.log("API 응답:", response.data); // 개발자 도구 콘솔에서 응답 확인

      if (response.data.code) {
        setCat1List(response.data.data); // 성공 시 데이터 저장
      } else {
        // 백엔드에서 success: false를 보낼 경우
        setError(response.data.message || "알 수 없는 오류 발생");
      }
    } catch (err) {
      // 네트워크 오류 또는 서버 응답 오류 등
      console.error("API 호출 중 오류 발생:", err);
      setError("API 호출 중 문제가 발생했습니다. 백엔드 서버를 확인하세요.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 자동으로 API 호출하고 싶다면 useEffect 사용
  // 이 경우 버튼 클릭 없이 페이지 진입 시 바로 연결 테스트 가능
  useEffect(() => {
    fetchCat1Categories();
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h2>백엔드 API 연결 테스트 (Cat1)</h2>

      {/* 버튼 클릭 시 API 호출 */}
      <button
        onClick={fetchCat1Categories}
        disabled={loading}
        style={{ padding: "10px 15px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "로딩 중..." : "대분류 목록 불러오기"}
      </button>

      {/* 로딩 상태 표시 */}
      {loading && <p>데이터를 불러오는 중...</p>}

      {/* 오류 메시지 표시 */}
      {error && <p style={{ color: "red" }}>오류: {error}</p>}

      {/* 불러온 데이터 표시 */}
      {cat1List.length > 0 && (
        <div>
          <h3>불러온 대분류 목록:</h3>
          <ul>
            {cat1List.map((cat, index) => (
              <li key={index}>{cat}</li> // 각 대분류 항목을 리스트로 표시
            ))}
          </ul>
        </div>
      )}

      {/* 데이터가 없고 로딩도 아니며 오류도 없을 때 */}
      {!loading && !error && cat1List.length === 0 && (
        <p>아직 불러온 데이터가 없습니다. 버튼을 눌러보세요.</p>
      )}
    </div>
  );
}

export default ApiTestPage;
