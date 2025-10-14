import React,{ useState, useEffect} from 'react';
import Ingresar from './Ingresar';
import Lista from './Lista';
import './home.css';

const Home = () => {
  const productosEnLocal = localStorage.getItem('kiosco')
  const [ db, setSb ] = useState(productosEnLocal ? JSON.parse(productosEnLocal) : [])
  const [ productos, setProductos ] = useState(db);

  const [ isIngresar, setIsIngresar ] = useState(false);
  const [ isLista, setIsLista ] = useState(false);
  const [ isOnCamara, setIsOnCamara ] = useState(false);

  useEffect(() => {
    console.log(productos)
    const nuevosProductos = productos
    localStorage.setItem('kiosco', JSON.stringify(nuevosProductos))
  },[productos])


  return (
    <div className="contenedor">
      <header>
        <h1>KIOSCO</h1>
      </header>
      <main>
        <nav>
          <button 
            className="btn-nav"
            onClick={() => {
              setIsLista(false);
              setIsIngresar(true);
              setIsOnCamara(true);
            }}
            >INGRESAR</button>
          <button 
            className="btn-nav"
            onClick={() => {
              setIsIngresar(false);
              setIsLista(true);
            }}
            >LISTA</button>
            <button 
            className="btn-nav"
            onClick={() => {
              
            }}
            >COBRAR</button>
        </nav>
        <section>
          {
            isIngresar &&
              <Ingresar 
              isOnCamara={isOnCamara}
              setIsOnCamara={setIsOnCamara}
              setProductos={setProductos}
              productos={productos}
              /> 
          }
          {
            isLista &&
              <Lista 
              productos={productos}
              setProductos={setProductos}
              />
          }
        </section>
      </main>
      <footer>
        <p>HERNAN LUIS VEYRET</p>
      </footer>
    </div>
  )
};
export default Home;