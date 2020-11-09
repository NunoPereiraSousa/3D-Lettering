import * as THREE from '../../node_modules/three/build/three.module.js';

import {
    OrbitControls
} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {
    SVGLoader
} from '../../node_modules/three/examples/jsm/loaders/SVGLoader.js';

import {
    TWEEN
} from '../../node_modules/three/examples/jsm/libs/tween.module.min.js';

let camera, scene, renderer;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-300, 0, 800);

    scene = new THREE.Scene();

    const loader = new THREE.FontLoader();
    loader.load('../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {

        const color = new THREE.Color(0x141414);

        const matDark = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x141414),
            side: THREE.DoubleSide
        });

        const matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });

        const message = "     I Am Nuno\nWeb Developer.";

        const shapes = font.generateShapes(message, 100);

        const geometry = new THREE.ShapeBufferGeometry(shapes);

        geometry.computeBoundingBox();

        const xMid = -geometry.boundingBox.max.x / 2;
        const yMid = geometry.boundingBox.max.y / 2;

        geometry.translate(xMid + 150, yMid - 80, 0);

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh(geometry, matLite);
        text.position.z = -150;
        scene.add(text);

        // make line shape ( N.B. edge view remains visible )

        const holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {

            const shape = shapes[i];

            if (shape.holes && shape.holes.length > 0) {

                for (let j = 0; j < shape.holes.length; j++) {

                    const hole = shape.holes[j];
                    holeShapes.push(hole);

                }

            }

        }

        shapes.push.apply(shapes, holeShapes);

        const style = SVGLoader.getStrokeStyle(5, color.getStyle());

        const strokeText = new THREE.Group();

        for (let i = 0; i < shapes.length; i++) {

            const shape = shapes[i];

            const points = shape.getPoints();

            const geometry = SVGLoader.pointsToStroke(points, style);

            geometry.translate(xMid + 150, yMid, 0);

            const strokeMesh = new THREE.Mesh(geometry, matDark);
            strokeText.add(strokeMesh);

        }

        scene.add(strokeText);

    }); //end load function

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("section1").appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

} // end init

function createSpotlight(color) {

    const newObj = new THREE.SpotLight(color, 2);

    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 500;
    newObj.power = 500;

    return newObj;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.render(scene, camera);

}