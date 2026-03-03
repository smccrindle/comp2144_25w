// Get the canvas element as a const
const canvas = document.getElementById("renderCanvas");
// Create the BABYON 3D engine, and attach it to the canvas
const engine = new BABYLON.Engine(canvas, true);
// The createScene function
const createScene = async function() {
    // Create a new BABYLON scene, passing in the engine as an argument
    const scene = new BABYLON.Scene(engine);
    

    /* CAMERA
    ---------------------------------------------------------------------------------------------------- */
    // Add a camera and allow it to control the canvas
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);


    /* LIGHTING
    ---------------------------------------------------------------------------------------------------- */
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;


    /* GROUND
    ---------------------------------------------------------------------------------------------------- */
    // Note that in AR, we don't need to create a 'ground' mesh, as we are using the real world instead


    /* SKY
    ---------------------------------------------------------------------------------------------------- */
    // We also don't need to build a skybox for AR


    /* MESHES
    ---------------------------------------------------------------------------------------------------- */


    /* SOUNDS
    ---------------------------------------------------------------------------------------------------- */
    

    /* ANIMATION
    ---------------------------------------------------------------------------------------------------- */


    /* ENABLE AR
    ---------------------------------------------------------------------------------------------------- */
    // Start a WebXR session (immersive-ar, specifically)
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
            // STEP 1: Set the referenceSpaceType to "unbounded" - since the headset is in passthrough mode with AR, let the vistor go anywhere they like within their physical space
            referenceSpaceType: "local-floor" //  viewer, local, local-floor, bounded-floor, or unbounded (https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace and https://gist.github.com/lempa/64b3a89a19cbec980ade709be35d7cbc#file-webxr-reference-space-types-csv)

        },
        // Enable optional features - either all of them with true (boolean), or as an array
        optionalFeatures: true
    });


    /* PLANE DETECTION
    ---------------------------------------------------------------------------------------------------- */
    // STEP 1: Enable the Plane Detector feature
    const fm = xr.baseExperience.featuresManager;

    // Use the static .Name property of the class itself
    const planeDetector = fm.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");

    // STEP 2: Listen for when a new plane is discovered
    planeDetector.onPlaneAddedObservable.add((plane) => {
        
        // Each 'plane' object contains an 'xrPlane' property from the WebXR API
        // We can filter by orientation: 'horizontal' or 'vertical'
        if (plane.xrPlane.orientation === "horizontal") {
            console.log("Floor or table detected");
            visualizePlane(plane, new BABYLON.Color3(0, 1, 0)); // Green for horizontal
        } else {
            console.log("Wall detected");
            visualizePlane(plane, new BABYLON.Color3(1, 0, 0)); // Red for vertical
        }
    });

    // STEP 3: Helper function to create a visual representation of the plane
    function visualizePlane(plane, color) {
        // BabylonJS automatically creates a mesh for the plane's polygon
        const mesh = plane.polygonDefinition;
        const material = new BABYLON.StandardMaterial("planeMat", scene);
        material.diffuseColor = color;
        material.alpha = 0.5; // Transparent so we can still see the real world
        
        mesh.material = material;
        
        // The mesh must stay attached to the plane's real-world transformation
        plane.onADirtyObservable.add(() => {
            // This ensures the mesh moves/rotates if the AR system updates the plane's position
        });
    }    


    // Return the scene
    return scene;
};

// Continually render the scene in an endless loop
createScene().then((sceneToRender) => {
    engine.runRenderLoop(() => sceneToRender.render());
});

// Add an event listener that adapts to the user resizing the screen
window.addEventListener("resize", function() {
    engine.resize();
});

// Thanks to Gemini 3 for the demonstration of Babylon.js Plane Detection and visualization in WebXR