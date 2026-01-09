import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider } from "./components";
import ManagedUIContext from "./contexts/ui.context.tsx";
import ModalArea from "./components/commonUI/Modal.tsx";
import ToastContainer from "./components/commonUI/Toast.tsx";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  }) as Record<string, any>;

  return (
    <ManagedUIContext>
      <PolarisProvider>
        <BrowserRouter>
          <QueryProvider>
            <Routes pages={pages} />
            <ModalArea />
            <ToastContainer />
          </QueryProvider>
        </BrowserRouter>
      </PolarisProvider>
    </ManagedUIContext>
  );
}
