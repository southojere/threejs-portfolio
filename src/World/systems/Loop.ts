import { Clock, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";


export default class Loop {

    private readonly camera: PerspectiveCamera;
    private readonly scene: Scene;
    private readonly renderer: WebGLRenderer;
    private readonly clock: Clock;

    public updatables: Object3D & { tick?: (delta: number) => void }[];
    constructor({ camera, scene, renderer }: { camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer }) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.clock = new Clock();

        this.updatables = [];
    }


    public start(): void {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            this.tick();

            // render a frame
            this.renderer.render(this.scene, this.camera);
        })
    }

    public stop(): void {

    }

    private tick(): void {
        // only call the getDelta once per frame
        const delta = this.clock.getDelta();

        for (const object of this.updatables) {
            if (object.tick) object.tick(delta);
        }
    }
}