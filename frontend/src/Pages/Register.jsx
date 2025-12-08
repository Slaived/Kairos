import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.webp';
import { registerUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error: authError } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // Obtener el parámetro de redirección y verificar si es 'checkout' o algo diferente
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    // Validar nombre
    const validateName = (name) => {
        if (!name) return "El nombre es requerido";
        if (name.length < 2) return "El nombre debe tener al menos 2 caracteres";
        return "";
    };

    // Validar email
    const validateEmail = (email) => {
        if (!email) return "El correo es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Por favor, introduce un correo válido";
        return "";
    };

    // Validar contraseña (MÁXIMO 20 CARACTERES)
    const validatePassword = (password) => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        if (password.length > 20) return "La contraseña no puede tener más de 20 caracteres"; // ← Máximo 20
        return "";
    };

    // Validar formulario completo
    const validateForm = () => {
        const newErrors = {};
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        
        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        
        return newErrors;
    };

    // Validar en tiempo real cuando los campos pierden el foco
    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        const newErrors = { ...errors };
        
        if (field === 'name') {
            newErrors.name = validateName(name);
        } else if (field === 'email') {
            newErrors.email = validateEmail(email);
        } else if (field === 'password') {
            newErrors.password = validatePassword(password);
        }
        
        // Eliminar el error si está vacío
        if (!newErrors[field]) {
            delete newErrors[field];
        }
        
        setErrors(newErrors);
    };

    // Manejar cambio de nombre
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        
        if (touched.name) {
            const error = validateName(value);
            if (error) {
                setErrors({ ...errors, name: error });
            } else {
                const newErrors = { ...errors };
                delete newErrors.name;
                setErrors(newErrors);
            }
        }
    };

    // Manejar cambio de email
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (touched.email) {
            const error = validateEmail(value);
            if (error) {
                setErrors({ ...errors, email: error });
            } else {
                const newErrors = { ...errors };
                delete newErrors.email;
                setErrors(newErrors);
            }
        }
    };

    // Manejar cambio de contraseña
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        
        if (touched.password) {
            const error = validatePassword(value);
            if (error) {
                setErrors({ ...errors, password: error });
            } else {
                const newErrors = { ...errors };
                delete newErrors.password;
                setErrors(newErrors);
            }
        }
    };

    // Toggle para mostrar/ocultar contraseña
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Marcar todos los campos como tocados
        setTouched({ name: true, email: true, password: true });
        
        // Validar formulario
        const formErrors = validateForm();
        
        if (Object.keys(formErrors).length === 0) {
            // Si no hay errores, enviar formulario
            dispatch(registerUser({ name, email, password }));
        } else {
            // Si hay errores, mostrarlos
            setErrors(formErrors);
        }
    };

    // Determinar si el botón debe estar deshabilitado
    const isFormValid = name && email && password && Object.keys(errors).length === 0;

    // Corregir el enlace de login (tenía un error)
    const loginLink = `/login?redirect=${encodeURIComponent(redirect)}`;

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'
                >
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Kairos</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>¡Bienvenido! 👋🏼</h2>
                    <p className='text-center mb-6'>
                        Crea una cuenta para comenzar.
                    </p>
                    
                    {/* Mostrar error de autenticación del servidor */}
                    {authError && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
                            <p className='font-medium'>Error al registrarse:</p>
                            <p className='text-sm'>
                                {authError === "User already exists" || authError === "Usuario ya existe" 
                                    ? "Este correo ya está registrado. Por favor, inicia sesión o usa otro correo."
                                    : authError}
                            </p>
                        </div>
                    )}
                    
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={() => handleBlur('name')}
                            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder='Introduce tu nombre completo'
                        />
                        {errors.name && touched.name && (
                            <p className='text-red-500 text-sm mt-1 flex items-center'>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>
                    
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Correo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => handleBlur('email')}
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder='Introduce tu correo electrónico'
                        />
                        {errors.email && touched.email && (
                            <p className='text-red-500 text-sm mt-1 flex items-center'>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>
                    
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2'>Contraseña</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => handleBlur('password')}
                                maxLength="20" // ← Limita a 20 caracteres
                                className={`w-full p-2 border rounded pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder='Introduce tu contraseña (6-20 caracteres)'
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800'
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && touched.password && (
                            <p className='text-red-500 text-sm mt-1 flex items-center'>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.password}
                            </p>
                        )}
                        <div className='mt-2 text-sm text-gray-600'>
                            <p>La contraseña debe tener entre 6 y 20 caracteres.</p>
                            <p className={`mt-1 ${password.length > 20 ? 'text-red-500' : 'text-gray-500'}`}>
                                Caracteres: {password.length}/20
                            </p>
                        </div>
                    </div>
                    
                    <button
                        type='submit'
                        disabled={!isFormValid || loading}
                        className={`w-full p-2 rounded-lg font-semibold transition ${
                            !isFormValid || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        {loading ? "Cargando..." : "Regístrate"}
                    </button>
                    
                    <p className='mt-6 text-center text-sm'>
                        ¿Ya tienes una cuenta?{" "}
                        <Link to={loginLink} className='text-blue-500 hover:underline'>
                            Iniciar Sesión
                        </Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='w-full flex flex-col justify-center items-center'>
                    <img
                        src={register}
                        alt="Crear cuenta"
                        className='h-[750px] w-full object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default Register;