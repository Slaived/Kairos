import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiBars3BottomRight
} from "react-icons/hi2";
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce(
        (total, product) => total + product.quantity, 0) ||
        0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <nav className='container mx-auto flex items-center justify-between 
        py-4 px-6'>
                {/* Logo izquierda */}
                <div>
                    <Link to='/' className="text-2xl font-medium">
                        Kairos
                    </Link>
                </div>
                {/* Links de Navegación */}
                <div className='hidden md:flex space-x-6'>
                    <Link
                        to="collections/all?gender=Hombre"
                        className='text-gray-700 hover:text-black text-sm font-medium uppercase'
                    >
                        Hombre
                    </Link>
                    <Link
                        to="collections/all?gender=Mujer"
                        className='text-gray-700 hover:text-black text-sm font-medium uppercase'
                    >
                        Mujer
                    </Link>
                    <Link
                        to="collections/all?category=Ropa de la parte superior"
                        className='text-gray-700 hover:text-black text-sm font-medium uppercase'
                    >
                        Ropa de la parte superior
                    </Link>
                    <Link
                        to="collections/all?category=Ropa de la parte inferior"
                        className='text-gray-700 hover:text-black text-sm font-medium uppercase'
                    >
                        Ropa de la parte inferior
                    </Link>
                </div>
                {/* Iconos */}
                <div className='flex items-center space-x-4'>
                    {user && user.role === "admin" && (
                        <Link
                            to="/admin"
                            className='block bg-black px-2 rounded text-sm text-white'
                        >
                            Administrar
                        </Link>
                    )}
                    <Link to="/profile" className='hover:text-black'>
                        <HiOutlineUser className='h-6 w-6 text-gray-700' />
                    </Link>
                    <button
                        onClick={toggleCartDrawer}
                        className='relative hover:text-black'
                    >
                        <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
                        {cartItemCount > 0 && (<span className='absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5'>
                            {cartItemCount}
                        </span>)}

                    </button>
                    {/* Buscar */}
                    <div className='overflow-hidden'>
                        <SearchBar />
                    </div>

                    <button onClick={toggleNavDrawer} className='md:hidden'>
                        <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
                    </button>
                </div>
            </nav>
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Navegación Móbil */}
            <div className={`fixed top-0 left-0 w-3/4 sm:1/2 md:w-1/3 h-full bg-white shadow-lg transform
                transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className='flex justify-end p-4'>
                    <button>
                        <IoMdClose onClick={toggleNavDrawer}
                            className='h-6 w-6 text-gray-600' />
                    </button>
                </div>
                <div className='p-4'>
                    <h2 className='text-xl font-semibold mb-4'>Menu</h2>
                    <nav className='space-y-4'>
                        <Link to="collections/all?gender=Hombre"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Hombre
                        </Link>
                        <Link to="collections/all?gender=Mujer"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Mujer
                        </Link>
                        <Link to="collections/all?category=Ropa de la parte superior"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Ropa de la parte superior
                        </Link>
                        <Link to="collections/all?category=Ropa de la parte inferior"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Ropa de la parte inferior
                        </Link>
                    </nav>

                </div>
            </div>
        </>
    )
}

export default Navbar