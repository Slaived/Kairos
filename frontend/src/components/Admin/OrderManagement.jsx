import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }));
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">Gestión de Órdenes</h2>

            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">ID Orden</th>
                            <th className="py-3 px-4">Cliente</th>
                            <th className="py-3 px-4">Precio Total</th>
                            <th className="py-3 px-4">Estado</th>
                            <th className="py-3 px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className='border-b hover:bg-gray-50 cursor-pointer'
                                >
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    {/* LÍNEA 54 CORREGIDA: */}
                                    <td className="p-4">{order.user?.name || "Usuario no disponible"}</td>
                                    <td className="p-4">${(order.totalPrice || 0).toFixed(2)}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status || "Procesando"}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                            }
                                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                        focus:ring-blue-500 focus:border-blue-500 block p-2.5'
                                        >
                                            <option value="Procesando">Procesando</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleStatusChange(order._id, "Entregado")}
                                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                                        >
                                            Marcar como Entregado
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='p-4 text-center text-gray-500'>
                                    No se encontraron órdenes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderManagement;