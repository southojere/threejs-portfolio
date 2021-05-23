import { WebGLRenderer } from "three";

function createRenderer() {
    const renderer = new WebGLRenderer();
    // @ts-ignore
    renderer.antialias = true;
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };