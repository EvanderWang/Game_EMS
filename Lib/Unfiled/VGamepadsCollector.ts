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

        Size,
    }
    
    export enum VEButtonEventType {
        Press,
        LongPress,
    }

    export enum VSAxisLevel {
        NotPush,
        HalfPush,
        FullPush,
    }

    export enum VSAxisDir {
        N,
        S,
        W,
        E,
        NW,
        NE,
        SW,
        SE,
    }

    export interface VSButtonState {
        pressed: boolean;
        percent: number;
    }

    export interface VSAxisState {
        x: number;
        y: number;
    }

    export interface VSAxisDirLevelChange {
        level: VSAxisLevel;
        dir: VSAxisDir;
    }

    export interface IVGamepad {
        TrackStateButton: (button: VEButtonType) => Rx.Observable<VSButtonState>;
        TrackEventButton: (button: VEButtonType) => Rx.Observable<VEButtonEventType>;
        TrackStateAxis: (axis:VEAxisType) => Rx.Observable<VSAxisState>;
        TrackEventAxis: (axis:VEAxisType) => Rx.Observable<VSAxisDirLevelChange>;
    }
    
    export interface IVGamepadsCollector {
        TrackEventButton: (button:VEButtonType, evttype:VEButtonEventType) => Rx.Observable<IVGamepad>;
        TrackEventAxis: (axis:VEAxisType, evttype:VSAxisDirLevelChange) => Rx.Observable<IVGamepad>;
    }
    
    class VGamepad implements IVGamepad {
        globalAnimationFrameSubscription: RxSubScription.AnonymousSubscription;
        buttonstates: Array<Rx.Subject<VSButtonState>>;
        buttonevents: Array<Rx.Subject<VEButtonEventType>>;
        axisstates: Array<Rx.Subject<VSAxisState>>;
        axisevents: Array<Rx.Subject<VSAxisDirLevelChange>>;
        
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

            this.axisstates = new Array<Rx.Subject<VSAxisState>>();
            this.axisevents = new Array<Rx.Subject<VSAxisDirLevelChange>>();
            for( let i = 0 ; i < VEAxisType.Size ; i++ ) {
                let index = i;
                this.axisstates.push( new Rx.Subject<VSAxisState>() );
                this.axisevents.push( new Rx.Subject<VSAxisDirLevelChange>() );

                this.axisstates[index].map( ( state: VSAxisState )=>{
                    let dis = Math.sqrt(state.x * state.x + state.y * state.y);
                    let level = VSAxisLevel.NotPush;
                    if( dis < 0.15 ) {
                        level = VSAxisLevel.NotPush;
                    } else if( dis < 0.85 ) {
                        level = VSAxisLevel.HalfPush;
                    } else {
                        level = VSAxisLevel.FullPush;
                    }

                    let dir = VSAxisDir.N;
                    if( Math.abs(state.x) < 0.2 ) {
                        if( state.y <= 0 ) {
                            dir = VSAxisDir.N;
                        } else {
                            dir = VSAxisDir.S;
                        }
                    } else if( Math.abs(state.y) < 0.2 ) {
                        if( state.x >= 0 ) {
                            dir = VSAxisDir.E;
                        } else {
                            dir = VSAxisDir.W;
                        }
                    } else {
                        if( state.x > 0 ) {
                            if( state.y < 0 ) {
                                dir = VSAxisDir.NE;
                            } else {
                                dir = VSAxisDir.SE;
                            }
                        } else {
                            if( state.y < 0 ) {
                                dir = VSAxisDir.NW;
                            } else {
                                dir = VSAxisDir.SW;
                            }
                        }
                    }

                    return {
                        level: level,
                        dir: dir,
                    };
                } ).distinctUntilChanged( (x: VSAxisDirLevelChange , y: VSAxisDirLevelChange)=>{
                    if( x.level == VSAxisLevel.NotPush && y.level == VSAxisLevel.NotPush ){
                        return true;
                    } else {
                        return (x.level == y.level) && (x.dir == y.dir);
                    }
                } ).subscribe( ( val: VSAxisDirLevelChange )=>{
                    this.axisevents[index].next(val);
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
                for( let i = 0 ; i < VEAxisType.Size ; i++ ) {
                    this.axisstates[i].next({
                        x: gamepad.axes[i*2+0],
                        y: gamepad.axes[i*2+1],
                    })
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
        TrackStateAxis(axis:VEAxisType): Rx.Observable<VSAxisState> {
            return this.axisstates[axis];
        }
        TrackEventAxis(axis:VEAxisType): Rx.Observable<VSAxisDirLevelChange> {
            return this.axisevents[axis];
        }
    }
    
    class VGamepadsCollector implements IVGamepadsCollector {
        gamepads: Array<VGamepad>;
        buttonevents: Array<Rx.Subject<[VEButtonEventType, IVGamepad]>>;
        axisevents: Array<Rx.Subject<[VSAxisDirLevelChange, IVGamepad]>>;
    
        constructor(){
            this.gamepads = new Array<VGamepad>();
            this.buttonevents = new Array<Rx.Subject<[VEButtonEventType, IVGamepad]>>();
            for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                this.buttonevents.push(new Rx.Subject<[VEButtonEventType, IVGamepad]>());
            }
            this.axisevents = new Array<Rx.Subject<[VSAxisDirLevelChange, IVGamepad]>>();
            for( let i = 0 ; i < VEAxisType.Size ; i++ ) {
                this.axisevents.push(new Rx.Subject<[VSAxisDirLevelChange, IVGamepad]>());
            }
    
            const gc$ = Rx.Observable.fromEvent(window, "gamepadconnected");
            gc$.subscribe( ( evt: GamepadEvent )=>{
                if( evt.gamepad.buttons.length == VEButtonType.Size && evt.gamepad.axes.length == VEAxisType.Size * 2 ) {
                    this.gamepads.push(new VGamepad(evt.gamepad.index));
                    let gpindex = this.gamepads.length - 1;
                    for( let i = 0 ; i < VEButtonType.Size ; i++ ) {
                        this.gamepads[gpindex].TrackEventButton(i).subscribe((et: VEButtonEventType)=>{
                            this.buttonevents[i].next([et,this.gamepads[gpindex]]);
                        });
                    }
                    for( let i = 0 ; i < VEAxisType.Size ; i++ ) {
                        this.gamepads[gpindex].TrackEventAxis(i).subscribe((et: VSAxisDirLevelChange)=>{
                            this.axisevents[i].next([et,this.gamepads[gpindex]]);
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

        TrackEventAxis(axis:VEAxisType, evttype:VSAxisDirLevelChange): Rx.Observable<IVGamepad> {
            let rt = new Rx.Subject<IVGamepad>(); 
            this.axisevents[axis].subscribe((val: [VSAxisDirLevelChange, IVGamepad])=>{
                if(val[0].dir == evttype.dir && val[0].level == evttype.level) {
                    rt.next(val[1]);
                }
            });
            return rt;
        }
    }

    export var gamepadCollector: IVGamepadsCollector = new VGamepadsCollector();
}

export { GamepadsCollector }