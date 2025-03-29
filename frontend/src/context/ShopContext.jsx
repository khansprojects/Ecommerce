import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currancy = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [cartItems, setCartItems] = useState({});

    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
                
            }
            else{
                cartData[itemId][size] = 1;
            }
            
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}});

            } catch (error) {
                console.log(error);
                // console.log('adding');
                toast.error(error.message);
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }


    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }


    // useEffect(()=>{
    //     console.log(cartItems);
    // }, [cartItems]);

    const getProductsData = async () => {
        try {
            const responce = await axios.get(backendUrl + '/api/product/list');
            // console.log(responce.data);
            if (responce.data.success) {
              setProducts(responce.data.products);  
            } else {
                toast.error(responce.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async ( token ) => {
        try {
            const responese = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}});
            if (responese.data.success) {
                setCartItems(responese.data.cartData);
            }
        } catch (error) {
            console.log(error);
            // console.log('this one');
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, [])

    const value = {
        products, currancy, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount,
        updateQuantity, getCartAmount,
        navigate,
        backendUrl,
        token, setToken,
        setCartItems,

    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;