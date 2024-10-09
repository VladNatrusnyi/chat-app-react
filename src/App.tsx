import { MainLayout } from "./components/layouts/MainLayout/MainLayout";
import {AuthProvider} from "./context/AppContext/AppContext.tsx";
import {BrowserRouter} from "react-router-dom";
import {Navigator} from "./navigation/Navigator.tsx";

function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              <MainLayout>
                  <Navigator />
              </MainLayout>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
