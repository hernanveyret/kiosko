import React, { useState, useEffect } from 'react';

const EditItemCaja = ({
                        carrito,
                        setCarrito,
                        idCodigoEditar,
                        setIdCodigoEditar,
                        setIsEditItem,
                    }) => {

  return (
    <div 
      className='contenedor-editar-item'
    >
      <div className='contenedor-form'>
        <button
          type='button'
          className='btn-editar-item'
          onClick={() => { setIsEditItem(false) } }
        >X</button>
        <form>
          <input type='text' placeholder='Cantidad...' />
          <input type='text' placeholder='Precio...' />           
          <button
            type='button'
            className='btn-cargar-editar'
          >
            CARGAR
          </button>
        </form>
      </div>
    </div>
  )
};

export default EditItemCaja;