import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home } from './pages';
import { Error404 } from './pages/Error404';

export default function App() {
  const [contract, setContract] = useState();

  useEffect(() => {

  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Home />}
        />
        <Route
          exact
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path='*'
          element={<Error404 />}
        />
      </Routes>
    </BrowserRouter>
  )
}
