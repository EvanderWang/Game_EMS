import * as Rx from "../../Third/RxJS_AMD/Rx";
import * as RxSubScription from "../../Third/RxJS_AMD/Subscription";
import { globalAnimationFrameSubscribable } from "./VAnimationFrameSubscribable";

module GamepadsCollector {
    export enum VEButtonType {
        A,
        B,
        X,
        Y,
        LB,
        RB,
        LT,
        RT,
        SELECT,
        START,
        L3,
        R3,
        UP,
        DOWN,
        LEFT,
        RIGHT,

        Size,
    }
    
    export enum VEAxisType {
        Left,
        Right,

        Size = 4,
    }
    
    export enum VEButtonEventType {
        Press,
        LongPress,
    }

    export enum VEAxisEventType {
        LevelChange, // level 0 == not press , level 1 == half push , level 2 == full push
        EightDirChange,
    }

    export interface VSButtonState {
        pressed: boolean;
        percent: number;
    }

    export interface VSAxisState {
        x: number;
        y: number;
    }

    export interface IVGamepad {
        TrackStateButton: (button: VEButtonType) => Rx.Observable<VSButtonState>;
        TrackEventButton: (button: VEButtonType) => Rx.Observable<VEButtonEventType>;
        // TrackStateAxis: (axis:VEAxisType) => Rx.Observable<VSAxisState>;
        // TrackEventAxis: (axis:VEAxisType) => Rx.Observable<VEAxisEventType>;
    }
    
    export interface IVGamepadsCollector {
        TrackEventButton: (button:VEButtonType, evttype:VEButtonEventType) => Rx.Observable<IVGamepad>;
        // TrackEventAxis: (axis:VEAxisType, evttype:VEAxisEventType) => Rx.Observable<IVGamepad>;
    }
    
    class VGamepad implements IVGamepad {
        globalAnimationFrameSubscription: RxSubScription.AnonymousSubscription;
        buttonstates: Array<Rx.Subject<VSButtonState>>;
        buttonevents: Array<Rx.Subject<VEButtonEventType>>;
        
        constructor( public gpindex: number ) {
            this.buttonstates = new Array<Rx.Subject<VSButtonState>>();
            this.buttonevents = new Array<Rx.Subject<VEButtonEventType>>();
            for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                let index = i;
                this.buttonstates.push( new Rx.Subject<VSButtonState>() );
                this.buttonevents.push( new Rx.Subject<VEButtonEventType>() );

                let prstate = this.buttonstates[index].map( ( state: VSButtonState )=>{
                    return state.pressed;
                } );
                let changestate = prstate.distinctUntilChanged();
                let downstate = changestate.filter((pressed: boolean)=>{ return pressed; }).map(()=>{ let val = Math.random(); return val; }).share();
                let upstate = changestate.filter((pressed: boolean)=>{ return !pressed; }).map(()=>{ return 0; });
                let long = downstate.delay(300);
                let finish = upstate.merge(long);
                let bufcount = downstate.buffer(finish);
                finish.withLatestFrom(bufcount).subscribe( ( val: [number, number[]] )=>{
                    if( val[1].length > 0 ) {
                        if( val[0] == 0 ) {
                            this.buttonevents[index].next(VEButtonEventType.Press);
                        } else if( val[0] == val[1][0]  ) {
                            this.buttonevents[index].next(VEButtonEventType.LongPress);
                        }
                    }
                } );
            }

            this.globalAnimationFrameSubscription = globalAnimationFrameSubscribable.subscribe(()=>{
                let gamepad = navigator.getGamepads()[gpindex];
                for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                    this.buttonstates[i].next({
                        pressed: gamepad.buttons[i].pressed,
                        percent: gamepad.buttons[i].value,
                    });
                }
            });
        }
    
        destructor(){
            this.globalAnimationFrameSubscription.unsubscribe();
        }

        TrackStateButton(button: VEButtonType): Rx.Observable<VSButtonState> {
            return this.buttonstates[button];
        }
        TrackEventButton(button: VEButtonType): Rx.Observable<VEButtonEventType> {
            return this.buttonevents[button];
        }
        // TrackStateAxis(axis:VEAxisType): Rx.Observable<VSAxisState> {

        // }
        // TrackEventAxis(axis:VEAxisType): Rx.Observable<VEAxisEventType> {

        // }
    }
    
    class VGamepadsCollector implements IVGamepadsCollector {
        gamepads: Array<VGamepad>;
        buttonevents: Array<Rx.Subject<[VEButtonEventType, IVGamepad]>>;
    
        constructor(){
            this.gamepads = new Array<VGamepad>();
            this.buttonevents = new Array<Rx.Subject<[VEButtonEventType, IVGamepad]>>();
            for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                this.buttonevents.push(new Rx.Subject<[VEButtonEventType, IVGamepad]>());
            }
    
            const gc$ = Rx.Observable.fromEvent(window, "gamepadconnected");
            gc$.subscribe( ( evt: GamepadEvent )=>{
                if( evt.gamepad.buttons.length == VEButtonType.Size && evt.gamepad.axes.length == VEAxisType.Size ) {
                    this.gamepads.push(new VGamepad(evt.gamepad.index));
                    let gpindex = this.gamepads.length - 1;
                    for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                        this.gamepads[gpindex].TrackEventButton(i).subscribe((et: VEButtonEventType)=>{
                            this.buttonevents[i].next([et,this.gamepads[gpindex]]);
                        });
                    }
                }
            } );
    
            const gd$ = Rx.Observable.fromEvent(window, "gamepaddisconnected");
            gd$.subscribe( ( evt: GamepadEvent )=>{
                for( let i = 0; i < this.gamepads.length ; i++ ){
                    if( this.gamepads[i].gpindex == evt.gamepad.index ){
                        this.gamepads[i].destructor();
                        this.gamepads.splice(i , 1);
                        break;
                    }
                }
            } );
        }

        TrackEventButton(button:VEButtonType, evttype:VEButtonEventType): Rx.Observable<IVGamepad> {
            let rt = new Rx.Subject<IVGamepad>(); 
            this.buttonevents[button].subscribe((val: [VEButtonEventType, IVGamepad])=>{
                if(val[0] == evttype) {
                    rt.next(val[1]);
                }
            });
            return rt;
        }

        // TrackEventAxis(axis:VEAxisType, evttype:VEAxisEventType): Rx.Observable<IVGamepad> {
            
        // }
    }

    export var gamepadCollector: IVGamepadsCollector = new VGamepadsCollector();
}

export { GamepadsCollector }