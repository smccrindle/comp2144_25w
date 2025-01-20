// Get the canvas element as a const
const canvas = document.getElementById("renderCanvas");
// Create the BABYON 3D engine, and attach it to the canvas
const engine = new BABYLON.Engine(canvas, true);
// The createScene function
const createScene = async function() {
    // Create a new BABYLON scene, passing in the engine as an argument
    const scene = new BABYLON.Scene(engine);
    
    // Add a camera and allow it to control the canvas
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0)); // Add Arc Rotate Camera
    camera.attachControl(canvas, true);
    
    // Include a light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    
    // STEP 1: Add a ground

    // STEP 9: Colour the ground
    

    // STEP 12b: Add an array to position the image properly on each of the four visible sides (notice we will not set 4 and 5)
    //options parameter to set different images on each side
       

    // STEP 2: Add a box to serve as a house
    
    // STEP 12c: Change the above declaration to include a material wrap
    

    // STEP 3a: Preview the result - noticing that the box is sunk into the ground
    // STEP 3b: Adjust the vertical position of the box (default box height is 1 size unit)
    
    // STEP 5a: Scale the box to resemble more of a house shape
    
    // STEP 5b: ...or use a vector object to scale the box instead
    
    // STEP 6a: Repostion the box (which is now 1.5 units in height, so to sit on the ground, we need to raise y to 0.75)
    
    // STEP 6b: ...or with a vector object
    
    // STEP 7: Rotate the box (Babylon.JS uses radians - so convert if you wish)
    
    // STEP 11: Add a texture to the walls of the house (the box) (https://www.babylonjs-playground.com/textures/floor.png)
        
    // STEP 12a: Change the texture above to use an image with doors and windows instead
    
    // STEP 8a: Build a roof - using a cylinder mesh
    
    // STEP 8b: Scale, rotate, and position the new mesh object

    // STEP 10: Add a texture to the roof (https://assets.babylonjs.com/environments/roof.jpg)

    // STEP 13a: Let's combine the box and the roof meshes into one mesh called 'house'
    
    // STEP 13b: Yikes - now the two meshes share the same material - we must allow multiple materials within the same mesh
    

    // STEP 14: Create another instance of the house object and place it elsewhere on the ground
    

    // STEP 4: Add some ambient sounds ("Chirping Birds Ambience" by Alex from Pixabay - https://pixabay.com/sound-effects/search/birds%20chirping/)
        
    // STEP 15a: Set the above createScene() function to async (important, or this will not work)
    // STEP 15b: Create the xrHelper to allow the visitor to choose WebXR if they are able and they'd like
    // const xr = await scene.createDefaultXRExperienceAsync({
    //     floorMeshes: [ground],
    //     optionalFeatures: true
    // });

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

// Thanks to FireDragonGameStudio (https://www.youtube.com/watch?v=8tFUmc7LGqM) for the promise with createScene() that finally got the WebXR session to work
// Lesson adapted from "Getting Started - Chapter 2 - Build A Village" (https://doc.babylonjs.com/features/introductionToFeatures/chap2/)
