import React, { useEffect, useState } from 'react';
import Card from './Card';
import Lector from './Lector';
import Item from './Item';
import './lista.css';
const Lista = ({ 
                productos, 
                setProductos,
                numero,
                setNumero,
                setIsOnCamara,
                isOnCamara
              }) => {
  const [ codigo, setCodigo ] = useState(null);
  const [ search, setSearch ] = useState([])
const eliminarProducto = (e) => {
  const filtro = productos.filter(item => item.codigo !== e)
  console.log(filtro)
  if(filtro){
    setProductos(filtro)
  }
}

const buscarProducto = (item) => {
  console.log(item)
  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase())
  );
  setSearch(resultados);
};

return (
  <div className='contenedor-lista'>
    {
      isOnCamara && 
        <Lector 
        setNumero={setNumero}
        numero={numero}
        setIsOnCamara={setIsOnCamara}
        />
    }
    <h3>Lista de productos</h3>
    <div className="buscador">
      <input type="text" 
      placeholder='Buscar...'
      defaultValue={numero}
        onChange={(e) => { buscarProducto(e.target.value)}}
      />
      <button
        onClick={() => { setIsOnCamara(true)}}
      >
        Scanear Codigo
      </button>
    </div>
    <div style={{background:'grey', color:'white', marginBottom:'0'}} className='contenedor-item header-oculto' >
      <div style={{borderRight: '1px solid white'}} className='item-img'></div>
      <div className='item-info'>
        <p style={{borderRight: '1px solid white'}}>CODIGO</p>
        <p style={{borderRight: '1px solid white'}}>DESCRIPCION</p>
        <p style={{borderRight: '1px solid white'}}>TAMAÑO</p>
        <p style={{borderRight: '1px solid white'}}>PRECIO</p>
        <p style={{borderRight: '1px solid white'}}>PRECIO OFF</p>
        <p style={{borderRight: '1px solid white'}}>STOCK</p>
      </div>
      <div className='item-btn'>ACCION</div>
    </div>
    <section 
      className='lista'>
        { 
          search.length > 0 
          ?
          search.map((item, i) => (
            <Item
              key={i}
              item={item}
              eliminarProducto={eliminarProducto}
              />
          )) 
          :
          productos.length > 0 ? 
          productos.map((item, i) => (
            <Item
              key={i}
              item={item}
              eliminarProducto={eliminarProducto}
              />
          ))
          :
          <p>Aun no hay productos ingresados</p>
        }
      </section>
  </div>
)                
}
export default Lista;
