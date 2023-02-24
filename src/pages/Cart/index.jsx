// Importações de estilo
import { useState } from 'react';
import { BsReceipt } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import cartImg from '../../assets/cart.svg';
import checkCircle from '../../assets/CheckCircle.svg';
import clock from '../../assets/clock.svg';
import cardImg from '../../assets/CreditCard.svg';
import logoPix from '../../assets/pix.svg';
import qrCode from '../../assets/qrcode.svg';
import { Button } from '../../components/Button';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { OrderCard } from '../../components/OrderCard';
import { PageError } from '../../components/PageError';
import { ThemeSlider } from '../../components/ThemeSlider';
import { useAuth } from '../../hooks/auth';
import { useCart } from '../../hooks/cart';
import { api } from '../../services/api';
import GlobalStyles from '../../styles/global';
import lightTheme from '../../styles/lightTheme';
import darkTheme from '../../styles/theme';
import { useDarkMode } from '../../styles/useDarkMode';
import { Container, Content, PaymentCard } from './styles.js';

// Importações de troca de tema
// Importação de Componentes
// Importações Estratégicas (API e outros)
// Importações de imagem
export function Cart() {
    const [ theme, toggleTheme ] = useDarkMode();
    const themeMode = theme === 'lightTheme' ? lightTheme : darkTheme;

    const { user } = useAuth()

    const { cart, total, handleResetCart} = useCart();

    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // Capturando itens do carrinho para cadastro
    function handleCreatedCart(cart) {
        return {
          orderStatus: '🔴 Pendente',
          paymentMethod: pixActive ? 'pix': 'creditCard',
          totalPrice: total,
          cart: cart.map(item => (
            {
              id: item.id,
              title: item.title,
              quantity: item.quantity
            }
          ))
        }
    }

    // Função de Finalização de Pagamento
    async function handleFinishPayment(cart) {
            
        const newCart = handleCreatedCart(cart)

        if (cart.length < 1) {
            navigate(-1);
            return alert("Oops! Seu carrinho está vazio. Adicione algo antes de tentar pagar.");
        }

        if (!pixActive && num.length < 16) {
            alert("Erro: Número de cartão incompleto!");
            return;
        }

        if (!pixActive && date.length < 4) {
            return alert("Erro: Validade do cartão incompleta!");
        }

        if (!pixActive && cvc.length < 3) {
            return alert("Erro: CVC do cartão incompleto!");
        }

        setLoading(true);

        await api.post("/orders", newCart)
            .then(() => {
                disableButton();
                setTimeout(() => {    
                    // Elements that will be changed
                    alert("Pedido cadastrado com sucesso!");
                    navigate(-1);
                    handleResetCart();

                    // Delay
                }, 7000);
            })
            .catch(error => {
                if(error.response){
                    alert(error.response.data.message);
                    console.log(error.response.data)
                } else {
                    alert("Não foi possível cadastrar");
                }
            });

        setLoading(false);
    }

    // Validações de cartão de crédito
    const [num, setNum] = useState('');
    const [cvc, setCvc] = useState('');

    const handleNumChange = event => {
        const limit = 16;
        setNum(event.target.value.slice(0, limit));
    };

    const handleCvcChange = event => {
        const limit = 3;
        setCvc(event.target.value.slice(0, limit));
    };

    // Botões de pagamento e telas de alteração
    const [isPixVisible, setIsPixVisible] = useState(false);
    const [isCreditVisible, setIsCreditVisible] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(true);
    const [pixActive, setPixActive] = useState(false);
    const [creditActive, setCreditActive] = useState(false);
    const [isClockActive, setIsClockActive] = useState(false);
    const [isApprovedActive, setIsApprovedActive] = useState(false);

    const handlePaymentPix = () => {
        setIsPixVisible(true);
        setIsCreditVisible(false);
        setIsCartVisible(false);
        setPixActive(true);
        setCreditActive(false);
    };

    const handlePaymentCredit = () => {
        setIsCreditVisible(true);
        setIsPixVisible(false);
        setIsCartVisible(false);
        setCreditActive(true);
        setPixActive(false);
    };

    // Desativar botões e alterar telas
    const [disabledButton, setDisabledButton] = useState(false);

    const disableButton = () => {
        setDisabledButton(true);

        setIsCreditVisible(false);
        setIsPixVisible(false);
        
        setIsClockActive(true);
        setIsApprovedActive(false);
        setTimeout(() => {    
            
            // Elementos que serão alterados
            setIsClockActive(false);
            setIsApprovedActive(true);

            // Delay
        }, 4000);
    }
    
    return(
        <ThemeProvider theme={themeMode}>
            <GlobalStyles />
                <Container>
                    <Header />

                        {
                            user.isAdmin ?

                            <PageError />

                        :

                            <Content>

                                <ThemeSlider theme={theme} toggleTheme={toggleTheme}/>

                                <div className="card-wrapper">
                                
                                    <div className="order-wrapper">
                                        <h2>Meu pedido</h2>
                                        <div className="details">
                                            {
                                                cart && 
                                                    cart.map(item => (
                                                        <OrderCard 
                                                            key={String(item.id)} 
                                                            data={item}
                                                        />
                                                    ))
                                            }
                                        </div>

                                        <div className="total">
                                            <p>Total: R$<span>{total}</span></p>
                                        </div>
                                    </div>
                                
                                    <PaymentCard>
                                        <div className="paymentHeader">
                                            <h2>Pagamento</h2>
                                        
                                            <div className="buttons">
                                                <button className={pixActive === true ? 'active' : ''} disabled={disabledButton} onClick={handlePaymentPix}>
                                                    <img src={logoPix} alt="Logo Pix"/>
                                                    PIX
                                                </button>
                                                
                                                <button className={creditActive === true ? 'active' : ''} disabled={disabledButton} onClick={handlePaymentCredit}>
                                                    <img src={cardImg} alt="Logo Cartão de Crédito"/>
                                                    Crédito
                                                </button>
                                            </div>
                                        </div>

                                        <div className="paymentBody">

                                            {isCartVisible &&
                                                <div className="cart" id="cart">
                                                    <img src={cartImg} alt="Imagem do carrinho de compras" />
                                                    <p>Selecione uma forma de pagamento acima!</p>
                                                </div>
                                            }

                                            {isPixVisible &&
                                                <div className={pixActive === false ? 'active' : ''} id="paymentPix">
                                                    <div className="qr">
                                                        <img src={qrCode} alt="Imagem do QRCode" />
                                                    </div>

                                                    <Button
                                                        title={loading ? "Finalizando pagamento" : "Finalizar pagamento"}
                                                        disabled={loading}
                                                        icon={BsReceipt}
                                                        style={ { height: 56 } }
                                                        className="finishPaymentButton"
                                                        onClick={()=>{handleFinishPayment(cart)}}
                                                    /> 
                                                </div>
                                            }

                                            {isCreditVisible &&

                                                <div className="paymentCredit" id="paymentCredit">
                                                    <div className="inputs">
                                                        <p>Número do Cartão</p>
                                                        <Input
                                                            placeholder="0000 0000 0000 0000"
                                                            type="number"
                                                            id="num"
                                                            name="num"
                                                            value={num}
                                                            onChange={handleNumChange}
                                                        />
                                                    </div>

                                                    <div className="validTo">
                                                        <div>
                                                            <p>Validade</p>
                                                            <Input
                                                                placeholder="MM/AA"
                                                                type="text"
                                                                id="date"
                                                                name="date"
                                                                maxLength="5"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p>CVC</p>
                                                            <Input
                                                                placeholder="***"
                                                                type="number"
                                                                id="cvc"
                                                                name="cvc"
                                                                value={cvc}
                                                                onChange={handleCvcChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <Button
                                                            title={loading ? "Finalizando pagamento" : "Finalizar pagamento"}
                                                            disabled={loading}
                                                            icon={BsReceipt}
                                                            style={ { height: 56 } }
                                                            className="finishPaymentButton"
                                                            onClick={()=>{handleFinishPayment(cart)}}
                                                    /> 
                                                </div>
                                            }

                                            {isClockActive &&

                                                <div className="clock" id="clock">
                                                    <img src={clock} alt="Imagem do QRCode" />
                                                    <p>Aguarde: Estamos processando o seu pagamento</p>
                                                </div>
                                            }

                                            {isApprovedActive &&

                                                <div className="approved" id="approved">
                                                    <img src={checkCircle} alt="Imagem de pagamento aprovado" />
                                                    <p>Oba! Pagamento aprovado! Em breve faremos a entrega!</p>
                                                </div>
                                            }
                                        </div>
                                    </PaymentCard>
                                </div>
                            </Content>
                        }
                    <Footer />
                </Container>
    </ThemeProvider>
  );
}