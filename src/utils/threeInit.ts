import * as THREE from 'three';

type ThreeParams = {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
}

const createCamera = (dom: HTMLDivElement) => {
    const camera = new THREE.PerspectiveCamera(
        75,
        dom.clientWidth / dom.clientHeight,
        0.1,
        100000,
    );
    return camera;
}

const addLight = (scene: THREE.Scene) => {
    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 5000000, 5000000);
    topLight.castShadow = true;
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bottomLight.position.set(0, -5000000, 0);
    bottomLight.castShadow = true;
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(5000000, 5000000, 5000000);

    scene.add(topLight);
    scene.add(bottomLight);
    scene.add(pointLight);
}

const createScene = () => {
    return new THREE.Scene();
}

const createRenderer = (dom: HTMLDivElement) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
    });
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    dom.appendChild(renderer.domElement);
    return renderer;
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = createCamera(dom);
    const renderer = createRenderer(dom);
    const scene = createScene();

    // add stuff
    addLight(scene);

    return {
        camera,
        renderer,
        scene,
    } as ThreeParams;
}

export type { ThreeParams };

export default threeInit;