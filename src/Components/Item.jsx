import React, { useState, useEffect } from 'react';
import './item.css';
const Item = ({ 
              item,
              eliminarProducto,
              }) => {  
  return (
    <div className='contenedor-item'>
      <div className='item-img'>
        {
        item.img && <img src={item.img} alt='Imagen Producto' />
      }
      </div>
      <div className='item-info'>
        <p><span className="titulo-oculto">Codigo:</span>{item.codigo}</p>
        <p><span className="titulo-oculto">Descripcion: </span>{item.descripcion}</p>
        <p><span className="titulo-oculto">Peso/Ltro: </span>{item.tamano}</p>
        <p><span className="titulo-oculto">Precio Unit: </span>${item.precio}</p>
        <p><span className="titulo-oculto">Precio Off: </span>{item.precioOff}</p>
        <p><span className="titulo-oculto">Stock: </span>{item.stock}</p>
      </div>
      <div className='item-btn'>
        <button className='btn-item'>
        <svg xmlns="http://www.w3.org/2000/svg" 
          height="20px" 
          viewBox="0 -960 960 960" 
          width="20px" 
          fill="black">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
      </button>
      <button 
      onClick={() => { eliminarProducto(item.codigo)}}
      className='btn-item '>
        <svg xmlns="http://www.w3.org/2000/svg" 
          height="20px" 
          viewBox="0 -960 960 960" 
          width="20px" 
          fill="black">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
      </div>

    </div>
  )
};
export default Item;