import React, { useEffect, useState } from 'react';
import Card from './Card';
import Item from './Item';
import './lista.css';
const Lista = ({ productos }) => {
useEffect(() => {
  console.log(productos)
},[productos])

return (
  <div className='contenedor-lista'>
    <h3>Lista de productos</h3>
    <div style={{background:'grey', color:'white', marginBottom:'0'}} className='contenedor-item' >
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
          productos.length > 0 ? 
          productos.map((item, i) => (
            <Item
              key={i}
              item={item}
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
