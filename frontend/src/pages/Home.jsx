import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import styles from "@css/home.module.css";
import * as THREE from "three";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useState } from "react";

function Commodore({ targetSpeed }) {
    const { scene, animations } = useGLTF("commodore_scsc_center.glb");
    const mixer = animations.length ? new THREE.AnimationMixer(scene) : null;

    animations.forEach((clip) => mixer?.clipAction(clip).play());

    const rotationSpeed = useRef(0.001);

    useFrame((state, delta) => {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetSpeed, 0.05);

        if (scene) {
            scene.rotation.y += rotationSpeed.current;
        }
        mixer?.update(delta);
    });

    return <primitive object={scene} scale={0.006} />;
}

const Home = () => {
    const [targetSpeed, setTargetSpeed] = useState(0.001);

    return (
        <>
            <section id={styles.hero_section}>
                <div id={styles.hero_container}>
                    <Canvas id={styles.hero_canvas} camera={{ fov: 10 }}>
                        <Stage shadows={null} environment="" intensity={0.01}>
                            <ambientLight intensity={1} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                            <Commodore targetSpeed={targetSpeed} />
                            <OrbitControls
                                minPolarAngle={0}
                                maxPolarAngle={Math.PI / 2}
                                enableZoom={false}
                                onStart={() => setTargetSpeed(0)}
                                onEnd={() => setTargetSpeed(0.001)}
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
