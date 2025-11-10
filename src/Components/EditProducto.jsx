import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import './ingresar.css'
const EditProducto = ({ db,
                        setIsEditarProducto,
                        idCodigo
                      }) => { 
const [ archivoOriginal, setArchivoOriginal] = useState(null);
const [ productoViejo, setProductoViejo ] = useState(null)

console.log(db)
useEffect(() => {
  console.log('id codigo del producto:', idCodigo)
  if(idCodigo){
    const filtro = db.find(item => item.codigo === idCodigo);
    setProductoViejo(filtro);
    /*
    setValue('codigo', filtro.codigo )
    setValue('descripcion', filtro.descripcion)
    setValue('tamano', filtro.tamano)
    setValue('precio', filtro.precio)
    setValue('precioOff', filtro.precioOff)
    setValue('cantidadOferta', filtro.cantidadOferta)
    setValue('stock', filtro.stock)
    */
   
  if (filtro) {
    reset(filtro);
  }


  }
},[idCodigo]);

useEffect(() => {
  console.log('Producto a editar: ', productoViejo)
},[productoViejo])

const {
  register,
  reset,
  handleSubmit,
  setValue,
  formState: { errors }  
} = useForm()


const cargarProducto = (data) => { 
  console.log(data)
}

/*
const cargarProducto = (data) => {
  if (!archivoOriginal) return;
  const reader = new FileReader();
  reader.onload = () => {
    const productoNuevo = {
      ...data,
      img: reader.result // Base64 de la imagen
    };

    // Guardar en estado
    setProductos(prev => [...prev, productoNuevo]);

    // Reiniciar formulario
    reset();
  };

  // ¡Muy importante! Esto inicia la lectura del archivo
  reader.readAsDataURL(archivoOriginal);
};
*/
return (
    <div className='contenedor-ingresar'>
      <div className='titulo-ingresar'>
        <h3>Editar Productos</h3>
      </div>
    
      <form
        onSubmit={handleSubmit(cargarProducto)}
      >
        <label>#Codigo
        <input type="text" name="id"
        {...register('codigo', {
          required: {
            value: true,
            message: 'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.codigo?.message && <p className='text-error'>{errors.codigo.message}</p>}

        <label>Descripcion
        <input type="text" name="descripcion" 
        {...register('descripcion', {
          required: {
            value:true,
            message:'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.descripcion?.message && <p className='text-error'>{errors.descripcion.message}</p>}
        
        <label>Peso/Litro
          <input type="text" name="peso/kilo" 
          {...register('tamano', {
            required: {
              value: true,
              message: 'Campo Obligatorio'
            }
          })}
          />
        </label>
        { errors.tamano?.message && <p className='text-error'>{errors.tamano.message}</p>}

        <label>Precio
        <input type="text" name="precio" 
        {...register('precio', {
          required: {
            value: true,
            message:'Campo Obligatorio'
          },
          pattern: {
            value: /^([0-9]+)$/,
            message: 'Ingresar solo Números'
          }
        })}
        />
        </label>
        { errors.precio?.message && <p className='text-error'>{errors.precio.message}</p>}

        <label>Precio Oferta
        <input type="text" name="precioOferta" 
        {...register('precioOff', {
          required: {
            value: false,
            message:'Campo Obligatorio'
          }          
        })}
        />
        </label>
        { errors.precioOff?.message && <p className='text-error'>{errors.precioOff.message}</p>}

        <label>Cantidad Oferta
        <input type="text" name="id"
        {...register('cantidadOferta', {
          required: {
            value: false,
            message: 'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.cantidadOferta?.message && <p className='text-error'>{errors.cantidadOferta.message}</p>}

        <label>Stock
        <input type="text" name="stock" 
        {...register('stock', {
          required: {
            value: true,
            message: 'Campo Obligatorio'
          },
          pattern: {
            value: /^([0-9]+)$/,
            message: 'Ingresar solo Números'
          }
        })}
        />
        </label>
        { errors.stock?.message && <p className='text-error'>{errors.stock.message}</p>}

        <label>Imagen
          <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivoOriginal(e.target.files[0])}
        />
        </label>
        <button
          type='submit'
          className='btn-cargar'
        >
          CARGAR
        </button>
      </form>
    </div>
  )
};
export default EditProducto;