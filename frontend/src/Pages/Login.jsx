import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/login.webp';
import { loginUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error: authError } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    // Validar email
    const validateEmail = (email) => {
        if (!email) return "El correo es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Por favor, introduce un correo válido";
        return "";
    };

    // Validar contraseña (CON MÁXIMO DE 10 CARACTERES)
    const validatePassword = (password) => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        if (password.length > 10) return "La contraseña no puede tener más de 10 caracteres"; // ← Nuevo
        return "";
    };

    // Validar formulario completo
    const validateForm = () => {
        const newErrors = {};
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        
        return newErrors;
    };

    // Validar en tiempo real cuando los campos pierden el foco
    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        const newErrors = { ...errors };
        
        if (field === 'email') {
            newErrors.email = validateEmail(email);
        } else if (field === 'password') {
            newErrors.password = validatePassword(password);
        }
        
        if (!newErrors[field]) {
            delete newErrors[field];
        }
        
        setErrors(newErrors);
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
        
        setTouched({ email: true, password: true });
        
        const formErrors = validateForm();
        
        if (Object.keys(formErrors).length === 0) {
            dispatch(loginUser({ email, password }));
        } else {
            setErrors(formErrors);
        }
    };

    const isFormValid = email && password && Object.keys(errors).length === 0;

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Kairos</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-6'>Hola! 👋🏼</h2>
                    <p className='text-center mb-6'>
                        Introduce tu usuario y contraseña para Iniciar sesión.
                    </p>
                    
                    {authError && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
                            <p className='font-medium'>Error de autenticación:</p>
                            <p className='text-sm'>
                                {authError === "Invalid credentials" || authError === "Credenciales incorrectas" 
                                    ? "Correo o contraseña incorrectos. Por favor, verifica tus datos."
                                    : authError}
                            </p>
                        </div>
                    )}
                    
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
                                maxLength="20" 
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
                            {/* Opcional: Mostrar contador de caracteres */}
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
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                    
                    <p className='mt-6 text-center text-sm'>
                        ¿No tienes una cuenta?{" "}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}
                            className='text-blue-500 hover:underline'>
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='w-full flex flex-col justify-center items-center'>
                    <img
                        src={login}
                        alt="Iniciar sesión de Cuenta"
                        className='h-[750px] w-full object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default Login;