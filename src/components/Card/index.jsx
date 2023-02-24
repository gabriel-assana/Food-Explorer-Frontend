//Importar estilos
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsReceipt } from 'react-icons/bs';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import imagePlaceholder from '../../assets/image-not-found-icon.svg';
import { useAuth } from '../../hooks/auth';
import { useCart } from '../../hooks/cart';
import { useFavorites } from '../../hooks/favorites';
import { api } from '../../services/api';
import { Button } from '../Button';
import { ButtonText } from '../ButtonText';
import { Container, Content, PurchaseCard } from './styles.js';

//Importar Componentes
//Importar hooks e API
//Importar icons e images
export function Card({ data, ...rest }) {
    //Carregar as credenciais do usuário
    const { user } = useAuth()
    
    //Carregar a imagem do prato
    const imageURL = data.image ? `${api.defaults.baseURL}/files/${data.image}` : imagePlaceholder;
    
    //Carregar e armazenar favoritos
    const { favorites, addDishToFavorite, removeDishFromFavorite } = useFavorites()
    const isFavorite = favorites.some((dish) => dish.title === data.title)

    //Carregar e armazenar o carrinho
    const { handleAddDishToCart, paymentAccept } = useCart();
    
    //Definir o estado inicial da quantidade
    const [quantity, setQuantity] = useState(1);

    //Aumentar quantidade
    const increase = () => {
        if (quantity > 19) {
            alert("Erro: A quantidade máxima é de 20 unidades")
            return;
        }
        setQuantity(count => count + 1);
    };
     
    //Diminuir quantidade
    const decrease = () => {
        if (quantity < 2) {
            alert("Erro: A quantidade mínima é 1 unidade")
            return;
        }
        setQuantity(count => count - 1);
    };

    return (
        <Container {...rest}>
            {
                user.isAdmin ?

                    <Content>
                        <div className="container">
                            <img src={imageURL} alt="Imagem do prato" />
                            <Link to={`/details/${data.id}`}>
                                <h3 className="product-title">{data.title}{' >'}</h3>
                            </Link>
                            <p className="description">{data.description}</p>
                            <h1 className="price">R$ {data.price}</h1>
                            <Link to={`/editDish/${data.id}`}>
                                <Button
                                    title="editar prato"
                                    icon={BsReceipt}
                                />
                            </Link>
                        </div>
                    </Content>

                :

                    <Content>
                        <button 
                            className="favButton"
                            onClick={() => isFavorite ? removeDishFromFavorite(data) : addDishToFavorite(data)}
                            >
                                {isFavorite ?
                                    <AiFillHeart />
                                :
                                    <AiOutlineHeart />
                                }
                        </button>

                        <div className="container">
                            <img src={imageURL} alt="Imagem do prato" />
                            <Link to={`/details/${data.id}`}>
                                <h3 className="product-title">{data.title}{' >'} </h3>
                            </Link>
                            <p className="description">{data.description}</p>
                            <h1 className="price">R$ {data.price}</h1>

                            <PurchaseCard>
                                <div className="counter">
                                    <ButtonText 
                                        icon={FiMinus}
                                        onClick={decrease}
                                    />
                                    <span>{quantity.toString().padStart(2, '0')}</span>
                                    <ButtonText 
                                        icon={FiPlus}
                                        onClick={increase}
                                    />
                                </div>

                                <Button 
                                    title="incluir"
                                    icon={BsReceipt}
                                    onClick={() => handleAddDishToCart(data, quantity, imageURL)}
                                    style={ { height: 56, width: 92, padding: '12px 4px' } }
                                />
                            </PurchaseCard>
                        </div>
                    </Content>
                }
        </Container>
    );
}