import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, type Group, type Mesh } from 'three';

export function Earth() {
  const groupRef = useRef<Group>(null);
  const wireRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid base sphere — deep ocean blue */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a1a3a"
          emissive="#00264d"
          emissiveIntensity={0.4}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Wireframe overlay — counter-rotating for parallax */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.005, 36, 24]} />
        <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.02, 1.04, 128]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.08, 48, 48]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.08} side={BackSide} />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.18, 48, 48]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.04} side={BackSide} />
      </mesh>
    </group>
  );
}
