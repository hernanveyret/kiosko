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
  const [ ventaDiaria, setVentaDiaria ] = useState([])
  
  const productosParaCobrar = localStorage.getItem('cobrar-kiosco')
  const [ carrito, setCarrito ] = useState(productosParaCobrar ? JSON.parse(productosParaCobrar) : [])
  const [ productos, setProductos ] = useState([]);
  const [ db, setDb ] = useState([])
  const [ cargando, setCargando ] = useState(true);
  const [ idDoc, setIdDoc ] = useState(null);
  const [ isLoaderGeneral, setIsLoaderGeneral ] = useState(false);

  useEffect(() => {
    const nuevosProductos = carrito
    localStorage.setItem('cobrar-kiosco', JSON.stringify(nuevosProductos))
  },[carrito])

useEffect(() => {
    let unsubscribeDocument = () => {};
      setIsLoaderGeneral(true)
    // Condición de Logueo
    if (usuarioLogueado && usuarioLogueado.uid) {
        const uid = usuarioLogueado.uid;
        setIdDoc(uid) // Guardo el id unico del usuario ya que va a ser el nombre del documento en firebase.
        // Suscripción al Documento Completo
        unsubscribeDocument = getData(uid, (fullData) => {
            // ⬅️ 'fullData' es el objeto completo {nombre_kiosco: "...", productos: [], ventas: []}
            setDb(fullData);
            setProductos(fullData.productos)
            setIsLoaderGeneral(false)
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

useEffect(() => {
  db.ventas && console.log('Base de datos db:', db.ventas)
  if(db.ventas){
    const fechas = Object.keys(db.ventas);
    console.log(fechas)
    //console.log(db.ventas[fechas[0]])
    //const totalDia = db.ventas[fechas[0]].reduce((acc, cant) => acc + cant.total, 0);
    //console.log(totalDia)
    fechas.forEach(i => {
      const totalDia = db.ventas[i].reduce((acc, cant) => acc + cant.total, 0);
      const dia = `${i.slice(0,2)}-${i.slice(2,4)}-${i.slice(4,8)}`
      const info = {
        fecha: dia,
        totalDia
      }
      setVentaDiaria((prev) => [...prev, info ])
    })
  }
},[db])

useEffect(() => {
  ventaDiaria && console.log(ventaDiaria)
},[ventaDiaria])

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
          carrito={carrito}
          setCarrito={setCarrito}
          db={db}
          isLoaderGeneral={isLoaderGeneral}
          setIsLoaderGeneral={setIsLoaderGeneral}
          />
      }
    </>
  )
}

export default App
