import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        } else {
            setMainImage(null);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Por favor selecciona un color y talla antes de añadir al carrito.", {
                duration: 1000,
            });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Producto añadido al carrito!!", {
                    duration: 1000,
                });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    if (loading) {
        return <p>Cargando...</p>
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    return (
        <div className='p-6'>
            {selectedProduct && (
                <div className='max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg'>
                    {/* Grid: imágenes a la izquierda, info a la derecha */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>

                        {/* === COLUMNA IZQUIERDA: IMÁGENES === */}
                        <div className='order-1 space-y-4'> {/* Agregué space-y-4 para separación */}

                            {/* MINIATURAS ARRIBA (solo en desktop) */}
                            <div className='hidden lg:flex justify-center gap-3 mb-4'>
                                {selectedProduct.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(image.url)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === image.url
                                                ? "border-black scale-105 shadow-md"
                                                : "border-gray-200 hover:border-gray-400"
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.altText || `Thumbnail ${index}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Imagen Principal MUY GRANDE */}
                            <div className='bg-gray-50 p-4 lg:p-6 rounded-2xl shadow-inner'>
                                <img
                                    src={mainImage}
                                    alt="Main Product"
                                    className='w-full h-auto max-h-[500px] object-contain mx-auto'
                                />
                            </div>

                            {/* MINIATURAS ABAJO (solo en móvil) */}
                            <div className='lg:hidden flex overflow-x-auto gap-3 py-3 mt-4'>
                                {selectedProduct.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(image.url)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${mainImage === image.url
                                                ? "border-black"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.altText || `Thumbnail ${index}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* === COLUMNA DERECHA: INFORMACIÓN === */}
                        <div className='order-2 space-y-6'>
                            {/* Título y Precio */}
                            <div>
                                <h1 className='text-4xl font-bold text-gray-900 mb-3'>
                                    {selectedProduct.name}
                                </h1>

                                <div className='flex items-center gap-3 mb-4'>
                                    {selectedProduct.originalPrice && (
                                        <p className='text-xl text-gray-500 line-through'>
                                            ${selectedProduct.originalPrice}
                                        </p>
                                    )}
                                    <p className='text-3xl font-bold text-gray-900'>
                                        ${selectedProduct.price}
                                    </p>
                                </div>

                                <p className='text-gray-700 text-lg leading-relaxed mb-6'>
                                    {selectedProduct.description}
                                </p>
                            </div>

                            {/* Selector de Color */}
                            <div>
                                <p className='text-lg font-semibold text-gray-800 mb-3'>Color:</p>
                                <div className='flex flex-wrap gap-3'>
                                    {selectedProduct.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedColor === color
                                                    ? "border-black scale-110"
                                                    : "border-gray-300 hover:scale-105"
                                                }`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Selector de Talla */}
                            <div>
                                <p className='text-lg font-semibold text-gray-800 mb-3'>Talla:</p>
                                <div className='flex flex-wrap gap-2'>
                                    {selectedProduct.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border font-medium transition-all ${selectedSize === size
                                                    ? "bg-black text-white border-black"
                                                    : "border-gray-300 hover:border-gray-600"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cantidad */}
                            <div>
                                <p className='text-lg font-semibold text-gray-800 mb-3'>Cantidad:</p>
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className='w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors'
                                    >
                                        -
                                    </button>
                                    <span className='text-xl font-bold w-8 text-center'>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className='w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Botón Añadir al Carrito */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`w-full py-3 rounded-lg text-lg font-bold transition-all mt-6 ${isButtonDisabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-black text-white hover:bg-gray-800"
                                    }`}
                            >
                                {isButtonDisabled ? "AÑADIENDO..." : "AÑADIR AL CARRITO"}
                            </button>

                            {/* Características */}
                            <div className='mt-8 pt-6 border-t border-gray-200'>
                                <h3 className='text-xl font-bold text-gray-900 mb-4'>Características</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div>
                                        <p className='text-gray-600 text-sm'>Marca</p>
                                        <p className='font-medium'>{selectedProduct.brand}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600 text-sm'>Material</p>
                                        <p className='font-medium'>{selectedProduct.material}</p>
                                    </div>
                                    {selectedProduct.category && (
                                        <div>
                                            <p className='text-gray-600 text-sm'>Categoría</p>
                                            <p className='font-medium'>{selectedProduct.category}</p>
                                        </div>
                                    )}
                                    {selectedProduct.gender && (
                                        <div>
                                            <p className='text-gray-600 text-sm'>Género</p>
                                            <p className='font-medium'>{selectedProduct.gender}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos Similares */}
                    <div className='mt-16 pt-8 border-t border-gray-200'>
                        <h2 className='text-2xl text-center font-bold text-gray-900 mb-6'>
                            También te puede gustar
                        </h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails