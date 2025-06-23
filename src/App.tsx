import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Layout from "./layouts/Layout";
import MainPage from "./pages/main/MainPage";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background text-foreground min-h-screen">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
