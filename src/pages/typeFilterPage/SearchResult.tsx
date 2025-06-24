import { searchApi } from "@/api/search";
import PagedContentGrid from "@/components/PagedContentGrid";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResult() {
  //   const recommendationData = useMemo(
  //     () => ({
  //       spots: [
  //         {
  //           id: 1,
  //           title: "경복궁",
  //           addr: "서울 종로구 사직로 161",
  //           image:
  //             "https://placehold.co/600x400/a78bfa/ffffff?text=Gyeongbokgung",
  //         },
  //         {
  //           id: 2,
  //           title: "남산서울타워",
  //           addr: "서울 용산구 남산공원길 105",
  //           image:
  //             "https://placehold.co/600x400/f87171/ffffff?text=N+Seoul+Tower",
  //         },
  //         {
  //           id: 3,
  //           title: "해운대해수욕장",
  //           addr: "부산 해운대구 우동",
  //           image: "https://placehold.co/600x400/34d399/ffffff?text=Haeundae",
  //         },
  //         {
  //           id: 4,
  //           title: "성산일출봉",
  //           addr: "제주 서귀포시 성산읍 성산리",
  //           image:
  //             "https://placehold.co/600x400/fb923c/ffffff?text=Seongsan+Ilchulbong",
  //         },
  //       ],
  //       facilities: [
  //         {
  //           id: 5,
  //           title: "국립중앙박물관",
  //           addr: "서울 용산구 서빙고로 137",
  //           image:
  //             "https://placehold.co/600x400/60a5fa/ffffff?text=National+Museum",
  //         },
  //         {
  //           id: 6,
  //           title: "예술의전당",
  //           addr: "서울 서초구 남부순환로 2406",
  //           image:
  //             "https://placehold.co/600x400/c084fc/ffffff?text=Seoul+Arts+Center",
  //         },
  //         {
  //           id: 7,
  //           title: "독립기념관",
  //           addr: "충남 천안시 동남구 목천읍 독립기념관로 1",
  //           image:
  //             "https://placehold.co/600x400/f472b6/ffffff?text=Independence+Hall",
  //         },
  //         {
  //           id: 8,
  //           title: "부산시립미술관",
  //           addr: "부산 해운대구 APEC로 58",
  //           image:
  //             "https://placehold.co/600x400/4ade80/ffffff?text=Busan+Museum+of+Art",
  //         },
  //       ],
  //       festivals: [
  //         {
  //           id: 9,
  //           title: "보령머드축제",
  //           addr: "충남 보령시 신흑동",
  //           image: "https://placehold.co/600x400/22d3ee/ffffff?text=Mud+Festival",
  //         },
  //         {
  //           id: 10,
  //           title: "진해군항제",
  //           addr: "경남 창원시 진해구",
  //           image:
  //             "https://placehold.co/600x400/f9a8d4/ffffff?text=Jinhae+Gunhangje",
  //         },
  //         {
  //           id: 11,
  //           title: "안동국제탈춤페스티벌",
  //           addr: "경북 안동시 육사로 239",
  //           image:
  //             "https://placehold.co/600x400/fdba74/ffffff?text=Andong+Mask+Dance",
  //         },
  //         {
  //           id: 12,
  //           title: "서울세계불꽃축제",
  //           addr: "서울 영등포구 여의동로 330",
  //           image:
  //             "https://placehold.co/600x400/818cf8/ffffff?text=Seoul+Fireworks",
  //         },
  //       ],
  //       courses: [
  //         {
  //           id: 13,
  //           title: "서울 도심 고궁 나들이",
  //           addr: "서울 종로구 일대",
  //           image:
  //             "https://placehold.co/600x400/d8b4fe/ffffff?text=Seoul+Palace+Tour",
  //         },
  //         {
  //           id: 14,
  //           title: "제주 올레길 7코스",
  //           addr: "제주 서귀포시 법환포구",
  //           image: "https://placehold.co/600x400/93c5fd/ffffff?text=Olle+Trail+7",
  //         },
  //         {
  //           id: 15,
  //           title: "부산 해안도로 드라이브",
  //           addr: "부산 해운대구~기장군",
  //           image:
  //             "https://placehold.co/600x400/6ee7b7/ffffff?text=Busan+Coastal+Road",
  //         },
  //         {
  //           id: 16,
  //           title: "경주 역사 유적지 탐방",
  //           addr: "경북 경주시 일대",
  //           image:
  //             "https://placehold.co/600x400/fca5a5/ffffff?text=Gyeongju+Historic",
  //         },
  //       ],
  //     }),
  //     []
  //   );
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    searchApi.search(params).then((res: any) => {
      if (Array.isArray(res.data)) {
        setResult(res.data);
      } else {
        setResult([]);
      }
    });
  }, [searchParams]);

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto px-4 flex flex-col justify-start">
        <PagedContentGrid items={result} />
      </div>
    </>
  );
}
