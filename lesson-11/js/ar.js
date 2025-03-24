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
    const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameter: 1 }, scene);
    const cylinderMat = new BABYLON.StandardMaterial("cylinderMat", scene);
    cylinderMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    cylinder.material = cylinderMat;
    cylinder.position.x = -2;

    const pyramid = BABYLON.MeshBuilder.CreateCylinder("pyramid", { height: 2, diameterTop: 0, diameterBottom: 1, tessellation: 4 }, scene);
    const pyramidMat = new BABYLON.StandardMaterial("pyramidMat", scene);
    pyramidMat.diffuseColor = new BABYLON.Color3(0, 0, 1);
    pyramid.material = pyramidMat;
    pyramid.position.x = 2;

    const torus = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 1, thickness: 0.3, tessellation: 32 }, scene);
    const torusMat = new BABYLON.StandardMaterial("torusMat", scene);
    torusMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    torus.material = torusMat;
    torus.position.y = 0.5;
   

    /* GUI
    ---------------------------------------------------------------------------------------------------- */
    
    /* TEXTBLOCK AND RECTANGLE ELEMENT */

    // STEP 1a: Create a simple plane for a rectangle label for the pyramid
    
    // STEP 1b: Set the pyramid as the parent
    
    // STEP 1c: Position it up above the pyramid
    
    // STEP 1d: Set the billboardMode so that it faces the viewer wherever they go
    

    // STEP 2: With GUI controls in 3D, we apply them to a mesh with a texture
    
    
    // STEP 3a: Build out a BABYLON GUI Rectangle
    
    // STEP 3b: Set the height, width, cornerRadius, color (foreground and background), and thickness
    
    // STEP 3c: Apply the rectangle GUI element to the texture being applied to plane1
    
    
    // STEP 4a: Add a label to the rectangle with TextBlock and set the text
    
    // STEP 4b: Attach the label to the above rectangle GUI element, and test it out with the headset
    


    /* BUTTON ELEMENT */

    // STEP 5a: Create a simple button to identify and control the cylinder, beginning with another plane mesh
    
    // STEP 5b: Make plane2 a child of the cylinder and position it above it
    
    // STEP 5c: Set the billboard mode to ALL
    

    // STEP 6: Create a new texture for the GUI elements to apply to plane2
    

    // STEP 7a: Make a BABYLON GUI button element, and add some text 
    
    // STEP 7b: Set the height, width, color (foreground and background), and the font size
    
    // STEP 7c: Add an event handler, and create an anonymous function to change the color of the mesh (see pre-built function changeMeshColor() below)
    
    // STEP 7d: Apply the button to the texture being applied to plane2, then try this GUI element in the headset
    


    /* SLIDER ELEMENT */

    // STEP 8a: Create another plane mesh that we will use to apply a slider control
    
    // STEP 8b: Set plane3 to be a child of the torus, and position it Z at -1.5 so it is not in the middle of the mesh
    
    // STEP 8c: Billboard mode for this plane should be back to Y axis only (or X or Z if you'd like)
    

    // STEP 9: Make a third texture upon which the slider control will be rendered on plane3
    

    // STEP 10a: Let's start with a simple text block to use as a header for the slider UI control element
    
    // STEP 10b: Apply the text content, the height, the color, and bump it up a bit to make room for the next element
    
    // STEP 10c: Apply the header to the texture to go on plane3
     

    // STEP 11a: Next up is the slider UI control itself
    
    // STEP 11b: Configure the minimum and maximum values for the slider, and the initial value
    
    // STEP 11c: Set the height and width, then bump the element down a bit so it doesn't collide with the above header
    
    // STEP 12a: Build an event handler for the slider, that passes in the value to an anonymous function
    
        // STEP 12b: Update the header UI element text with the degrees of rotation of the torus
        
        // STEP 12c: Update the rotation.z value of the torus mesh itself
        
    
    // STEP 13: Apply the slider to the texture being applied to plane 3, then try it out in the headset (you may need to walk around the torus to get to the slider control)
    


    /* OTHER FUNCTIONS
    ---------------------------------------------------------------------------------------------------- */
    function changeMeshColor() {
        cylinder.material.diffuseColor = BABYLON.Color3.Random();
    };


    /* ENABLE AR
    ---------------------------------------------------------------------------------------------------- */
    // Start a WebXR session (immersive-ar, specifically)
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
            // Set the referenceSpaceType to "unbounded" - since the headset is in passthrough mode with AR, let the vistor go anywhere they like within their physical space
            referenceSpaceType: "local" // viewer, local, local-floor, bounded-floor, or unbounded (https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace and https://gist.github.com/lempa/64b3a89a19cbec980ade709be35d7cbc#file-webxr-reference-space-types-csv)

        },
        // Enable optional features - either all of them with true (boolean), or as an array
        optionalFeatures: true
    });


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

// Thanks to the playground at https://playground.babylonjs.com/#U9AC0N#1, the great BABYLON GUI documentation at https://doc.babylonjs.com/features/featuresDeepDive/gui/gui/, and Gemini 2.0 for filling in some of the gaps in the documentation pages.