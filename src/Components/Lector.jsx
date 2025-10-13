import React, { useEffect, useRef } from 'react';
import './lector.css';

const Lector = ({ setNumero, setIsOnCamara }) => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanningRef = useRef(true);

  useEffect(() => {
    const startCamera = async () => {
      stopCamera(); // Detener cualquier cámara previa

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(d => d.kind === 'videoinput');

        // Elegir cámara trasera si existe, sino cualquier cámara disponible
        const backCamera = cameras.find(c =>
          /back|rear|environment/i.test(c.label)
        );

        const constraints = backCamera
          ? { video: { deviceId: backCamera.deviceId } }
          : { video: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        startScanner();
      } catch (err) {
        if (resultRef.current) {
          resultRef.current.textContent = 'Error: ' + err.message;
        }
        console.error('No se pudo iniciar la cámara:', err);
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
        if (!video || !video.videoWidth || !scanningRef.current) {
          requestAnimationFrame(scanLoop);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          let code = null;

          if (detector.detect) {
            const bitmap = await createImageBitmap(canvas);
            const barcodes = await detector.detect(bitmap);
            if (barcodes.length) code = barcodes[0].rawValue;
          } else {
            const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            await img.decode();
            const res = await detector.decodeFromImage(img);
            if (res) code = res.text;
          }

          if (code) {
            if (resultRef.current) resultRef.current.textContent = '📦 ' + code;
            setNumero(code);
            scanningRef.current = false;
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

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    initDetector().then(startCamera);

    return () => {
      scanningRef.current = false;
      stopCamera();
    };
  }, [setNumero, setIsOnCamara]);

  return (
    <div className="container-lector">
      <video ref={videoRef} autoPlay playsInline></video>
      <div ref={resultRef}>Esperando código...</div>
      <button onClick={() => { scanningRef.current = false; stopCamera(); setIsOnCamara(false); }}>
        CERRAR
      </button>
    </div>
  );
};

export default Lector;
