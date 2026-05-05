import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { useHydrateMe } from "./domain/user/user.usecase";
import AllRoutes from "./AppRoutes";

const AppRoutes = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const { isLoading, user } = useHydrateMe(isAuthPage);

  if (!isAuthPage && isLoading) {
    return <div>Calling me api</div>;
  }

  return <AllRoutes isAuthenticated={!!user} />;
};

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
