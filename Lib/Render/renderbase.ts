import { irender } from "./irender";
import { map } from "../../Base/std/map";
import { VGUID } from "../../Base/std/guid";
import { matrix } from "../../Base/math/matrix";
import { vector } from "../../Base/math/vector";

module renderbase {
    class VImpMngr<IT, T extends IT> {
        list: Array<T>;

        constructor() {
            this.list = new Array<T>();
        }

        record(t: T): IT {
            this.list.push(t);
            return t;
        }

        check(it: IT): T | null {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] == <T>it) {
                    return this.list[i];
                }
            }
            return null;
        }

        remove(t: T) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] == t) {
                    this.list.splice(i, 1);
                    return;
                }
            }
        }
    }

    class VExtensionChecker {
        enabledExtensions: Array<string>;

        constructor(private gl: WebGLRenderingContext) {
            let exts = gl.getSupportedExtensions();
            if (exts != null) {
                this.enabledExtensions = exts;
            }
        }

        tryuseExtension(ext: string): boolean | any {
            for (let i in this.enabledExtensions) {
                if (this.enabledExtensions[i] == ext) {
                    return this.gl.getExtension(ext);
                }
            }
            console.error("do not support need extension : " + ext + " !");
            return false;
        }
    }
    var extChecker: VExtensionChecker;
    
    class VBuffer implements irender.IVBuffer {
        byteLength: number;
        buffer: WebGLBuffer;

        constructor(private gl: WebGLRenderingContext, bufData: ArrayBuffer, private mngr: VImpMngr<irender.IVBuffer, VBuffer>) {
            this.buffer = <WebGLBuffer>gl.createBuffer();
            this.byteLength = bufData.byteLength;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufData, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteBuffer(this.buffer);
        }

        changeBuf(bufData: ArrayBuffer) {
            this.byteLength = bufData.byteLength;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, bufData, this.gl.DYNAMIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
    }

    class VIndexBuffer implements irender.IVIndexBuffer {
        byteLength: number;
        count: number;
        buffer: WebGLBuffer;

        constructor(private gl: WebGLRenderingContext, bufData: Uint32Array, private mngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>) {
            this.buffer = <WebGLBuffer>gl.createBuffer();
            this.byteLength = bufData.byteLength;
            this.count = bufData.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufData, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteBuffer(this.buffer);
        }

        changeBuf(bufData: Uint32Array) {
            this.byteLength = bufData.byteLength;
            this.count = bufData.length;
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, bufData, this.gl.DYNAMIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    class VTexture2D implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, w: number, h: number, texData: Float32Array, private mngr: VImpMngr<irender.IVTexture2D, VTexture2D>) {
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, texData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteTexture(this.texture);
        }
    }

    class VTextureImage2D implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, image: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, private mngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>) {
            this.width = image.width;
            this.height = image.height;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteTexture(this.texture);
        }
    }

    class VProgramRenderer implements irender.IVProgramRenderer {
        curusedtexpos = 0;
        texturePosToActivePos: map.Map<WebGLUniformLocation, number>;

        constructor(private gl: WebGLRenderingContext
            , private program: WebGLProgram
            , private bufMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , private idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , private texMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , private texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
        ) {
            this.texturePosToActivePos = new map.Map<WebGLUniformLocation, number>();
            this.initState();
        }

        private initState() {
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.depthMask(true);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
        }

        private renderIndex(glRenderType: number, buf: irender.IVIndexBuffer, count?: number) {
            let buffer = this.idxMngr.check(buf);
            if (buffer != null) {
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
                this.gl.drawElements(glRenderType, count == undefined ? buffer.count : count, this.gl.UNSIGNED_INT, 0);
                if (this.gl.getError() != 0) {
                    console.error("WebGL error occour.");
                }
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            } else {
                console.error("use createIndex() function from VRenderContext please.");
            }
            this.initState();
        }

        renderTriIndex(buf: irender.IVIndexBuffer, count?: number) {
            this.renderIndex(this.gl.TRIANGLES, buf, count);
        }

        renderLinestripIndex(buf: irender.IVIndexBuffer, count?: number) {
            this.renderIndex(this.gl.LINE_STRIP, buf, count);
        }



        setUniformMat4(pos: WebGLUniformLocation, dat: matrix.VMat4) {
            this.gl.uniformMatrix4fv(pos, false, dat.transpose().toFloat32Array());
        }

        setUniformFloat(pos: WebGLUniformLocation, dat: number) {
            this.gl.uniform1f(pos, dat);
        }

        setUniformVec2(pos: WebGLUniformLocation, dat: vector.VFVector2) {
            this.gl.uniform2f(pos, dat.x, dat.y);
        }

        setUniformVec3(pos: WebGLUniformLocation, dat: vector.VFVector3) {
            this.gl.uniform3f(pos, dat.x, dat.y, dat.z);
        }

        setUniformVec4(pos: WebGLUniformLocation, dat: vector.VFVector4) {
            this.gl.uniform4f(pos, dat.x, dat.y, dat.z, dat.w);
        }

        setUniformVec3I(pos: WebGLUniformLocation, dat: vector.VNVector3UI) {
            this.gl.uniform3i(pos, dat.x, dat.y, dat.z);
        }

        setUniformTexture(pos: WebGLUniformLocation, tex: irender.IVTexture2D) {
            let texture: WebGLTexture | null = null;
            let texture2D = this.texMngr.check(tex);
            if (texture2D != null) {
                texture = texture2D.texture;
            } else {
                let textureImg2D = this.texImgMngr.check(tex);
                if (textureImg2D != null) {
                    texture = textureImg2D.texture;
                } else {
                    let textureFBOC = this.fboColorTexMngr.check(tex);
                    if (textureFBOC != null) {
                        texture = textureFBOC.texture;
                    } else {
                        let textureFBOD = this.fboDepthTexMngr.check(tex);
                        if (textureFBOD != null) {
                            texture = textureFBOD.texture;
                        }
                    }
                }
            }

            if (texture != null) {
                let activePos: number = -1;
                if (this.texturePosToActivePos.has(pos)) {
                    activePos = <number>this.texturePosToActivePos.get(pos);
                } else if (this.curusedtexpos < this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) {
                    activePos = this.curusedtexpos;
                    this.texturePosToActivePos.set(pos, this.curusedtexpos);
                    this.curusedtexpos += 1;
                } else {
                    console.error("active texture too many.");
                }
                this.gl.activeTexture(this.gl.TEXTURE0 + activePos);
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                this.gl.uniform1i(pos, activePos);
            } else {
                console.error("use createTexture() function from VRenderContext please.");
            }
        }



        setAttributeVF1(pos: GLint, data: irender.IVBuffer) {
            let buf = this.bufMngr.check(data);
            if (buf != null) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf.buffer);
                this.gl.enableVertexAttribArray(pos);
                this.gl.vertexAttribPointer(pos, 1, this.gl.FLOAT, false, 4 * 1, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            } else {
                console.error("use createBuffer() function from VRenderContext please.");
            }
        }

        setAttributeVF2(pos: GLint, data: irender.IVBuffer) {
            let buf = this.bufMngr.check(data);
            if (buf != null) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf.buffer);
                this.gl.enableVertexAttribArray(pos);
                this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 4 * 2, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            } else {
                console.error("use createBuffer() function from VRenderContext please.");
            }
        }

        setAttributeVF3(pos: GLint, data: irender.IVBuffer) {
            let buf = this.bufMngr.check(data);
            if (buf != null) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf.buffer);
                this.gl.enableVertexAttribArray(pos);
                this.gl.vertexAttribPointer(pos, 3, this.gl.FLOAT, false, 4 * 3, 0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            } else {
                console.error("use createBuffer() function from VRenderContext please.");
            }
        }

        clearAttribute(pos: GLint) {
            this.gl.disableVertexAttribArray(pos);
        }



        setDepthFunc(df: irender.VEDepthFuncParam) {
            let param = this.switchDepthFuncParam(df);
            if (param == -1) {
                this.gl.disable(this.gl.DEPTH_TEST);
            }
            else
                this.gl.depthFunc(param);
        }

        private switchDepthFuncParam(df: irender.VEDepthFuncParam): number {
            switch (df) {
                case irender.VEDepthFuncParam.NEVER:
                    return this.gl.NEVER; 
                case irender.VEDepthFuncParam.LESS:
                    return this.gl.LESS;
                case irender.VEDepthFuncParam.EQUAL:
                    return this.gl.EQUAL;
                case irender.VEDepthFuncParam.LEQUAL:
                    return this.gl.LEQUAL;
                case irender.VEDepthFuncParam.GREATER:
                    return this.gl.GREATER;
                case irender.VEDepthFuncParam.NOTEQUAL:
                    return this.gl.NOTEQUAL;
                case irender.VEDepthFuncParam.GEQUAL:
                    return this.gl.GEQUAL;
                case irender.VEDepthFuncParam.ALWAYS:
                    return this.gl.ALWAYS;
                default:
                    return -1;
            }
        }

        setDepthMask(mask: boolean) {
            this.gl.depthMask(mask);
        }

        setBlendFunc(sf: irender.VEBlendFuncParam, df: irender.VEBlendFuncParam) {
            let sparam = this.switchBlendFuncParam(sf);
            let dparam = this.switchBlendFuncParam(df);
            if (sparam == -1 || dparam == -1) {
                this.gl.disable(this.gl.BLEND);
            }
            else
                this.gl.blendFunc(sparam, dparam);
        }

        private switchBlendFuncParam(sf: irender.VEBlendFuncParam): number {
            switch (sf) {
                case irender.VEBlendFuncParam.ZERO:
                    return this.gl.ZERO;
                case irender.VEBlendFuncParam.ONE:
                    return this.gl.ONE;
                case irender.VEBlendFuncParam.SRC_COLOR:
                    return this.gl.SRC_COLOR;
                case irender.VEBlendFuncParam.DST_COLOR:
                    return this.gl.DST_COLOR;
                case irender.VEBlendFuncParam.ONE_MINUS_SRC_COLOR:
                    return this.gl.ONE_MINUS_SRC_COLOR;
                case irender.VEBlendFuncParam.ONE_MINUS_DST_COLOR:
                    return this.gl.ONE_MINUS_DST_COLOR;
                case irender.VEBlendFuncParam.SRC_ALPHA:
                    return this.gl.SRC_ALPHA;
                case irender.VEBlendFuncParam.DST_ALPHA:
                    return this.gl.DST_ALPHA;
                case irender.VEBlendFuncParam.ONE_MINUS_SRC_ALPHA:
                    return this.gl.ONE_MINUS_SRC_ALPHA;
                case irender.VEBlendFuncParam.ONE_MINUS_DST_ALPHA:
                    return this.gl.ONE_MINUS_DST_ALPHA;
                case irender.VEBlendFuncParam.CONSTANT_COLOR:
                    return this.gl.CONSTANT_COLOR;
                case irender.VEBlendFuncParam.CONSTANT_ALPHA:
                    return this.gl.CONSTANT_ALPHA;
                case irender.VEBlendFuncParam.ONE_MINUS_CONSTANT_COLOR:
                    return this.gl.ONE_MINUS_CONSTANT_COLOR;
                case irender.VEBlendFuncParam.ONE_MINUS_CONSTANT_ALPHA:
                    return this.gl.ONE_MINUS_CONSTANT_ALPHA;
                case irender.VEBlendFuncParam.SRC_ALPHA_SATURATE:
                    return this.gl.SRC_ALPHA_SATURATE;
                default:
                    return -1;
            }
        }

        setCullFace(cf: irender.VECullFaceParam) {
            switch (cf) {
                case irender.VECullFaceParam.BACK:
                    this.gl.cullFace(this.gl.BACK);
                    break;
                case irender.VECullFaceParam.FRONT:
                    this.gl.cullFace(this.gl.FRONT);
                    break;
                case irender.VECullFaceParam.FRONT_AND_BACK:
                    this.gl.cullFace(this.gl.FRONT_AND_BACK);
                    break;
                default:
                    this.gl.disable(this.gl.CULL_FACE);
                    break;
            }
        }

        setPolygonOffset(pf: irender.VEPolygonOffsetParam) {
            if (pf == irender.VEPolygonOffsetParam.ENABLE) {
                this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
                this.gl.polygonOffset(-2, -2);
            } else if (pf == irender.VEPolygonOffsetParam.DISABLE) {
                this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
            }
        }
    }

    class VProgram implements irender.IVProgram {
        program: WebGLProgram;
        vs: WebGLShader;
        fs: WebGLShader;

        constructor(private gl: WebGLRenderingContext, vsData: string, fsData: string, private mngr: VImpMngr<irender.IVProgram, VProgram>) {
            this.vs = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
            this.fs = <WebGLShader>gl.createShader(gl.FRAGMENT_SHADER);
            this.complieShader(this.vs, vsData);
            this.complieShader(this.fs, fsData);
            this.program = <WebGLProgram>gl.createProgram();
            gl.attachShader(this.program, this.vs);
            gl.attachShader(this.program, this.fs);
            gl.linkProgram(this.program);
            let linksuc = <GLboolean>gl.getProgramParameter(this.program, gl.LINK_STATUS);
            if (!linksuc) {
                console.error("link program errrrrr:\n");
                console.error(this.gl.getProgramInfoLog(this.program));
                console.error(vsData);
                console.error(fsData);
            }
            // safari must not detach & delete shader here
            mngr.record(this);
        }

        complieShader(shader: WebGLShader, data: string) {
            this.gl.shaderSource(shader, data);
            this.gl.compileShader(shader);
            let compliesuc = <GLboolean>this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
            if (!compliesuc) {
                console.error("complie shader errrrrr:\n");
                console.error(this.gl.getShaderInfoLog(shader));
                console.error(data);
            }
        }

        delete() {
            this.mngr.remove(this);
            this.gl.detachShader(this.program, this.vs);
            this.gl.detachShader(this.program, this.fs);
            this.gl.deleteShader(this.vs);
            this.gl.deleteShader(this.fs);
            this.gl.deleteProgram(this.program);
        }

        getUnifromPos(name: string): WebGLUniformLocation | null{
            return this.gl.getUniformLocation(this.program, name);
        }

        getAttributePos(name: string): GLint | null {
            return this.gl.getAttribLocation(this.program, name);
        }
    }

    class VRenderTool implements irender.IVRenderTool {
        constructor(private gl: WebGLRenderingContext
            , private programMngr: VImpMngr<irender.IVProgram, VProgram>
            , private bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , private idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , private texMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , private texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
        ) {}

        setProgram(p: irender.IVProgram, prRecv: (pr: irender.IVProgramRenderer) => void) {
            let curProgram = this.programMngr.check(p);
            if (curProgram == null) {
                console.error("use createProgram() function from VRenderContext please.")
            } else {
                this.gl.useProgram(curProgram.program);
                prRecv(new VProgramRenderer(this.gl, curProgram.program, this.bufferMngr, this.idxMngr, this.texMngr, this.texImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr));
            }
        }
    }

    class VBoard implements irender.IVBoard {
        renderer: irender.IVBoardRenderer | null;
        x: number;
        y: number;
        w: number;
        h: number;
        usePercent: boolean;
        R: number;
        G: number;
        B: number;
        A: number;
        depth: number;
        layer: number;
        mDirty: boolean;

        constructor(private gl: WebGLRenderingContext
            , private ParentWidth: number
            , private ParentHeight: number
            , private renderTool: VRenderTool
        ) {
            this.renderer = null;
            this.usePercent = false;
            this.mDirty = false;
            this.x = 0;
            this.y = 0;
            this.w = ParentWidth;
            this.h = ParentHeight;
            this.R = 0.0;
            this.G = 0.0;
            this.B = 0.0;
            this.A = 1.0;
            this.depth = 1.0;
        }

        private calXYWH(): [number,number,number,number] {
            let rx = this.x;
            let ry = this.y;
            let rw = this.w;
            let rh = this.h;
            if (this.usePercent) {
                rx = this.x * this.ParentWidth;
                ry = this.y * this.ParentHeight;
                rw = this.w * this.ParentWidth;
                rh = this.h * this.ParentHeight;
            }
            return [rx, ry, rw, rh];
        }

        setParentSize(width: number, height: number) {
            this.ParentWidth = width;
            this.ParentHeight = height;
        }

        render() {
            if (this.mDirty && this.renderer) {
                this.mDirty = false;
                let rywh = this.calXYWH();
                
                this.gl.scissor(rywh[0], rywh[1], rywh[2], rywh[3]);
                this.gl.viewport(rywh[0], rywh[1], rywh[2], rywh[3]);
                this.gl.clearColor(this.R, this.G, this.B, this.A);
                this.gl.clearDepth(this.depth);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

                this.renderer.render(this.renderTool);
            }
        }

        setRenderer(renderer: irender.IVBoardRenderer | null) {
            this.renderer = renderer;
        }

        setViewport(x: number, y: number, width: number, height: number) {
            this.usePercent = false;
            this.x = x;
            this.y = y;
            this.w = width;
            this.h = height;
        }

        setViewportPercent(xper: number, yper: number, wper: number, hper: number) {
            this.usePercent = true;
            this.x = xper;
            this.y = yper;
            this.w = wper;
            this.h = hper;
        }

        setClearColor(r: number, g: number, b: number, a: number) {
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }

        setClearDepth(depth: number) {
            this.depth = depth;
        }

        setLayer(layer: number) {
            this.layer = layer;
        }

        dirty() {
            this.mDirty = true;
        }

        posAt(parentpos: irender.VSGlPos): irender.VSGlPos | null {
            let rywh = this.calXYWH();

            if (parentpos.x >= rywh[0] && parentpos.x < (rywh[0] + rywh[2]) && parentpos.y >= rywh[1] && parentpos.y < (rywh[1] + rywh[3])) {
                let rtValue = new irender.VSGlPos();
                rtValue.x = parentpos.x - rywh[0];
                rtValue.y = parentpos.y - rywh[1];
                return rtValue;
            } else {
                return null;
            }
        }
    }

    class VColorAttachment implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, w: number, h: number,private mngr: VImpMngr<irender.IVTexture2D, VColorAttachment>) {
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, this.gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteTexture(this.texture);
        }

        resize(width: number, height: number) {
            this.width = width;
            this.height = height;

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.FLOAT, null);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    class VDepthAttachment implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, w: number, h: number,private mngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>) {
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, w, h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
            mngr.record(this);
        }

        delete() {
            this.mngr.remove(this);
            this.gl.deleteTexture(this.texture);
        }

        resize(width: number, height: number) {
            this.width = width;
            this.height = height;

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, width, height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }

    class VDefaultRenderTarget implements irender.IVRenderTarget {
        boardList: Array<VBoard>;

        constructor(private gl: WebGLRenderingContext
            , public width: number
            , public height: number
            , private renderTool: VRenderTool
        ) {
            this.boardList = new Array<VBoard>();
        }

        private sortboard() {
            this.boardList.sort((a: VBoard, b: VBoard) => { return a.layer - b.layer; });
        }

        render() {
            window.requestAnimationFrame(() => {
                this.sortboard();

                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                for (let i = 0; i < this.boardList.length; i++) {
                    this.boardList[i].render();
                }
            });
        }

        clean(rgba:[number,number,number,number] = [1,1,1,1]) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.scissor(0, 0, this.width, this.height);
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }

        createBoard(): irender.IVBoard {
            let rtValue = new VBoard(this.gl, this.width, this.height, this.renderTool);
            this.boardList.push(rtValue);
            return rtValue;
        }

        deleteBoard(board: irender.IVBoard) {
            for (let i = 0; i < this.boardList.length; i++) {
                if (this.boardList[i] === board) {
                    this.boardList = this.boardList.splice(i, 1);
                    return;
                }
            }
        }

        calPos(pos: irender.VSGlPos): [irender.IVBoard, irender.VSGlPos] | null {
            this.sortboard();

            for (let i = 0; i < this.boardList.length; i++) {
                let subpos = this.boardList[i].posAt(pos);
                if (subpos) {
                    return [this.boardList[i], subpos];
                }
            }

            return null;
        }

        changeSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            for (let i = 0; i < this.boardList.length; i++) {
                this.boardList[i].setParentSize(width, height);
                this.boardList[i].dirty();
            }
        }

        getPixels(): Float32Array {
            let rtValue = new Float32Array(this.width * this.height * 4);

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.FLOAT, rtValue);

            return rtValue;
        }

        getPixelColorUI(pt: irender.VSGlPos): vector.VNVector3UI | null {
            if (pt.x >= this.width || pt.y >= this.height || pt.x < 0 || pt.y < 0)
                return null;

            let rtValue = new Float32Array(4);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.readPixels(pt.x, pt.y, 1, 1, this.gl.RGBA, this.gl.FLOAT, rtValue);

            return new vector.VFVector3(Math.round(rtValue[0] * 255), Math.round(rtValue[1] * 255), Math.round(rtValue[2] * 255));
        }
    }

    class VFBORenderTarget implements irender.IVOffscreenRenderTarget {
        fbo: WebGLFramebuffer;
        colorTextureArray: VColorAttachment[];
        depthTexture: VDepthAttachment;
        drawBuffers: number[];
        boardList: Array<VBoard>;
        
        constructor(private gl: WebGLRenderingContext
            , private ext_WEBGL_draw_buffers: any
            , public width: number
            , public height: number
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
            , private renderTool: VRenderTool
        ) {
            this.boardList = new Array<VBoard>();
            this.fbo = <WebGLFramebuffer>gl.createFramebuffer();
            this.colorTextureArray = new Array<VColorAttachment>();
            this.drawBuffers = new Array<number>();
            this.useColorTexture(1);
            this.depthTexture = new VDepthAttachment(gl, width, height, fboDepthTexMngr);
            gl.bindTexture(gl.TEXTURE_2D, this.depthTexture.texture);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture.texture, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        private sortboard() {
            this.boardList.sort((a: VBoard, b: VBoard) => { return a.layer - b.layer; });
        }

        render() {
            this.sortboard();

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.ext_WEBGL_draw_buffers.drawBuffersWEBGL(this.drawBuffers);
            for (let i = 0; i < this.boardList.length; i++) {
                this.boardList[i].render();
            }
        }

        clean(rgba: [number, number, number, number] = [1, 1, 1, 1]) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.scissor(0, 0, this.width, this.height);
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }

        createBoard(): irender.IVBoard {
            let rtValue = new VBoard(this.gl, this.width, this.height, this.renderTool);
            this.boardList.push(rtValue);
            return rtValue;
        }

        deleteBoard(board: irender.IVBoard) {
            for (let i = 0; i < this.boardList.length; i++) {
                if (this.boardList[i] === board) {
                    this.boardList = this.boardList.splice(i, 1);
                    return;
                }
            }
        }

        delete() {
            for (let i = 0; i < this.colorTextureArray.length; i++) {
                this.colorTextureArray[i].delete();
            }
            this.depthTexture.delete();
            this.gl.deleteFramebuffer(this.fbo);
        }

        calPos(pos: irender.VSGlPos): [irender.IVBoard, irender.VSGlPos] | null {
            this.sortboard();

            for (let i = 0; i < this.boardList.length; i++) {
                let subpos = this.boardList[i].posAt(pos);
                if (subpos) {
                    return [this.boardList[i], subpos];
                }
            }

            return null;
        }

        getPixels(): Float32Array {
            let rtValue = new Float32Array(this.width * this.height * 4);

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.FLOAT, rtValue);
            return rtValue;
        }

        getPixelColorUI(pt: vector.VNVector2UI): vector.VNVector3UI | null {
            if (pt.x >= this.width || pt.y >= this.height)
                return null;

            let rtValue = new Float32Array(4);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.readPixels(pt.x, pt.y, 1, 1, this.gl.RGBA, this.gl.FLOAT, rtValue);
            return new vector.VFVector3(Math.round(rtValue[0] * 255), Math.round(rtValue[1] * 255), Math.round(rtValue[2] * 255));
        }

        useColorTexture(count: number): irender.IVTexture2D[] {
            if (this.colorTextureArray.length >= count) {
                let rtValue = new Array<irender.IVTexture2D>();
                for (let i = 0; i < count; i++) {
                    rtValue.push(this.colorTextureArray[i]);
                }
                return rtValue;
            }

            for (let i = 0; i < this.colorTextureArray.length; i++) {
                this.colorTextureArray[i].delete();
            }
            this.colorTextureArray.splice(0, this.colorTextureArray.length);
            this.drawBuffers.splice(0, this.drawBuffers.length);
            for (let i = 0; i < count; i++) {
                let colorTexture = new VColorAttachment(this.gl, this.width, this.height, this.fboColorTexMngr);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
                this.gl.bindTexture(this.gl.TEXTURE_2D, colorTexture.texture);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext_WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL + i, this.gl.TEXTURE_2D, colorTexture.texture, 0);
                this.drawBuffers.push(this.ext_WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL + i);
                this.colorTextureArray.push(colorTexture);
            }
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            return this.colorTextureArray;
        }

        useDepthTexture(): irender.IVTexture2D {
            return this.depthTexture;
        }

        resize(width: number, height: number) {
            this.width = width;
            this.height = height;

            for (let i = 0; i < this.colorTextureArray.length; i++) {
                this.colorTextureArray[i].resize(width, height);
            }
            this.depthTexture.resize(width, height);

            for (let i = 0; i < this.boardList.length; i++) {
                this.boardList[i].setParentSize(width, height);
                this.boardList[i].dirty();
            }
        }
    }

    export class VRenderContext implements irender.IVRenderContext {
        gl: WebGLRenderingContext;
        defaultRenderTarget: VDefaultRenderTarget;
        bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>;
        indexMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>;
        programMngr: VImpMngr<irender.IVProgram, VProgram>;
        textureMngr: VImpMngr<irender.IVTexture2D, VTexture2D>;
        textureImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
        fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>;
        fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>;
        renderTool: VRenderTool;

        constructor(private renderElem: HTMLCanvasElement) {
            renderElem.width = renderElem.clientWidth;
            renderElem.height = renderElem.clientHeight;
            renderElem.style.width = renderElem.clientWidth.toString() + "px";
            renderElem.style.height = renderElem.clientHeight.toString() + "px";
            renderElem.oncontextmenu = () => { return false; }

            let webgl = renderElem.getContext('experimental-webgl', { preserveDrawingBuffer: true });
            if (webgl == null)
                webgl = renderElem.getContext('webgl', { preserveDrawingBuffer: true });
            if (webgl != null) {
                this.gl = webgl;
                extChecker = new VExtensionChecker(this.gl);
                if (this.CheckState())
                {
                    this.bufferMngr = new VImpMngr<irender.IVBuffer, VBuffer>();
                    this.indexMngr = new VImpMngr<irender.IVIndexBuffer, VIndexBuffer>();
                    this.programMngr = new VImpMngr<irender.IVProgram, VProgram>();
                    this.textureMngr = new VImpMngr<irender.IVTexture2D, VTexture2D>();
                    this.textureImgMngr = new VImpMngr<irender.IVTexture2D, VTextureImage2D>();
                    this.fboColorTexMngr = new VImpMngr<irender.IVTexture2D, VColorAttachment>();
                    this.fboDepthTexMngr = new VImpMngr<irender.IVTexture2D, VDepthAttachment>();
                    this.renderTool = new VRenderTool(this.gl, this.programMngr, this.bufferMngr, this.indexMngr, this.textureMngr, this.textureImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr);

                    this.gl.enable(this.gl.SCISSOR_TEST);
                    this.defaultRenderTarget = new VDefaultRenderTarget(this.gl, renderElem.clientWidth, renderElem.clientHeight, this.renderTool);

                    return;
                }
            } 

            console.error("Browser can not use this render base system.");
        }

        private CheckState(): boolean {
            let ext_OES_texture_float = extChecker.tryuseExtension("OES_texture_float");
            let ext_OES_texture_float_linear = extChecker.tryuseExtension('OES_texture_float_linear');
            let ext_OES_element_index_uint = extChecker.tryuseExtension("OES_element_index_uint");

            return (ext_OES_texture_float != null)
                && (ext_OES_texture_float_linear != null)
                && (ext_OES_element_index_uint != null);
        }

        createRenderTarget(width: number, height: number): irender.IVOffscreenRenderTarget | null {
            let ext_WEBGL_draw_buffers = extChecker.tryuseExtension("WEBGL_draw_buffers");
            let ext_WEBGL_depth_texture = extChecker.tryuseExtension('WEBGL_depth_texture');

            if (ext_WEBGL_draw_buffers != null && ext_WEBGL_depth_texture != null)
            {
                return new VFBORenderTarget(this.gl, ext_WEBGL_draw_buffers, width, height, this.fboColorTexMngr, this.fboDepthTexMngr, this.renderTool);
            } else {
                return null;
            }
        }

        createProgram(vertexShaderData: string, fragmentShaderData: string): irender.IVProgram {
            return new VProgram(this.gl, vertexShaderData, fragmentShaderData, this.programMngr);
        }

        createBuffer(bufData: ArrayBuffer): irender.IVBuffer {
            return new VBuffer(this.gl, bufData, this.bufferMngr);
        }

        createIndex(bufData: Uint32Array): irender.IVIndexBuffer {
            return new VIndexBuffer(this.gl, bufData, this.indexMngr);
        }

        createTexture(width: number, height: number, texData: Float32Array): irender.IVTexture2D{
            return new VTexture2D(this.gl, width, height, texData, this.textureMngr);
        }

        createTextureImage(image: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) :irender.IVTexture2D{
            return new VTextureImage2D(this.gl, image, this.textureImgMngr);
        }

        sync() {
            this.gl.flush();
            this.gl.finish();
        }

        delete() {
            for (let i = 0; i < this.bufferMngr.list.length; i++) {
                this.bufferMngr.list[i].delete();
            }
            for (let i = 0; i < this.indexMngr.list.length; i++) {
                this.indexMngr.list[i].delete();
            }
            for (let i = 0; i < this.textureMngr.list.length; i++) {
                this.textureMngr.list[i].delete();
            }
            for (let i = 0; i < this.textureImgMngr.list.length; i++) {
                this.textureImgMngr.list[i].delete();
            }
            for (let i = 0; i < this.fboColorTexMngr.list.length; i++) {
                this.fboColorTexMngr.list[i].delete();
            }
            for (let i = 0; i < this.fboDepthTexMngr.list.length; i++) {
                this.fboDepthTexMngr.list[i].delete();
            }
            for (let i = 0; i < this.programMngr.list.length; i++) {
                this.programMngr.list[i].delete();
            }
        }

        resize(width: number, height: number) {
            this.renderElem.width = width;
            this.renderElem.height = height;
            this.renderElem.style.width = width.toString() + "px";
            this.renderElem.style.height = height.toString() + "px";
            this.defaultRenderTarget.changeSize(width, height);
        }
    }
}

export { renderbase }