import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    }, [dispatch, collection ,searchParams]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        // Cerramos la sidebar si se hace click afuera
        if (sidebarRef.current && !sidebarRef.current.contains(e.targer)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        //Agregamos Event Listener para clicks
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }), [];

    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Botón de filtro móvil  */}
            <button
                onClick={toggleSidebar}
                className='lg:hidden border p-2 flex justify-center items-center'
            >
                <FaFilter className='mr-2' /> Filtros
            </button>

            {/* Filtro de Sidebar */}
            <div
                ref={sidebarRef}
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
                    lg:static lg:translate-x-0`}
            >
                <FilterSidebar />
            </div>
            <div className='flex-grow p-4'>
                <h2 className='text-2xl uppercase mb-4'>Toda la colección</h2>

                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error}/>
            </div>
        </div>
    )
}

export default CollectionPage