
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Texture, TextureLoader } from "three";

export type Resource = {
    source: string;
    name: string
}

type Loader = {
    extensions: string[],
    action: (resource: Resource) => any, // loaded data
}

type ResourceLoaderProps = {
    dracoLoader: DRACOLoader;
    gltfLoader: GLTFLoader;
    textureLoader: TextureLoader;
}
/**
 * ResourceLoader - 
 * 
 * ... trying to follow DI
 */
class ResourceLoader {
    public itemsToLoad: number;
    public loaded: number;
    private itemToData: Map<string, any>

    // loaders
    private loaders: Loader[];
    private gltfLoader: GLTFLoader;
    private dracoLoader: DRACOLoader;
    private textureLoader: TextureLoader;
    constructor({ gltfLoader, dracoLoader, textureLoader }: ResourceLoaderProps) {
        this.itemsToLoad = 0;
        this.loaded = 0;
        this.itemToData = new Map<string, Resource>();

        this.loaders = [];
        this.gltfLoader = gltfLoader;
        this.dracoLoader = dracoLoader;
        this.dracoLoader.setDecoderPath('/draco/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        this.textureLoader = textureLoader;

        this.initLoaders();
    }

    private initLoaders() {
        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (resource) => new Promise((resolve) => {
                this.gltfLoader.load(resource.source, gltfData => {
                    this.fileLoadEnd(resource, gltfData);
                    resolve(gltfData)
                })
            })
        })
        this.loaders.push({
            extensions: ['jpg'],
            action: (resource) => new Promise((resolve) => {
                this.textureLoader.load(resource.source, (textureData) => {
                    this.fileLoadEnd(resource, textureData);
                    resolve(textureData);
                })
            })
        })
    }

    private findLoaderForResource(resource: Resource) {
        const extensionMatch = resource.source.match(/\.([a-z]+)$/);
        if (!extensionMatch) return null;
        const extension = extensionMatch[1];
        const loader = this.loaders.find(loader => loader.extensions.find((_extension) => _extension === extension))
        return loader;
    }

    private fileLoadEnd(resource: Resource, data: any) {
        this.loaded++;
        this.itemToData.set(resource.name, data);
    }

    public load(resources: Resource[]) {
        const promises: Promise<GLTF | Texture>[] = [];
        for (const resource of resources) {
            this.itemsToLoad++;
            const loader = this.findLoaderForResource(resource)
            if (loader) {
                promises.push(loader.action(resource));
            } else {
                console.warn(`Cannot find loader for (${resource})`);

            }
        }
        return promises;
    }
}

export default ResourceLoader;