import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { Vector3, MeshPhongMaterial, Color } from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise'

export default function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const noise = useMemo(() => new SimplexNoise(), [])

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position
      const time = state.clock.getElapsedTime()
      for (let i = 0; i < positions.count; i++) {
        const p = new Vector3().fromBufferAttribute(positions, i)
        p.normalize().multiplyScalar(
          2 + 0.3 * noise.noise3d(
            p.x * 1.5 + time * 0.1,
            p.y * 1.5 + time * 0.1,
            p.z * 1.5 + time * 0.1
          )
        )
        positions.setXYZ(i, p.x, p.y, p.z)
      }
      positions.needsUpdate = true

      const material = meshRef.current.material as MeshPhongMaterial
      material.color.setHSL(time * 0.1 % 1, 0.5, 0.5)
      material.emissive.setHSL((time * 0.1 + 0.5) % 1, 0.5, 0.5)
    }
  })

  return (
    <Sphere args={[2, 64, 64]} ref={meshRef}>
      <meshPhongMaterial wireframe />
    </Sphere>
  )
}

