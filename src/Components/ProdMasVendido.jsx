import React, { useState, useEffect } from 'react';
import './prodMasVendido.css';
const ProdMasVendido = ({
                          masVendido        
                        }) => {

useEffect(() => {
  console.log(masVendido)
},[masVendido])
  return (
    <div
      className='contenedor-mas-vendidos'
      >
      <h3>Productos mas vendidos</h3>
      <div className='productos'>
        {
          masVendido.length > 0 ?
            masVendido.map(item => (
              <div className='card-item' key={item.codigo}>
                <div className='img-item'>
                  <img src={item.img} alt='Imagen del producto' />
                </div>
                  <p>{item.descripcion} {item.peso}</p>
                  
                  <p>Cantidad: {item.cantidad}</p>

              </div>
            ))
          :
          <h3>No hay productos para mostrar</h3>
        }
      </div>
    </div>
  )
};
export default ProdMasVendido;
