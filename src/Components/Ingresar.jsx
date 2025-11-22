import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { agregarProducto } from '../firebase/auth.js';
import Lector from './Lector';
import Loader from './Loader.jsx';
import './ingresar.css'
const Ingresar = ({ 
                  isOnCamara, 
                  setIsOnCamara ,
                  setProductos,
                  productos,
                  numero,
                  setNumero,
                  idDoc
                }) => {  

const [ archivoOriginal, setArchivoOriginal] = useState(null);
const [ url, setUrl ] = useState('');
const [ isPublicId, setIsPublicId ] = useState(null);
const [ isLoader, setIsLoader ] = useState(false);

const {
  register,
  reset,
  handleSubmit,
  setValue,
  formState: { errors }  
} = useForm()


  // En el componente Ingresar.jsx
useEffect(() => {
    if (numero && numero !== 0) {
        // Esta función es la que actualiza el input después del escaneo.
        setValue('codigo', numero); 
    }
}, [numero, setValue]);

const cargarProducto = async (data) => {
  setIsLoader(true)
   if (!archivoOriginal) {
    alert('Debe seleccionar una imagen')
    return;
  }

  const urlFinal = await handleChange(); // convierte la imagen a webp y la sube a cloudinary, la guarda 
          // en una variable para usarla en la url del nuevoProducto, asi siempre va a usar la url correcta.  
    const nuevoProducto = {
      codigo: data.codigo,
      descripcion: data.descripcion,
      precio: data.precio,
      precioOff: data.precioOff,
      tamano: data.tamano,
      cantidadOferta: data.cantidadOferta,
      stock: data.stock,
      img: urlFinal
    }
   await agregarProducto(idDoc, nuevoProducto)
   setIsLoader(false)
   reset();
}

const handleChange = async (e) => {        
    if (!archivoOriginal) return;
    //console.log('cargando el archivo: ', archivoOriginal)
    const webpBlob = await convertirAWebP(archivoOriginal);
    const urlWebP = await subirACloudinary(webpBlob, archivoOriginal.name);
    return urlWebP
  };

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
        <h3>Ingrear Productos</h3>
      </div>
      { 
        isOnCamara &&
          <Lector 
          setNumero={setNumero}
          numero={numero}
          setIsOnCamara={setIsOnCamara}
          />          
      }
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
          { isLoader ? <Loader /> : 'CARGAR' }
          
        </button>
      </form>
    </div>
  )
};
export default Ingresar;