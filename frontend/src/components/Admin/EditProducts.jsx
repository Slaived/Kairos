import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
import axios from 'axios';

const EditProducts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);


    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
    });

    const [uploading, setUploading] = useState(false); // Estado de carga de imagen

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        const formDataObj = new FormData();
        formDataObj.append("image", file);
        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formDataObj,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
            setUploading(false);

        } catch (error) {
            console.error("Error al subir imagen:", error);
            setUploading(false);
            alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ id, productData }));
        navigate("/admin/products");
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className="text-3xl font-bold mb-6">Editar Productos</h2>
            <form onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Nombre del Producto</label>
                    <input
                        type="text"
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Descripción</label>
                    <textarea
                        name='description'
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        rows={4}
                        required
                    />
                </div>

                {/* Precio */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Precio</label>
                    <input
                        type="number"
                        name='price'
                        value={productData.price}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Cantidad en stock */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Cantidad en stock</label>
                    <input
                        type="number"
                        name='countInStock'
                        value={productData.countInStock}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>SKU</label>
                    <input
                        type="text"
                        name='sku'
                        value={productData.sku}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Tallas */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Tallas (separado por comas)
                    </label>
                    <input
                        type="text"
                        name='sizes'
                        value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map((size) => size.trim()),
                        })
                        }
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Colores */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>
                        Colores (separado por comas)
                    </label>
                    <input
                        type="text"
                        name='colors'
                        value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim()),
                        })
                        }
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/*Imagen */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Actualizar Imagen</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p>Cargando imagen...</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image.url}
                                    alt={image.altText || "Imagen de Producto"}
                                    className='w-20 h-20 object-cover rounded-md shadow-md'
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button type='submit' className='w-full bg-green-500 text-white py-2 runded-md
             hover:bg-green-600 transition-colors'
                >
                    Actualizar Producto
                </button>
            </form>
        </div>
    )
}

export default EditProducts