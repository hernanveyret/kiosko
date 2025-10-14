import React, { useEffect, useRef } from 'react';
import './lector.css';

// Importación condicional del fallback para el detector de código de barras
// NOTA: Se asume que @zxing/library ya está instalado localmente.

const Lector = ({ 
  setNumero,
  numero,
  setIsOnCamara 
}) => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanningRef = useRef(true);

  // Función para detener la cámara y el escaneo
  const stopCamera = () => {
    scanningRef.current = false; // Detiene el bucle de escaneo
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // En el componente Ingresar.jsx
useEffect(() => {
    if (numero && numero !== 0) {
        // ✅ Esta función es la que actualiza el input después del escaneo.
        setValue('codigo', numero); 
    }
}, [numero, setValue]);

  // Función para inicializar el detector de códigos (nativo o fallback)
  const initDetector = async () => {
    if ('BarcodeDetector' in window) {
      detectorRef.current = new BarcodeDetector({
        formats: [
          'ean_13', 'ean_8', 'code_128', 'code_39', 'code_93', 'upc_e', 'upc_a',
        ],
      });
    } else {
      // Importación local del paquete instalado (soluciona el TypeError)
      try {
        const mod = await import('@zxing/library'); 
        detectorRef.current = new mod.BrowserMultiFormatReader();
      } catch (e) {
        console.error("Error al cargar @zxing/library. ¿Está instalado?", e);
        resultRef.current.textContent = "Error: Detector no disponible o mal instalado.";
        stopCamera();
      }
    }
  };

  // Función principal para iniciar la cámara
  const startCamera = async () => {
    stopCamera(); // Asegura detener la cámara anterior

    try {
      let constraints = { video: true }; // Restricción general (Webcam en PC)
      let stream = null;
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((d) => d.kind === 'videoinput');

      // 1. Intenta la cámara trasera (móvil) por etiqueta o facingMode
      const backCamera = cameras.find((c) =>
        /back|rear|environment/i.test(c.label)
      );

      if (backCamera) {
          // Si encontramos una cámara trasera por etiqueta, la usamos
          constraints = { deviceId: { exact: backCamera.deviceId } };
      } else {
          // Si no, probamos con el facingMode ideal (para la mayoría de los móviles)
          constraints = { facingMode: { ideal: 'environment' } };
      }

      try {
        // Intenta la restricción más específica (trasera/ambiente)
        stream = await navigator.mediaDevices.getUserMedia({ video: constraints });
      } catch (error) {
        // Si falla (típico en PC o si la cámara trasera no responde), usa cualquier cámara
        console.warn("Fallo la restricción específica. Intentando cámara general.");
        stream = await navigator.mediaDevices.getUserMedia({ video: true }); 
      }
      
      // Asignar el stream
      streamRef.current = stream;
      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();

      scanningRef.current = true; // Habilita el bucle de escaneo
      startScanner();

    } catch (err) {
      console.error('Error al iniciar la cámara:', err);
      resultRef.current.textContent = 'Error: ' + err.message + '. Asegúrate de tener permisos.';
    }
  };
  
  // Función para iniciar el bucle de escaneo
  const startScanner = async () => {
    const detector = detectorRef.current;
    const video = videoRef.current;

    const scanLoop = async () => {
      // Detiene el bucle si no hay video o si se ha detenido el escaneo
      if (!video.videoWidth || !scanningRef.current || !detector) {
        if(scanningRef.current) {
             requestAnimationFrame(scanLoop);
        }
        return;
      }

      // Proceso de captura del frame y escaneo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      try {
        let code = null;

        if (detector.detect) {
          // BarcodeDetector API nativa
          const bitmap = await createImageBitmap(canvas);
          const barcodes = await detector.detect(bitmap);
          if (barcodes.length) code = barcodes[0].rawValue;
        } else {
          // Fallback con zxing (necesita convertir a imagen)
          const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await img.decode();
          const res = await detector.decodeFromImage(img);
          if (res) code = res.text;
        }

        if (code) {
          resultRef.current.textContent = '📦 Código Detectado: ' + code;
          console.log(code)
          setNumero(code);       // Guarda el número escaneado
          stopCamera();          // Cierra la cámara al detectar el código
          setIsOnCamara(false);
          return;
        }
      } catch (err) {
        // Ignorar errores de detección, continuar escaneando
      }

      requestAnimationFrame(scanLoop);
    };

    scanLoop();
  };

  // useEffect se ejecuta solo al montar el componente
  useEffect(() => {
    initDetector().then(startCamera);

    // Limpieza al desmontar
    return () => {
      stopCamera();
    };
  }, [setNumero, setIsOnCamara]); // Dependencias para el linting

  return (
    <div className="container-lector">
      {/* Añadido 'muted' para evitar restricciones de autoPlay del navegador */}
      <video ref={videoRef} autoPlay playsInline muted></video>
      <div className="resultado-scan" ref={resultRef}>Esperando código...</div>
      <button
        className="cerrar-lector-btn"
        onClick={() => {
          stopCamera();
          setIsOnCamara(false);
        }}
      >
        CERRAR CÁMARA
      </button>
    </div>
  );
};

export default Lector;