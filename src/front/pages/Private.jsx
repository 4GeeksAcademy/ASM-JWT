import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { validateToken } from "../store";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!store.auth?.token) {
        navigate("/login");
        return;
      }
      
      // Validar el token con el backend
      const isValid = await validateToken(store.auth.token, dispatch);
      
      if (!isValid) {
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [store.auth?.token, dispatch, navigate]);
  
  // Si no hay usuario autenticado, mostrar cargando
  if (!store.auth?.user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Verificando autenticación...</p>
      </div>
    );
  }
  
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Área Privada</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">¡Bienvenido, {store.auth.user.username}!</h4>
            <p>Has accedido correctamente al área privada de la aplicación. Solo los usuarios autenticados pueden ver este contenido.</p>
          </div>
          
          <div className="mt-4">
            <h5>Información de Usuario:</h5>
            <ul className="list-group mb-4">
              <li className="list-group-item">
                <strong>ID:</strong> {store.auth.user.id}
              </li>
              <li className="list-group-item">
                <strong>Nombre de usuario:</strong> {store.auth.user.username}
              </li>
              <li className="list-group-item">
                <strong>Correo electrónico:</strong> {store.auth.user.email}
              </li>
            </ul>
          </div>
          
          <div className="mt-4">
            <h5>Tareas Pendientes:</h5>
            <ul className="list-group">
              {store.todos.map((todo) => (
                <li 
                  key={todo.id} 
                  className="list-group-item"
                  style={todo.background ? { backgroundColor: todo.background } : {}}
                >
                  {todo.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Private;