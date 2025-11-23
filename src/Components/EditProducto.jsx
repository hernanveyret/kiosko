import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { actualizarProductos } from '../firebase/auth.js'

import './ingresar.css'
import Loader from './Loader.jsx';
const EditProducto = ({ productos,
                        setIsEditarProducto,
                        idCodigo,
                        setIdCodigo,
                        setIsLista,
                        setProductos,
                        idDoc
                      }) => { 
const [ archivoOriginal, setArchivoOriginal] = useState(null);
const [ nuevaUrl, setNuevaUrl ] = useState(null)
const [ productoViejo, setProductoViejo ] = useState(null);
const [ isPublicId, setIsPublicId ] = useState(null);
const [ isLoader, setIsLoader ] = useState(false);

useEffect(() => {
  if(idCodigo){
    const filtro = productos.find(item => item.codigo === idCodigo);
    setArchivoOriginal(filtro.img)
    /*
    setValue('codigo', filtro.codigo )
    setValue('descripcion', filtro.descripcion)
    setValue('tamano', filtro.tamano)
    setValue('precio', filtro.precio)
    setValue('precioOff', filtro.precioOff)
    setValue('cantidadOferta', filtro.cantidadOferta)
    setValue('stock', filtro.stock)
    */

   // resetea todos los campos u como los nombres de las propiedades son iguales
   // a los campos de register se agregan automaticamente con reset.
  if (filtro) {
    reset(filtro);
  }
  }
},[idCodigo]);

const {
  register,
  reset,
  handleSubmit,
  setValue,
  formState: { errors }  
} = useForm()

  const convertirAWebP = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/webp",
          0.8 // calidad
        );
      };

      reader.readAsDataURL(file);
    });
  };

const subirACloudinary = async (webpBlob, originalName) => {
    // Reemplazar la extensión por .webp
    const baseName = originalName.split(".").slice(0, -1).join(".");
    const webpFileName = `${baseName}.webp`;

    const formData = new FormData();
    formData.append("file", webpBlob, webpFileName);
    formData.append("upload_preset", "carrito_upload");
    formData.append("folder", `kioscos/${idDoc}`);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dujru85ae/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setIsPublicId(data.public_id)
      return data.secure_url;
    } else {
      console.error("Error al subir:", data);
      return null;
    }
  };
const cargarProducto = async (data) => {
    setIsLoader(true)
    let productoEditado = { ...data }; // 1. Inicialización de productoEditado
    
    // 2. DETERMINAR SI SE SELECCIONÓ UN ARCHIVO NUEVO
    const inputImgValue = data.img;

    // Se considera un archivo nuevo si:
    // a) Es un objeto FileList (lo que produce el input[type=file] al seleccionar un archivo).
    // b) Tiene al menos un archivo dentro (length > 0).
    const isNewFileSelected = inputImgValue instanceof FileList && inputImgValue.length > 0;

    // 3. Lógica de Subida Condicional
    if (isNewFileSelected) {
        const archivoSeleccionado = inputImgValue[0];
        try {
            // Esto solo se ejecuta si sabemos que 'archivoSeleccionado' es un objeto File
            const webpBlob = await convertirAWebP(archivoSeleccionado); 
            const urlWebP = await subirACloudinary(webpBlob, archivoSeleccionado.name);
            
            // Reemplaza el objeto FileList por la URL final.
            productoEditado.img = urlWebP; 
            
        } catch (error) {
            console.error("Fallo la subida de imagen:", error);
            // Si la subida falla, aborta todo el proceso
            return; 
        }
    } 
    
    // 4. Si NO se seleccionó un archivo nuevo (else):
    // 'productoEditado.img' ya contiene la URL anterior (string) gracias al 'reset(filtro)', 
    // por lo que simplemente se mantiene ese valor y NO se llama a la lógica de subida.
    
    // 5. Limpieza de campos (Lógica de null/''/'0')
    Object.keys(productoEditado).forEach(key => {
        if (productoEditado[key] === '' || productoEditado[key] === '0') {
            productoEditado[key] = null;
        }
    });

    // 6. Clonar y Actualizar el array local
    const nuevosProductos = productos.map(item =>
        item.codigo === idCodigo ? productoEditado : item
    );

    // 7. LLAMAR A FIREBASE
    try {
        await actualizarProductos(idDoc, nuevosProductos); 
        //console.log("Firestore actualizado con éxito.");
    } catch (error) {
        console.error("Fallo la actualización de Firestore:", error);
    }

    // 8. Actualización del estado local y limpieza de UI
    setIsLoader(false)
    setProductos(nuevosProductos); 
    setIdCodigo(null);
    setIsEditarProducto(false);
    setIsLista(true);
};
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
          {...register('img', {
            required: {
              value: false,
              message: 'Campo no obligatorio'
            }
          })}
        />
        </label>
        <button
          type='submit'
          className='btn-cargar'
        >
          { isLoader ? <Loader/> : 'EDITAR'}
        </button>
      </form>
    </div>
  )
};
export default EditProducto;