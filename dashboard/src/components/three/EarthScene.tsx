import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

import type { Asteroid as AsteroidData } from '../../types/asteroid';
import { AsteroidField } from './AsteroidField';
import { Earth } from './Earth';

interface EarthSceneProps {
  asteroids: AsteroidData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function EarthScene({ asteroids, selectedId, onSelect }: EarthSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      onPointerMissed={() => onSelect(null)}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#cfe9ff" />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#ff3860" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#00e5ff" />

      <Suspense fallback={null}>
        <Stars
          radius={80}
          depth={50}
          count={3500}
          factor={3}
          saturation={0.6}
          fade
          speed={0.6}
        />
        <Earth />
        <AsteroidField asteroids={asteroids} selectedId={selectedId} onSelect={onSelect} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
