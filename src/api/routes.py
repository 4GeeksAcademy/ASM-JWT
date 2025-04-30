from flask import Blueprint, request, jsonify
from models import db, User
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps

api = Blueprint('api', __name__)

SECRET_KEY = os.environ.get("FLASK_APP_KEY", "Cacahuete")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Después de usar el decorador de Wrap, busco si la autorización está en el header, n este caso si existe Bearer, si llegara a no existir, devuelve un 401
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1] if "Bearer " in auth_header else auth_header
        
        if not token:
            return jsonify({'message': 'Token no proporcionado!'}), 401
        
        try:
           
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(email=data['email']).first()
            
            if not current_user:
                return jsonify({'message': 'Usuario no encontrado!'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

#Ruta de registro con POST 
@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    
    if not data.get('email') or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Faltan datos requeridos"}), 400
    
    # Aqui simplemente buscamos que no se repita usuario y correo
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'El correo ya está registrado!'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'El nombre de usuario ya está registrado!'}), 409
    
    # y si no existe ya creamos el nuevo usuario
    new_user = User(
        email=data['email'],
        username=data['username'],
        password=data['password']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario registrado correctamente!'}), 201

# un Login simplemente
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Faltan datos requeridos"}), 400
    
    #
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Credenciales inválidas!'}), 401
    
    # Genero el token y le doy un tiempo de expiración de 2 horas 
    token = jwt.encode({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(hours=2)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({
        'message': 'El login ha sido exitoso!',
        'token': token,
        'user': user.serialize()
    }), 200

# Aquí tuve que documentarme sobre las rutas protegidas, y me pareció buena idea el ponerlo
@api.route('/validate', methods=['GET'])
@token_required
def validate(current_user):
    return jsonify({
        'message': 'Token válido!',
        'user': current_user.serialize()
    }), 200

# y ya aquí un simple Get para que muestre el usuario
@api.route('/user-info', methods=['GET'])
@token_required
def user_info(current_user):
    return jsonify(current_user.serialize()), 200