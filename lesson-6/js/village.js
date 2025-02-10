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
    // STEP 11: Restrict camera from going below the ground
    


    /* LIGHTING
    ---------------------------------------------------------------------------------------------------- */
    // Include a light
    const light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
    light1.intensity = 0.6;

    // STEP 8a: Let's create some shadows...create a new DirectionalLight
    
    // STEP 8b: Position the light
    
    // STEP 8c: Create a ShadowGenerator object, and attach it to the light
    

    // STEP 10: Soften the edges of the shadows a bit
    


    /* GROUND
    ---------------------------------------------------------------------------------------------------- */
    // STEP 6a: Comment out the below code for the simple square ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10
    });
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0.33, 0.42, 0.18);
    ground.material = groundMat;

    // STEP 6b: Create large ground texture material using Babylon.js library (https://assets.babylonjs.com/environments/valleygrass.png)
    
    // STEP 6c: Build a 3D ground surface based on a heightmap (https://assets.babylonjs.com/environments/villageheightmap.png)
    
    // STEP 6d: Set the largeGround material property to be the largeGroundMat we created above
    
    
    // STEP 8d: Instruct the ground mesh to receive shadows
    


    /* SKY
    ---------------------------------------------------------------------------------------------------- */
    // STEP 7a: Add a skybox (see https://playground.babylonjs.com/#UU7RQ#91 to visualize how this works)
    
    // STEP 7b: Apply the 6 images onto the skybox cube (look at the /textures/ directory)
    
    // Thanks to Chad Wolfe's skybox bitmaps at https://opengameart.org/content/sky-box-sunny-day
    // STEP 7c: Make the skybox non-reflective
    
    // STEP 7d: Set the skybox material property
    


    /* HOUSES
    ---------------------------------------------------------------------------------------------------- */
    // Add an array to position an image (bitmap sprite) properly on each of the four visible sides of the box
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // rear face
    faceUV[1] = new BABYLON.Vector4(0.3, 0.0, 0.5, 1.0); // front face
    faceUV[2] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); // right side
    faceUV[3] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); // left side

    // Add a box to serve as a house
    const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
    box.scaling = new BABYLON.Vector3(2, 1.5, 3);
    box.position = new BABYLON.Vector3(1, 0.75, 2)
    box.rotation.y = BABYLON.Tools.ToRadians(45);
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png");
    box.material = boxMat;

    // Build a roof - using a cylinder mesh
    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
        diameter: 2.8,
        height: 3.5,
        tessellation: 3
    });
    roof.scaling.x = 0.75;
    roof.rotation.z = BABYLON.Tools.ToRadians(90);
    roof.rotation.y = BABYLON.Tools.ToRadians(-45);
    roof.position = new BABYLON.Vector3(1, 2, 2);
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");
    roof.material = roofMat;

    // Combine the box and the roof meshes into one mesh. Note the MergeMeshes method below includes arguments to allow multiple materials within the same mesh
    const house1 = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
    // STEP 9e: Notice the tree is not casting a shadow on the house? Set each of the three houses to cast and recieve shadows, too
    

    // HOUSE 2
    let house2 = house1.createInstance("house2");
    house2.position = new BABYLON.Vector3(0, 0, -4);
    house2.rotation.y = BABYLON.Tools.ToRadians(45);
    // STEP 9f: Set house2 to cast and receive shadows
    

    // HOUSE 3
    let house3 = house1.createInstance("house3");
    house3.position = new BABYLON.Vector3(-3, 0, 1.0);
    house3.rotation.y = BABYLON.Tools.ToRadians(-45);
    // STEP 9g: Set house3 to cast and receive shadows
    


    /* SOUNDS
    ---------------------------------------------------------------------------------------------------- */
    // Ambient sounds ("Chirping Birds Ambience" by Alex from Pixabay - https://pixabay.com/sound-effects/search/birds%20chirping/)
    const sound = new BABYLON.Sound("birds", "./media/chirping-birds-ambience-217410.mp3", scene, null, {
        loop: true,
        autoplay: true
    });
    

    /* TREE
    ---------------------------------------------------------------------------------------------------- */
    // Include a 3D model of a tree (https://free3d.com/3d-model/low_poly_tree-816203.html by kipris, from which the .dae file is converted to .glb format using https://convert3d.org/)
    // Drop the tree into the scene using the ImportMeshAsync method (note that the tree is very, very tiny)
    const tree = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "Lowpoly_tree_sample.glb").then((result) => {
        let treeMesh = result.meshes[0];
        treeMesh.position = new BABYLON.Vector3(-2.5, 0.1, -2.5);
        // Scale up the tree - it is way too small
        treeMesh.scaling = new BABYLON.Vector3(150, 150, 150);
        // STEP 9a: Set the tree mesh to cast a shadow (true means apply to child meshes as well), and also to receive shadows
        
    });


    /* CAR AND WHEELS
    ---------------------------------------------------------------------------------------------------- */
    // Build a simple 1x1 cube car, with a standard material and a color
    const car = BABYLON.MeshBuilder.CreateBox("car");
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    car.material = carMat;
    // STEP 9b: Add a shadow to the car, and set it to receive shadows cast upon it
    

    // Move car up 0.5 so that it sits on the ground
    car.position = new BABYLON.Vector3(1, 0.5, -0.75);
    // Move it out of the way so that the 0,0,0 point in the scene is visible for the next mesh we will import

    // Drop a wheel (built into TinkerCAD) into the scene using the ImportMeshAsync method
    const wheel1 = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "wheel1.glb").then((result) => {
        const wheelMesh = result.meshes[0];
        const wheelBounds = result.meshes[1];
        // wheelBounds.showBoundingBox = true;
        wheelMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        wheelMesh.parent = car;
        wheelMesh.position = new BABYLON.Vector3(0, -0.4, -0.6);
        // STEP 9c: Add a shadow to the wheel, and enable receiveShadows
        
    }).catch((error) => {
        console.log("Error loading mesh: " + error);
        return null;
    });    

    // Add a second wheel (also from TinkerCAD)
    const wheel2 = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "wheel2.glb").then((result) => {
        const wheelMesh = result.meshes[0];
        const wheelBounds = result.meshes[1];
        // wheelBounds.showBoundingBox = true;
        wheelMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        wheelMesh.parent = car;
        wheelMesh.position = new BABYLON.Vector3(0, -0.4, 0.6);
        // STEP 9d: Add a shadow to the wheel, and enable receiveShadows
        
    }).catch((error) => {
        console.log("Error loading mesh: " + error);
        return null;
    });

    // The car's wheels are stuck in the ground - we need to lift the car up so that it sits on the ground
    car.position.y = 0.6;


    /* ANIMATION
    ---------------------------------------------------------------------------------------------------- */
    // STEP 1: Create a new animation object (at 30 FPS)
    

    // STEP 2a: Create an array for keyframes
    
    // STEP 2b: Add the first keyframe - at key 0, the value of position.x is -3
    
    // STEP 2c: at animation key 60, (after 2 seconds since animation FPS = 30) the value of position.x is 3
    
    // STEP 2d: At animation key 120, the value of position.x is -3 again
    

    // STEP 3: Attach the animation keys to the animation object
    

    // STEP 4: Add the animation object to the car's animations array
    

    // STEP 5: Attach the animation to the scene
    

    /* ENABLE IMMERSIVE VR
    ---------------------------------------------------------------------------------------------------- */
    // STEP 12: Enable the WebXR experience, and walk around your scene using the provided VR headset
    // Check to see if WebXR (immersive-vr, specifically) is supported on this device
    // if (BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-vr")) {
    //     const xr = await scene.createDefaultXRExperienceAsync({
    //         floorMeshes: [largeGround],
    //         optionalFeatures: true
    //     });
    // } else {
    //     console.log("WebXR is not supported on this device.");
    // };

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

// Thanks to the helpful folks at https://forum.babylonjs.com/, and the great documentation at https://doc.babylonjs.com/