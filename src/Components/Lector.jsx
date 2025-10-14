import React, { useEffect, useRef } from 'react';
import './lector.css';

const Lector = ({ 
  setNumero, 
  setIsOnCamara 
}) => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanningRef = useRef(true);

  useEffect(() => {
    const stopCamera = () => {
      if (streamRef.current) {
        // Detiene todas las pistas de la cámara
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        scanningRef.current = false; // Detiene el bucle de escaneo
      }
    };

    const startCamera = async () => {
      stopCamera(); // Asegura detener la cámara anterior si existe

      try {
        let constraints = {};
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((d) => d.kind === 'videoinput');

        // 1. Intenta obtener la cámara con "facingMode: environment" (móvil, trasera)
        // 2. Si falla, intenta la primera cámara disponible o simplemente 'true'
        
        let backCameraConstraint = { facingMode: { ideal: 'environment' } };
        let generalConstraint = { video: true }; // Permite cualquier cámara

        if (cameras.length > 0) {
            // Intenta encontrar una cámara trasera por etiqueta
            const backCamera = cameras.find((c) =>
                /back|rear|environment/i.test(c.label)
            );

            if (backCamera) {
                // Si encontramos una por etiqueta, la usamos
                backCameraConstraint = { deviceId: { exact: backCamera.deviceId } };
                constraints = backCameraConstraint;
            } else {
                // Si no encontramos una con etiqueta, simplemente usamos la primera
                constraints = { deviceId: { exact: cameras[0].deviceId } };
            }
        } else {
            // Si no se puede enumerar, usamos el facingMode ideal
            constraints = backCameraConstraint; 
        }

        try {
            // 💡 Intenta primero con la restricción más específica (trasera/ideal)
            const stream = await navigator.mediaDevices.getUserMedia({ video: constraints });
            streamRef.current = stream;
        } catch (error) {
            // 💡 Si falla (ej. en PC sin cámara trasera), intenta con la restricción general
            const stream = await navigator.mediaDevices.getUserMedia(generalConstraint);
            streamRef.current = stream;
        }
        
        // Asignar el stream al elemento video y reproducir
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();

        scanningRef.current = true; // Habilita el bucle de escaneo
        startScanner();
      } catch (err) {
        console.error('Error al iniciar la cámara:', err);
        resultRef.current.textContent = 'Error al iniciar la cámara: ' + err.message + '. Asegúrate de tener permisos.';
      }
    };

    // ... (El resto de initDetector, startScanner y scanLoop son correctos y se mantienen)

    const initDetector = async () => {
      // ... (código initDetector sin cambios)
      if ('BarcodeDetector' in window) {
        detectorRef.current = new BarcodeDetector({
          formats: [
            'ean_13', 'ean_8', 'code_128', 'code_39', 'code_93', 'upc_e', 'upc_a',
          ],
        });
      } else {
        const mod = await import(
          'https://unpkg.com/@zxing/library@0.18.6/esm/index.js'
        );
        detectorRef.current = new mod.BrowserMultiFormatReader();
      }
    };

    const startScanner = async () => {
        const detector = detectorRef.current;
        const video = videoRef.current;
  
        const scanLoop = async () => {
          if (!video.videoWidth || !scanningRef.current) {
            requestAnimationFrame(scanLoop);
            return;
          }
  
          // ... (código de escaneo sin cambios)
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
              const bitmap = await createImageBitmap(canvas);
              const barcodes = await detector.detect(bitmap);
              if (barcodes.length) code = barcodes[0].rawValue;
            } else {
              const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
              const img = new Image();
              img.src = URL.createObjectURL(blob);
              await img.decode();
              const res = await detector.decodeFromImage(img);
              if (res) code = res.text;
            }
  
            if (code) {
              resultRef.current.textContent = '📦 ' + code;
              setNumero(code); 
              stopCamera();    
              setIsOnCamara(false);
              return;
            }
          } catch (err) {
            // ignorar errores de detección
          }
  
          requestAnimationFrame(scanLoop);
        };
  
        scanLoop();
      };

    initDetector().then(startCamera);

    // Limpieza al desmontar el componente
    return () => {
      stopCamera();
    };
  }, [setNumero, setIsOnCamara]);

  return (
    <div className="container-lector">
      <video ref={videoRef} autoPlay playsInline muted></video> {/* Añadido 'muted' para evitar advertencias de autoPlay */}
      <div ref={resultRef}>Esperando código...</div>
      <button
      onClick={() => setIsOnCamara(false)}
      >CERRAR</button>
    </div>
  );
};

export default Lector;