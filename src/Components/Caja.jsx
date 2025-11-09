import React, { useState, useEffect } from 'react';
import Lector from './Lector';
import './caja.css';

const Caja = ({
                db,
                numero,
                setNumero,
                setIsOnCamara,
                isOnCamara
}) => {

const [ valorCodigo , setValorCodigo ] = useState('');
const [ search, setSearch ] = useState([]);
const [ buscar, setBuscar ] = useState([]);
const [ carrito, setCarrito ] = useState([]);
const [ subtotal, setSubTotal ] = useState(0);
const [ error, setError ] = useState(false);

useEffect(() => {
  console.log(db)
},[db])

useEffect(() => {
  console.log(search)
},[search])

const buscarProductoCam = (item) => {  
  const resultados = db.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setSearch(resultados);
};


useEffect(() => {
  if(search.length === 1){
    setCarrito((prev) => [...prev, {...search[0], cantidad: 1}])
    setSubTotal((prev) => prev + Number(search.precio))
  }
},[search])


useEffect(() => {
  console.log(carrito)
  console.log(subtotal)
},[carrito])

 // detecta si se escaneo algun numero
useEffect(() => {
    if (numero && numero !== 0) {
        // actualiza el input después del escaneo.
        setValorCodigo(numero);
        buscarProductoCam(numero)
    }
}, [numero]);

const buscarProductoTeclado = (item) => {
  const resultados = db.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setBuscar(resultados)
}

const addCarrito = (i) => {
  if(buscar){
    setValorCodigo('');
    setCarrito((prev) => [...prev, { ...buscar[i], cantidad: 1 }]);
    setBuscar([]);
  }
}

useEffect(() => {
  console.log(buscar)
  console.log(valorCodigo)
},[buscar])

  return (
    <div className='contenedor-caja'>
      {
        isOnCamara  &&
          <Lector 
          setNumero={setNumero}
          numero={numero}
          setIsOnCamara={setIsOnCamara}
          />
      }
        <h3>Lista de productos</h3>
    <div className="buscador-producto">
      <div className='nav-buscador'>

      <input type="text" 
      placeholder='Buscar...'
      value={valorCodigo}
      onChange={(e) => { 
        setValorCodigo(e.target.value )
        buscarProductoTeclado(e.target.value)}}
      />
      <button
        className='btn-scann'
        onClick={() => { setIsOnCamara(true)}}
        >
        Ecanear Codigo
      </button>
        </div>
      <nav className="productos-encontrados">
        {
          buscar &&
            buscar.map((item, i) => (
              <div className='search-productos' key={item.codigo} >
                <p>#{i+1}</p>
                <p>{item.descripcion}</p>
                <p>{item.precio}</p>
                <p>{item.precioOferta}</p>
                <button
                  type='button'
                  onClick={() => addCarrito(i)}
                >+</button>
              </div>
            ))
          }
      </nav>
        </div>
      <div className='lista-productos'>
        {
          carrito.length > 0 
          ?
          carrito.map((item, i) => (
            <div className='items-cobrar' key={item.codigo}>
              <div>
              <p>#{i+1} -</p>
              <p>{item.descripcion}</p>
            </div>
            <div>
              <p>{item.cantidad}</p>
            </div>
            <div>
              <p>
                {
                  Number(item.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  })
                }
              </p>
            </div>
            <div className="btn-cobrar">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              </button>
              <button><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            </div>
              
            </div>
          ))
          :
          <p>Aun no hay productos para cobrar</p>
        }
      </div>
      <div className='importe'>
        <p>SubTotal
          <span>
          {
            Number(subtotal).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
            })
          }
        </span>
        </p>
      </div>
    </div>
  )
};
export default Caja;