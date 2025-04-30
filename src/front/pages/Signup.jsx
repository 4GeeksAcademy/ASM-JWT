import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { signupUser } from "../store/store";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const { store, dispatch } = useContext(Context);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  
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
    
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    
    if (!formData.email) {
      errors.email = "El correo electrónico es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Formato de correo no válido";
      isValid = false;
    }
    
   
    if (!formData.username) {
      errors.username = "El nombre de usuario es obligatorio";
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
      isValid = false;
    }
    
    // Validar password
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }
    
 
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {

      const { confirmPassword, ...userData } = formData;
      
      const success = await signupUser(userData, dispatch);
      
      if (success) {
        navigate("/login");
      }
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Registro de Usuario</h4>
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
                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo electrónico"
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Elige un nombre de usuario"
                  />
                  {formErrors.username && (
                    <div className="invalid-feedback">{formErrors.username}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">{formErrors.password}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                  />
                  {formErrors.confirmPassword && (
                    <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                  )}
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={store.auth.loading}
                  >
                    {store.auth.loading ? "Registrando..." : "Registrarme"}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-center">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}>
                    Inicia sesión aquí
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

export default Signup;