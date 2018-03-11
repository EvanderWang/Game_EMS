import * as Rx from "../../Third/RxJS_AMD/Rx";
import * as RxObserver from "../../Third/RxJS_AMD/Observer";
import * as RxObservable from "../../Third/RxJS_AMD/Observable";
import * as RxSubScription from "../../Third/RxJS_AMD/Subscription";

class VAnimationFrameObserver implements RxSubScription.AnonymousSubscription {
    constructor(private observerOrNext: RxObserver.PartialObserver<void> | ((value: void) => void),private parent: VAnimationFrameSubscribable){}

    passnext(){
        if( typeof( this.observerOrNext ) == "function" ){
            this.observerOrNext(undefined);
        } else {
            this.observerOrNext.next(undefined);
        }
    }

    unsubscribe(){
        this.parent.onchildUnsubscribe(this);
    }
}


class VAnimationFrameSubscribable implements RxObservable.Subscribable<void> {
    subscribers: Array<VAnimationFrameObserver>;

    constructor() {
        this.subscribers = new Array<VAnimationFrameObserver>();
        Rx.Subject.create();
    }

    next () {
        for(let i = 0 ; i < this.subscribers.length ; i++){
            this.subscribers[i].passnext();
        }
        this.recheck();
    }
    
    subscribe(observerOrNext?: RxObserver.PartialObserver<void> | ((value: void) => void), error?: (error: any) => void, complete?: () => void): RxSubScription.AnonymousSubscription {
        let rtValue = new VAnimationFrameObserver(observerOrNext , this);
        this.subscribers.push(rtValue);
        this.recheck();
        return rtValue;
    }

    onchildUnsubscribe(child: VAnimationFrameObserver){
        for(let i = 0 ; i < this.subscribers.length ; i++){
            if( this.subscribers[i] == child ){
                this.subscribers.splice(i, 1);
                break;
            }
        }
        this.recheck();
    }

    private recheck(){
        if( this.subscribers.length > 0 ){
            window.requestAnimationFrame(()=>{ this.next(); });
        }
    }
}

export var globalAnimationFrameSubscribable : RxObservable.Subscribable<void> = new VAnimationFrameSubscribable();