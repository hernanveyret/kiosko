import { GoogleAuthProvider,
         signInWithPopup,
         signOut,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword, 
         updateProfile } from "firebase/auth";

import { collection,
         onSnapshot, 
         addDoc,
         deleteDoc,
         doc, 
         setDoc,
         getDoc,
         updateDoc, 
         getDocs,
         arrayUnion, 
         arrayRemove,
        } from "firebase/firestore";

import { 
        updatePassword, 
        EmailAuthProvider, 
        reauthenticateWithCredential 
        } from "firebase/auth";

import { auth, db } from "./config.js";

const provider = new GoogleAuthProvider();

export const loginWhihtGoogle = async () => {
  try {
    // 1. INICIAR SESIÓN CON GOOGLE
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // OBTENEMOS EL UID DEL USUARIO LOGUEADO
    const userUID = user.uid;
    const userDocRef = doc(db, 'kioscos', userUID);

    // 2. VERIFICAR SI EL DOCUMENTO DEL KIOSCO YA EXISTE
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // 3. SI NO EXISTE (PRIMERA VEZ): CREAR EL DOCUMENTO INICIAL
      console.log(`Documento inicial creado para el usuario: ${user.displayName}`);      
      await setDoc(userDocRef, {
        nombre_kiosco: user.displayName || 'Mi Kiosco Google', 
        fecha_creacion: new Date(),
        productos: [], 
        ventas: [],
      });      
    } else {
      // 4. SI YA EXISTE: Simplemente cargamos los datos
      console.log(`Usuario existente logueado: ${user.displayName}.`);
    }    
    return user;    
  } catch (error) {
    console.log('Error al iniciar sesion con Google: ', error);
    throw error;
  }
}

// Login con mail y contraseña
export const loginConMail = async(dataUser) => {
  try {
    const userLogin = await signInWithEmailAndPassword(auth, dataUser.correo, dataUser.password);
    //console.log(userLogin.user)
    //console.log(userLogin.user.displayName)
    return userLogin.user
  } catch (error) {
    //console.log(error.code)
    return { ok: false, error: error.code }  
}
}

// Cerrar sesion
export const cerrarSesion = async () => {
  signOut(auth).then(() => {
    console.log('Sesion finalizada')
  })
}

export const crearCuentaEmail = async (datosUser) => {
  try {
    // 1. CREAR USUARIO EN FIREBASE AUTH
    const result = await createUserWithEmailAndPassword(auth, datosUser.correo, datosUser.password);
    const user = result.user;
    
    // Asignar el nombre de usuario
    await updateProfile(user, { displayName: datosUser.nombre });
    
    // 2. CREAR DOCUMENTO PRINCIPAL EN FIRESTORE
    // Ruta: /kioscos/{UID_DEL_USUARIO}
    const userDocRef = doc(db, 'kioscos', user.uid);

    // ✅ INICIALIZAR EL DOCUMENTO CON LOS ARRAYS VACÍOS
    await setDoc(userDocRef, {
      nombre_kiosco: datosUser.nombre || 'Mi Kiosco', 
      fecha_creacion: new Date(),
      
      // ⭐ CAMPOS DE ARRAY VACÍOS ⭐
      productos: [], 
      ventas: [],
    });

    // ❌ Se elimina la inicialización de la Subcolección 'productos'
    // ❌ Se elimina la inicialización de la Subcolección 'ventas'
    
    return user;

  } catch (error) {
    console.error('Error en crearCuentaEmail:', error);
    throw error; 
  }
}

// Escucha cambios en tiempo real en la base de datos y las descarga
export const getData = (userUID, callback) => {
    if (!userUID) return () => {};

    try {
        // La referencia apunta al documento completo: /kioscos/{UID}
        const docRef = doc(db, 'kioscos', userUID);
        
        // Se suscribe al documento completo
        const unsubscribe = onSnapshot(docRef, docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // ⬅️ Retorna el objeto de datos completo
                console.log(data)
                callback(data); 
            } else {
                callback({}); // Retorna un objeto vacío si no existe
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error('Error al escuchar el documento:', error);
        callback({});
        return () => {};
    }
};

export const agregarProducto = async ( userUID, nuevoProducto ) => {
  if(!userUID){
    throw new error('S necesita el UID para agregar el producto');
  }

  // Crear una referencia del documento del usuario logueado.
  const userDocRef = doc(db, 'kioscos', userUID);
 try {
  await updateDoc(userDocRef, {
    productos: arrayUnion(nuevoProducto)
  });
  console.log('Producto agregado con exito')
 } catch (error) {
  console.error('Error al cargar el producto: ', error);
  throw error
 }
}


/*
export const guardarProducto = async (userUID,producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto      
    });
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};
*/

/*
export const crearCategorias = async (producto) => {
  const categorias = {
    categoria: producto.categoria,
    urlImg: producto.urlImg,
    public_id: producto.public_id
  }
  try {
    const docRef = await addDoc(collection(db, 'categorias'), {
      ...categorias
    
    });
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};
*/

/*
// Borra la categoria o el prodructo seleccionada/o por ID
export const borrarCategoria = async (nombreColeccion,id) => {
  try {
    const docRef = doc(db,nombreColeccion, id);
    await deleteDoc(docRef);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
*/
/*
export const editarProducto = async (idProducto, update) => {  
  try {
    const docRef = doc(db,"productos", idProducto);
    const result = await setDoc(docRef, update);
    return { ok: true }
  } catch (error) {
    return { ok: false, message: 'Error al editar el producto'}
  }
}
*/

/*
export const editActivate = async (idproducto, update) => {
  try {
    const docRef = doc(db, 'productos', idproducto);
    await setDoc(docRef, {activate: update}, { merge: true }); // al poner merge true solo actualiza activate
  } catch (error) {
    console.log('Error al actualizar Activate:', error)
  }
}
 */
/*
export const guardarPrecioEnvio = async (costo) => {
  const envio = {
    envio: costo,
  };

  try {
    // Documento con ID fijo "precio"
    const envioRef = doc(db, 'envio', 'precio');
    // Crea o actualiza ese documento
    const resultado = await setDoc(envioRef, envio);
    return { ok: true }
  } catch (error) {
    console.error("⛔ Error al guardar el precio de envío:", error);
    return { ok: false, error: error }
  }
};
*/
export const guardarDatosbancarios = async (datos) => {
  try {
    const bancoRef = doc(db,'datosBancarios', 'banco');
    await setDoc(bancoRef, datos);
    return { ok: true }
  } catch (error) {
    console.log('No se pudieron guardar los datos bancarios: ', error)
    return { ok: false, error: error }
  }
}
/*
// cambiar contraseña
export const cambiarContrasena = async (user, contraseñaActual, nuevaContrasena) => {

  try {
    // Reautenticar al usuario con la contraseña actual
    const credencial = EmailAuthProvider.credential(user.email, contraseñaActual);
    await reauthenticateWithCredential(user, credencial);

    // Actualizar la contraseña
    const resultado = await updatePassword(user, nuevaContrasena);
    return { ok: true }
  } catch (error) {
    console.log(error.code)
    return { ok: false, error: error }
  }
};
*/
