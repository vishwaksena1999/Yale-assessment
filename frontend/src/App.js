import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Publication from "./Publication";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index Component={Home} />
          <Route path="publication/:id" Component={Publication} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
