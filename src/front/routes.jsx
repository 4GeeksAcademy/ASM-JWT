// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Nuevos componentes
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Private } from "./pages/Private";

// Removed unnecessary imports
// import { useContext } from "react";
// import useGlobalReducer from "./hooks/useGlobalReducer";


const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      {/* Nested Routes: Defines sub-routes within the Layout component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} /> {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/private"
        element={
          <ProtectedRoute>
            <Private />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);