import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.scrollPaddingTop = "4rem";
    root.style.scrollBehavior = "smooth";
  }, [theme]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    navigate("/"); // Go to main page first
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <>
      <Header navigate={navigate} handleScrollTo={handleScrollTo} toggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
      <footer className="bg-secondary/50">
        <div className="container mx-auto py-8 px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 여행의 발견. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
