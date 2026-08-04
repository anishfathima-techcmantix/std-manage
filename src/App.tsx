import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.tsx";
import AppRoutes from "./router/AppRoutes.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Session Expiration Toast Notifications */}
        <Toaster position="top-center" />
        {/* Central Router */}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;