import MainPage from "./pages/main-page";
import "./App.css";
import ContextsProvider from "./context";

function App() {
  return (
    <ContextsProvider>
      <MainPage />
    </ContextsProvider>
  );
}

export default App;
