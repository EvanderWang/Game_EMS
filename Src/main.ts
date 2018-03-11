import * as Rx from "../Third/RxJS_AMD/Rx";
import { renderbase } from "../Lib/Render/renderbase";
import { globalAnimationFrameSubscribable } from "../Lib/Unfiled/VAnimationFrameSubscribable";
import { VSleeper } from "../Lib/Unfiled/VSleeper";
import { VFPS } from "../Lib/Unfiled/VFPS";
import { GamepadsCollector } from "../Lib/Unfiled/VGamepadsCollector";

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
            //VSleeper.sleep(30);
            fps.onRender();
            rtx.defaultRenderTarget.render();
        }); 

        let func = ()=>{
            let sel = GamepadsCollector.gamepadCollector.TrackEventButton(GamepadsCollector.VEButtonType.A, GamepadsCollector.VEButtonEventType.Press).subscribe(( gamepad: GamepadsCollector.IVGamepad )=>{ 
                sel.unsubscribe();
                scene.setClearColor(0,1,0,1);
                scene.dirty();
                gamepad.TrackEventAxis(GamepadsCollector.VEAxisType.Right).subscribe( (val: GamepadsCollector.VSAxisDirLevelChange)=>{
                    console.log(GamepadsCollector.VSAxisDir[val.dir]);
                } );
    
                gamepad.TrackEventButton(GamepadsCollector.VEButtonType.A)
                .filter( ( evttype: GamepadsCollector.VEButtonEventType )=>{ return evttype == GamepadsCollector.VEButtonEventType.Press } )
                .subscribe( ()=>{
                    console.log("A");
                } );
    
                GamepadsCollector.gamepadCollector.TrackGamepadDisconnected().subscribe( ( gp: GamepadsCollector.IVGamepad )=>{
                    if(gp == gamepad){
                        scene.setClearColor(1,0,0,1);
                        scene.dirty();
    
                        func();
                    }
                } )
            });
        }

        func();
        
        const sceneresize$ = Rx.Observable.fromEvent(window, "resize");
        sceneresize$.subscribe( () => { 
            
            rtx.resize(window.innerWidth, window.innerHeight);
        } );
    }
}

export { module_main }
