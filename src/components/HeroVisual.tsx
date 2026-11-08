import { useRef, useMemo, Suspense, Component, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function createGlassGeometry() {
  const pts: THREE.Vector2[] = []
  const profile: [number, number][] = [
    [0.46, 1.42], [0.48, 1.28], [0.47, 1.12], [0.44, 0.95], [0.38, 0.78],
    [0.28, 0.58], [0.16, 0.4], [0.08, 0.28], [0.042, 0.18], [0.034, 0.05],
    [0.03, -0.42], [0.16, -0.5], [0.27, -0.55], [0.3, -0.575], [0.01, -0.575],
  ]
  profile.forEach(([r, y]) => pts.push(new THREE.Vector2(r, y)))
  return new THREE.LatheGeometry(pts, 64)
}

function createLiquidGeometry() {
  const pts: THREE.Vector2[] = []
  const profile: [number, number][] = [
    [0.01, 0.42], [0.2, 0.44], [0.34, 0.58], [0.4, 0.78], [0.41, 0.98],
    [0.36, 1.15], [0.22, 1.22], [0.01, 1.24],
  ]
  profile.forEach(([r, y]) => pts.push(new THREE.Vector2(r, y)))
  return new THREE.LatheGeometry(pts, 48)
}

type MouseMV = MotionValue<number>

function GlassScene({ mouseX, mouseY }: { mouseX: MouseMV; mouseY: MouseMV }) {
  const group = useRef<THREE.Group>(null)
  const reduced = usePrefersReducedMotion()
  const glassGeo = useMemo(() => createGlassGeometry(), [])
  const liquidGeo = useMemo(() => createLiquidGeometry(), [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const sway = reduced ? 0 : 0.01
    group.current.rotation.y = Math.sin(t * 0.2) * sway + mouseX.get() * 0.3
    group.current.rotation.x = Math.cos(t * 0.17) * sway * 0.5 + mouseY.get() * -0.2
  })

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.24, 0.05, 48]} />
        <meshStandardMaterial color="#EAE6DE" roughness={0.3} metalness={0.03} />
      </mesh>
      <mesh position={[0.2, -0.56, 0.14]} castShadow>
        <sphereGeometry args={[0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#5A2E16" roughness={0.7} />
      </mesh>
      <mesh geometry={glassGeo} castShadow>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.03}
          transmission={0.92}
          thickness={0.65}
          ior={1.5}
          envMapIntensity={1.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={liquidGeo}>
        <meshPhysicalMaterial
          color="#5C1A28"
          metalness={0.05}
          roughness={0.06}
          transmission={0.18}
          thickness={0.85}
          ior={1.35}
          attenuationColor="#3A0E16"
          attenuationDistance={0.45}
          envMapIntensity={0.6}
          emissive="#4A1520"
          emissiveIntensity={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh position={[0, 1.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.21, 32]} />
        <meshPhysicalMaterial
          color="#6E2434"
          metalness={0.1}
          roughness={0.04}
          transmission={0.25}
          thickness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

function CameraRig({ mouseX, mouseY }: { mouseX: MouseMV; mouseY: MouseMV }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouseX.get() * 0.36 - camera.position.x) * 0.05
    camera.position.y += (0.3 + mouseY.get() * 0.2 - camera.position.y) * 0.05
    camera.lookAt(0, 0.2, 0)
  })
  return null
}

function SceneContent({ mouseX, mouseY }: { mouseX: MouseMV; mouseY: MouseMV }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.2, 5.2, 2.6]} intensity={1.15} castShadow />
      <directionalLight position={[-2.2, 1.6, -1.6]} intensity={0.32} color="#EDE6DC" />
      <spotLight position={[0.4, 3.2, 1.8]} angle={0.45} penumbra={0.6} intensity={0.55} color="#FFF5EB" />
      <Float speed={1.05} rotationIntensity={0.05} floatIntensity={0.09}>
        <GlassScene mouseX={mouseX} mouseY={mouseY} />
      </Float>
      <ContactShadows position={[0, -0.66, 0]} opacity={0.4} scale={5.5} blur={2.4} far={3.5} />
      <Environment preset="studio" />
      <CameraRig mouseX={mouseX} mouseY={mouseY} />
    </>
  )
}

function FallbackUI({ message = '3D loading...' }: { message?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F7F5F0] to-[#EAE7E0]/50">
      <div className="text-center px-6">
        <div className="w-24 h-32 mx-auto mb-4 rounded-t-[45%] rounded-b-[20%] border border-[#EAE7E0] bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
          <div className="absolute bottom-3 left-2 right-2 h-[45%] rounded-b-[30%] bg-[#702D3B]/85" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#85847E]">{message}</p>
      </div>
    </div>
  )
}

class HeroErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return <FallbackUI message="3D unavailable on this device" />
    return this.props.children
  }
}

export default function HeroVisual() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 })

  return (
    <div
      className="w-full h-full relative"
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onPointerLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
    >
      <HeroErrorBoundary>
        <Suspense fallback={<FallbackUI />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.28, 3.2], fov: 35, near: 0.1, far: 40 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0)
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.05
            }}
            style={{ background: 'transparent' }}
          >
            <SceneContent mouseX={springX} mouseY={springY} />
          </Canvas>
        </Suspense>
      </HeroErrorBoundary>
      <p className="absolute bottom-5 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-[#85847E]/70 pointer-events-none">
        Interactive 3D composition
      </p>
    </div>
  )
}
