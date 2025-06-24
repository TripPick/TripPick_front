import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import SignUpPage from "./pages/register/page";
import Layout from "./layouts/Layout";
import TypeFilterPage from "./pages/typeFilterPage";
import MainPage from "./pages/main/MainPage";
import { AuthProvider } from "./contexts/AuthContext";
import './App.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-background text-foreground min-h-screen">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<SignUpPage />} />
              <Route path="type-filter" element={<TypeFilterPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
     </AuthProvider>
  );
}

export default App;
