import { useState, useEffect } from 'react'
import { auth } from './firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getData } from './firebase/auth.js'
import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'

function App() {
  const [ isHome, setIsHome ] = useState(false);
  const [ isLogin, setIsLogin ] = useState(true)
  const [ usuarioLogueado, setUsuarioLogueado ] = useState(null); // Muestra datos del usuario logedo
  const [ errorUsuario, setErrorUsuario ] = useState(false);
  
  const productosParaCobrar = localStorage.getItem('cobrar-kiosco')
  const [ productosEnCarrito, setProductosEnCarrito ] = useState(productosParaCobrar ? JSON.parse(productosParaCobrar) : [])
  const [ productos, setProductos ] = useState([]);
  const [ db, setDb ] = useState([])
  const [ cargando, setCargando ] = useState(true);
  const [ idDoc, setIdDoc ] = useState(null)

    useEffect(() => {
    const nuevosProductos = productosEnCarrito
    localStorage.setItem('kiosco', JSON.stringify(nuevosProductos))
  },[productosEnCarrito])

useEffect(() => {
    let unsubscribeDocument = () => {};

    // Condición de Logueo
    if (usuarioLogueado && usuarioLogueado.uid) {
        const uid = usuarioLogueado.uid;
        setIdDoc(uid) // Guardo el id unico del usuario ya que va a ser el nombre del documento en firebase.
        // Suscripción al Documento Completo
        unsubscribeDocument = getData(uid, (fullData) => {
            // ⬅️ 'fullData' es el objeto completo {nombre_kiosco: "...", productos: [], ventas: []}
            setDb(fullData);
            setProductos(fullData.productos)
            console.log("Documento completo cargado:", fullData);
        });
    } else {
        // Limpiar estado al desloguearse
        setDb({});
        //console.log('No hay usuario logueado. Estado limpiado.');
    }
    
    // Limpieza: Detiene la escucha del documento
    return () => {
        unsubscribeDocument();
    };

// Dependencia clave: Se re-ejecuta solo cuando el usuario cambia.
}, [usuarioLogueado]); 

  // Detecta si se loguea o sale.
  onAuthStateChanged( auth, ( user ) => {
    if(user){
      setUsuarioLogueado(user);
      setIsLogin(false);
      setIsHome(true);
    }else{
      setIsHome(false);
      setIsLogin(true);
    }
  })

 
  
  return (
    <>
      {
        isLogin &&
          <Login 
          setUsuarioLogueado={setUsuarioLogueado}
          usuarioLogueado={usuarioLogueado}
          errorUsuario={errorUsuario}
          setErrorUsuario={setErrorUsuario}
          />
      }
      {
        isHome &&
          <Home 
          idDoc={idDoc}
          productos={productos}
          setProductos={setProductos}
          productosEnCarrito={productosEnCarrito}
          setProductosEnCarrito={setProductosEnCarrito}
          />
      }
    </>
  )
}

export default App
