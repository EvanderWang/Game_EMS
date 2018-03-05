import { matrix } from "../Math/matrix";
import { vector } from "../Math/vector";
import { VGUID } from "../Std/guid";

module irender {
    export interface IVGpuRes {
        delete: () => void;
    }

    export enum VEDepthFuncParam {
        NEVER,
        LESS,
        EQUAL,
        LEQUAL,
        GREATER,
        NOTEQUAL,
        GEQUAL,
        ALWAYS,
        DISABLE,
    }

    export enum VEBlendFuncParam {
        ZERO,
        ONE,
        SRC_COLOR,
        DST_COLOR,
        ONE_MINUS_SRC_COLOR,
        ONE_MINUS_DST_COLOR,
        SRC_ALPHA,
        DST_ALPHA,
        ONE_MINUS_SRC_ALPHA,
        ONE_MINUS_DST_ALPHA,
        CONSTANT_COLOR,
        CONSTANT_ALPHA,
        ONE_MINUS_CONSTANT_COLOR,
        ONE_MINUS_CONSTANT_ALPHA,
        SRC_ALPHA_SATURATE,
        DISABLE,
    }

    export enum VECullFaceParam {
        FRONT,
        BACK,
        FRONT_AND_BACK,
        DISABLE,
    }

    export enum VEPolygonOffsetParam {
        ENABLE,
    }

    export interface IVProgramRenderer {
        setUniformMat4: (pos: WebGLUniformLocation, dat: matrix.VMat4) => void;
        setUniformVec2: (pos: WebGLUniformLocation, dat: vector.VFVector2) => void;
        setUniformVec3: (pos: WebGLUniformLocation, dat: vector.VFVector3) => void;
        setUniformVec3I: (pos: WebGLUniformLocation, dat: vector.VNVector3UI) => void;
        setUniformVec4: (pos: WebGLUniformLocation, dat: vector.VFVector4) => void;
        setUniformFloat: (pos: WebGLUniformLocation, dat: number) => void;
        // ...
        setAttributeVF3: (pos: GLint, data: IVBuffer) => void;
        setAttributeVF2: (pos: GLint, data: IVBuffer) => void;
        // ...
        clearAttribute: (pos: GLint) => void;

        setTexture: (pos: WebGLUniformLocation, tex: IVTexture2D) => void;

        renderTriIndex: (buf: IVIndexBuffer, count?: number) => void;
        renderLinestripIndex: (buf: IVIndexBuffer, count?: number) => void;

        setDepthFunc: (df: VEDepthFuncParam) => void;
        setBlendFunc: (sf: VEBlendFuncParam, df: VEBlendFuncParam) => void;
        setCullFace: (cf: VECullFaceParam) => void;
        setPolygonOffset: (pf: VEPolygonOffsetParam) => void;
    }

    export interface IVRenderTool {
        setProgram: (p: IVProgram, prRecv: (pr: IVProgramRenderer) => void) => void;
    }

    export interface IVSceneRenderer {
        render: (tool: IVRenderTool) => void;
    }

    export interface IVScene { // Lower Left Base
        setViewport: (x: number, y: number, width: number, height: number) => void;
        setViewportPercent: (xper: number, yper: number, wper: number, hper: number) => void;
        setClearColor: (r: number, g: number, b: number, a: number) => void;
        setClearDepth: (depth: number) => void;

        setRenderer: (renderer: IVSceneRenderer | null) => void;
        dirty: () => void;
    }

    export interface IVMouseEvt {
        x: number;
        y: number;
    }

    export interface IVWheelEvt {
        deltY: number;
    }

    export interface IVMouseKeyboardListener { // 此处需要修改，考虑自定义消息类型? 或者派发过去由Listener再行转换. 不过基本原则上需要进行位置估计，例如多手指不全在此区域比较麻烦，需思考
        onLeftUp: (evt: IVMouseEvt) => void;
        onLeftDown: (evt: IVMouseEvt) => void;
        onRightUp: (evt: IVMouseEvt) => void;
        onRightDown: (evt: IVMouseEvt) => void;
        onMove: (evt: IVMouseEvt) => void;
        onLeftClick: (evt: IVMouseEvt) => void;
        onRightClick: (evt: IVMouseEvt) => void;
        onDoubleClick: (evt: IVMouseEvt) => void;
        onWheel: (evt: IVWheelEvt) => void;
        onEnter: () => void;
        onLeave: () => void;
        onHover: (evt: IVMouseEvt) => void;
    }

    export interface IVTouchListener {
        // need add
    }

    export interface IVGamepadsListener {
        // need add
    }

    export interface IVMessageScene extends IVScene {
        setListener: (listener: IVMouseKeyboardListener | IVTouchListener | IVGamepadsListener | null) => void;
    }

    export interface IVRenderTarget {
        width: number;
        height: number;
        render: () => void;
    }

    export interface IVDefaultRenderTarget extends IVRenderTarget {
        listenResize: ( onresizeRender: ( (width:number, height:number) => void ) | null) => void;
        createScene: () => IVMessageScene;
    }

    export interface IVNewRenderTarget extends IVRenderTarget, IVGpuRes {
        useColorTexture: (count: number) => IVTexture2D[];
        useDepthTexture: () => IVTexture2D;
        createScene: () => IVScene;

        getPixels: () => Float32Array;
        getPixelColorUI: (pt: vector.VNVector2UI) => vector.VNVector3UI | null;
        resize: (width: number, height: number) => void;
    }

    export interface IVProgram extends IVGpuRes{
        getUnifromPos: (name: string) => WebGLUniformLocation | null;
        getAttributePos: (name: string) => GLint | null;
    }

    export interface IVBuffer extends IVGpuRes {
        //byteLength: number;
        changeBuf: (bufData: ArrayBuffer) => void;
    }

    export interface IVIndexBuffer extends IVGpuRes {
        //byteLength: number;
    }

    export interface IVTexture2D extends IVGpuRes {
        width: number;
        height: number;
    }

    //export interface IVRenderBuffer extends IVBuffer {
    //    width: number;
    //    height: number;
    //}

    export interface IVRenderContext {
        defaultRenderTarget: IVDefaultRenderTarget;
        createRenderTarget: (width: number, height: number) => IVNewRenderTarget;
        createProgram: (vertexShaderData: string, fragmentShaderData: string) => IVProgram;
        createBuffer: (bufData: ArrayBuffer) => IVBuffer;
        createIndex: (bufData: Uint32Array) => IVIndexBuffer;
        createTexture: (width: number, height: number, texData: Float32Array) => IVTexture2D;
        createTextureImage: (pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => IVTexture2D;

        resize: (width: number, height: number) => void;
        sync: () => void;

        delete: () => void;
    }
}

export { irender }