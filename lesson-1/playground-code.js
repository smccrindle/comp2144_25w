// STEP 1: Create a function to contain the scene
export const createScene = function() {
 
    // STEP 2a: Create the scene itself
    let scene = new BABYLON.Scene(engine);
 
 
    // STEP 7a: Add an ArcRotateCamera (first comment out STEP 3a and 3b)
    let camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(57.3), 10, BABYLON.Vector3.Zero(), scene);
    // STEP 7b: Attach the camera to the canvas so that it can control the scene
    camera.attachControl(canvas, true);
 
 
    // STEP 3a: Create and position a camera
    // let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 1, 2), scene);
    // STEP 3b: Target the camera to the scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());
 
 
    // STEP 4a: Install a light aiming up at the sky, and attach to the scene
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0));
    // STEP 4b: Dim the light just a bit
    light.intensity = 0.7;
 
 
    // STEP 5a: Create a ground object, and attach to the scene
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
    // STEP 5b: Create a constant for the ground material, and attach to the scene
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    // STEP 5c: Set the color of the ground material to green
    groundMaterial.diffuseColor = BABYLON.Color3.Green();
    // STEP 5d: Create a new texture for the ground, and attach to the scene
    let groundTexture = new BABYLON.Texture(Assets.textures.grass_png.path, scene);
    // STEP 5e: Set the texture property of the ground material to the above grass image
    groundMaterial.diffuseTexture = groundTexture;
    // STEP 5f: Set the material property of the ground to the ground material created above
    ground.material = groundMaterial;
 
 
    // STEP 6a: Import a mesh model of an aeroplane, and include a callback function for when the model loads
    BABYLON.SceneLoader.ImportMesh("", Assets.meshes.aerobatic_plane.rootUrl, Assets.meshes.aerobatic_plane.filename, scene, function(newMeshes) {
 
        // STEP 6b: Scale the mesh model - it is pretty small
        newMeshes[0].scaling = new BABYLON.Vector3(20, 20, 20);
        // STEP 6c: Experiment with positioning the model
        
    });
 
    // STEP 2b: Return the scene
    return scene;
}