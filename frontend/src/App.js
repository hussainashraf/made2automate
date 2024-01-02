import MyForm from "./pages/form";
import ProductList from "./pages/ProductDetails"
import List from "./pages/List"
import {BrowserRouter,Routes,Route} from "react-router-dom"
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<MyForm/>}/>
    <Route path="/products" element={<ProductList/>}/>
    <Route path="/List/:productId" element={<List/>} />
  </Routes>
  </BrowserRouter>
  );
}

export default App;
