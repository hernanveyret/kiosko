import React, { useState, useEffect } from 'react'
import './ventasDiarias.css';
const VentasDiarias = ({
                         ventaDiaria
                      }) => {

useEffect(() => {
  ventaDiaria && console.log('Ventas por dia' ,ventaDiaria)
},[ventaDiaria])

  return (
    <div className='contenedor-ventas'>
      <h3>Ventas diarias</h3>
        <div className='ventas'>
          {
            ventaDiaria.length 
            ? 
              ventaDiaria.map((item, i) => (
                <div className='card-venta'>
                  <p>{item.fecha}</p>
                  <p>{item.totalDia.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</p>
                </div>
              ))              
            :
            <p>No hay ventas guardadas</p>
          }
        </div>
    </div>
  )
};
export default VentasDiarias;