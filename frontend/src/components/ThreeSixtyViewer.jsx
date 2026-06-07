import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ThreeSixtyViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    fetch(`/api/portfolio/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data.property);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!property || !property.rooms || property.rooms.length === 0) return;

    // Load Three.js from CDN
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initThree;
      document.head.appendChild(script);
    } else {
      initThree();
    }

    let camera, scene, renderer, mesh;
    let isUserInteracting = false,
      onPointerDownPointerX = 0, onPointerDownPointerY = 0,
      lon = 0, onPointerDownLon = 0,
      lat = 0, onPointerDownLat = 0,
      phi = 0, theta = 0;

    function initThree() {
      if (sceneRef.current) {
        // Update texture instead of full re-init if possible, 
        // but for simplicity here we'll re-init if container is fresh or just update mesh
        if (mesh) {
          const loader = new window.THREE.TextureLoader();
          loader.load(`/uploads/${property.rooms[currentRoomIndex].filename}`, (texture) => {
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
          });
          return;
        }
      }

      const container = containerRef.current;
      if (!container) return;

      camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
      scene = new window.THREE.Scene();
      sceneRef.current = scene;

      const geometry = new window.THREE.SphereGeometry(500, 60, 40);
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1);

      const loader = new window.THREE.TextureLoader();
      const texture = loader.load(`/uploads/${property.rooms[currentRoomIndex].filename}`);
      const material = new window.THREE.MeshBasicMaterial({ map: texture });

      mesh = new window.THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new window.THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      container.style.touchAction = 'none';
      container.addEventListener('pointerdown', onPointerDown);
      document.addEventListener('wheel', onDocumentMouseWheel);
      window.addEventListener('resize', onWindowResize);

      animate();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerDown(event) {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }

    function onPointerUp() {
      isUserInteracting = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    }

    function onDocumentMouseWheel(event) {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = window.THREE.MathUtils.clamp(fov, 10, 75);
      camera.updateProjectionMatrix();
    }

    function animate() {
      requestAnimationFrame(animate);
      update();
    }

    function update() {
      lat = Math.max(-85, Math.min(85, lat));
      phi = window.THREE.MathUtils.degToRad(90 - lat);
      theta = window.THREE.MathUtils.degToRad(lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(x, y, z);
      renderer.render(scene, camera);
    }

    return () => {
      // Cleanup
      if (renderer) {
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      document.removeEventListener('wheel', onDocumentMouseWheel);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [property, currentRoomIndex]);

  if (loading) return <div className="fixed inset-0 bg-black flex items-center justify-center text-white">Loading Tour...</div>;
  if (!property || !property.rooms || property.rooms.length === 0) return <div className="fixed inset-0 bg-black flex items-center justify-center text-white">No 360 photos available for this property.</div>;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full cursor-move" />
      
      {/* UI Overlays */}
      <div className="absolute top-6 left-6 z-10 flex flex-col space-y-2">
        <button 
          onClick={() => navigate('/portfolio')}
          className="bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition flex items-center text-sm font-bold uppercase tracking-widest"
        >
          ← Back to Gallery
        </button>
        <div className="bg-[#B8966A] text-[#0E0E0E] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
          {property.title}
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-h-[80vh] overflow-y-auto w-48 shadow-2xl">
        <h4 className="text-[10px] font-bold text-[#B8966A] uppercase tracking-widest mb-4 opacity-70">Switch Room</h4>
        <div className="space-y-2">
          {property.rooms.map((room, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentRoomIndex(idx)}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold transition flex items-center space-x-3 ${
                currentRoomIndex === idx 
                  ? 'bg-[#B8966A] text-[#0E0E0E] shadow-lg' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="opacity-50">0{idx + 1}</span>
              <span className="truncate">{room.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none">
        Drag to look around • Scroll to zoom
      </div>
    </div>
  );
};

export default ThreeSixtyViewer;
