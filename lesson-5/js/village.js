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
    
    // Add a ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10
    });
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0.33, 0.42, 0.18);
    ground.material = groundMat;

    // Add an array to position an image properly on each of the four visible sides of the box below (notice we will not set 4 and 5)
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // rear face
    faceUV[1] = new BABYLON.Vector4(0.3, 0.0, 0.5, 1.0); // front face
    faceUV[2] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); // right side
    faceUV[3] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); // left side

    // Add a box to serve as a house
    const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true}); // note options parameter to set different images on each side
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
    roof.showBoundingBox = true;

    // Combine the box and the roof meshes into one mesh called 'house'
    // Note that the MergeMeshes method below includes arguments to allow multiple materials within the same mesh
    const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);

    // Create another instance of the house object and place it elsewhere on the ground
    let house2 = house.createInstance("house2");
    house2.position = new BABYLON.Vector3(0, 0, -4);
    house2.rotation.y = BABYLON.Tools.ToRadians(45);
    // How about a third house?
    let house3 = house.createInstance("house3");
    house3.position = new BABYLON.Vector3(-3, 0, 1.0);
    house3.rotation.y = BABYLON.Tools.ToRadians(-45);

    // Add some ambient sounds ("Chirping Birds Ambience" by Alex from Pixabay - https://pixabay.com/sound-effects/search/birds%20chirping/)
    const sound = new BABYLON.Sound("birds", "./media/chirping-birds-ambience-217410.mp3", scene, null, {
        loop: true,
        autoplay: true
    });
    
    // Include a 3D model of a tree (https://free3d.com/3d-model/low_poly_tree-816203.html by kipris, from which the .dae file is converted to .glb format using https://convert3d.org/)
    // Drop the tree into the scene using the ImportMeshAsync method (note that the tree is very, very tiny)
    const tree = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "Lowpoly_tree_sample.glb").then((result) => {
        result.meshes[0].position = new BABYLON.Vector3(-2.5, 0.1, -2.5);
        // Scale up the tree - it is way too small
        result.meshes[0].scaling = new BABYLON.Vector3(150, 150, 150);
    });

    // STEP 1: Build a simple 1x1 cube car, with a standard material and a color
    const car = BABYLON.MeshBuilder.CreateBox("car");
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseColor = new BABYLON.Color3(1, 0, 1);
    car.material = carMat;

    // STEP 2a: The local coordinates origin of the cube car is the reference point for scaling and positioning it within the scene - move it up 0.5 so that it sits on the ground
    car.position = new BABYLON.Vector3(1, 0.5, -0.75);
    // STEP 2b: Move it out of the way so that the 0,0,0 point in the scene is visible for the next mesh we will import

    // STEP 3a: Go to TinkerCAD and build a wheel (radius: 2, wall thickness: 1, sides: 12, bevel: 0, bevel segments: 0)
    // STEP 3b: Rotate the wheel 90 degrees and position it at 0,0,0 in the workspace
    // STEP 3c: Export the wheel as a .glb file and put it in the meshes folder
    
    // STEP 4a: Drop the wheel into the scene using the ImportMeshAsync method
    const wheel1 = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "wheel1.glb").then((result) => {
        const wheelMesh = result.meshes[0];
        const wheelBounds = result.meshes[1];
        wheelBounds.showBoundingBox = true;
        wheelMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        // wheelMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        wheelMesh.parent = car;
        wheelMesh.position = new BABYLON.Vector3(0, -0.4, -0.6);
    }).catch((error) => {
        console.log("Error loading mesh: " + error);
        return null;
    });    

    // STEP 4b: The wheel is 4 units radius, which is too big again - so scale it down to 1/10 the size above
    // STEP 4c: Add a bounding box to the wheel to see the dimensions of the mesh (this can be accessed via the second mesh in the result.meshes array, result.meshes[1])

    // STEP 5a: Now we need to be able to attach the wheel to the car...so make the car the parent of the wheel (inside the promise above)
    // STEP 5b: Position the wheel with respect to its parent - but now the wheel is using the coordinates of the cube as its reference point, rather than the scene origin

    // STEP6a: Go back to TinkerCAD and export another wheel, but change the color
    // STEP6b: Copy the code in STEP 4 and paste it below, change the the const name and filename to match the new wheel
    // STEP6c: Change the position of the wheel so that it is on the other side of the car
    const wheel2 = BABYLON.SceneLoader.ImportMeshAsync("", "./meshes/", "wheel2.glb").then((result) => {
        const wheelMesh = result.meshes[0];
        const wheelBounds = result.meshes[1];
        wheelBounds.showBoundingBox = true;
        wheelMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        // wheelMesh.rotation.y = BABYLON.Tools.ToRadians(90);
        wheelMesh.parent = car;
        wheelMesh.position = new BABYLON.Vector3(0, -0.4, 0.6);
    }).catch((error) => {
        console.log("Error loading mesh: " + error);
        return null;
    });

    // STEP 7: The car's wheels are stuck in the ground - we need to lift the car up so that it sits on the ground
    car.position.y = 0.6;

    // STEP 8: Create a new animation object
    // START here Feb. 10, 2025!!!

    // STEP 9a: Create an array for keyframes
     
    // STEP 9b: Add the first keyframe - at key 0, the value of position.x is 0
    
    // STEP 9c: at animation key 30, (after 1 sec since animation fps = 30) the value of position.x is 2
    
    // STEP 9d: At animation key 60, the value of position.x is 0 again
    

    // STEP 10: Attach the animation keys to the animation object
    

    // STEP 11: Add the animation object to the car's animations array
    

    // STEP 12: Attach the animation to the scene
    

    // STEP 13: Enable the WebXR experience, and walk around your scene using the provided VR headset
    // Check to see if WebXR (immersive-vr, specifically) is supported on this device
    if (BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-vr")) {
        const xr = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [ground],
            optionalFeatures: true
        });
    } else {
        console.log("WebXR is not supported on this device.");
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

// Thanks to Gemini 2.0 and Copilot for some useful code refactoring tips! Also, thanks to TinkerCAD for the great 3D modeling web app.
