import { Toaster } from "react-hot-toast";
import Router from "./router";

function App() {
  return (
    <>
      <Router />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1C2430",
            color: "#F4F7FA",
            border: "1px solid #313D50",
          },
        }}
      />
    </>
  );
}

export default App;