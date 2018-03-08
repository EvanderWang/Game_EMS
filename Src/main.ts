import * as Rx from "../Third/RxJS_AMD/Rx";
import { renderbase } from "../Lib/Render/renderbase";

module module_main{
    export function main(){
        let canvas = <HTMLCanvasElement>document.getElementById("scene");
        let rtx = new renderbase.VRenderContext(canvas, window.innerWidth, window.innerHeight);

        let scene = rtx.defaultRenderTarget.createScene();
        scene.setViewportPercent(0,0,1,1);
        scene.setClearColor(1,0,0,1);
        scene.dirty();

        // let dorender = () => {
        //     window.requestAnimationFrame(()=>{
        //         rtx.defaultRenderTarget.render();
        //     })
        // }

        let requestAnimationFrameObservable = Rx.Observable.bindCallback(window.requestAnimationFrame);
        const raf$ = requestAnimationFrameObservable();
        raf$.subscribe( () => {
            rtx.defaultRenderTarget.render();
        } , () => {
            console.log("fisrt err");
        } , () => {
            console.log("fisrt fin");
        } );

        const sceneresize$ = Rx.Observable.fromEvent(window, "resize");
        sceneresize$.subscribe( () => { 
            scene.setClearColor(0,1,0,1);
            scene.dirty();
            rtx.resize(window.innerWidth, window.innerHeight);
            //dorender();
            raf$.subscribe( () => {
                rtx.defaultRenderTarget.render();
            } , () => {
                console.log("second err");
            } , () => {
                console.log("second fin");
            } );
        } );

        //dorender();
    }
}

export { module_main }
