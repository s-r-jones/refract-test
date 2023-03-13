import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Canvas, useThree } from '@react-three/fiber';
import {
  useGLTF,
  MeshTransmissionMaterial,

  Environment,
  OrbitControls,
  Center,
  Float,
  Text3D,

  Bounds,

  RoundedBox,

  Cylinder,
  PivotControls,

} from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three';

import { useSpring, animated, config } from '@react-spring/three'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="canvas-container" style={{ width: '100vw', height: '80vh' }}>
          <Canvas shadows camera={{ position: [0, 2, 8] }}>
            {/* <ambientLight /> */}


            <Scene />
            <Environment
              files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr"
              background
              blur={3} />


            {/* 
            <AccumulativeShadows

              frames={100}
              alphaTest={0.84}
              color="#030303"
              colorBlend={1}
              opacity={2.}
              scale={20}
              position={[0, -0.5, 0]}>
              <RandomizedLight radius={20} ambient={0.5} intensity={1} position={[0, 8, -3.5]} bias={0.001} />
            </AccumulativeShadows> */}
            {/* <Perf position="top-left" /> */}

            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} makeDefault />
          </Canvas>
        </div>

      </main >




    </div >
  )
}




export function Scene(props) {
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: true,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 32, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.07, min: 0, max: 1, step: 0.01 },
    thickness: { value: 1, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.2, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.4, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.2, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#ffffff',
    color: '#ffffff',
    //bg: '#839681',
    textColor: '#000000',
    fillWidth: false,
    fillHeight: false,
    margin: { value: 0, min: 0, max: 0.2, step: 0.01 },
    float: true,
    showControls: false
  })

  const { viewport } = useThree()

  //const {nodes, materials} = useGLTF('/gelatinous_cube-transformed.glb')
  return (
    <>



      <Bounds fit fillWidth margin={.8} >
        <Center position={[0, 2, 0]} top >

          <Text3D
            castShadow
            //rotation={[0, 0, Math.PI / 8]}
            font={'/fonts/helvetiker_regular.typeface.json'}
            lineHeight={0.8}
            scale={viewport.width > 500 ? 20 : 1}

            // bevelEnabled
            // bevelSize={.001}
            letterSpacing={.03}
          >


            {`REFRACT STUDIO`}
            <meshStandardMaterial color={config.textColor} />
          </Text3D>

        </Center>
      </Bounds>
      <Float floatIntensity={.1} rotationIntensity={2} speed={config.float ? 4 : 0} floatingRange>
        <PivotControls depthTest={false} anchor={[0, -1, -1]} scale={1.1} visible={config.showControls}>
          <mesh position={[0, 2.7, 2.5]}>
            <torusGeometry castShadow scale={1.1} />

            {config.meshPhysicalMaterial ?
              <meshPhysicalMaterial {...config} /> :
              <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
          </mesh>
        </PivotControls>
      </Float>

      <Float floatIntensity={0} rotationIntensity={2.5} speed={config.float ? 1 : 0} >
        <PivotControls depthTest={false} anchor={[0, -1, -1]} scale={1.1} visible={config.showControls}>
          <RoundedBox castShadow position={[-3., 2., 2.2]} rotation={[0, Math.PI / 4, Math.PI / 2]} scale={1.2} smoothness={32} radius={0.2}>

            {config.meshPhysicalMaterial ?
              <meshPhysicalMaterial {...config} /> :
              <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
          </RoundedBox>
        </PivotControls>
      </Float>

      <Float floatIntensity={1} rotationIntensity={3} speed={config.float ? 1 : 0} >
        <PivotControls depthTest={false} anchor={[0, -1, -1]} scale={1.1} visible={config.showControls}>
          <Cylinder castShadow position={[3., 3., 3.2]} scale={.8} heightSegments={32} >

            {config.meshPhysicalMaterial ?
              <meshPhysicalMaterial {...config} /> :
              <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
          </Cylinder>
        </PivotControls>
      </Float>

    </>
  )
}