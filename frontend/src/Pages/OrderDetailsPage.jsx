import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error} </p>;

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-2xl md:text-3xl font-bold mb-6'>Detalles de Orden</h2>
            {!orderDetails ? (
                <p>Detalle de Orden No encontrado</p>
            ) : (
                <div className='p-4 sm:p-6 rounded-lg border'>
                    {/* Info de Orden */}
                    <div className='flex flex-col sm:flex-row justify-between mb-8'>
                        <div>
                            <h3 className='text-lg md:text-xl font-semibold'>
                                ID de Orden: #{orderDetails._id}
                            </h3>
                            <p className='text-gray-600'>
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className='flex flex-col items-start sm:items-end mt-4 sm:mt-0'>
                            <span className={`${orderDetails.isPaid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                            >
                                {orderDetails.isPaid ? "Aprobado" : "Pendiente"}
                            </span>
                            <span className={`${orderDetails.isDelivered
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
                            >
                                {orderDetails.isDelivered ? "Entregado" : "Entrega Pendiente"}
                            </span>
                        </div>
                    </div>
                    {/* Info de Clientes, Pago, Envío */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8'>
                        <div>
                            <h4 className='text-lg font-semibold mb-2'>Información de Pago</h4>
                            <p>Método de Pago: {orderDetails.paymentMethod}</p>
                            <p>Estado: {orderDetails.isPaid ? "Pagado" : "No pagado"}</p>
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold mb-2'>Información de Envío</h4>
                            <p>Método de Envío: {orderDetails.shippingMethod}</p>
                            <p>
                                Dirección:{" "}
                                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
                            </p>
                        </div>
                    </div>
                    {/* Lista de producto */}
                    <div className='overflow-x-auto'>
                        <h4 className='text-lg font-semibold mb-4'>Productos</h4>
                        <table className='min-w-full text-gray-600 mb-4'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    {/* ENCABEZADOS CENTRADOS */}
                                    <th className='py-2 px-4 text-center'>Nombre</th>
                                    <th className='py-2 px-4 text-center'>Precio Unitario</th>
                                    <th className='py-2 px-4 text-center'>Cantidad</th>
                                    <th className='py-2 px-4 text-center'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.orderItems.map((item) => (
                                    <tr key={item.productId} className='border-b'>
                                        {/* Columna del nombre con imagen - centrado vertical pero no horizontal */}
                                        <td className='py-2 px-4 flex items-center justify-center'>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='w-12 h-12 object-cover rounded-lg mr-4'
                                            />
                                            <Link to={`/product/${item.productId}`}
                                                className='text-blue-500 hover:underline'
                                            >
                                                {item.name}
                                            </Link>
                                        </td>
                                        {/* DATOS CENTRADOS */}
                                        <td className="py-2 px-4 text-center">${item.price}</td>
                                        <td className="py-2 px-4 text-center">{item.quantity}</td>
                                        <td className="py-2 px-4 text-center">${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Volver al enlace de pedidos */}
                    <Link to="/my-orders" className='text-blue-500 hover:underline'>
                        Volver a mis pedidos
                    </Link>
                </div>
            )}
        </div>
    )
}

export default OrderDetailsPage;