import React, { useState, useEffect, useRef } from 'react';
import Lector from './Lector';
import EditItemCaja from './EditItemCaja';
import Loader from './Loader';
import './caja.css';
import './editItemCaja.css';

const Caja = ({
                productos,
                numero,
                setNumero,
                setIsOnCamara,
                isOnCamara,
                valorCodigo,
                setValorCodigo,
                productosEnCarrito, 
                setProductosEnCarrito
}) => {
const [ search, setSearch ] = useState([]);
const [ buscar, setBuscar ] = useState([]);
const [ carrito, setCarrito ] = useState([]);
const [ cantidad, setCantidad ] = useState(0);
const [ isEditItem, setIsEditItem ] = useState(false);
const [ idCodigoEditar, setIdCodigoEditar ] = useState(null);
const [ subtotal, setSubTotal ] = useState(0);
const [ vuelto, setVuelto ] = useState('');
const [ vueltoPuro, setVueltoPuro ] = useState(0);
const [ isLoader, setIsLoader ] = useState(false);

useEffect(() => {
   setNumero('')
},[])
useEffect(() => {
   setValorCodigo('')
},[])

const navRef = useRef(null);

const buscarProductoCam = (item) => {  
  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setSearch(resultados);
};

useEffect(() => {
  if(search.length === 1){
    setCarrito((prev) => [...prev, {...search[0], cantidad: 1}])    
  }
},[search])

useEffect(() => {
  const addCarrito = carrito;
  setProductosEnCarrito(carrito)
},[carrito])

useEffect(() => {
  console.log(productosEnCarrito)
},[productosEnCarrito])

useEffect(() => {
    const nuevoSubtotal = carrito.reduce((acumulador, itemActual) => {
        return acumulador + Number(itemActual.precio) * Number(itemActual.cantidad);
    }, 0);
    setSubTotal(nuevoSubtotal);    

    const cantidadProductos = carrito.reduce((acc, cant) => Number(acc) + Number(cant.cantidad), 0)
    setCantidad(cantidadProductos)
}, [carrito]);

 // detecta si se escaneo algun numero
useEffect(() => {
    if (numero && numero !== 0) {
        // actualiza el input después del escaneo.
        setValorCodigo(numero);
        buscarProductoCam(numero)
    }
}, [numero]);

const buscarProductoTeclado = (item) => {
  const valor = navRef.current
  valor.classList.remove('close')

  if (item.trim() === '') {
    setBuscar([]); 
    return;
  }

  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  if(resultados.length > 0 ){
    setBuscar(resultados)
  }
}

const addCarrito = (i) => {
const valor = navRef.current
  if(buscar){
    
    setValorCodigo('');
    setCarrito((prev) => [...prev, { ...buscar[i], cantidad: 1 }]);
    setBuscar([]);
    valor.classList.add('close')
  }
}

const borrarDelCarrito = (id) => {
  const filtrar = carrito.filter(item => item.codigo !== id );
  if(filtrar){
    setCarrito(filtrar)
  }
}

const formatearCambio = (e) => {
    const valor = e.target.value;
    
    // 1. Limpieza: Obtenemos SOLO los dígitos (ej: "10000"). Esto elimina el '.' si viene del input.
    const rawValue = valor.replace(/\D/g, ''); 
    
    // 2. Monto Numérico: Convertimos el valor limpio a número (si es "" se convierte a 0).
    const cambioNumerico = Number(rawValue); 

    // 3. Formato para Display: Usamos 'decimal' para obtener solo los puntos de miles (ej: "10.000").
    const valorDisplay = cambioNumerico.toLocaleString('es-AR', {
        style: 'decimal', // Solo decimal, no currency
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // 4. Actualizar ESTADOS:
    setVueltoPuro(cambioNumerico); // <<-- El número PURO para el cálculo (5000)
    setVuelto(valorDisplay);       // <<-- El string formateado para el input ("5.000")
};

// --- FUNCIÓN DE CÁLCULO DEL VUELTO ---
const calcularVuelto = () => {
    // 1. **Lógica de la Resta:** El cambio (vueltoPuro) debe restar al Total (subtotal).
    const vueltoReal = vueltoPuro - subtotal;
    
    // 2. Condición de Visibilidad/Validación: Solo mostrar si el cambio es positivo y suficiente.
    if (vueltoReal <= 0 || vueltoPuro === 0) {
        // Si el vuelto es cero, negativo o no se ingresó monto, retorna un string vacío.
        return ''; 
    }

    // 3. Formateo de Salida: Retornamos el valor formateado (solo miles).
    return vueltoReal.toLocaleString('es-AR', {
        style: 'decimal', // Usamos decimal para solo los miles
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};

  return (
    <div className='contenedor-caja'>
      {
        isOnCamara  &&
          <Lector 
          setNumero={setNumero}
          numero={numero}
          setIsOnCamara={setIsOnCamara}
          />
      }
      {
        isEditItem &&
          <EditItemCaja 
            carrito={carrito}
            setCarrito={setCarrito}
            idCodigoEditar={idCodigoEditar}
            setIdCodigoEditar={setIdCodigoEditar}
            setIsEditItem={setIsEditItem}
          />
      }
        <h3>Lista de productos</h3>
    <div className="buscador-producto">
      <div className='nav-buscador'>
      <input type="text" 
      placeholder='Buscar...'
      value={valorCodigo}
      onChange={(e) => { 
        setValorCodigo(e.target.value )
        buscarProductoTeclado(e.target.value)}}
      />
      <button
        className='btn-scann'
        onClick={() => { setIsOnCamara(true)}}
        >
        Ecanear Codigo
      </button>
        </div>
      <section className="productos-buscados close" ref={navRef}>
        {
          buscar &&
            buscar.map((item, i) => (
              <div className='search-productos' key={item.codigo} >
                <p>#{i+1} {item.descripcion} {item.tamano}</p>
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
                <p>
                  {
                    item.precioOff &&
                    Number(item.precioOff).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })
                  }
                </p>
                <button
                  type='button'
                  className='btn-add-item'
                  onClick={() => addCarrito(i)}
                >+</button>
              </div>
            ))
          }
      </section>
        </div>
      <div className="contenedor-pc">
      <div className='lista-productos'>
        {
          carrito.length > 0 
          ?
          carrito.map((item, i) => (
            <div className='items-cobrar' key={item.codigo}>
              <div>
              <p>#{i+1} - {item.descripcion} {item.tamano}</p>
            </div>
            <div>
              <p>{item.cantidad}</p>
            </div>
            <div>
              <p>
                { Number(item.cantidad) === 1 ?
                  Number(item.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  }) 
                  :
                  Number(item.precioOff).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  })

                }
              </p>
            </div>
            <div className="btn-cobrar">
              <button
                type='Editar'
                onClick={() => { 
                  setIdCodigoEditar(item.codigo)
                  setIsEditItem(true) 
                } }
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="20px" 
                  viewBox="0 -960 960 960" 
                  width="20px" 
                  fill="white">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
              </button>
              <button
                type='Borrar'
                onClick={() => { borrarDelCarrito(item.codigo)}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="20px" 
                  viewBox="0 -960 960 960" 
                  width="20px" 
                  fill="white">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
              
            </div>
          ))
          :
          <p style={{textAlign:'center', color:'grey', padding:'10px'}}>Aun no hay productos para cobrar</p>
        }
      </div>
      <div className='importe'>
        <p>Cantidad:
          <span>{cantidad}</span>
        </p>
        <p>Total
          <span>
          {
            Number(subtotal).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
            })
          }
        </span>
        </p>
        <span>Cambio:
          <input 
            type='text'  
            style={{ 
              padding: '5px', 
              textAlign:'right', 
              color: 'red', 
              fontWeight:'bold',
              marginRight:'5px'
            }}
            value={vuelto}
            onChange={formatearCambio}
          />
        </span>
        <p>Vuelto: $
          {calcularVuelto()} 
        </p>
        <p>Medio de pago</p>
        <select>
          <option>Efectivo</option>
          <option>Mercado Pago</option>
          <option>Devito</option>
        </select>
      </div>
      </div>
      
      <button
        type='button'
        className='cobrar-btn'
      >
        {
          isLoader ? <Loader /> : 'COBRAR'
        }
      </button>
    </div>
  )
};
export default Caja;