import TabList from "./TabList";
import SearchFilter from "@/pages/typeFilterPage/SearchFilter";
import SearchResult from "@/pages/typeFilterPage/SearchResult";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { category } from "@/pages/typeFilterPage/category";

type Conditions = {
  category?: string;
  main?: string;
  mid?: string;
  detail?: string;
  sido?: string;
  sigungu?: string;
  keyword?: string;
};

export default function TypePage() {
  const [selectedCategory, setSelectedCategory] = useState("spots");
  const [keyword, setKeyword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [conditions, setConditions] = useState({
  //   main: "",
  //   mid: "",
  //   detail: "",
  //   sido: "",
  //   sigungu: "",
  //   keyword: "",
  // });

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const keywordParm = searchParams.get("keyword");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (keywordParm) {
      setKeyword(keywordParm);
    }
  }, [searchParams]);

  const selectedCategoryData = category.find(
    (c) => c.category === selectedCategory
  );

  // 검색 실행
  const handleSearch = (conditions: Conditions) => {
    const params = new URLSearchParams(conditions);
    navigate(`/type-filter?${params.toString()}`);
  };

  return (
    <>
      <TabList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {selectedCategoryData && (
        <SearchFilter
          selectedCategory={selectedCategoryData}
          searchKeyword={keyword}
          onSearch={handleSearch}
        />
      )}
      <SearchResult />
    </>
  );
}
