var createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // 1. Setup the XR Experience
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        // IMPORTANT: Must explicitly ask for these for the Quest to allow them
        optionalFeatures: ["hit-test", "anchors"]
    });

    const fm = xr.baseExperience.featuresManager;
    const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");
    const anchorSystem = fm.enableFeature(BABYLON.WebXRAnchorSystem, "latest");

    // 2. Create a "Ghost" Marker to show where the hit-test is currently pointing
    const marker = BABYLON.MeshBuilder.CreateCylinder("marker", { diameter: 0.1, height: 0.01 });
    marker.isVisible = false;

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

    // 4. On Tap/Click: Create a permanent Anchor and attach a Cube
    scene.onPointerDown = async () => {
        if (lastHitTest && marker.isVisible) {
            // Create the anchor at the hit test point
            const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
            
            // Create a simple cube to "stick" to the table
            const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.1 });
            
            // Link the box to the anchor's transform node
            // This ensures it stays glued to the real-world coffee table
            anchor.attachedNode = box;
        }
    };

    return scene;
};