
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
    // STEP 1: Create a simple box, and apply a material and a colour to it.
    const box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.5}, scene);
    const boxMat = new BABYLON.StandardMaterial("boxMat", scene);
    boxMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
    box.material = boxMat;
    // STEP 4: Move the box so it is not at your feet
    box.position.x = 1;
    box.position.z = 2;
    // STEP 4b: It is embedded in the floor - bring it up 0.25
    box.position.y = 0.25;


    /* SOUNDS
    ---------------------------------------------------------------------------------------------------- */
    

    /* ANIMATION
    ---------------------------------------------------------------------------------------------------- */


    /* ENABLE AR
    ---------------------------------------------------------------------------------------------------- */
    // STEP 2a: Start a WebXR session (immersive-ar, specifically)
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
            // STEP 2b: We need 0, 0, 0 to be a space on the floor, not between your eyes! There are several types of reference spaces: viewer, local, local-floor, bounded-floor, and unbounded (https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace)
            referenceSpaceType: "local-floor"
        },
        // STEP 2c: Meta Quest requires these to be explicitly requested
        optionalFeatures: ["hit-test", "anchors"]
    });
    // STEP 3: Commit your code and push it to a server, then try it out with a headset - notice how the orange box is right at your feet - 0, 0, 0 is located on the floor at your feet


    /* HIT-TEST
    ---------------------------------------------------------------------------------------------------- */
    // STEP 5: A hit-test is a standard feature in AR that permits a ray to be cast from the device (headset or phone) into the real world, and detect where it intersects with a real-world object. This enables AR apps to place objects on surfaces or walls of the real world (https://immersive-web.github.io/hit-test/). To enable hit-testing, use the enableFeature() method of the featuresManager from the base WebXR experience helper.
    // STEP 5a: Create the features manager object
    const fm = xr.baseExperience.featuresManager;
    // STEP 5b: Enable the hit-test feature
    const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

    // STEP 6a: Create a marker to show where a hit-test has registered a surface
    const marker = BABYLON.MeshBuilder.CreateCylinder("marker", { diameter: 0.15, height: 0.01 }, scene);
    // STEP 6aa: Lay the cylinder flat so the "top" faces the floor
    // marker.rotation.x = Math.PI / 2; 
    // marker.bakeCurrentTransformIntoVertices(); 

    // STEP 6aaa: Initialize the Quaternion so the Hit-Test can control it
    marker.rotationQuaternion = new BABYLON.Quaternion();

    marker.isVisible = false;
    const markerMat = new BABYLON.StandardMaterial("markerMat", scene);
    markerMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    markerMat.alpha = 0.5;
    marker.material = markerMat;

    // STEP 6b: Create a variable to store the latest hit-test results
    let lastHitTest;
    // STEP 6c: Add an event listener for the hit-test results
    hitTest.onHitTestResultObservable.add((results) => {
        // STEP 6d: If there is a successful hit-test, then make the marker visible
        if (results.length) {
            marker.isVisible = true;
            // STEP 6e: Grab the hit-test matrix of coordinates
            lastHitTest = results[0];
            // STEP 6f: Extract what we need so that the marker is oriented properly on the detected surface
            lastHitTest.transformationMatrix.decompose(undefined, marker.rotationQuaternion, marker.position);
        } else {
            marker.isVisible = false;
        }
    });

    /* ANCHORS
    ---------------------------------------------------------------------------------------------------- */
    // STEP 7: Anchors are a feature that allow you to place objects in the real world space and have them stay there, even if the observer moves around. To enable anchors, use the enableFeature() method of the featuresManager from the base WebXR experience helper (https://immersive-web.github.io/anchors/).
    // STEP 7a: Enable the anchor feature
    const anchorSystem = fm.enableFeature(BABYLON.WebXRAnchorSystem, "latest");
    // STEP 7b: Add event listener for click
    scene.onPointerDown = async () => {
        if (lastHitTest && marker.isVisible) {
            // STEP 7c: Create an anchor point based on the last hit-test coordinates
            const anchor = await anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
            // STEP 7d: Build a box to drop on the surface
            const box = buildRandomBox();
            // STEP 7e: Attach the box to the real world!
            anchor.attachedNode = box;
        }
    };
    
    // Function to create a randomly-coloured box mesh
    function buildRandomBox() {
        const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.1 }, scene);
        // Move the box geometry up by half its height (0.05) and "freeze" that as the new zero point so the box is not embedded in the surface
        box.position.y = 0.05; 
        box.bakeCurrentTransformIntoVertices();
        // Colour the box
        const boxMat = new BABYLON.StandardMaterial("boxMat", scene);
        boxMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        box.material = boxMat;
        return box;
    }

    // Function to generate a random number between 0.0 and 1.0 for the random colour
    function getRandomRounded() {
        // Generate a random integer between 0 and 1, inclusive
        const minInt = 0;
        const maxInt = 1;
        const randomInt = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        // Divide the integer by 10 to get the desired decimal value
        const randomFloat = randomInt / 10;
        return randomFloat;
    }

    // Return the scene
    return scene;
};

createScene().then((scene) => {
    // Continually render the scene in an endless loop
    engine.runRenderLoop(function () {
        scene.render();
    });
    // Event listener that adapts to the user resizing the screen (in the browser view)
    window.addEventListener("resize", function () {
        engine.resize();
    });
});


// Thanks to the great documentation at https://doc.babylonjs.com/, some excellent re-factoring of my code by Gemini, and some code writing assistance from CoPilot.