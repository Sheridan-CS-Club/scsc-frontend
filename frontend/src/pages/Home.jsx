import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@css/home.module.css";
import Terminal from "@components/Terminal";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

// function Commodore({ moveToCenter, onReachedCenter, targetSpeed }) {
function Commodore({ moveToCenter, targetSpeed }) {
    const { scene } = useGLTF("commodore_scsc_center.glb");
    const rotationSpeed = useRef(0.001);

    useFrame(() => {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetSpeed, 0.05);
        scene.rotation.y += rotationSpeed.current;
        if (Math.abs(scene.rotation.y) >= Math.PI * 2)
            scene.rotation.y = 0;

        if (moveToCenter) {
            scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, 0, 0.05);
            scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, 0, 0.05);
            scene.rotation.z = THREE.MathUtils.lerp(scene.rotation.z, 0, 0.05);

            if (scene.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 0.01) {
                // onReachedCenter();
            }
        }
    });

    return <primitive object={scene} scale={0.006} />;
}

const targetCameraPosition = new THREE.Vector3(
    // this is taken from current camera position
    0.03536585056999449,
    0.10601775760072982,
    0.3533925253357664
);

function CameraAnimation({ animateCamera, targetPosition, onAnimationEnd }) {
    const camera = useRef();

    useFrame(({ camera }) => {
        if (animateCamera) {
            // console.log("camera position: ", camera.position);

            // camera.position.lerp(targetPosition, 0.008);
            // if (camera.position.distanceTo(targetPosition) < 0.01) {
            //     onAnimationEnd();
            // }
        }
    });

    return <perspectiveCamera ref={camera} />;
}

const Home = () => {
    const [moveToCenter, setMoveToCenter] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [targetSpeed, setTargetSpeed] = useState(0.001);
    const [enableControls, setEnableControls] = useState(true);
    const [animateCamera, setAnimateCamera] = useState(false);
    const heroRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            setShowTerminal(false);
            setMoveToCenter(false);
            setTargetSpeed(0.001);
            setEnableControls(true);
        } else if (e.key === "Enter") {
            setAnimateCamera(true);
            setMoveToCenter(true);
            setTargetSpeed(0);
            setEnableControls(false);
            
            // setTimeout(() => {
            //     setShowTerminal(true);
            //     setEnableControls(true);
            //     setAnimateCamera(false);
            // }, 1500);
            setShowTerminal(true);
            setEnableControls(true);
            setAnimateCamera(false);
        }
    }, []); 

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);


    return (
        <section id={styles.hero_section} ref={heroRef}>
            <div id={styles.hero_container}>
                <Canvas id={styles.hero_canvas} camera={{ fov: 10, position: [1, 3, 10] }}>
                    <Stage shadows={null} environment="" intensity={0.01}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                        {/* <Commodore moveToCenter={moveToCenter} onReachedCenter={() => setShowTerminal(true)} targetSpeed={targetSpeed} /> */}
                        <Commodore moveToCenter={moveToCenter} targetSpeed={targetSpeed} />
                        <CameraAnimation
                            animateCamera={animateCamera}
                            targetPosition={targetCameraPosition}
                            onAnimationEnd={() => setAnimateCamera(false)}
                        />
                        <OrbitControls
                            enabled={enableControls}
                            target={[0, 0, 0]}
                            // makeDefault
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI / 2}
                            enableZoom={false}
                        />
                        <EffectComposer>
                            <DepthOfField focusDistance={0} focalLength={1} bokehScale={2} height={480} />
                            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={320} />
                            <Noise opacity={0.1} />
                            <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        </EffectComposer>
                    </Stage>
                </Canvas>
                {!showTerminal && <div id={styles.hero_hint}>Press enter to start.</div>}
                {showTerminal && <Terminal />}
            </div>
        </section>
    );
};

export default Home;
