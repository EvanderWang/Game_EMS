import * as Rx from "../Third/RxJS_AMD/Rx";
import { renderbase } from "../Lib/Render/renderbase";
import { globalAnimationFrameSubscribable } from "../Lib/Unfiled/VAnimationFrameSubscribable";
import { VSleeper } from "../Lib/Unfiled/VSleeper";
import { VFPS } from "../Lib/Unfiled/VFPS";

module module_main{
    export function main(){
        let canvas = <HTMLCanvasElement>document.getElementById("scene");
        let rtx = new renderbase.VRenderContext(canvas, window.innerWidth, window.innerHeight);

        let scene = rtx.defaultRenderTarget.createScene();
        scene.setViewportPercent(0,0,1,1);
        scene.setClearColor(1,0,0,1);
        scene.dirty();

        let fps = new VFPS();
        let globalAnimationFrameSubscription = globalAnimationFrameSubscribable.subscribe(()=>{
            VSleeper.sleep(30);
            fps.onRender();
            rtx.defaultRenderTarget.render();
        });

        const sceneresize$ = Rx.Observable.fromEvent(window, "resize");
        sceneresize$.subscribe( () => { 
            scene.setClearColor(0,1,0,1);
            scene.dirty();
            rtx.resize(window.innerWidth, window.innerHeight);
        } );
    }
}

export { module_main }
