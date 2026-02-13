const createScene = async function () {
    // Basic setup
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // 1. Initialize WebXR
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        // Meta Quest requires these to be explicitly requested
        optionalFeatures: ["hit-test", "anchors"]
    });

    const fm = xr.baseExperience.featuresManager;
    const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");
    const anchorSystem = fm.enableFeature(BABYLON.WebXRAnchorSystem, "latest");

    // 2. Create a "Ghost" Marker (Reticle)
    const marker = BABYLON.MeshBuilder.CreateCylinder("marker", { diameter: 0.15, height: 0.01 }, scene);
    marker.isVisible = false;
    const markerMat = new BABYLON.StandardMaterial("markerMat", scene);
    markerMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    markerMat.alpha = 0.5;
    marker.material = markerMat;

    // 3. Update marker position based on Hit Test
    let lastHitTest;
    hitTest.onHitTestResultObservable.add((results) => {
        if (results.length) {
            marker.isVisible = true;
            lastHitTest = results[0];
            lastHitTest.transformationMatrix.decompose(undefined, marker.rotationQuaternion, marker.position);
        } else {
            marker.isVisible = false;
        }
    });

    // 4. Anchor a box on click/tap
    scene.onPointerDown = async () => {
        if (lastHitTest && marker.isVisible) {
            const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
            const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.1 }, scene);
            // Move the geometry up by half its height (0.05) 
            // and "freeze" that as the new zero point.
            box.position.y = 0.05; 
            box.bakeCurrentTransformIntoVertices();
            // Glue the box to the real world
            anchor.attachedNode = box;
        }
    };

    return scene;
};

// --- ENGINE GLUE CODE ---
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

createScene().then((scene) => {
    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
});