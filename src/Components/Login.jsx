import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

import './login.css';
const Login = ({
                setIsHome,
                setIsLogin
              }) => {

 const {
   register,
   reset,
   handleSubmit,
   setValue,
   formState: { errors }  
 } = useForm()
  const [ accion, setAccion ] = useState(false);

  const refAsideIzq = useRef(null);
  const refAsideDer = useRef(null);

  const crearCuenta = (data) => {
    console.log('crear una cuenta')
    console.log(data)
  }

  const ingresar = (data) => {
    console.log('ingresar a tu cuenta')
    console.log(data)
    setIsHome(true)
    setIsLogin(false)
  }
  return (
    <div
      className='contenedor-login'>
        <div className='aside-izq'>
          <div className='contenedor-img'>
            <img src='./img/logoKiosco.webp' alt="Logo" />
          </div>
        </div>
        <div className='aside-der'>
          <div className='contenedor-form-login'>
            { accion ? <h2>Crear cuenta</h2> : <h2>Login</h2> }
            <form
              className='form-login'
              onSubmit={handleSubmit( accion ? crearCuenta : ingresar )}
            >
              { 
                accion && 
                <input type='text' name='nombre' 
                  {...register('nombre', {
                    required: {
                      value: true,
                      message: 'Campo obligatorio'
                    }
                  }) }
                /> 
              }
              <input type="mail" name='mail' 
                {...register('mail', {
                  required: {
                    value: true,
                    message:'Campo obligatorio'
                  }
                })
                }                
              />
              { errors.mail?.message && <p className='text-error'>{errors.mail.message}</p>}
              <span className='span-password'>
              <input type='password' name='password' className='password'
                {...register('password', {
                  required: {
                    value: true,
                    message:'Campo obligatorio'
                  }
                })
                }
              />
              <button
                type='button'
                className='btn-ojos'
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="#000000">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                </svg>
              </button>
              </span>
              { errors.password?.message && <p className='text-error'>{errors.password.message}</p>}
                {
                  accion && (
                    <>
                      <input
                        type="password"
                        {...register("repetirPassword", {
                          required: {
                            value: true,
                            message: "Campo obligatorio",
                          },
                        })}
                      />

                      {errors.repetirPassword?.message && (
                        <p className="text-error">{errors.repetirPassword.message}</p>
                      )}
                    </>
                  )
                }              
              <button 
                type='submit'
                className='btn-entrar'          
              >
                ENTRAR
              </button>
              </form>
              {
                !accion
                ?
                <button
                  type='button'
                  className='btn-crear-cuanta'
                  onClick={() => setAccion(true)}
                   >¿No tenes cuenta?</button>
                :
                <button
                  type='button'
                  className='btn-crear-cuanta'
                  onClick={() => setAccion(false)}
                   >Volver</button>
              }
        
                 </div>
        </div>
      </div>
  )
};
export default Login;