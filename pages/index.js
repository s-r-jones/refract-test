import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Environment,
  OrbitControls,
  Center,
  Float,
  Text,
  Backdrop,
  RoundedBox,
  Cylinder,
  Plane,
  Torus,
  MeshDistortMaterial,
  useTexture,
  Html
} from '@react-three/drei'
import { useControls, Leva } from 'leva'
import { useEffect, use, useRef, Suspense } from 'react';
import { Color, Vector2, Vector3, PlaneBufferGeometry, Mesh, MeshBasicMaterial } from 'three';

import { useSpring, animated } from '@react-spring/three';



export default function Home() {


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
          <Canvas camera={{ position: [0, 0, 10], far: 100, }} >
            <ambientLight shadows />

            <Scene />

            <Environment
              preset='studio'
              toneMapped={false}
              background
            >

            </Environment>

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
    transmissionSampler: false,
    //backside: true,
    //samples: { value: 10, min: 1, max: 32, step: 1 },
    //resolution: { value: 32, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    thickness: { value: .97, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.3, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.8, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 10., min: 0, max: 10, step: 0.01 },
    attenuationColor: '#ffffff',
    color: '#ffffff',

  })



  const { viewport, camera, gl, size } = useThree()
  //gl.setClearColor(new Color('white'))
  const textRef = useRef()
  const occludeRef = useRef()
  const scale = Math.min(1, viewport.width / 16)

  const aspectRatio = size.width / size.height;
  const planeHeight = camera.top - camera.bottom;
  const planeWidth = planeHeight * aspectRatio;

  const planeTexture = useTexture('refract_gradient.png')

  useEffect(() => {
    updateObjectPosition(camera, textRef.current, gl)

    const handleResize = () => {
      updateObjectPosition(camera, textRef.current, gl)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [camera, textRef, gl])


  function updateObjectPosition(camera, object, renderer) {
    const topLeftOffset = new Vector2(50, 140); // Adjust these values to control the position relative to the top-left corner (in pixels)

    // Calculate the screen space position
    const screenPosition = new Vector2(-1, 1);
    screenPosition.x += (topLeftOffset.x / renderer.domElement.clientWidth) * 2;
    screenPosition.y -= (topLeftOffset.y / renderer.domElement.clientHeight) * 2;

    // Calculate the world position
    const worldPosition = new Vector3(screenPosition.x, screenPosition.y, 0.5);
    worldPosition.unproject(camera);

    const direction = worldPosition.sub(camera.position).normalize();
    const finalPosition = camera.position.clone().add(direction.multiplyScalar(10))

    // Update the object's position
    object.position.copy(finalPosition);
  }

  const rotationSpring = useSpring({
    rotation: [0, 2 * Math.PI, 0],
    config: {
      duration: 10000,
      easing: (t) => t,
    },
    loop: { reverse: false },
  })
  return (
    <>
      {/* goofy remember to remove when usin controls */}
      <Leva hidden />
      <Plane


        args={[100, 100]}
        position={[0, 0, -10]} // Adjust Y position as needed to be behind other objects

      >
        <meshBasicMaterial
          toneMapped={false}
          transparent
          //map={planeTexture}
          color={("white")}
        />
      </Plane>


      <Html
        fullscreen
        occlude={false}
        style={{
          //zIndex: '-1',
          background: `url('refract_gradient.png') no-repeat center center fixed`,
          backgroundSize: '102% 102%',
          transform: 'translateY(0px)'


        }}
      />

      <group ref={textRef}>

        <Suspense>

          <Text

            // fillOpacity={.1}
            outlineColor={'#2C2C2C'}
            outlineWidth={.01}
            anchorX="left"
            anchorY="top"
            castShadow
            fontSize={1.3 * scale}

            font={'fonts/montserrat-v25-latin-800.woff'}
            lineHeight={1.1}
            letterSpacing={.03}
          >

            {`REFRACT`}
            <meshBasicMaterial color='#2C2C2C' toneMapped={false} />
          </Text>

          <Text
            fillOpacity={0}
            strokeColor='#2C2C2C'
            position={[0, -1.2, 0]}
            anchorX="left"
            anchorY="top"
            castShadow
            fontSize={1.3 * scale}
            strokeWidth={'2.5%'}
            font={'fonts/montserrat-v25-latin-800.woff'}
            lineHeight={1.1}
            letterSpacing={.03}
          >

            STUDIO

          </Text>

        </Suspense>




        <SpinningTorus config={config} position={[11, -2, 1.5]} />

        <Float floatingRange={[-2., 3.2]}>
          <SpinningTorus config={config} position={[3.5, -3.5, 1.5]} />
        </Float>


        {/* <Torus
          position={[7, -4.5, 1.5]}
        >

          <MeshTransmissionMaterial  {...config} toneMapped={false} />
        </Torus> */}

        <Float floatingRange={[-1., .6]} speed={-.6} >
          <SpinningBox config={config} />

        </Float>



        {/* <SpinningCylinder config={config} /> */}



      </group>

    </>
  )
}

const AnimatedTorus = animated(Torus);

function SpinningTorus(props,) {
  const spinAnimation = useSpring({
    rotation: [0, Math.PI * 2, 0],
    from: { rotation: [0, 0, 0] },
    config: { duration: 20000, },
    loop: { reverse: false, reset: true }, // Loop the animation forever
  })

  return (
    <AnimatedTorus
      args={[1, 0.4, 64, 200]}
      position={props.position}
      {...spinAnimation}
    >

      <MeshTransmissionMaterial  {...props.config} toneMapped={false} />
    </AnimatedTorus>

  );
}

const AnimatedCylinder = animated(Cylinder);

function SpinningCylinder(props) {
  const spinAnimation = useSpring({
    rotation: [Math.PI * 4, 0, Math.PI * 2],
    from: { rotation: [0, 0, 0] },
    config: { duration: 20000, },
    loop: { reverse: false, reset: true }, // Loop the animation forever
  })

  return (
    <AnimatedCylinder castShadow position={[-.2, -2.3, 0.3]}  {...spinAnimation} scale={.8} args={[1, 1, 1, 64]}>

      <MeshTransmissionMaterial  {...props.config} toneMapped={false} />
    </AnimatedCylinder>


  );
}

const AnimatedRoundedBox = animated(RoundedBox);

function SpinningBox(props) {
  const spinAnimation = useSpring({
    rotation: [Math.PI * 4, Math.PI * 2, Math.PI * 4],
    from: { rotation: [0, 0, 0] },
    config: { duration: 25000, },
    loop: { reverse: false, reset: true }, // Loop the animation forever
  })

  return (
    <AnimatedRoundedBox {...spinAnimation} castShadow position={[7.2, -1.3, 3]} scale={.9} smoothness={32} radius={0.2}>

      <MeshTransmissionMaterial  {...props.config} toneMapped={false} />
    </AnimatedRoundedBox>


  );
}

