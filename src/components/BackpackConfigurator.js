import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { QRCodeCanvas } from "qrcode.react";
import backpackModel from "../assets/backpack/backpack.glb";
import brownTexture from "../assets/backpack/denim_baseColor.jpg";
import blackTexture from "../assets/backpack/fabric_baseColor.jpg";
import darkBlueTexture from "../assets/backpack/leather_baseColor.jpg";
import ButtonGroup from "./ButtonGroup";

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
    renderer.setPixelRatio(window.devicePixelRatio);
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    renderer.setClearColor(0xffffff);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      backpackModel,
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(7, 7, 7);
        loadedModel.position.set(0, -1, 0);
        modelRef.current = loadedModel;
        scene.add(loadedModel);
        console.log("Model loaded and added to scene.");
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

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
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
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
              console.log("Texture updated.");
            }
          });
        } else {
          console.error("Model is not yet loaded.");
        }
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
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
            console.log("Color updated.");
          }
        }
      });
    } else {
      console.error("Model is not yet loaded.");
    }
  };

  const changeMetalColor = (color) => {
    changeColor(color, "Mesh_1");
  };

  const generateSceneViewerUrl = () => {
    // const modelUrl = encodeURIComponent("https://public/backpack.glb");
    // return `https://backpackar.netlify.app/?model=${modelUrl}`;
    return `https://backpackar.netlify.app/?model=backpack.glb`;
  };

  const handleARClick = () => {
    if (isMobile) {
      // window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent("https://public/backpack.glb")}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;end;`;
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent("https://backpackar.netlify.app//backpack.glb")}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;end;`;
    } else {
      setShowQR(true);
    }
  };
  return (
    <div className="section">
      <div className="link">
        <button onClick={handleARClick} className="btn-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.33331 12.9833L3.99998 11.0667C3.78887 10.9444 3.62509 10.7833 3.50865 10.5833C3.3922 10.3833 3.33376 10.1611 3.33331 9.91666V6.08333C3.33331 5.83888 3.39176 5.61666 3.50865 5.41666C3.62554 5.21666 3.78931 5.05555 3.99998 4.93333L7.33331 3.01666C7.54442 2.89444 7.76665 2.83333 7.99998 2.83333C8.23331 2.83333 8.45554 2.89444 8.66665 3.01666L12 4.93333C12.2111 5.05555 12.3751 5.21666 12.492 5.41666C12.6089 5.61666 12.6671 5.83888 12.6666 6.08333V9.91666C12.6666 10.1611 12.6084 10.3833 12.492 10.5833C12.3755 10.7833 12.2115 10.9444 12 11.0667L8.66665 12.9833C8.45554 13.1056 8.23331 13.1667 7.99998 13.1667C7.76665 13.1667 7.54442 13.1056 7.33331 12.9833ZM7.33331 11.45V8.38333L4.66665 6.83333V9.91666L7.33331 11.45ZM8.66665 11.45L11.3333 9.91666V6.83333L8.66665 8.38333V11.45ZM1.99998 5.33333C1.81109 5.33333 1.65287 5.26933 1.52531 5.14133C1.39776 5.01333 1.33376 4.85511 1.33331 4.66666V2.66666C1.33331 2.29999 1.46398 1.98622 1.72531 1.72533C1.98665 1.46444 2.30042 1.33377 2.66665 1.33333H4.66665C4.85554 1.33333 5.01398 1.39733 5.14198 1.52533C5.26998 1.65333 5.33376 1.81155 5.33331 1.99999C5.33287 2.18844 5.26887 2.34688 5.14131 2.47533C5.01376 2.60377 4.85554 2.66755 4.66665 2.66666H2.66665V4.66666C2.66665 4.85555 2.60265 5.01399 2.47465 5.14199C2.34665 5.26999 2.18842 5.33377 1.99998 5.33333ZM2.66665 14.6667C2.29998 14.6667 1.9862 14.5362 1.72531 14.2753C1.46442 14.0144 1.33376 13.7004 1.33331 13.3333V11.3333C1.33331 11.1444 1.39731 10.9862 1.52531 10.8587C1.65331 10.7311 1.81154 10.6671 1.99998 10.6667C2.18842 10.6662 2.34687 10.7302 2.47531 10.8587C2.60376 10.9871 2.66754 11.1453 2.66665 11.3333V13.3333H4.66665C4.85554 13.3333 5.01398 13.3973 5.14198 13.5253C5.26998 13.6533 5.33376 13.8116 5.33331 14C5.33287 14.1884 5.26887 14.3469 5.14131 14.4753C5.01376 14.6038 4.85554 14.6676 4.66665 14.6667H2.66665ZM13.3333 14.6667H11.3333C11.1444 14.6667 10.9862 14.6027 10.8586 14.4747C10.7311 14.3467 10.6671 14.1884 10.6666 14C10.6662 13.8116 10.7302 13.6533 10.8586 13.5253C10.9871 13.3973 11.1453 13.3333 11.3333 13.3333H13.3333V11.3333C13.3333 11.1444 13.3973 10.9862 13.5253 10.8587C13.6533 10.7311 13.8115 10.6671 14 10.6667C14.1884 10.6662 14.3469 10.7302 14.4753 10.8587C14.6038 10.9871 14.6675 11.1453 14.6666 11.3333V13.3333C14.6666 13.7 14.5362 14.014 14.2753 14.2753C14.0144 14.5367 13.7004 14.6671 13.3333 14.6667ZM13.3333 4.66666V2.66666H11.3333C11.1444 2.66666 10.9862 2.60266 10.8586 2.47466C10.7311 2.34666 10.6671 2.18844 10.6666 1.99999C10.6662 1.81155 10.7302 1.65333 10.8586 1.52533C10.9871 1.39733 11.1453 1.33333 11.3333 1.33333H13.3333C13.7 1.33333 14.014 1.46399 14.2753 1.72533C14.5366 1.98666 14.6671 2.30044 14.6666 2.66666V4.66666C14.6666 4.85555 14.6026 5.01399 14.4746 5.14199C14.3466 5.26999 14.1884 5.33377 14 5.33333C13.8115 5.33288 13.6533 5.26888 13.5253 5.14133C13.3973 5.01377 13.3333 4.85555 13.3333 4.66666ZM7.99998 7.23333L10.6333 5.68333L7.99998 4.16666L5.36665 5.68333L7.99998 7.23333Z"
              fill="white"/>
          </svg>
          See in real life
        </button>

        {showQR && (
          <div className="qr">
            <button className='btn-qr' onClick={() => setShowQR(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                <path
                  d="M11.2495 10.497L16.8775 4.8635C16.9768 4.76372 17.0325 4.62866 17.0324 4.4879C17.0323 4.34713 16.9765 4.21215 16.877 4.1125C16.678 3.9145 16.3275 3.9135 16.1265 4.1135L10.5 9.747L4.87154 4.112C4.67154 3.9145 4.32104 3.9155 4.12204 4.113C4.07265 4.1622 4.03355 4.22074 4.00702 4.28521C3.98049 4.34968 3.96707 4.41879 3.96754 4.4885C3.96754 4.6305 4.02254 4.7635 4.12204 4.862L9.75004 10.4965L4.12254 16.1315C4.02323 16.2314 3.96762 16.3667 3.9679 16.5076C3.96818 16.6484 4.02434 16.7835 4.12404 16.883C4.22054 16.9785 4.35704 17.0335 4.49804 17.0335H4.50104C4.64254 17.033 4.77904 16.9775 4.87354 16.881L10.5 11.2475L16.1285 16.8825C16.228 16.9815 16.361 17.0365 16.502 17.0365C16.5718 17.0367 16.6408 17.0231 16.7053 16.9965C16.7697 16.9699 16.8283 16.9309 16.8776 16.8816C16.9269 16.8323 16.966 16.7737 16.9926 16.7092C17.0192 16.6448 17.0327 16.5757 17.0325 16.506C17.0325 16.3645 16.9775 16.231 16.8775 16.1325L11.2495 10.497Z"
                  fill="#4169E1"/>
              </svg>
            </button>
            <p className="text">Scan the QR code with your phone. Within 1-3 seconds the AR function opens on your
              phone.</p>
            <div className="qr-code">
                <QRCodeCanvas value={generateSceneViewerUrl()} className="border"/>
            </div>


          </div>
        )}
      </div>
      <div ref={mountRef} className="btn-collection"/>

      <div className="d-flex">

        <ButtonGroup
          title="body Color"
          width="210px"
          buttons={[
            {label: "Brown", onClick: () => changeColor(0x8b4512), color: "#8b4512"},
            {label: "Black", onClick: () => changeColor(0x1a1a1a), color: "#1a1a1a"},
            {label: "Blue", onClick: () => changeColor(0x104d97), color: "#104d97"},
          ]}
        />

        <ButtonGroup
          title="Metal color"
          width="210px"
          buttons={[
            {label: "Silver", onClick: () => changeMetalColor(0xc0c0c0), color: "#c0c0c0"},
            {label: "Gold", onClick: () => changeMetalColor(0xffc107), color: "#ffc107"},
            {label: "Black", onClick: () => changeMetalColor(0x000000), color: "#000000"},
          ]}
        />

        <ButtonGroup
          title="Material"
          width="260px"
          buttons={[
            {label: "Leather", onClick: () => changeTexture(brownTexture)},
            {label: "Fabric", onClick: () => changeTexture(blackTexture)},
            {label: "Denim", onClick: () => changeTexture(darkBlueTexture)},
          ]}
        />


      </div>
    </div>
  );
};

export default BackpackConfigurator;
