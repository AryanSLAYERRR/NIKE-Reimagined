let scene, camera, renderer, controls;
let shoe;
let cube;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        (window.innerWidth / 2) / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(3, 1.5, 10); // Adjusted for side view

    // Enhanced renderer setup with shadows
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('shoe-model').appendChild(renderer.domElement);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Enhanced lighting setup
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main directional light (like sunlight)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    // Add spotlights for dramatic effect
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.8);
    spotLight1.position.set(3, 3, 0);
    spotLight1.angle = Math.PI / 4;
    spotLight1.penumbra = 0.3;
    spotLight1.decay = 2;
    spotLight1.distance = 200;
    spotLight1.castShadow = true;
    spotLight1.shadow.bias = -0.0001;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight2.position.set(-3, 3, 0);
    spotLight2.angle = Math.PI / 4;
    spotLight2.penumbra = 0.1;
    spotLight2.decay = 2;
    spotLight2.distance = 200;
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // Load 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        './gltf/Airjordan.gltf',
        function (gltf) {
            shoe = gltf.scene;
            
            // Scale the model
            shoe.scale.set(0.3, 0.3, 0.3);
            
            // Position for side view
            shoe.position.set(0, -1.6, 0);
            
            // Rotate for side view
            shoe.rotation.y = Math.PI / 2; // 90 degrees - side view
            
            // Enable shadows for the model
            shoe.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            scene.add(shoe);
            scene.remove(cube);
            cube = null;
        },
        undefined,
        function (error) {
            console.error('An error occurred loading the model:', error);
        }
    );

    // OrbitControls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 6;
    controls.maxDistance = 8;
    controls.minPolarAngle = Math.PI / 4; // Limit how low camera can go
    controls.maxPolarAngle = Math.PI / 2; // Limit how high camera can go
    
    // Auto rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5; // Slower, more elegant rotation
    controls.target.set(0, -0.5, 0);

    // Performance optimizations
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows

    // Optimize geometry
    scene.traverse((node) => {
        if (node.isMesh) {
            node.geometry.setDrawRange(0, Infinity);
            node.geometry.attributes.position.needsUpdate = true;
            // Optional: reduce geometry detail
            // node.geometry = node.geometry.clone().setDrawRange(0, node.geometry.attributes.position.count * 0.75);
        }
    });

    // Adjust camera settings for better performance
    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Only rotate the cube if it exists
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = (window.innerWidth / 2) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();