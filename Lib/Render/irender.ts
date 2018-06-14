import { matrix } from "../Math/matrix";
import { vector } from "../Math/vector";

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
        DISABLE,
    }

    export interface IVProgramRenderer {
        setUniformMat4: (pos: WebGLUniformLocation, dat: matrix.VMat4) => void;
        setUniformFloat: (pos: WebGLUniformLocation, dat: number) => void;
        setUniformVec2: (pos: WebGLUniformLocation, dat: vector.VFVector2) => void;
        setUniformVec3: (pos: WebGLUniformLocation, dat: vector.VFVector3) => void;
        setUniformVec4: (pos: WebGLUniformLocation, dat: vector.VFVector4) => void;
        setUniformVec3I: (pos: WebGLUniformLocation, dat: vector.VNVector3UI) => void;
        setUniformTexture: (pos: WebGLUniformLocation, tex: IVTexture2D) => void;
        // ...

        setAttributeVF1: (pos: GLint, data: IVBuffer) => void;
        setAttributeVF2: (pos: GLint, data: IVBuffer) => void;
        setAttributeVF3: (pos: GLint, data: IVBuffer) => void;
        
        clearAttribute: (pos: GLint) => void;
        // ...

        renderTriIndex: (buf: IVIndexBuffer, count?: number) => void;
        renderLinestripIndex: (buf: IVIndexBuffer, count?: number) => void;

        setDepthFunc: (df: VEDepthFuncParam) => void;
        setDepthMask: (mask: boolean) => void;
        setBlendFunc: (sf: VEBlendFuncParam, df: VEBlendFuncParam) => void;
        setCullFace: (cf: VECullFaceParam) => void;
        setPolygonOffset: (pf: VEPolygonOffsetParam) => void;
    }

    export interface IVRenderTool {
        setProgram: (p: IVProgram, prRecv: (pr: IVProgramRenderer) => void) => void;
    }

    export interface IVBoardRenderer {
        render: (tool: IVRenderTool) => void;
    }

    export interface IVBoard { // Lower Left Base
        setViewport: (x: number, y: number, width: number, height: number) => void;
        setViewportPercent: (xper: number, yper: number, wper: number, hper: number) => void;
        setClearColor: (r: number, g: number, b: number, a: number) => void;
        setClearDepth: (depth: number) => void;
        setLayer: (layer: number) => void;

        setRenderer: (renderer: IVBoardRenderer | null) => void;
        dirty: () => void;
    }

    export class VSGlPos { // Lower Left Base
        x: number;
        y: number;
    }

    export interface IVRenderTarget {
        width: number;
        height: number;

        render: () => void;
        clean: (rgba ?: [number, number, number, number]) => void;

        createBoard: () => IVBoard;
        deleteBoard: (board: IVBoard) => void;

        calPos: (pos: VSGlPos) => [IVBoard, VSGlPos] | null;

        getPixels: () => Float32Array;
        getPixelColorUI: (pt: VSGlPos) => vector.VNVector3UI | null;
    }

    export interface IVOffscreenRenderTarget extends IVRenderTarget, IVGpuRes {
        useColorTexture: (count: number) => IVTexture2D[];
        useDepthTexture: () => IVTexture2D;

        resize: (width: number, height: number) => void;
    }

    export interface IVProgram extends IVGpuRes {
        getUnifromPos: (name: string) => WebGLUniformLocation | null;
        getAttributePos: (name: string) => GLint | null;
    }

    export interface IVBuffer extends IVGpuRes {
        changeBuf: (bufData: ArrayBuffer) => void;
    }

    export interface IVIndexBuffer extends IVGpuRes {
        changeBuf: (bufData: Uint32Array) => void;
    }

    export interface IVTexture2D extends IVGpuRes {
        width: number;
        height: number;
    }

    export interface IVRenderContext extends IVGpuRes {
        defaultRenderTarget: IVRenderTarget;
        createRenderTarget: (width: number, height: number) => IVOffscreenRenderTarget | null;
        createProgram: (vertexShaderData: string, fragmentShaderData: string) => IVProgram;
        createBuffer: (bufData: ArrayBuffer) => IVBuffer;
        createIndex: (bufData: Uint32Array) => IVIndexBuffer;
        createTexture: (width: number, height: number, texData: Float32Array) => IVTexture2D;
        createTextureImage: (pixels: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => IVTexture2D;

        resize: (width: number, height: number) => void;
        sync: () => void;
    }
}

export { irender }