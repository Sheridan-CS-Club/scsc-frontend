import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';
import styles from "@css/home.module.css";
import * as THREE from 'three';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { useRef, useState } from 'react';

function Commodore(props) {
    const { scene, animations } = useGLTF(`commodore_scsc.glb`);

    let mixer;
    if (animations.length) {
        mixer = new THREE.AnimationMixer(scene);
        animations.forEach(clip => mixer.clipAction(clip).play());
    }

    // const { isRotating } = useThree();

    useFrame((state, delta) => {
        if (scene) { 
            scene.rotation.y += 0.0015;
            mixer?.update(delta);
        }
    });

    return <primitive object={scene} scale={0.006} {...props} />;
}

const Home = () => {
    // const [isRotating, setIsRotating] = useState(true);

    return (
        <>
            <section id={styles.hero_section}>
                <div id={styles.hero_container}>
                    <Canvas camera={{ fov: 10 }} id={styles.hero_canvas}>
                        <Stage shadows={null} environment="" intensity={0.01}>
                            <ambientLight intensity={1} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                            <Commodore />
                            <OrbitControls
                                // makeDefault
                                minPolarAngle={0}
                                maxPolarAngle={Math.PI / 2}
                                onPointerDown={() => setIsRotating(false)} 
                                onPointerUp={() => setIsRotating(true)}
                                onPointerLeave={() => setIsRotating(true)}
                            />
                            <EffectComposer>
                                <DepthOfField focusDistance={0} focalLength={1} bokehScale={2} height={480} />
                                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
                                <Noise opacity={0.1} />
                                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                            </EffectComposer>
                        </Stage>
                    </Canvas>
                </div>
            </section>
        </>
    );
};

export default Home;