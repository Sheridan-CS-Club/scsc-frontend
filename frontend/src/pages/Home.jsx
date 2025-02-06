import { Link } from "react-router-dom";
import styles from "@css/home.module.css";
import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import * as THREE from 'three';

let mouseX = 0;
let mouseY = 0;

function Commodore(props) {
    const { scene, animations } = useGLTF(`commodore_scsc.glb`);

    let mixer;
    // Commodore default animation if exists
    if (animations.length) {
        mixer = new THREE.AnimationMixer(scene);
        animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta);
        // Commodore smoothly rotates towards cursor position
        if (scene) {
            scene.rotation.y += (mouseX / window.innerWidth * 1.5 / Math.PI - scene.rotation.y) * 0.02;
            scene.rotation.x += (mouseY / window.innerHeight + .25 * 1.5 / Math.PI  - scene.rotation.x) * 0.02;
        }
    });

    return <primitive object={scene} scale={0.006} {...props} />;
}

const Home = () => {
    // for 3d model animations based on cursor position
    const handleMouseMove = (event) => {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
    };
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

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
                        </Stage>
                    </Canvas>
                </div>
            </section>
        </>
    );
};

export default Home;