import React, { useState, useEffect } from 'react';
import Lector from './Lector';
import './caja.css';

const Caja = ({
                db,
                numero
}) => {

const [ valorCodigo , setValorCodigo ] = useState(null);
const [ search, setSearch ] = useState([]);
const [ carrito, setCarrito ] = useState([]);

useEffect(() => {
  console.log(db)
},[db])

useEffect(() => {
  console.log(search)
},[search])

const buscarProducto = (item) => {  
  const resultados = db.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setSearch(resultados);
};

useEffect(() => {
  if(search.length === 1){
    setCarrito((prev) => [...prev, search[0]])
  }
},[search])

useEffect(() => {
  console.log(carrito)
},[carrito])

 // detecta si se escaneo algun numero
useEffect(() => {
    if (numero && numero !== 0) {
        // actualiza el input después del escaneo.
        setValorCodigo(numero);
        buscarProducto(numero)
    }
}, [numero]);

const addCarrito = () => {

}

  return (
    <div className='contenedor-caja'>
        <h3>Lista de productos</h3>
    <div className="buscador-producto">
      <input type="text" 
      placeholder='Buscar...'
      defaultValue={valorCodigo}
        onChange={(e) => { buscarProducto(e.target.value)}}
      />
      <button
        className='btn-scann'
        onClick={() => { setIsOnCamara(true)}}
      >
        Ecanear Codigo
      </button>
    </div>
      <div className='lista-productos'>
        {
          carrito.length > 0 
          ?
          carrito.map(item => (
            <div className='items-cobrar' key={item.codigo}>
              <p>{item.descripcion}</p>
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
          ))
          :
          <p>Aun no hay productos para cobrar</p>
        }
      </div>
      <div className='importe'>
      </div>
    </div>
  )
};
export default Caja;