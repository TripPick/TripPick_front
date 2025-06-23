import { useState } from "react";
import TabList from "./TabList";
import { category } from "@/pages/typeFilterPage/category";
import SearchFilter from "@/pages/typeFilterPage/SearchFilter";
import SearchResult from "@/pages/typeFilterPage/SearchResult";

export default function TypePage() {
  const [selectedCategory, setSelectedCategory] = useState("spots");

  const selectedCategoryData = category.find(
    (c) => c.category === selectedCategory
  );
  return (
    <>
      <TabList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {selectedCategoryData && (
        <SearchFilter selectedCategory={selectedCategoryData} />
      )}
      <SearchResult />
    </>
  );
}
