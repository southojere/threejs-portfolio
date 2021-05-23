import { World } from "./World/World";

function main() {
  const container: HTMLDivElement | null = document.querySelector("#scene-container");
  if (!container) throw new Error(`Failed to find app container`)
  const world = new World(container);
  world.start();
}

console.log("loading");
main();