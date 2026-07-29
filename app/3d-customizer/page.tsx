'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Camera, Shirt, Sparkles, RefreshCw, ZoomIn, 
  Settings2, Eye, Paintbrush, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

const T_SHIRT_COLORS = [
  { name: 'Pitch Black', hex: '#09090b' },
  { name: 'Classic White', hex: '#f4f4f5' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Ruby Red', hex: '#991b1b' },
  { name: 'Forest Green', hex: '#065f46' },
];

export default function ThreeDViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedColor, setSelectedColor] = useState(T_SHIRT_COLORS[0]);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [arMode, setArMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ThreeJS instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const shirtMeshRef = useRef<THREE.Mesh | null>(null);
  const logoDecalMeshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const arModeRef = useRef(arMode);
  useEffect(() => {
    arModeRef.current = arMode;
  }, [arMode]);

  // Initialize 3D Scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera with safe initial dimensions
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 8;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0); // Explicit transparent background
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // Procedural T-Shirt Geometry (using custom extruded shapes for high realism without files)
    const shirtGroup = new THREE.Group();
    
    // Torso
    const torsoGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.5, 32);
    const shirtMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor.hex),
      roughness: 0.8,
      metalness: 0.1,
    });
    
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = -0.2;
    shirtGroup.add(torso);

    // Left Sleeve
    const sleeveGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.9, 16);
    sleeveGeo.rotateZ(Math.PI / 4);
    const leftSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
    leftSleeve.position.set(-1.4, 0.7, 0);
    shirtGroup.add(leftSleeve);

    // Right Sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
    // Mirror the rotation
    rightSleeve.rotation.z = -Math.PI / 4;
    rightSleeve.position.set(1.4, 0.7, 0);
    shirtGroup.add(rightSleeve);

    // Collar trim
    const collarGeo = new THREE.TorusGeometry(0.65, 0.08, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.set(0, 1.0, 0);
    shirtGroup.add(collar);

    // Rotate slightly for better perspective
    shirtGroup.rotation.y = 0.2;
    scene.add(shirtGroup);
    shirtMeshRef.current = torso; // Track torso to change color later

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Auto rotate if not in AR mode
      if (!arModeRef.current) {
        shirtGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || 350;
      const height = containerRef.current.clientHeight || 430;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Use ResizeObserver for robust layout computation
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Double check layout size shortly after mounting
    setTimeout(handleResize, 100);
    setTimeout(handleResize, 400);

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        resizeObserver.disconnect();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update base color when state changes
  useEffect(() => {
    if (sceneRef.current) {
      // Find all meshes in the group and change material color
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const material = object.material as THREE.MeshStandardMaterial;
          if (material && material.color) {
            material.color.set(selectedColor.hex);
          }
        }
      });
    }
  }, [selectedColor]);

  // Load logo graphic onto shirt
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoImage(dataUrl);

      // Load texture
      const loader = new THREE.TextureLoader();
      loader.load(dataUrl, (texture) => {
        // If an old decal exists, remove it
        if (logoDecalMeshRef.current && sceneRef.current) {
          sceneRef.current.remove(logoDecalMeshRef.current);
        }

        // Create a flat plane to display the decal over the chest
        const decalGeo = new THREE.PlaneGeometry(0.8, 0.8);
        const decalMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false, // Prevents Z-fighting
        });
        
        const decalMesh = new THREE.Mesh(decalGeo, decalMat);
        
        // Position on chest
        decalMesh.position.set(0, 0.3, 1.41); // slightly in front of cylinder radius 1.4
        sceneRef.current?.add(decalMesh);
        logoDecalMeshRef.current = decalMesh;
        setLoading(false);
      });
    };
    reader.readAsDataURL(file);
  };

  // WebAR Camera Toggle (Capacitor wrapper compatible)
  const toggleARMode = async () => {
    if (arMode) {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setArMode(false);
    } else {
      try {
        setLoading(true);
        let stream: MediaStream;
        try {
          // Try environment camera (back camera on mobile)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          });
        } catch (err) {
          console.warn('Environment camera failed, falling back to default camera:', err);
          // Fallback to default user camera (front camera / webcam)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setArMode(true);
      } catch (err) {
        console.error('Camera access failed completely:', err);
        alert('Could not access camera. Please verify device camera connections and site permissions.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN: Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold mb-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Base Colors */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Paintbrush size={16} className="text-violet-400" />
            1. Apparel Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {T_SHIRT_COLORS.map((col) => (
              <button
                key={col.name}
                onClick={() => setSelectedColor(col)}
                style={{ backgroundColor: col.hex }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor.name === col.name
                    ? 'border-violet-500 scale-110 shadow-lg shadow-violet-600/30'
                    : 'border-zinc-800 hover:border-zinc-500'
                }`}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Upload Logo Decal */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Shirt size={16} className="text-violet-400" />
            2. Chest Design Decal
          </h3>
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-800 hover:border-violet-500 rounded-xl cursor-pointer hover:bg-zinc-900/50 transition-all text-center">
            <span className="text-xs text-zinc-400 font-semibold">Upload Print Graphic</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </label>
        </div>

        {/* AR Mode Trigger */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
            <Eye size={16} className="text-violet-400" />
            3. AR Camera Fitting
          </h3>
          <button
            onClick={toggleARMode}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              arMode
                ? 'bg-red-950/20 border border-red-500/50 text-red-400'
                : 'bg-violet-600 hover:bg-violet-500 text-white glow-primary'
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : arMode ? (
              <>
                <Camera size={16} /> Stop Camera Fit
              </>
            ) : (
              <>
                <Camera size={16} /> Start AR fitting check
              </>
            )}
          </button>
        </div>
      </div>

      {/* MIDDLE: 3D / AR Renderer */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-[320px]">
        {/* Render Frame */}
        <div className="relative w-full max-w-[450px] h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/80 shadow-2xl">
          {/* Background Camera video for AR fitting */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
              arMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            muted
            playsInline
          />

          {/* ThreeJS WebGL Overlay with Hardware Acceleration translation */}
          <div
            ref={containerRef}
            className="absolute inset-0 z-10 w-full h-full pointer-events-auto [transform:translate3d(0,0,0)]"
          />

          {/* Top overlays */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
              {arMode ? 'AR Camera Mode' : '3D Studio Model'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
