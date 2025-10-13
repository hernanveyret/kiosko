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
    const startCamera = async () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((d) => d.kind === 'videoinput');
        const backCamera = cameras.find((c) =>
          /back|rear|environment/i.test(c.label)
        );

        const constraints = {
          video: backCamera
            ? { deviceId: { exact: backCamera.deviceId } }
            : { facingMode: { ideal: 'environment' } },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        startScanner();
      } catch (err) {
        resultRef.current.textContent = 'Error: ' + err.message;
      }
    };

    const initDetector = async () => {
      if ('BarcodeDetector' in window) {
        detectorRef.current = new BarcodeDetector({
          formats: [
            'ean_13',
            'ean_8',
            'code_128',
            'code_39',
            'code_93',
            'upc_e',
            'upc_a',
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
            setNumero(code); // ✅ guarda el número escaneado
            stopCamera();    // ✅ cierra la cámara al detectar el código
            scanningRef.current = false;
            setIsOnCamara(false)
            return;
          }
        } catch (err) {
          // ignorar errores de detección
        }

        requestAnimationFrame(scanLoop);
      };

      scanLoop();
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };

    initDetector().then(startCamera);

    // Limpieza al desmontar el componente
    return () => {
      stopCamera();
    };
  }, [setNumero]);

  return (
    <div className="container-lector">
      <video ref={videoRef} autoPlay playsInline></video>
      <div ref={resultRef}>Esperando código...</div>
      <button
      onClick={() => setIsOnCamara(false)}
      >CERRAR</button>
    </div>
  );
};

export default Lector;

