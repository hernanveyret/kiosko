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

  const [ numero, setNumero ] = useState(0)

  useEffect(() => {
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eee"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>
          <button 
            className="btn-nav"
            onClick={() => {
              setIsIngresar(false);
              setIsLista(true);
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eee"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
            </button>
            <button 
            className="btn-nav"
            onClick={() => {
              
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eee"><path d="M280-640q-33 0-56.5-23.5T200-720v-80q0-33 23.5-56.5T280-880h400q33 0 56.5 23.5T760-800v80q0 33-23.5 56.5T680-640H280Zm0-80h400v-80H280v80ZM160-80q-33 0-56.5-23.5T80-160v-40h800v40q0 33-23.5 56.5T800-80H160ZM80-240l139-313q10-22 30-34.5t43-12.5h376q23 0 43 12.5t30 34.5l139 313H80Zm260-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Z"/></svg>
            </button>
        </nav>
        <section>
          {
            isIngresar &&
              <Ingresar 
              isOnCamara={isOnCamara}
              setIsOnCamara={setIsOnCamara}
              setProductos={setProductos}
              productos={productos}
              numero={numero}
              setNumero={setNumero}
              /> 
          }
          {
            isLista &&
              <Lista 
              productos={productos}
              setProductos={setProductos}
              setIsOnCamara={setIsOnCamara}
              isOnCamara={isOnCamara}
              numero={numero}
              setNumero={setNumero}
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