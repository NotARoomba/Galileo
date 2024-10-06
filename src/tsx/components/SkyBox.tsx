import { useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";

export function SkyBox() {
  // highlight-start
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "/skybox/front.png",
    "/skybox/back.png",
    "/skybox/bottom.png",
    "/skybox/left.png",
    "/skybox/right.png",
    "/skybox/top.png",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  // highlight-end
  return null;
}
