import { BrowserRouter } from "react-router-dom";
import RouterAdmin from "./routers/RouterAdmin";

const App = () => {
  return (
    <div>
    <BrowserRouter>
      <RouterAdmin />
    </BrowserRouter>
    </div>
  );
};

export default App;
