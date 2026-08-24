import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Neuron({ position, color, size = 0.1 }) {
  const mesh = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    mesh.current.position.y += Math.sin(t + position[0]) * 0.002
  })

  return (
    <Sphere args={[size, 16, 16]} position={position} ref={mesh}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2} 
        toneMapped={false} 
      />
    </Sphere>
  )
}

function Synapses({ count = 80 }) {
  const points = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    ])
  }, [count])

  return (
    <group>
      {points.map((pos, i) => (
        <Neuron 
          key={i} 
          position={pos} 
          color={Math.random() > 0.8 ? "#FFD700" : "#00FFFF"} 
        />
      ))}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, color: '#FFD700', letterSpacing: '4px', fontSize: '2rem', fontWeight: 'bold' }}>MEMORIA-NEXUS</h1>
        <p style={{ color: '#00FFFF', opacity: 0.8, fontSize: '0.9rem' }}>Neuroscience-Inspired AI Memory Lab</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Synapses count={100} />
        </Float>
        
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div style={{ position: 'absolute', bottom: 30, left: 30, zIndex: 10 }}>
        <div style={{ 
          padding: '15px', 
          background: 'rgba(0,0,0,0.6)', 
          borderRadius: '12px', 
          border: '1px solid rgba(0,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(0,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF00', marginRight: '8px', boxShadow: '0 0 8px #00FF00' }}></div>
            <small style={{ color: '#aaa', fontWeight: 'bold', fontSize: '0.75rem' }}>SYSTEM: ACTIVE</small>
          </div>
          <small style={{ color: '#00FFFF', display: 'block' }}>REDIS_VL: CONNECTED</small>
          <small style={{ color: '#FFD700', display: 'block' }}>NEURAL_NODES: 1,248</small>
        </div>
      </div>
    </div>
  )
}
