import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart, updateQuantity } from '../redux/cartSlice';
import axios from 'axios';
const Cart = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);

    const decodeToken = useCallback((token) => {
        if (!token) return null;
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.id; // Adjust according to your JWT structure
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = decodeToken(token);
        setUserId(id);
    }, [decodeToken]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productResponses = await Promise.all(
                    cart.map(item => axios.get(`http://localhost:3001/api/fetchproducts/products/${item.id}`))
                );
                setProducts(productResponses.map(response => response.data));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [cart]);

    const handleRemoveFromCart = id => {
        dispatch(removeFromCart(id));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleIncreaseQuantity = id => {
        dispatch(updateQuantity({ id, quantity: getQuantity(id) + 1 }));
    };

    const handleDecreaseQuantity = id => {
        dispatch(updateQuantity({ id, quantity: Math.max(getQuantity(id) - 1, 1) }));
    };

    const getQuantity = id => {
        const item = cart.find(product => product.id === id);
        return item ? item.quantity : 1;
    };

    const navigateToOrderList = () => {
        navigate("/place-order")
    };

    const calculateTotalBill = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p._id === item.id);
            if (product) {
                const discountedPrice = product.sale
                    ? (product.price - (product.price * product.sale) / 100)
                    : product.price;
                return total + (discountedPrice * item.quantity);
            }
            return total;
        }, 0).toFixed(2);
    };

    const calculateActualTotalBill = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p._id === item.id);
            if (product) {
                return total + (product.price * item.quantity);
            }
            return total;
        }, 0).toFixed(2);
    };

    const handleSaveCart = async () => {
        try {
            await axios.post('http://localhost:3001/api/cartState/cart/save', { userId, items: cart });
            alert('Cart saved successfully!');
        } catch (error) {
            console.error('Error saving cart:', error);
            alert('Failed to save cart.');
        }
    };

    return (
        <div className="p-4">
            {cart.length === 0 ? (
                <p className='p-[15px] bg-red-100 border-2 border-red-700 rounded-2xl text-xl text-red-600 mx-auto text-center xsx:w-[80%]'>
                    Your cart is empty
                </p>
            ) : (
                <div className=' xsx:w-[80%] mx-auto'>

                    <div className='flex justify-between'>
                        <h1 className="text-2xl font-bold">Shopping Cart</h1>
                        <div className='text-lg font-semibold'>
                            <button onClick={handleClearCart} className="px-4 border-2 border- hover:bg-white hover:text-red-600 py-2 bg-red-600 border-red-600 rounded-2xl text-white">Clear Cart</button>
                            <button onClick={handleSaveCart} className="px-4 py-2 border-2 hover:bg-white hover:text-blue-700 bg-blue-600 border-blue-600  rounded-2xl text-white ml-4">Save for Later</button>
                        </div>
                    </div>

                    <div className='flex border p-[15px] rounded-xl flex-col'>
                        <div className='text-xl font-bold'>Checkout</div>
                        <div className='border-b border-t border-gray-400 text-md font-semibold'>
                            <div className='flex mt-[15px] justify-between'>
                                <p>Your Cart Subtotal:</p>
                                <p className='px-[8px] text-xl rounded-xl'><span className='text-lg'>Rs.</span>{calculateTotalBill()}</p>
                            </div>
                            <div className='flex mt-[8px] justify-between'>
                                <p>Discount Through Applied Sales:</p>
                                <p className='px-[8px] text-xl rounded-xl'><span className='text-lg'>Rs.</span>{calculateActualTotalBill()}</p>
                            </div>
                            <div className='flex my-[8px] justify-between'>
                                <p>Delivery Charges (*On Delivery):</p>
                                <p className='px-[8px] text-xl rounded-xl'><span className='text-lg'>Rs.</span>200</p>
                            </div>
                            </div>
                            
                        <div className='flex justify-between'>
                            <p className='px-[8px] text-4xl mt-[10px] font-bold rounded-xl'><span className='text-xl font-medium mr-[3px]'>Rs.</span>200</p>
                            <button onClick={navigateToOrderList} className="border-2 text-[20px] font-bold mt-[15px] py-[5px] hover:bg-white hover:text-green-800 bg-green-700 border-green-700 rounded-2xl px-[25px] text-white">Checkout</button>
                            </div>
                            
                    </div>

                    <div className="mt-4">
                        {cart.map(item => (
                            <CartItem
                                key={item.id}
                                id={item.id}
                                quantity={item.quantity}
                                onIncrease={() => handleIncreaseQuantity(item.id)}
                                onDecrease={() => handleDecreaseQuantity(item.id)}
                                onRemove={() => handleRemoveFromCart(item.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const CartItem = ({ id, quantity, onIncrease, onDecrease, onRemove }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/fetchproducts/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) return null;

    const discountedPrice = product.sale
        ? (product.price - (product.price * product.sale) / 100).toFixed(2)
        : product.price.toFixed(2);

    return (
        <div className="flex  items-center justify-between mb-[28px] bg-custom-light-red border rounded-2xl border-red-700 p-4">

            <div className='w-[200px] h-[180px]'>
                <img
                    src={`http://localhost:3001/uploads/${product.image}`}
                    alt={product.name}
                    className=" h-[180px] mx-auto object-cover"
                />
            </div>
            <div className="ml-4 flex-1">
                <div className='flex justify-between'>
                    <h2 className="text-[28px] underline font-bold">{product.name}</h2>
                    <button onClick={onRemove} className="px-[20px] rounded-[28px] bg-red-800  hover:bg-red-300 hover:text-red-700 font-bold text-white">Remove</button>
                </div>

                <p className="text-lg flex items-center my-[5px]">
                    <span className='font-medium mt-[3px] text-red-950 mr-[5px]'>Item Price:</span>
                    {product.sale && <span className="text-red-500 mt-[3px] font-medium mr-[8px] line-through">${product.price.toFixed(2)}</span>}
                    <span className='text-[28px] text-green-800 font-bold'>${discountedPrice}</span>
                </p>

                <div className='flex  justify-between items-center'>
                    <div className="mt-2 py-[5px] px-[15px] rounded-2xl flex items-center space-x-2">
                        <button onClick={onDecrease} className="w-8 h-8 text-2xl rounded-full text-white bg-red-900 flex items-center justify-center">-</button>
                        <span className="text-xl font-bold rounded-md px-[10px]  bg-red-100 py-[3px] ">{quantity}</span>
                        <button onClick={onIncrease} className="w-8 h-8 text-2xl rounded-full bg-red-900 text-white flex items-center justify-center">+</button>
                    </div>

                    <p className="text-lg text-green-800 font-bold rounded-md p-[5px]">
                        Item Checkout: <span className='bg-green-200 px-[8px] py-[2px] rounded-lg border-2 border-green-800'>${(discountedPrice * quantity).toFixed(2)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
