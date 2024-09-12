const ARComponent = () => {
  return (
      <a-scene
        vr-mode-ui="enabled: true"
        embedded
        arjs="sourceType: webcam; trackingMethod: best; debugUIEnabled: false;">
        <a-light type="directional" position="1 1 0" intensity="1"></a-light>
        {/*<a-light type="ambient" color="#fff"></a-light>*/}
        <a-gltf-model src="url(/backpack.glb)"
                      position="0 1 -3"
                      rotation="0 0 0"
                      scale="4 2 4"
                      animation="property: rotation; to: 0 360 0; dur: 10000; loop: true"
        >
        </a-gltf-model>
      </a-scene>
  );
};

export default ARComponent;