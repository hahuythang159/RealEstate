import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Globe() {
  const globeRef = useRef();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const earthTexture = new THREE.TextureLoader().load('/textures/earth.jpg');

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

function GitHubGlobe() {
  return (
    <Canvas style={{ height: '100vh', background: '#000' }}>
      {/* Hiệu ứng sao xung quanh quả cầu */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ánh sáng */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Globe />

      <OrbitControls enableZoom={true} enabled={false} />
    </Canvas>
  );
}

export default GitHubGlobe;
