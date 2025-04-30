export const initialStore = () => {
  
  const storedToken = sessionStorage.getItem('token');
  const storedUser = sessionStorage.getItem('user');
  
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    
    auth: {
      token: storedToken || null,
      user: storedUser ? JSON.parse(storedUser) : null,
      loading: false,
      error: null
    }
  };
};

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    
   
    case 'auth_loading':
      return {
        ...store,
        auth: {
          ...store.auth,
          loading: true,
          error: null
        }
      };
      
    case 'login_success':
      
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      
      return {
        ...store,
        auth: {
          token: action.payload.token,
          user: action.payload.user,
          loading: false,
          error: null
        }
      };
      
    case 'auth_error':
      return {
        ...store,
        auth: {
          ...store.auth,
          loading: false,
          error: action.payload
        }
      };
      
    case 'signup_success':
      return {
        ...store,
        auth: {
          ...store.auth,
          loading: false,
          error: null
        }
      };
      
    case 'logout':
      
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      return {
        ...store,
        auth: {
          token: null,
          user: null,
          loading: false,
          error: null
        }
      };
      
    default:
      throw Error('Unknown action.');
  }    
}


export const loginUser = async (email, password, dispatch) => {
  try {
    dispatch({ type: 'auth_loading' });
    
    const resp = await fetch(`${process.env.VITE_BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || 'Error en el inicio de sesión');
    }
    
    dispatch({
      type: 'login_success',
      payload: {
        token: data.token,
        user: data.user
      }
    });
    
    return true;
  } catch (error) {
    dispatch({
      type: 'auth_error',
      payload: error.message
    });
    
    return false;
  }
};

export const signupUser = async (userData, dispatch) => {
  try {
    dispatch({ type: 'auth_loading' });
    
    const resp = await fetch(`${process.env.VITE_BACKEND_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || 'Error en el registro');
    }
    
    dispatch({ type: 'signup_success' });
    
    return true;
  } catch (error) {
    dispatch({
      type: 'auth_error',
      payload: error.message
    });
    
    return false;
  }
};

export const logoutUser = (dispatch) => {
  dispatch({ type: 'logout' });
};

export const validateToken = async (token, dispatch) => {
  try {
    const resp = await fetch(`${process.env.VITE_BACKEND_URL}/api/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!resp.ok) {
      //aqui simplemente es si el token no es ok que haga logout, deberia ocurrir cada dos horas que es el tiempo que le pusimos al token
      dispatch({ type: 'logout' });
      return false;
    }
    
    
    return true;
  } catch (error) {
    dispatch({ type: 'logout' });
    return false;
  }
};

//en resumen lo que intento aquí añadiendo la autorización y los token es, cuando inicio sesión se obtiene el token, que se guarda en el storage (las 2 horas)
// y se actualiza el estado global, al cerrar sesión se elimina del storage, teniendo que volver a inciiar pero si cierras la pagina sin hacer logout 
// te inicie sessión de manera autmática con el token, una vez pasada las 2 horas el token se vuelve inválido, lke tuve que pedir ayuda al chatgpt pq no sabia como hacer
// que reconociera con el Get que despues me explicó con los condicionales de la línea 193