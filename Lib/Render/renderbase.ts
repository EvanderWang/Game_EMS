import { irender } from "./irender";
import { VGUID } from "../Std/guid";
import { matrix } from "../Math/matrix";
import { vector } from "../Math/vector";

module renderbase {
    class VPos {
        v: boolean;
        x: number;
        y: number;
    }

    function isPowerOf2(value: number) {
        return (value & (value - 1)) == 0;
    }

    class VExtensionChecker {
        enabledExtensions: Array<string>;

        constructor(private gl: WebGLRenderingContext) {
            let exts = gl.getSupportedExtensions();
            if (exts != null) {
                this.enabledExtensions = exts;
                //for (let i in this.enabledExtensions) {
                //    gl.getExtension(this.enabledExtensions[i]);
                //}
            }
        }

        alertCheck(ext: string): any {
            for (let i in this.enabledExtensions) {
                if (this.enabledExtensions[i] == ext) {
                    return this.gl.getExtension(ext);
                }
            }
            console.error("do not support need extension : " + ext + " !");
        }
    }
    var extChecker: VExtensionChecker;

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
    }

    class VTexture2D implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, w: number, h: number, texData: Float32Array, private mngr: VImpMngr<irender.IVTexture2D, VTexture2D>) {
            //extChecker.alertCheck('OES_texture_float');
            //extChecker.alertCheck('OES_texture_float_linear');
            let halfFloat = extChecker.alertCheck('OES_texture_half_float');
            extChecker.alertCheck('OES_texture_half_float_linear');
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, halfFloat.HALF_FLOAT_OES, texData);
            //if (this.width == this.height && isPowerOf2(this.width) && isPowerOf2(this.height)) {
            //    gl.generateMipmap(gl.TEXTURE_2D);
            //} else {
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //}
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
            //extChecker.alertCheck("OES_texture_float");
            //extChecker.alertCheck('OES_texture_float_linear');
            let halfFloat = extChecker.alertCheck('OES_texture_half_float');
            extChecker.alertCheck('OES_texture_half_float_linear');
            this.width = image.width;
            this.height = image.height;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, halfFloat.HALF_FLOAT_OES, image);
            //if (this.width == this.height && isPowerOf2(this.width) && isPowerOf2(this.height)) {
            //    gl.generateMipmap(gl.TEXTURE_2D);
            //} else {
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //}
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
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
        }

        private renderIndex(glRenderType: number, buf: irender.IVIndexBuffer, count?: number) {
            extChecker.alertCheck("OES_element_index_uint");
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

        setUniformVec2(pos: WebGLUniformLocation, dat: vector.VFVector2) {
            this.gl.uniform2f(pos, dat.x, dat.y);
        }

        setUniformVec3(pos: WebGLUniformLocation, dat: vector.VFVector3) {
            this.gl.uniform3f(pos, dat.x, dat.y, dat.z);
        }

        setUniformVec3I(pos: WebGLUniformLocation, dat: vector.VNVector3UI) {
            this.gl.uniform3f(pos, dat.x/255, dat.y/255, dat.z/255);
        }

        setUniformVec4(pos: WebGLUniformLocation, dat: vector.VFVector4) {
            this.gl.uniform4f(pos, dat.x, dat.y, dat.z, dat.w);
        }

        setUniformFloat(pos: WebGLUniformLocation, dat: number) {
            this.gl.uniform1f(pos, dat);
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

        clearAttribute(pos: GLint) {
            this.gl.disableVertexAttribArray(pos);
        }

        setTexture(pos: WebGLUniformLocation, tex: irender.IVTexture2D) {
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
                    activePos = this.texturePosToActivePos.get(pos);
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

        setDepthFunc(df: irender.VEDepthFuncParam) {
            let param = this.switchDepthFuncParam(df);
            if (param == -1) {
                this.gl.disable(this.gl.DEPTH_TEST);
            }
            else
                this.gl.depthFunc(param);
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

        setBlendFunc(sf: irender.VEBlendFuncParam, df: irender.VEBlendFuncParam) {
            let sparam = this.switchBlendFuncParam(sf);
            let dparam = this.switchBlendFuncParam(df);
            if (sparam == -1 || dparam == -1) {
                this.gl.disable(this.gl.BLEND);
            }
            else
                this.gl.blendFunc(sparam, dparam);
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
        curProgram: VProgram | null;

        constructor(private gl: WebGLRenderingContext
            , private programMngr: VImpMngr<irender.IVProgram, VProgram>
            , private bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , private idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , private texMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , private texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
        ) {
            this.curProgram = null;
        }

        setProgram(p: irender.IVProgram, prRecv: (pr: irender.IVProgramRenderer) => void) {
            this.curProgram = this.programMngr.check(p);
            if (this.curProgram == null) {
                console.error("use createProgram() function from VRenderContext please.")
            } else {
                this.gl.useProgram(this.curProgram.program);
                prRecv(new VProgramRenderer(this.gl, this.curProgram.program, this.bufferMngr, this.idxMngr, this.texMngr, this.texImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr));
            }
        }
    }

    class VScene implements irender.IVMessageScene {
        renderer: irender.IVSceneRenderer | null;
        x: number;
        y: number;
        w: number;
        h: number;
        usePercent: boolean;
        R: number;
        G: number;
        B: number;
        A: number;
        depth: number
        tool: VRenderTool;
        mDirty: boolean;
        listener: irender.IVMouseKeyboardListener | irender.IVTouchListener | irender.IVGamepadsListener | null;

        constructor(private gl: WebGLRenderingContext, private frameWidth: number, private frameHeight: number
            , programMngr: VImpMngr<irender.IVProgram, VProgram>
            , bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , textureMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
        ) {
            this.renderer = null;
            this.listener = null;
            this.usePercent = false;
            this.mDirty = false;
            this.x = 0;
            this.y = 0;
            this.w = frameWidth;
            this.h = frameHeight;
            this.R = 0.0;
            this.G = 0.0;
            this.B = 0.0;
            this.A = 1.0;
            this.depth = 1.0;
            this.tool = new VRenderTool(gl, programMngr, bufferMngr, idxMngr, textureMngr, texImgMngr, fboColorTexMngr, fboDepthTexMngr);
        }

        setSize(width: number, height: number) {
            this.frameWidth = width;
            this.frameHeight = height;
        }

        render() {
            if (this.mDirty) {
                let rx = this.x;
                let ry = this.y;
                let rw = this.w;
                let rh = this.h;
                if (this.usePercent) {
                    rx = this.x * this.frameWidth;
                    ry = this.y * this.frameHeight;
                    rw = this.w * this.frameWidth;
                    rh = this.h * this.frameHeight;
                }
                this.gl.scissor(rx, ry, rw, rh);
                this.gl.viewport(rx, ry, rw, rh);
                this.gl.clearColor(this.R, this.G, this.B, this.A);
                this.gl.clearDepth(this.depth);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                if (this.renderer != null) {
                    this.renderer.render(this.tool);
                }

                this.mDirty = false;
            }
            
        }

        setRenderer(renderer: irender.IVSceneRenderer | null) {
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

        dirty() {
            this.mDirty = true;
        }

        private dispatchCheck(evt: VPos): VPos{
            let rx = this.x;
            let ry = this.y;
            let rw = this.w;
            let rh = this.h;
            if (this.usePercent) {
                rx = this.x * this.frameWidth;
                ry = this.y * this.frameHeight;
                rw = this.w * this.frameWidth;
                rh = this.h * this.frameHeight;
            }

            if (evt.x >= rx && evt.x < rx + rw && evt.y >= ry && evt.y < ry + rh) {
                return { v: true, x: evt.x - rx, y: evt.y - ry };
            } else {
                return { v: false, x: 0, y: 0 };
            }
        }

        dispatchLeave() {
            if (this.listener != null) {
                (<irender.IVMouseKeyboardListener>this.listener).onLeave();
            }
        }

        dispatchMove(evt: irender.IVMouseEvt) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck({ v: true, x: evt.x, y: evt.y });
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onMove({ x: dispatched.x, y: dispatched.y });
                } 
            }
        }

        dispatchLeftDown(evt: irender.IVMouseEvt) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck({ v: true, x: evt.x, y: evt.y });
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onLeftDown({ x: dispatched.x, y: dispatched.y });
                }
            }
        }

        dispatchLeftUp(evt: irender.IVMouseEvt) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck({ v: true, x: evt.x, y: evt.y });
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onLeftUp({ x: dispatched.x, y: dispatched.y });
                }
            }
        }

        dispatchRightDown(evt: irender.IVMouseEvt) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck({ v: true, x: evt.x, y: evt.y });
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onRightDown({ x: dispatched.x, y: dispatched.y });
                }
            }
        }

        dispatchRightUp(evt: irender.IVMouseEvt) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck({ v: true, x: evt.x, y: evt.y });
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onRightUp({ x: dispatched.x, y: dispatched.y });
                }
            }
        }

        dispatchWheel(evt: irender.IVWheelEvt, pos: VPos) {
            if (this.listener != null) {
                let dispatched = this.dispatchCheck(pos);
                if (dispatched.v) {
                    (<irender.IVMouseKeyboardListener>this.listener).onWheel(evt);
                }
            }
        }

        setListener(listener: irender.IVMouseKeyboardListener | irender.IVTouchListener | irender.IVGamepadsListener | null) {
            this.listener = listener;
        }
    }

    class VColorAttachment implements irender.IVTexture2D {
        width: number;
        height: number;
        texture: WebGLTexture;

        constructor(private gl: WebGLRenderingContext, w: number, h: number,private mngr: VImpMngr<irender.IVTexture2D, VColorAttachment>) {
            extChecker.alertCheck('OES_texture_float');
            extChecker.alertCheck('OES_texture_float_linear');
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, this.gl.FLOAT, null);
            if (isPowerOf2(this.width) && isPowerOf2(this.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
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
            extChecker.alertCheck('WEBGL_depth_texture');
            this.width = w;
            this.height = h;
            this.texture = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, w, h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            if (isPowerOf2(this.width) && isPowerOf2(this.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
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

    class VDefaultRenderTarget implements irender.IVDefaultRenderTarget {
        width: number;
        height: number;
        sceneList: Array<VScene>;
        onresize: ((width: number, height: number) => void ) | null; 

        oldtouchList: TouchList | null = null;
        moving: boolean = false;

        constructor(private gl: WebGLRenderingContext
            , private programMngr: VImpMngr<irender.IVProgram, VProgram>
            , private bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , private idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , private textureMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , private texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
            , private canvas: HTMLCanvasElement
        ) {
            this.width = gl.drawingBufferWidth;
            this.height = gl.drawingBufferHeight;
            this.sceneList = new Array<VScene>();
            this.onresize = null;

            canvas.addEventListener("mousedown", (ev: MouseEvent) => {
                let pos = this.calMouseEvent(ev);
                if (ev.button == 0) {
                    this.dispatchMouseEvt(VScene.prototype.dispatchLeftDown, pos);
                } else if (ev.button == 2) {
                    this.dispatchMouseEvt(VScene.prototype.dispatchRightDown, pos);
                }
                this.stopPropagation(ev);
            });
            canvas.addEventListener("mouseup", (ev: MouseEvent) => {
                let pos = this.calMouseEvent(ev);
                if (ev.button == 0) {
                    this.dispatchMouseEvt(VScene.prototype.dispatchLeftUp, pos);
                } else if (ev.button == 2) {
                    this.dispatchMouseEvt(VScene.prototype.dispatchRightUp, pos);
                }
                this.stopPropagation(ev);
            });
            canvas.addEventListener("mousemove", (ev: MouseEvent) => {
                let pos = this.calMouseEvent(ev);
                this.dispatchMouseEvt(VScene.prototype.dispatchMove, pos);
                this.stopPropagation(ev);
            });
            canvas.addEventListener("mousewheel", (ev: WheelEvent) => {
                let pos = this.calMouseEvent(ev);
                this.dispatchWheelEvt(VScene.prototype.dispatchWheel, { deltY: ev.deltaY }, pos);
                this.stopPropagation(ev);
            });
            canvas.addEventListener("mouseleave", (ev: MouseEvent) => {
                this.dispatchNoneEvt(VScene.prototype.dispatchLeave);
                this.stopPropagation(ev);
            });

            canvas.addEventListener("touchstart", (ev: TouchEvent) => {
                ev.preventDefault();
                this.onMessageTouch(ev);
                this.stopPropagation(ev);
            });

            canvas.addEventListener("touchmove", (ev: TouchEvent) => {
                ev.preventDefault();
                this.onMessageTouch(ev);
                this.stopPropagation(ev);
            });
            canvas.addEventListener("touchend", (ev: TouchEvent) => {
                ev.preventDefault();
                this.onMessageTouch(ev, true);
                this.stopPropagation(ev);
            });
            canvas.addEventListener("touchcancel", (ev: TouchEvent) => {
                ev.preventDefault();
                this.onMessageTouch(ev, true);
                this.stopPropagation(ev);
            });
        }

        private stopPropagation(ev: Event) {
            if (document.all) {  //只有ie识别
                ev.cancelBubble = true;//阻止冒泡
                ev.returnValue = false;//阻止默认事件
            } else {
                ev.stopPropagation();//阻止冒泡
                ev.preventDefault();//阻止默认事件
            }
        }

        createScene(): irender.IVMessageScene {
            let rtValue = new VScene(this.gl, this.width, this.height, this.programMngr, this.bufferMngr, this.idxMngr, this.textureMngr, this.texImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr);
            this.sceneList.push(rtValue);
            return rtValue;
        }

        render() {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            for (let i = 0; i < this.sceneList.length; i++) {
                this.sceneList[i].render();
            }
        }

        changeSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            for (let i = 0; i < this.sceneList.length; i++) {
                this.sceneList[i].setSize(width, height);
            }
            if (this.onresize != null) {
                this.onresize(this.width, this.height);
            }
        }

        calMouseEvent(evt: MouseEvent) : VPos {
            let mx = evt.offsetX;//evt.clientX - this.canvas.getBoundingClientRect().left;
            let my = this.canvas.getBoundingClientRect().height - evt.offsetY;//this.canvas.getBoundingClientRect().bottom - evt.clientY;
            return { v: true, x: mx, y: my };
        }

        calTouchEvent(evt: Touch): VPos {
            let mx = evt.clientX - this.canvas.getBoundingClientRect().left;
            let my = this.canvas.getBoundingClientRect().bottom - evt.clientY;
            return { v: true, x: mx, y: my };
        }

        dispatchNoneEvt(func: () => void) {
            for (let i = 0; i < this.sceneList.length; i++) {
                func.call(this.sceneList[i]);
            }
        }

        dispatchMouseEvt(func: (evt: irender.IVMouseEvt) => void, evt: irender.IVMouseEvt) {
            for (let i = 0; i < this.sceneList.length; i++) {
                func.call(this.sceneList[i], { x: evt.x, y: evt.y });
            }
        }

        dispatchWheelEvt(func: (evt: irender.IVWheelEvt, pos: VPos) => void, evt: irender.IVWheelEvt, pos: VPos) {
            for (let i = 0; i < this.sceneList.length; i++) {
                func.call(this.sceneList[i], evt, pos);
            }
        }
        
        onMessageTouch(evt: TouchEvent, cancel: boolean = false) {
            if (cancel) {
                if (this.oldtouchList != null) {
                    let pos = this.calTouchEvent(this.oldtouchList[0]);
                    this.dispatchMouseEvt(VScene.prototype.dispatchLeftUp, pos);
                    this.dispatchMouseEvt(VScene.prototype.dispatchRightUp, pos);
                }
                this.moving = false;
                this.oldtouchList = null;
            } else {
                let newtouchList = evt.touches;
                if (newtouchList.length == 1) {
                    let pos = this.calTouchEvent(evt.touches[0]);
                    if (this.oldtouchList != null) {
                        this.dispatchMouseEvt(VScene.prototype.dispatchMove, pos);
                    } else {
                        this.dispatchMouseEvt(VScene.prototype.dispatchLeftDown, pos);
                    }
                } else if (newtouchList.length >= 2) {
                    if (this.oldtouchList != null) {
                        let pos = this.calTouchEvent(this.oldtouchList[0]);
                        this.dispatchMouseEvt(VScene.prototype.dispatchLeftUp, pos);
                    }

                    if (this.oldtouchList == null) {
                    } else if (this.oldtouchList.length == 1) {
                        let pos = this.calTouchEvent(evt.touches[0]);
                        this.dispatchMouseEvt(VScene.prototype.dispatchLeftUp, pos);
                    } else {
                        let oldpos1 = this.calTouchEvent(this.oldtouchList[0]);
                        let oldpos2 = this.calTouchEvent(this.oldtouchList[1]);
                        let newpos1 = this.calTouchEvent(evt.touches[0]);
                        let newpos2 = this.calTouchEvent(evt.touches[1]);
                        let deltx1 = newpos1.x - oldpos1.x;
                        let deltx2 = newpos2.x - oldpos2.x;
                        let delty1 = newpos1.y - oldpos1.y;
                        let delty2 = newpos2.y - oldpos2.y;

                        if ((deltx1 * deltx2 < 0) || (delty1 * delty2 < 0)) {
                            this.moving = false;
                            this.dispatchMouseEvt(VScene.prototype.dispatchRightUp, oldpos1);
                            let delt = 0.02;
                            let oldx = oldpos2.x - oldpos1.x;
                            let oldy = oldpos2.y - oldpos1.y;
                            let oldlen = oldx * oldx + oldy * oldy;
                            let newx = newpos2.x - newpos1.x;
                            let newy = newpos2.y - newpos1.y;
                            let newlen = newx * newx + newy * newy;
                            if (newlen > oldlen) {
                                delt *= -1;
                            }
                            this.dispatchWheelEvt(VScene.prototype.dispatchWheel, { deltY: delt }, oldpos1);
                        } else {
                            if (this.moving == false) {
                                this.moving = true;
                                this.dispatchMouseEvt(VScene.prototype.dispatchRightDown, newpos1);
                            } else {
                                this.dispatchMouseEvt(VScene.prototype.dispatchMove, newpos1);
                            }
                        }
                    }
                }
                this.oldtouchList = newtouchList;
            }
        }

        listenResize(onresizeRender: (width: number, height: number) => void | null) {
            this.onresize = onresizeRender;
        }
    }

    class VFBORenderTarget implements irender.IVNewRenderTarget {
        width: number;
        height: number;
        fbo: WebGLFramebuffer;
        colorTextureArray: VColorAttachment[];
        depthTexture: VDepthAttachment;
        drawBuffers: number[];
        sceneList: Array<VScene>;
        
        constructor(private gl: WebGLRenderingContext, w: number, h: number
            , private programMngr: VImpMngr<irender.IVProgram, VProgram>
            , private bufferMngr: VImpMngr<irender.IVBuffer, VBuffer>
            , private idxMngr: VImpMngr<irender.IVIndexBuffer, VIndexBuffer>
            , private textureMngr: VImpMngr<irender.IVTexture2D, VTexture2D>
            , private texImgMngr: VImpMngr<irender.IVTexture2D, VTextureImage2D>
            , private fboColorTexMngr: VImpMngr<irender.IVTexture2D, VColorAttachment>
            , private fboDepthTexMngr: VImpMngr<irender.IVTexture2D, VDepthAttachment>
        ) {
            this.width = w;
            this.height = h;
            this.sceneList = new Array<VScene>();
            this.fbo = <WebGLFramebuffer>gl.createFramebuffer();
            this.colorTextureArray = new Array<VColorAttachment>();
            this.drawBuffers = new Array<number>();
            this.useColorTexture(1);
            this.depthTexture = new VDepthAttachment(gl, w, h, fboDepthTexMngr);
            gl.bindTexture(gl.TEXTURE_2D, this.depthTexture.texture);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture.texture, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        delete() {
            for (let i = 0; i < this.colorTextureArray.length; i++) {
                this.colorTextureArray[i].delete();
            }
            this.depthTexture.delete();
            this.gl.deleteFramebuffer(this.fbo);
        }

        createScene(): irender.IVScene {
            let rtValue = new VScene(this.gl, this.width, this.height, this.programMngr, this.bufferMngr, this.idxMngr, this.textureMngr, this.texImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr);
            this.sceneList.push(rtValue);
            return rtValue;
        }

        useColorTexture(count: number): irender.IVTexture2D[] {
            if (this.colorTextureArray.length >= count) {
                let rtValue = new Array<irender.IVTexture2D>();
                for (let i = 0; i < count; i++) {
                    rtValue.push(this.colorTextureArray[i]);
                }
                return rtValue;
            }

            let ext = extChecker.alertCheck("WEBGL_draw_buffers");

            if (ext != null) {
                for (let i = 0; i < this.colorTextureArray.length; i++) {
                    this.colorTextureArray[i].delete();
                }
                this.colorTextureArray.splice(0, this.colorTextureArray.length);
                this.drawBuffers.splice(0, this.drawBuffers.length);
                for (let i = 0; i < count; i++) {
                    let colorTexture = new VColorAttachment(this.gl, this.width, this.height, this.fboColorTexMngr);
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, colorTexture.texture);
                    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, this.gl.TEXTURE_2D, colorTexture.texture, 0);
                    this.drawBuffers.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
                    this.colorTextureArray.push(colorTexture);
                }
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                return this.colorTextureArray;
            }
            else
                return [];
        }

        useDepthTexture(): irender.IVTexture2D {
            return this.depthTexture;
        }

        render() {
            let ext = extChecker.alertCheck("WEBGL_draw_buffers");
            if (ext != null) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
                ext.drawBuffersWEBGL(this.drawBuffers);
                for (let i = 0; i < this.sceneList.length; i++) {
                    this.sceneList[i].render();
                }
            }
        }

        resize(width: number, height: number) {
            this.width = width;
            this.height = height;

            for (let i = 0; i < this.colorTextureArray.length; i++) {
                this.colorTextureArray[i].resize(width, height);
            }
            this.depthTexture.resize(width, height);

            for (let i = 0; i < this.sceneList.length; i++) {
                this.sceneList[i].setSize(width, height);
                this.sceneList[i].dirty();
            }
        }

        getPixels(): Float32Array {
            let rtValue = new Float32Array(this.width * this.height * 4);

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.FLOAT, rtValue);
            return rtValue;
        }

        getPixelColorUI(pt: vector.VNVector2UI): vector.VNVector3UI | null{
            if (pt.x >= this.width || pt.y >= this.height)
                return null;

            let rtValue = new Float32Array(4);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
            this.gl.readPixels(pt.x, pt.y, 1, 1, this.gl.RGBA, this.gl.FLOAT, rtValue);
            return new vector.VFVector3(Math.round(rtValue[0] * 255), Math.round(rtValue[1] * 255), Math.round(rtValue[2] * 255));
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

        constructor(private renderElem: HTMLCanvasElement, width: number, height: number) {
            renderElem.width = width;
            renderElem.height = height;
            renderElem.style.width = width.toString() + "px";
            renderElem.style.height = height.toString() + "px";

            let webgl = renderElem.getContext('webgl', { preserveDrawingBuffer: true });
            if (webgl == null)
                webgl = renderElem.getContext('experimental-webgl', { preserveDrawingBuffer: true });
            if (webgl != null) {
                this.bufferMngr = new VImpMngr<irender.IVBuffer, VBuffer>();
                this.indexMngr = new VImpMngr<irender.IVIndexBuffer, VIndexBuffer>();
                this.textureMngr = new VImpMngr<irender.IVTexture2D, VTexture2D>();
                this.textureImgMngr = new VImpMngr<irender.IVTexture2D, VTextureImage2D>();
                this.fboColorTexMngr = new VImpMngr<irender.IVTexture2D, VColorAttachment>();
                this.fboDepthTexMngr = new VImpMngr<irender.IVTexture2D, VDepthAttachment>();
                this.programMngr = new VImpMngr<irender.IVProgram, VProgram>();
                this.gl = webgl;
                this.initState();
                extChecker = new VExtensionChecker(this.gl);
                this.defaultRenderTarget = new VDefaultRenderTarget(this.gl, this.programMngr, this.bufferMngr, this.indexMngr, this.textureMngr, this.textureImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr, renderElem);
            }
            else {
                console.error("can not get context from :" + renderElem.nodeName);
            }

            //window.addEventListener('resize', () => {
            //    renderElem.width = renderElem.clientWidth;
            //    renderElem.height = renderElem.clientHeight;
            //    this.defaultRenderTarget.changeSize(renderElem.width, renderElem.height);
            //});

            renderElem.oncontextmenu = () => { return false; }
        }

        private initState() {
            this.gl.enable(this.gl.SCISSOR_TEST);
        }

        createRenderTarget(width: number, height: number): irender.IVNewRenderTarget {
            return new VFBORenderTarget(this.gl, width, height, this.programMngr, this.bufferMngr, this.indexMngr, this.textureMngr, this.textureImgMngr, this.fboColorTexMngr, this.fboDepthTexMngr);
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

        resize(width: number, height: number) {
            this.renderElem.width = width;
            this.renderElem.height = height;
            this.renderElem.style.width = width.toString() + "px";
            this.renderElem.style.height = height.toString() + "px";
            this.defaultRenderTarget.changeSize(this.renderElem.width, this.renderElem.height);
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
    }
}

export { renderbase }