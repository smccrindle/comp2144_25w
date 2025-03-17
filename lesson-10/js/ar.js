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
    // Create a simple box, and apply a material and a colour to it.
    const box = BABYLON.MeshBuilder.CreateBox("box", {size: 0.5}, scene);
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    boxMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
    box.material = boxMat;
    // The initial position of the box is 0, 0, 0 so with the referenceSpaceType: "unbounded" it will be located on the viewer's head, which is the origin point of the scene - reposition the box as you'd like
    box.position.y = 0.5;
    box.position.z = 0.5;

    // STEP 7: Let's create another native mesh object for interactive purposes
    

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


    /* INTERACTION
    ---------------------------------------------------------------------------------------------------- */
    // STEP 2: Add an action manager to the box mesh
    box.actionManager = new BABYLON.ActionManager(scene);

    // STEP 3a: Set up a "mouseover" effect - register a new action with the registerAction() method
    box.actionManager.registerAction(
        // STEP 3b: Set up the action to animate the effect with InterpolateValueAction
        new BABYLON.InterpolateValueAction(
            // STEP 3c: Add a hover action with OnPointerOverTrigger, to scale the box 1.2 times its size over a quarter of a second
            BABYLON.ActionManager.OnPointerOverTrigger,
            box,
            "scaling",
            new BABYLON.Vector3(1.2, 1.2, 1.2),
            250
        )
    );
    // STEP 4a: Set up a "mouseout" effect - register another action with the registerAction() method
    
        // STEP 4b: Set up the action to animate the effect once again with InterpolateValueAction
        
            // STEP 4c: Add a hover-out action with OnPointerOutTrigger, to scale the box back to its original size over a quarter of a second
            

    // STEP 5a: Set up a "click" effect - register a third action
    
        //STEP 5b: Set up the action to change the color value

            // STEP 5c: Add a click action, and use a random color
            
    // STEP 5d: Notice how you can only change the color of the box once - if we'd like to do it every time we click on the box, we'd have to re-register the action again and again - comment out the above STEP 5 code


    // STEP 6a: Instead, let's register one action to run some code on each click - this will side-step the issue
    
        // STEP 6b: Add a new BABYLON.ExecuteCodeAction
        
            // STEP 6c: Add a OnPickTrigger that references a function called changeBoxColor
            

    // STEP 6d: Build a simple function to change the material.diffuseColor of the box to a random color
    

    // STEP 8: Make the can grabbable and moveable (awesome)! 
    


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

// The grab and drag behaviour is thanks to the forum article at https://forum.babylonjs.com/t/near-dragging-a-mesh-in-immersive-vr-with-and-without-sixdofdragbehavior/48963 and the referenced playground at https://playground.babylonjs.com/#AZML8U#225