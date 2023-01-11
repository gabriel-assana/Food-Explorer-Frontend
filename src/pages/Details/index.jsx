// Importações de estilo
import { useEffect, useState } from 'react';
import { BsReceipt } from 'react-icons/bs';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Button } from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Ingredients } from '../../components/Ingredients';
import { ThemeSlider } from '../../components/ThemeSlider';
import { useAuth } from '../../hooks/auth';
import { useCart } from '../../hooks/cart';
import { api } from '../../services/api';
import GlobalStyles from '../../styles/global';
import lightTheme from '../../styles/lightTheme';
import darkTheme from '../../styles/theme';
import { useDarkMode } from '../../styles/useDarkMode';
import { Container, Content, Ingredient, PurchaseCard } from './styles.js';

// Importações de troca de tema
// Importação de Componentes
// Importações Estratégicas (API e outros)
// Importações de imagem
export function Details() {
    const [ theme, toggleTheme ] = useDarkMode();
    const themeMode = theme === 'lightTheme' ? lightTheme : darkTheme;

    const { user } = useAuth()

    const navigate = useNavigate();
    
    function handleBack() {
        navigate(-1);
    }

    const [data, setData] = useState(null);
    const params = useParams();

    const imageURL = data && `${api.defaults.baseURL}/files/${data.image}`;

    // Carrega e armazena o carrinho
    const { handleAddDishToCart } = useCart();
    
    // Definir estado inicial da quantidade
    const [quantity, setQuantity] = useState(1);

    // Aumenta a quantidade
    const increase = () => {
        if (quantity > 19) {
            alert("Erro: A quantidade máxima é de 20 unidades")
            return;
        }
        setQuantity(count => count + 1);
    };
     
    // Diminui a quantidade
    const decrease = () => {
        if (quantity < 2) {
            alert("Erro: A quantidade mínima é 1 unidade")
            return;
        }
        setQuantity(count => count - 1);
    };
    
    useEffect(() => {
        async function fetchDishDetail() {
            const response = await api.get(`/dishes/${params.id}`);
            setData(response.data);
        }
    
        fetchDishDetail();
    }, []);
    
    return(
        <ThemeProvider theme={themeMode}>
            <GlobalStyles />
                <Container>
                    <Header />
                    {
                        data &&

                        <Content>

                            <ThemeSlider theme={theme} toggleTheme={toggleTheme}/>
                            
                            <Link>
                                <ButtonText
                                    title="Voltar" 
                                    icon={RiArrowLeftSLine} 
                                    onClick={handleBack}
                                />
                            </Link>
                    
                            <div className="content">
                    
                                <div className="dish">
                                    <img src={imageURL} alt="Logo" />
                                    <div className="description">
                        
                                        <h1>{data.title}</h1>
                        
                                        <h3>{data.description}</h3>

                                        <Ingredient>
                                            {
                                                data.ingredients.map(ingredient => (
                                                    <Ingredients
                                                        key={String(ingredient.id)}
                                                        ingredient={ingredient.name}
                                                    />
                                                ))
                                            }
                                        </Ingredient>
                                                            
                                        <div className="price">
                                            <h4>R$ {data.price}</h4>
                                        
                                            <div className="purchaseCard">
                                                {
                                                    user.isAdmin ?

                                                    <PurchaseCard>
                                                        {
                                                            data &&
                                                                <Link to={`/editdish/${data.id}`}>
                                                                    <Button 
                                                                        title="editar prato"
                                                                        icon={BsReceipt}
                                                                    />
                                                                </Link>
                                                        }
                                                    </PurchaseCard>
                                                    
                                                :

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
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                        </Content>
                    }
                    <Footer />
                </Container>
        </ThemeProvider>
    );
}