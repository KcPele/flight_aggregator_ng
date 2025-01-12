import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Group } from "three";

function Airplane() {
  const [model, setModel] = useState(null);
  const modelRef = useRef<Group>(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/airplane.mtl", (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load("/airplane.obj", (object) => {
        // // Adjust scale
        object.scale.set(0.008, 0.008, 0.008);

        // // Adjust rotation to face forward
        object.rotation.set(0, 0, 4, 5); // Rotate 90 degrees around the Y-axis

        // // Adjust position (optional)
        object.position.set(0, 0, 0);

        setModel(object);
      });
    });
  }, []);

  useFrame((state) => {
    if (modelRef.current) {
      // Add subtle idle animations
      modelRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      modelRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return model ? <primitive ref={modelRef} object={model} /> : null;
}
const Scene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Airplane />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
