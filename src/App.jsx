
  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

  import { ModelLoader } from "./components/home/HomePage.jsx";
  import { CropPage } from "./components/crop/CropPage.jsx";
  import { FertilizerPage } from "./components/fertilizer/FertilizerPage.jsx";
  import { CropResult } from "./components/result/CropResult.jsx";
  import { FertilizerResult } from "./components/result/FertilizerResult.jsx";
  import Login from "./components/auth/Login";
  import Signup from "./components/auth/Signup";
  import Profile from "./components/profile/Profile.jsx";
  import HistoryPage from "./components/history/HistoryPage.jsx";
  import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
  import BlogPage from "./components/blog/BlogPage.jsx";

  function NotFound() {
    return <Navigate to="/" />;
  }

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ModelLoader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes — require login */}
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/crop" element={<ProtectedRoute><CropPage /></ProtectedRoute>} />
          <Route path="/fertilizer" element={<ProtectedRoute><FertilizerPage /></ProtectedRoute>} />
          <Route path="/crop_result" element={<ProtectedRoute><CropResult /></ProtectedRoute>} />
          <Route path="/fertilizer_result" element={<ProtectedRoute><FertilizerResult /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
