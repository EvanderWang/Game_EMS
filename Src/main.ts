import * as Rx from "../Third/RxJS_AMD/Rx";
import { renderbase } from "../Lib/Render/renderbase";

module module_main{
    export function main(){
        let canvas = <HTMLCanvasElement>document.getElementById("scene");
        let rtx = new renderbase.VRenderContext(canvas, window.innerWidth, window.innerHeight);

        let scene = rtx.defaultRenderTarget.createScene();
        scene.setViewportPercent(0,0,1,1);
        scene.setClearColor(1,0,0,1);

        let dorender = () => {
            window.requestAnimationFrame(()=>{
                rtx.defaultRenderTarget.render();
            })
        }

        const sceneresize$ = Rx.Observable.fromEvent(window, "resize");
        sceneresize$.subscribe( () => { 
            scene.dirty();
            rtx.resize(window.innerWidth, window.innerHeight);

            
            dorender();
        } );

        dorender();
    }
}

export { module_main }
