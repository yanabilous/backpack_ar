import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { QRCodeCanvas } from "qrcode.react";
import backpackModel from "../assets/backpack/backpack.glb";
import brownTexture from "../assets/backpack/denim_baseColor.jpg";
import blackTexture from "../assets/backpack/fabric_baseColor.jpg";
import darkBlueTexture from "../assets/backpack/leather_baseColor.jpg";

const BackpackConfigurator = () => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(backpackModel, (gltf) => {
      const loadedModel = gltf.scene;
      loadedModel.scale.set(2, 2, 2);
      loadedModel.position.set(0, -1, 0);
      modelRef.current = loadedModel;
      scene.add(loadedModel);
    });

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const changeTexture = (textureUrl) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        if (modelRef.current) {
          modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          });
        }
      },
      undefined,
      (error) => {
        console.error("Помилка завантаження текстури:", error);
      }
    );
  };

  const changeColor = (color, partName = null) => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!partName || child.name === partName) {
            child.material.color.set(color);
            child.material.needsUpdate = true;
          }
        }
      });
    }
  };

  const changeMetalColor = (color) => {
    changeColor(color, "Mesh_1");
  };


  const generateSceneViewerUrl = () => {
    return `https://backpackar.netlify.app/${encodeURIComponent(backpackModel)}`;
  };

  const handleARClick = () => {
    if (isMobile) {
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${backpackModel}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;end;`;
    } else {
      setShowQR(true);
    }
  };

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 1 }}>
        <h3>Зміна текстури рюкзака</h3>
        <button onClick={() => changeTexture(brownTexture)}>Шкіра</button>
        <button onClick={() => changeTexture(blackTexture)}>Фабрік</button>
        <button onClick={() => changeTexture(darkBlueTexture)}>Денім</button>
        <h3>Зміна кольору рюкзака</h3>
        <button onClick={() => changeColor(0x8b4512)}>Коричневий</button>
        <button onClick={() => changeColor(0x1a1a1a)}>Чорний</button>
        <button onClick={() => changeColor(0x104d97)}>Темносиній</button>
        <h3>Зміна кольору металевих частин</h3>
        <button onClick={() => changeMetalColor(0xffc107)}>Золотий </button>
        <button onClick={() => changeMetalColor(0xc0c0c0)}>Срібний </button>
        <button onClick={() => changeMetalColor(0x000000)}>Чорний </button>

        <h3>Переглянути в AR</h3>
        <button onClick={handleARClick}>Переглянути в AR</button>

        {showQR && (
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", border: "1px solid black", zIndex: 1000 }}>
            <h3>Скануйте QR-код для перегляду в AR</h3>
            <QRCodeCanvas value={generateSceneViewerUrl()} />
            <button onClick={() => setShowQR(false)}>Закрити</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackpackConfigurator;
