import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, deleteUser, updateUser, fetchUsers } from '../../redux/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user: currentUser } = useSelector((state) => state.auth);
    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        if (!currentUser || currentUser.role !== "admin") {
            navigate("/");
            return;
        }
        
        dispatch(fetchUsers());
    }, [currentUser, navigate, dispatch]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "cliente",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData))
            .unwrap()
            .then(() => {
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "cliente",
                });
                dispatch(fetchUsers());
            })
            .catch((error) => {
                alert(`Error al crear usuario: ${error.message}`);
            });
    };

    const handleRoleChange = (userId, newRole, userEmail) => {
        // Prevenir cambio de rol del admin principal
        if (userEmail === "admin@gmail.com" && newRole !== "admin") {
            alert("No se puede cambiar el rol del administrador principal.");
            return;
        }

        dispatch(updateUser({ id: userId, role: newRole }))
            .unwrap()
            .then(() => {
                dispatch(fetchUsers());
            })
            .catch((error) => {
                alert(`Error al cambiar rol: ${error.message}`);
            });
    };

    const handleDeleteUser = (userId, userEmail) => {
        // Prevenir eliminación del admin principal
        if (userEmail === "admin@gmail.com") {
            alert("No se puede eliminar la cuenta de administrador principal.");
            return;
        }

        if (window.confirm("¿Estás seguro de querer eliminar este usuario?")) {
            dispatch(deleteUser(userId))
                .unwrap()
                .then(() => {
                    console.log("Usuario eliminado exitosamente");
                    dispatch(fetchUsers());
                })
                .catch((error) => {
                    alert(`Error al eliminar usuario: ${error.message}`);
                });
        }
    };

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
            
            {loading && <p className="text-blue-500">Cargando usuarios...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            {/* Formulario para nuevos usuarios */}
            <div className='p-6 border rounded-lg mb-6 bg-gray-50'>
                <h3 className='text-lg font-bold mb-4'>Añadir nuevo usuario</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className="block text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className="block text-gray-700 mb-2">Correo</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className="block text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className="block text-gray-700 mb-2">Rol</label>
                        <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                        >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button 
                        type='submit' 
                        className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
                        disabled={loading}
                    >
                        {loading ? 'Añadiendo...' : 'Añadir Usuario'}
                    </button>
                </form>
            </div>

            {/* Lista de Gestión de Usuarios */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Nombre</th>
                            <th className='py-3 px-4'>Correo</th>
                            <th className='py-3 px-4'>Rol</th>
                            <th className='py-3 px-4'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr 
                                    key={user._id}
                                    className='border-b hover:bg-gray-50'
                                >
                                    <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
                                        {user.name}
                                    </td>
                                    <td className='p-4'>{user.email}</td>
                                    <td className='p-4'>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value, user.email)}
                                            className={`p-2 border rounded ${
                                                user.email === "admin@gmail.com" 
                                                    ? 'bg-gray-100 cursor-not-allowed' 
                                                    : ''
                                            }`}
                                            disabled={user.email === "admin@gmail.com" || loading}
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className='p-4'>
                                        <button 
                                            onClick={() => handleDeleteUser(user._id, user.email)}
                                            className={`px-4 py-2 rounded ${
                                                user.email === "admin@gmail.com" 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                            disabled={user.email === "admin@gmail.com" || loading}
                                            title={user.email === "admin@gmail.com" 
                                                ? "Este usuario no se puede eliminar" 
                                                : "Eliminar usuario"}
                                        >
                                            {user.email === "admin@gmail.com" ? "Protegido" : "Eliminar"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    {loading ? 'Cargando usuarios...' : 'No hay usuarios registrados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement;