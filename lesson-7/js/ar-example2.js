
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
    
    // STEP 4: Move the box so it is not at your feet
    
    // STEP 4b: It is embedded in the floor - bring it up 0.25
    


    /* SOUNDS
    ---------------------------------------------------------------------------------------------------- */
    

    /* ANIMATION
    ---------------------------------------------------------------------------------------------------- */


    /* ENABLE AR
    ---------------------------------------------------------------------------------------------------- */
    // STEP 2a: Start a WebXR session (immersive-ar, specifically)
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            
            // STEP 2b: We need 0, 0, 0 to be a space on the floor, not between your eyes! There are several types of reference spaces: viewer, local, local-floor, bounded-floor, and unbounded (https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace)
            
        },
        // STEP 2c: Meta Quest requires these to be explicitly requested
        
    });
    // STEP 3: Commit your code and push it to a server, then try it out with a headset - notice how the orange box is right at your feet - 0, 0, 0 is located on the floor at your feet


    /* HIT-TEST
    ---------------------------------------------------------------------------------------------------- */
    // STEP 5: A hit-test is a standard feature in AR that permits a ray to be cast from the device (headset or phone) into the real world, and detect where it intersects with a real-world object. This enables AR apps to place objects on surfaces or walls of the real world (https://immersive-web.github.io/hit-test/). To enable hit-testing, use the enableFeature() method of the featuresManager from the base WebXR experience helper.
    // STEP 5a: Create the features manager object
    
    // STEP 5b: Enable the hit-test feature
    

    // STEP 6a: Create a marker to show where a hit-test has registered a surface
     

    // STEP 6b: Initialize the Quaternion so the hit-test can control rotation in all dimensions
    
    // STEP 6c: Make the marker invisible by default
    
    // STEP 6d: Colour the marker
    

    // STEP 7a: Create a variable to store the latest hit-test results
    
    // STEP 7b: Add an event listener for the hit-test results
    
        // STEP 7c: If there is a successful hit-test, then make the marker visible
        
            
            // STEP 7d: Grab the hit-test matrix of coordinates
            
            // STEP 7e: Extract what we need so that the marker is oriented properly on the detected surface
            
            // STEP 7f: Otherwise, marker is invisible
        
    

    /* ANCHORS
    ---------------------------------------------------------------------------------------------------- */
    // STEP 8: Anchors are a feature that allow you to place objects in the real world space and have them stay there, even if the observer moves around. To enable anchors, use the enableFeature() method of the featuresManager from the base WebXR experience helper (https://immersive-web.github.io/anchors/).
    // STEP 8a: Enable the anchor feature
    
    // STEP 8b: Add event listener for click
    
        
            // STEP 8c: Create an anchor point based on the last hit-test coordinates
            
            // STEP 8d: Build a box to drop on the surface
            
            // STEP 8e: Attach the box to the real world!
            
        
    
    
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