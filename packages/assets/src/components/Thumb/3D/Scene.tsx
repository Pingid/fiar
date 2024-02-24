import { useGLTF, OrbitControls, Stage } from '@react-three/drei'
import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Box3, Group } from 'three'

const Scene = (props: { url: string; active?: boolean }): JSX.Element => {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 150], fov: 50 }}>
      <ambientLight intensity={0.25} />
      <Suspense fallback={null}>
        <Model url={props.url} />
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  )
}

const Model = (props: { url: string }): JSX.Element => {
  const data = useGLTF(props.url)
  const group = useRef<Group<any>>(null)

  useLayoutEffect(() => {
    let box: Box3 | undefined

    data.scene.traverse((obj: any) => {
      if (obj.isMesh) {
        if (!box) box = obj.geometry.boundingBox
        obj.castShadow = obj.receiveShadow = true
        obj.material.envMapIntensity = 0.8
      }
    })

    // Scale geometry to fit
    if (box && group.current) {
      const height = box.max.y - box.min.y
      const m = 110
      group.current.scale.set(m / height, m / height, m / height)
    }
  }, [data])

  return (
    <group ref={group}>
      <Stage preset={'rembrandt'} intensity={1} shadows environment={'city'} adjustCamera={false}>
        <primitive object={data.scene} />
      </Stage>
    </group>
  )
}

export default Scene
