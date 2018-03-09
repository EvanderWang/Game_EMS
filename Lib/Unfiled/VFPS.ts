class VFPS {
    oldtime: Date;
    canvas: CanvasRenderingContext2D;
    constructor(){
        this.oldtime = new Date();
        let showplace = <HTMLCanvasElement>document.getElementById("FPS");
        if(!showplace){
            let sp = document.createElement("canvas");
            sp.id = "FPS";
            sp.setAttribute("style", "position: absolute;left: 0;top: 0;margin: 0px;z-index: 10;width: 100px;height: 50px;");
            sp.setAttribute("width", "100"); 
            sp.setAttribute("height", "50"); 
            document.body.appendChild(sp);
            showplace = sp;
        }
        this.canvas = showplace.getContext("2d");
        this.canvas.font="20px Verdana";
        this.canvas.fillStyle = "#ffffff";
    }

    onRender(){
        let newtime = new Date();
        let msdur = newtime.getTime() - this.oldtime.getTime();
        let fps = 1000 / msdur;
        this.oldtime = newtime;
        this.canvas.clearRect(0,0,100,100);
        
        this.canvas.fillText("FPS:"+ Math.round(fps).toString(), 10, 30);
    }
}

export { VFPS }