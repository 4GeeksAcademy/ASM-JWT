import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { loginUser } from "../store";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
 
  useEffect(() => {
    if (store.auth.token && store.auth.user) {
      navigate("/private");
    }
  }, [store.auth.token, store.auth.user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;
    
    if (!email || !password) {
      return;
    }
    
    const success = await loginUser(email, password, dispatch);
    
    if (success) {
      navigate("/private");
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Iniciar Sesión</h4>
            </div>
            <div className="card-body">
              {store.auth.error && (
                <div className="alert alert-danger" role="alert">
                  {store.auth.error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo electrónico"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={store.auth.loading}
                  >
                    {store.auth.loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-center">
                <p>
                  ¿No tienes una cuenta?{" "}
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}>
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;