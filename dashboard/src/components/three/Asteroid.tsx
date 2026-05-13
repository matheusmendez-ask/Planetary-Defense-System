import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Mesh } from 'three';

import type { Asteroid as AsteroidData } from '../../types/asteroid';

interface AsteroidProps {
  data: AsteroidData;
  position: [number, number, number];
  size: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function Asteroid({ data, position, size, selected, onSelect }: AsteroidProps) {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const hazardous = data.is_potentially_hazardous;
  const color = hazardous ? '#ff3860' : '#00e5ff';
  const emissiveIntensity = selected ? 2.2 : hovered ? 1.5 : hazardous ? 1.0 : 0.6;
  const scale = selected ? 1.7 : hovered ? 1.3 : 1;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (ringRef.current) {
      const t = state.clock.elapsedTime;
      const pulse = 1 + Math.sin(t * 2 + position[0]) * 0.15;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data.nasa_neo_reference_id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {(hazardous || selected) && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.8, size * 2.2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.7 : 0.4}
            side={DoubleSide}
          />
        </mesh>
      )}

      {selected && (
        <mesh>
          <sphereGeometry args={[size * 2.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  );
}
