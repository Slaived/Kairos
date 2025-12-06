import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout, clearCheckoutError } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Obtener estados de Redux
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { checkout, loading: checkoutLoading, error: checkoutError } = useSelector((state) => state.checkout);

    const [checkoutId, setCheckoutId] = useState(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "", // Corregí el typo: "fisrtName" -> "firstName"
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    // Asegurar que el carrito esté cargado antes de proceder
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    // Limpiar errores automáticamente
    useEffect(() => {
        if (checkoutError) {
            const timer = setTimeout(() => {
                dispatch(clearCheckoutError());
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [checkoutError, dispatch]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        setLocalError(null);
        
        // Validaciones
        if (!cart || cart.products.length === 0) {
            setLocalError("El carrito está vacío");
            return;
        }
        
        if (!validateShippingAddress()) {
            setLocalError("Por favor completa todos los campos de dirección");
            return;
        }

        try {
            const result = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "Paypal",
                totalPrice: cart.totalPrice,
            }));

            // Verificar si la acción fue exitosa usando el matcher
            if (createCheckout.fulfilled.match(result)) {
                // Establecer ID de checkout si el checkout fue exitoso
                const payload = result.payload;
                if (payload?._id) {
                    setCheckoutId(payload._id);
                } else if (payload?.checkout?._id) {
                    setCheckoutId(payload.checkout._id);
                } else if (payload?.data?._id) {
                    setCheckoutId(payload.data._id);
                } else {
                    console.warn('Checkout creado pero no se encontró ID en la respuesta:', payload);
                }
            } else if (createCheckout.rejected.match(result)) {
                setLocalError(result.payload?.message || result.error?.message || "Error al crear el checkout");
            }
        } catch (error) {
            setLocalError("Error inesperado al crear el checkout");
            console.error('Create checkout error:', error);
        }
    };

    const validateShippingAddress = () => {
        const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;
        return firstName && lastName && address && city && postalCode && country && phone;
    };

    const handlePaymentSuccess = async (details) => {
        setLocalLoading(true);
        setLocalError(null);
        
        try {
            if (!checkoutId) {
                throw new Error("No hay un checkout ID válido");
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { 
                    checkoutId,
                    paymentStatus: "pagado", 
                    paymentDetails: details 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            if (response.status === 200) {
                await handleFinalizeCheckout(checkoutId); // Finalizar el checkout si el pago es exitoso
            } else {
                throw new Error("Error al procesar el pago");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setLocalError(error.response?.data?.message || error.message || "Error al procesar el pago");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
  try {
    console.log('📍 Finalizing checkout ID:', checkoutId);
    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
      {}, // Cuerpo vacío
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    console.log('✅ Finalize response:', response.data);

    if (response.status === 200 || response.status === 201) {
      navigate("/order-confirmation", { 
        state: { 
          checkoutId, 
          success: true,
          orderDetails: response.data 
        } 
      });
    } else {
      throw new Error(`HTTP ${response.status}: Error al finalizar el checkout`);
    }
  } catch (error) {
    console.error("❌ Finalize checkout error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || error.message 
      || "Error al finalizar el checkout";
    
    setLocalError(`Finalize error: ${errorMessage} (Status: ${error.response?.status || 'N/A'})`);
    
    // Mostrar alerta más informativa
    alert(`Error finalizando checkout:\n\n${errorMessage}\n\nStatus: ${error.response?.status || 'N/A'}\n\nPor favor contacta soporte.`);
  }
};

    // Estados de carga y error combinados
    const isLoading = cartLoading || checkoutLoading || localLoading;
    const errorMessage = cartError || checkoutError || localError;

    if (cartLoading) return <p className="text-center py-10">Cargando carrito...</p>;
    if (cartError) return <p className="text-center py-10 text-red-600">Error: {cartError}</p>;
    
    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-xl mb-4">Tu carrito está vacío.</p>
                <button 
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                    Continuar comprando
                </button>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* Sección Izquierda */}
            <div className='bg-white rounded-lg p-6'>
                <h2 className='text-2xl uppercase mb-6'>Verificar</h2>
                
                {/* Mostrar errores */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                        <button 
                            onClick={() => {
                                setLocalError(null);
                                if (checkoutError) dispatch(clearCheckoutError());
                            }}
                            className="float-right text-red-700 hover:text-red-900"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleCreateCheckout}>
                    <h3 className='text-lg mb-4'>Detalles de Contacto</h3>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Correo</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            className='w-full p-2 border rounded bg-gray-50'
                            disabled
                        />
                    </div>
                    
                    <h3 className='text-lg mb-4'>Entrega</h3>
                    
                    <div className='mb-4 grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-gray-700'>Nombre</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value
                                    })
                                }
                                className='w-full p-2 border rounded'
                                required
                                disabled={isLoading || checkoutId}
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700'>Apellido</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value
                                    })
                                }
                                className='w-full p-2 border rounded'
                                required
                                disabled={isLoading || checkoutId}
                            />
                        </div>
                    </div>
                    
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Dirección</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded'
                            required
                            disabled={isLoading || checkoutId}
                        />
                    </div>
                    
                    <div className='mb-4 grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-gray-700'>Ciudad</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value
                                    })
                                }
                                className='w-full p-2 border rounded'
                                required
                                disabled={isLoading || checkoutId}
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700'>Código Postal</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value
                                    })
                                }
                                className='w-full p-2 border rounded'
                                required
                                disabled={isLoading || checkoutId}
                            />
                        </div>
                    </div>
                    
                    <div className='mb-4'>
                        <label className='block text-gray-700'>País</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    country: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded'
                            required
                            disabled={isLoading || checkoutId}
                        />
                    </div>
                    
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Teléfono</label>
                        <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    phone: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded'
                            required
                            disabled={isLoading || checkoutId}
                        />
                    </div>
                    
                    <div className='mt-6'>
                        {!checkoutId ? (
                            <button
                                type='submit'
                                disabled={isLoading}
                                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} text-white py-3 rounded transition`}
                            >
                                {isLoading ? 'Procesando...' : 'Continuar con el Pago'}
                            </button>
                        ) : (
                            <div>
                                <h3 className='text-lg mb-4'>Pago con PayPal</h3>
                                <div className="p-4 bg-blue-50 rounded mb-4">
                                    <p className="text-blue-700">
                                        Checkout ID: <strong>{checkoutId}</strong>
                                    </p>
                                </div>
                                
                                {localLoading ? (
                                    <div className="text-center py-4">
                                        <p>Procesando pago...</p>
                                    </div>
                                ) : (
                                    <PayPalButton
                                        amount={cart.totalPrice}
                                        onSuccess={handlePaymentSuccess}
                                        onError={(err) => {
                                            setLocalError(err.message || "Pago fallido. Intenta de nuevo.");
                                        }}
                                        disabled={localLoading}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </div>
            
            {/* Sección Derecha */}
            <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg mb-4'>Resumen del pedido</h3>
                <div className='border-t py-4 mb-4'>
                    {cart.products.map((product, index) => (
                        <div key={index} className='flex items-start justify-between py-2 border-b'>
                            <div className='flex items-start'>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-20 h-24 object-cover mr-4'
                                />
                                <div>
                                    <h3 className='text-md'>{product.name}</h3>
                                    <p className='text-gray-500'>Cantidad: {product.quantity || 1}</p>
                                    {product.size && <p className='text-gray-500'>Talla: {product.size}</p>}
                                    {product.color && <p className='text-gray-500'>Color: {product.color}</p>}
                                </div>
                            </div>
                            <p className="text-xl">${(product.price || 0).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                
                <div className='flex justify-between items-center text-lg mb-4'>
                    <p>Subtotal</p>
                    <p>${(cart.totalPrice || 0).toLocaleString()}</p>
                </div>
                
                <div className='flex justify-between items-center text-lg'>
                    <p>Envío</p>
                    <p>Gratis</p>
                </div>
                
                <div className='flex justify-between items-center text-lg mt-4 border-t pt-4'>
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold">${(cart.totalPrice || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default Checkout;