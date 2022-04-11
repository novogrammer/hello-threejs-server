import { JSDOM } from "jsdom";
import createContext from "gl";
// import {createCanvas,loadImage} from "canvas";
import * as THREE from "three";
import fs from "fs";
import {PNG} from "pngjs";


const WIDTH=640;
const HEIGHT=480;

interface globalThis{
  [index:string]:any;
}



async function main(): Promise<void> {
  // console.log("hello");
  // console.log(JSDOM);
  // console.log(createContext);
  // console.log(createCanvas,loadImage);
  // console.log(`THREE.REVISION: ${THREE.REVISION}`);

  const jsdom = new JSDOM();
  global.navigator=jsdom.window.navigator;
  const canvas = jsdom.window.document.createElement("canvas");
  // console.log(canvas);
  const context = createContext(WIDTH,HEIGHT);
  // const context = canvas.getContext("webgl");
  // console.log(context);
  if(!context){
    throw new Error("createContext failed.");
  }

  const renderer=new THREE.WebGLRenderer({
    context,
    canvas,
  });
  renderer.setSize(WIDTH,HEIGHT);

  {
    const scene=new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 );
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    renderer.render( scene, camera );
  }

  // console.log(renderer);

  

  const pixels = new Uint8Array(WIDTH * HEIGHT * 4);
  context.readPixels(0, 0, WIDTH, HEIGHT, context.RGBA, context.UNSIGNED_BYTE, pixels);
  
  const png=new PNG({
    width:WIDTH,
    height:HEIGHT,
  });
  for(let i=0;i<png.data.length;++i){
    png.data[i]=pixels[i];
  }
  
  png.pack().pipe(fs.createWriteStream("output/a.png"));


}

main();