import { MeshBasicMaterial, sRGBEncoding, Texture } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import ResourceLoader from "../utils/ResourceLoader"

async function createPC(loader: ResourceLoader) {

    const models = await Promise.all(loader.load([
        {
            name: 'pc',
            source: 'src/static/models/computer.glb'
        },
        {
            name: 'pc-texture',
            source: 'src/static/models/baked-computer.jpg'
        }
    ]));
    const gltf = models[0] as GLTF;
    const texture = models[1] as Texture;

    texture.flipY = false
    texture.encoding = sRGBEncoding
    const bakedMaterial = new MeshBasicMaterial({ map: texture })
    gltf.scene.traverse((child:any) => {
        child.material = bakedMaterial
    })

    gltf.scene.position.x = 2
    gltf.scene.rotation.y = Math.PI * -.4
    return gltf.scene
}

export { createPC }