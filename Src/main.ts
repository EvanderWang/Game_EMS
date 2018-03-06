import * as Rx from "../Third/RxJS_AMD/Rx";

module module_main{
    export function main(){
        const sceneresize$ = Rx.Observable.fromEvent(window, "resize");
        sceneresize$.subscribe( () => { console.log( "w: " + window.innerWidth + "; h: " + window.innerHeight); } );

        const click$ = Rx.Observable.fromEvent(window, "click");
        click$.subscribe( (e: MouseEvent) => { console.log("x: " + e.clientX + "; y: " + e.clientY); } );
    }
}

export { module_main }
