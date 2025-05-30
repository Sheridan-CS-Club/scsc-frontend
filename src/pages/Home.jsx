import { useRef, useState, useEffect, useCallback } from "react";
import styles from "@css/home.module.css";
import discord from "@assets/icons/discord.svg";
import Terminal from "@components/Terminal";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette, ToneMapping } from "@react-three/postprocessing";

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
        }
    });

    return <primitive object={scene} scale={0.006} />;
}

function CameraAnimation({ animateCamera, onAnimationEnd, resetZoom }) {
    const { camera } = useThree();
    const initialZoom = useRef(1.5);
    const targetZoom = useRef(3);

    useFrame(() => {
        if (animateCamera) {
            // zoom in
            camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom.current, 0.1);
            camera.updateProjectionMatrix();

            // check if zoom complete
            if (Math.abs(camera.zoom - targetZoom.current) < 0.01) {
                onAnimationEnd();
            }
        } else if (resetZoom) {
            // zoom out
            camera.zoom = THREE.MathUtils.lerp(camera.zoom, initialZoom.current, 0.1);
            camera.updateProjectionMatrix();
        }
    });

    return null;
}

const Home = () => {
    const [moveToCenter, setMoveToCenter] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [targetSpeed, setTargetSpeed] = useState(0.001);
    const [enableControls, setEnableControls] = useState(true);
    const [animateCamera, setAnimateCamera] = useState(false);
    const [resetZoom, setResetZoom] = useState(false);
    const heroRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            setShowTerminal(false);
            setMoveToCenter(false);
            setTargetSpeed(0.001);
            setEnableControls(true);
            setResetZoom(true);
        } else if (e.key === "Enter") {
            setAnimateCamera(true);
            setMoveToCenter(true);
            setTargetSpeed(0);
            setEnableControls(false);
            setResetZoom(false);
        }
        return undefined;
    }, []);


    useEffect(() => {
        const keyDownListener = (e) => handleKeyDown(e);
        window.addEventListener("keydown", keyDownListener);
        
        return () => {
            window.removeEventListener("keydown", keyDownListener);
        };
    }, [handleKeyDown]);

    return (
        <>
            <section id={styles.hero_section} ref={heroRef}>
                <div id={styles.hero_container}>
                    <Canvas id={styles.hero_canvas} camera={{ fov: 10, position: [7, 1.75, 10], zoom: 1.5 }}>
                        <Stage shadows={null} environment={null} intensity={0.01}>
                            <ambientLight intensity={1} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                            <Commodore moveToCenter={moveToCenter} targetSpeed={targetSpeed} />
                            <CameraAnimation
                                animateCamera={animateCamera}
                                onAnimationEnd={() => {
                                    setShowTerminal(true);
                                    setEnableControls(true);
                                    setAnimateCamera(false);
                                }}
                                resetZoom={resetZoom}
                            />
                            <OrbitControls
                                enabled={enableControls}
                                target={[0, 0, 0]}
                                minPolarAngle={0}
                                maxPolarAngle={Math.PI / 2}
                                enableZoom={false}
                                enablePan={false}
                                onStart={() => setTargetSpeed(0)}
                                onEnd={() => setTargetSpeed(0.001)}
                            />
                            <EffectComposer>
                                <DepthOfField focusDistance={0} focalLength={1} bokehScale={2} height={480} />
                                {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={320} /> */}
                                <Noise opacity={0.1} />
                                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                                <ToneMapping adaptive resolution={256}/>
                            </EffectComposer>
                        </Stage>
                    </Canvas>
                    {!showTerminal && <div id={styles.hero_hint}>Press enter to start.</div>}
                    {showTerminal && <Terminal />}
                </div>
            </section>
            <section id={styles.about_section}>
                <div id={styles.about_container}>
                    <h1>SHERIDAN <span>COMPUTER</span> SCIENCE <span>CLUB</span></h1>
                    <div id={styles.about_content}>
                        <p>
                            The SCSC is more than just a club — it's a thriving community where CS students learn,
                            grow, and build together. We're proud to have some of Sheridan's top developers
                            contributing to important projects for the college.
                        </p>
                        <p>
                            We're committed to empowering all CS students by providing resources, workshops, 
                            and opportunities to collaborate on exciting initiatives. Join us and become part 
                            of something special!
                        </p>
                        <p id={styles.quote_author}>- SCSC team</p>
                    </div>
                </div>
            </section>
            <section id={styles.welcome_section}>
                <div id={styles.welcome_container}>
                    <h1>Welcome to the SCSC!</h1>
                    <a id={styles.welcome_button} className={styles.rounded_button} href="https://discord.gg/3CXVBXeeSr" target="_blank">
                       <div>
                            <h5>Join the Club Today!</h5>
                            <p>All on Discord</p>
                       </div>
                       <img src={discord} alt="discord logo" />
                    </a>
                </div>
            </section>
        </>
    );
};

export default Home;