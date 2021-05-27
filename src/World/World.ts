import { DirectionalLight, WebGLRenderer, Scene, PerspectiveCamera, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


import { createCamera } from "./components/camera";
import { createCube } from "./components/cube";
import { createLights } from "./components/light";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { Resizer } from "./systems/Resizer";
import Loop from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import ResourceLoader from "./utils/ResourceLoader";
import { createPC } from "./components/pc";


class World {
    // components
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private light: DirectionalLight;

    // system
    private loop: Loop;


    constructor(container: HTMLDivElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.light = createLights();
        this.loop = new Loop({ camera: this.camera, scene: this.scene, renderer: this.renderer });
        createControls(this.camera, this.renderer.domElement);
        container.append(this.renderer.domElement);

        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        const textureLoader = new TextureLoader();
        const loader = new ResourceLoader({ gltfLoader, dracoLoader, textureLoader })
        const cube = createCube();

        // TODO: figure about a better way to load this async stuff
        createPC(loader).then(pc => this.scene.add(pc));
        this.loop.updatables.push(cube);

        this.scene.add(this.light, cube);

        new Resizer(container, this.camera, this.renderer)
    }

    private render() {
        this.renderer.render(this.scene, this.camera)
    }

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }
}

export { World }