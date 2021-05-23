import { PerspectiveCamera } from "three";

const CAMERA_SETTINGS = {
    fov: 35,
    aspectRadio: 1, // dummy value
    nearClippingPlane: .1,
    farClippingPlane: 100,
    // position
    x: 0,
    y: 0,
    z: 10,
}

function createCamera(): PerspectiveCamera {
    const { fov, aspectRadio, nearClippingPlane, farClippingPlane, x, y, z } = CAMERA_SETTINGS;
    const camera = new PerspectiveCamera(
        fov,
        aspectRadio,
        nearClippingPlane,
        farClippingPlane,
    );

    camera.position.set(x, y, z)
    return camera;
}

export { createCamera }