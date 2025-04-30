import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { logoutUser } from "../store/store";

export const Navbar = () => {
	const { store, dispatch } = useContext(Context);
	const navigate = useNavigate();
	
	const handleLogout = () => {
		logoutUser(dispatch);
		navigate("/login");
	};
	
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Mi Aplicación</span>
				</Link>
				<div className="ml-auto">
					{!store.auth.user ? (
						<>
							<Link to="/login">
								<button className="btn btn-primary me-2">Iniciar Sesión</button>
							</Link>
							<Link to="/signup">
								<button className="btn btn-outline-primary">Registrarse</button>
							</Link>
						</>
					) : (
						<>
							<span className="me-3">Hola, {store.auth.user.username}</span>
							<Link to="/private">
								<button className="btn btn-success me-2">Área Privada</button>
							</Link>
							<button onClick={handleLogout} className="btn btn-outline-danger">
								Cerrar Sesión
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;