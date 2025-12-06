import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0); // Corregido: inicializar con 0, no false
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data || []); // Corregido: response.data, no response.date
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
                setNewArrivals([]); // Asegurar que sea array vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    const handleMouseDown = (e) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    }

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollRef.current) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    }

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Corregido: behavior, no behaviour
    }

    // Actualizar Botones de Desplazamiento
    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable =
                container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, [newArrivals]);

    if (loading) {
        return (
            <section className='py-16 px-4 lg:px-0'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold mb-4'>Explora lo recién llegado</h2>
                    <p className='text-lg text-gray-600 mb-8'>
                        Descubre los estilos más recientes...
                    </p>
                    <div className='flex justify-center items-center h-64'>
                        <p>Cargando productos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>Explora lo recién llegado</h2>
                <p className='text-lg text-gray-600 mb-8'>
                    Descubre los estilos más recientes directamente de la pasarela,
                    recién añadidos para mantener tu guardarropa a la vanguardia de la moda.
                </p>

                {/* Botones de desplazamiento */}
                <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${canScrollLeft
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronLeft />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${canScrollRight
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}>
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            {/* Contenido desplazable */}
            {newArrivals.length > 0 ? (
                <div
                    ref={scrollRef}
                    className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ?
                            "cursor-grabbing" : "cursor-grab"
                        }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                >
                    {newArrivals.map((product) => (
                        <div
                            key={product._id}
                            className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'
                        >
                            {product.images?.[0]?.url && ( // Validación de imagen
                                <img
                                    src={product.images[0].url}
                                    alt={product.images[0]?.altText || product.name}
                                    className='w-full h-[500px] object-cover rounded-lg'
                                    draggable="false"
                                />
                            )}
                            <div className='absolute bottom-0 left-0 right-0 backdrop-blur-md text-white 
                        p-4 rounded-b-lg'
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <Link to={`/product/${product._id}`} className='block'>
                                    <h4 className='font-medium'>{product.name}</h4>
                                    <p className='mt-1'>${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='container mx-auto text-center'>
                    <p className='text-gray-500'>No hay productos nuevos disponibles.</p>
                </div>
            )}
        </section>
    )
}

export default NewArrivals