import { vector } from "./vector";
import { ubit } from "./ubit";

module mesh {
    export class VSSimpleGraph {
        vertLength: number;
        triangleLength: number;
        triangleBuffer: Uint32Array;

        constructor(vl: number, tl: number, tb: Uint32Array) {
            this.vertLength = vl;
            this.triangleLength = tl;
            this.triangleBuffer = tb;
        }
    }

    export class VSSimpleMesh {
        vertLength: number;
        vertBuffer: Float32Array;
        triangleLength: number;
        triangleBuffer: Uint32Array;

        constructor(vl: number, vb: Float32Array, tl: number, tb: Uint32Array) {
            this.vertLength = vl;
            this.vertBuffer = vb;
            this.triangleLength = tl;
            this.triangleBuffer = tb;
        }
    }

    export class VSTriBuf {
        triangleLength: number;
        triangleBuffer: Uint32Array;

        constructor(tl: number, tb: Uint32Array) {
            this.triangleLength = tl;
            this.triangleBuffer = tb;
        }
    }

    export class VSVertBuf {
        vertLength: number;
        vertBuffer: Float32Array;

        constructor(vl: number, vb: Float32Array) {
            this.vertLength = vl;
            this.vertBuffer = vb;
        }
    }

    export class VVBCtrller {
        static Get(vertBuffer: Float32Array, idx: number): vector.VFVector3 {
            return new vector.VFVector3(vertBuffer[idx * 3 + 0], vertBuffer[idx * 3 + 1], vertBuffer[idx * 3 + 2]);
        }

        static GetArray(vertBuffer: Float32Array, idx: number): number[] {
            return [vertBuffer[idx * 3 + 0], vertBuffer[idx * 3 + 1], vertBuffer[idx * 3 + 2]];
        }

        static Set(vertBuffer: Float32Array, idx: number, val: vector.VFVector3): boolean {
            if (idx * 3 < vertBuffer.length) {
                vertBuffer[idx * 3 + 0] = val.x;
                vertBuffer[idx * 3 + 1] = val.y;
                vertBuffer[idx * 3 + 2] = val.z;
                return true;
            }
            return false;
        }
    }

    export class VTBCtrller {
        static Get(triBuffer: Uint32Array, idx: number): vector.VNVector3UI {
            return new vector.VFVector3(triBuffer[idx * 3 + 0], triBuffer[idx * 3 + 1], triBuffer[idx * 3 + 2]);
        }

        static GetArray(triBuffer: Uint32Array, idx: number): number[] {
            return [triBuffer[idx * 3 + 0], triBuffer[idx * 3 + 1], triBuffer[idx * 3 + 2]];
        }

        static Set(triBuffer: Uint32Array, idx: number, val: vector.VNVector3UI): boolean {
            if (idx * 3 < triBuffer.length) {
                triBuffer[idx * 3 + 0] = val.x;
                triBuffer[idx * 3 + 1] = val.y;
                triBuffer[idx * 3 + 2] = val.z;
                return true;
            }
            return false;
        }
    }

    export class VSVertInfo {
        edgeCount   : number;
        edgeOffset  : number;
        surfCount   : number;
        surfOffset  : number;

        constructor() {
            this.edgeCount = 0;
            this.edgeOffset = 0;
            this.surfCount = 0;
            this.surfOffset = 0;
        }
    }

    export class VSSurfInfo {
        edge: vector.VNVector3UI;
        idxInVertNbr: vector.VNVector3UI;
        idxInEdgeNbr: vector.VNVector3UI;

        constructor() {
            this.edge = new vector.VFVector3();
            this.idxInVertNbr = new vector.VFVector3();
            this.idxInEdgeNbr = new vector.VFVector3();
        }
    }

    export class VSEdgeInfo {
        vert: vector.VNVector2UI;
        nbrSurf: vector.VNVector2UI;
        idxInSurf: vector.VNVector2UI;

        constructor() {
            this.vert = new vector.VFVector2();
            this.nbrSurf = new vector.VFVector2();
            this.idxInSurf = new vector.VFVector2();
        }
    }

    export class VSSurfRef {
        crd: number;
        pre: number;
        nxt: number;
        idx: number;

        constructor() {
            this.crd = ubit.VD_INVALID_INDEX;
            this.pre = ubit.VD_INVALID_INDEX;
            this.nxt = ubit.VD_INVALID_INDEX;
            this.idx = ubit.VD_INVALID_INDEX;
        }
    }

    export class VSEdgeRef {
        crd: number;
        idx: number;

        constructor() {
            this.crd = ubit.VD_INVALID_INDEX;
            this.idx = ubit.VD_INVALID_INDEX;
        }
    }

    export class VOS {
        constructor(public surfIndx: number, public vertInSurf: number) {}
    }

    export class VOE {
        constructor(public edgeIndx: number, public vertInEdge: number) {}
    }

    export class VSTopoGraph {
        m_lstVertices: Array<VSVertInfo>;
        m_lstSurfaces: Array<VSSurfInfo>;
        m_lstEdges: Array<VSEdgeInfo>;
        m_lstVertEdge: Array<VSEdgeRef>;
        m_lstVertSurf: Array<VSSurfRef>;

        constructor() {
            this.m_lstVertices = new Array<VSVertInfo>();
            this.m_lstSurfaces = new Array<VSSurfInfo>();
            this.m_lstEdges = new Array<VSEdgeInfo>();
            this.m_lstVertEdge = new Array<VSEdgeRef>();
            this.m_lstVertSurf = new Array<VSSurfRef>();
        }

        resizeVertex(vCount: number) {
            this.m_lstVertices = new Array<VSVertInfo>(vCount);
            for (let i = 0; i < vCount; i++) {
                this.m_lstVertices[i] = new VSVertInfo();
            }
        }
        resizeSurface(sCount: number) {
            this.m_lstSurfaces = new Array<VSSurfInfo>(sCount);
            for (let i = 0; i < sCount; i++) {
                this.m_lstSurfaces[i] = new VSSurfInfo();
            }
        }
        resizeEdge(eCount: number) {
            this.m_lstEdges = new Array<VSEdgeInfo>(eCount);
            for (let i = 0; i < eCount; i++) {
                this.m_lstEdges[i] = new VSEdgeInfo();
            }
        }
        resizeVertEdge(erCount: number) {
            this.m_lstVertEdge = new Array<VSEdgeRef>(erCount);
            for (let i = 0; i < erCount; i++) {
                this.m_lstVertEdge[i] = new VSEdgeRef();
            }
        }
        resizeVertSurf(esCount: number) {
            this.m_lstVertSurf = new Array<VSSurfRef>(esCount);
            for (let i = 0; i < esCount; i++) {
                this.m_lstVertSurf[i] = new VSSurfRef();
            }
        }

        GetSurfCount(): number {
            return this.m_lstSurfaces.length;
        }

        GetVertexCount(): number {
            return this.m_lstVertices.length;
        }

        GetEdgeCount(): number {
            return this.m_lstEdges.length;
        }

        GetSurfCountOfVetex(vIdx: number): number {
            return this.m_lstVertices[vIdx].surfCount;
        }

        GetSurfIndxOfVertex(vIdx: number, sIdx: number): number {
            return this.m_lstVertSurf[this.m_lstVertices[vIdx].surfOffset + sIdx].idx;
        }

        GetSurfOfVertex(vIdx: number, sIdx: number): VOS {
            let sr = this.m_lstVertSurf[this.m_lstVertices[vIdx].surfOffset + sIdx]
            return new VOS(sr.idx, sr.crd);
        }

        GetEdgeCountOfVetex(vIdx: number): number {
            return this.m_lstVertices[vIdx].edgeCount;
        }

        GetEdgeIndxOfVertex(vIdx: number, eIdx: number): number {
            return this.m_lstVertEdge[this.m_lstVertices[vIdx].edgeOffset + eIdx].idx;
        }

        GetEdgeOfVertex(vIdx: number, eIdx: number): VOE {
            let er = this.m_lstVertEdge[this.m_lstVertices[vIdx].edgeOffset + eIdx];
            return new VOE(er.idx, er.crd);
        }

        GetVertNbrIndxOfSurf(sIdx: number): vector.VNVector3UI {
            return this.m_lstSurfaces[sIdx].idxInVertNbr;
        }

        GetEdgeIndxOfSurf(sIdx: number): vector.VNVector3UI {
            return this.m_lstSurfaces[sIdx].edge;
        }

        GetEdgeNbrIndxOfSurf(sIdx: number): vector.VNVector3UI {
            return this.m_lstSurfaces[sIdx].idxInEdgeNbr
        }

        GetSurfIndxOfEdge(eIdx: number): vector.VNVector2UI {
            return this.m_lstEdges[eIdx].nbrSurf;
        }

        GetSurfNbrIndxOfEdge(eIdx: number): vector.VNVector2UI {
            return this.m_lstEdges[eIdx].idxInSurf;
        }

        GetVertIndxOfEdge(eIdx: number): vector.VNVector2UI {
            return this.m_lstEdges[eIdx].vert;
        }
    }

    export class VTopoGraphBuilder {
        static BuildFromSimpleMesh(smesh: VSSimpleMesh): VSTopoGraph {
            return this.Build(smesh.vertLength, smesh.triangleLength, smesh.triangleBuffer);
        }

        static Build(vertCount: number, triCount: number, surfBuff: Uint32Array): VSTopoGraph {
            let rtValue = new VSTopoGraph();
            if (triCount > 0) {
                this.constructRelation(rtValue, vertCount, triCount, surfBuff);
            }
            return rtValue;
        }

        private static constructRelation(topoGraph: VSTopoGraph, vertCount: number, triCount: number, surfBuff: Uint32Array) {
            this.initVertInfo(topoGraph, vertCount);
            this.initSurfVert(topoGraph, surfBuff, triCount);
            this.initVertSurf(topoGraph, triCount * 3);
            this.updateVertSurfRelation(topoGraph, surfBuff);
            this.updateVertEdge(topoGraph);
        }

        private static initVertInfo(topoGraph: VSTopoGraph, count: number) {
            topoGraph.resizeVertex(count);
            //topoGraph.m_lstVertices = new Array<VSVertInfo>(count);
            //for (let i = 0; i < count; i++) {
            //    topoGraph.m_lstVertices[i].surfCount = 0;
            //    topoGraph.m_lstVertices[i].edgeCount = 0;
            //    topoGraph.m_lstVertices[i].edgeOffset = 0;
            //}
        }

        private static initSurfVert(topoGraph: VSTopoGraph, surfBuff: Uint32Array, count: number) {
            //topoGraph.m_lstSurfaces = new Array<VSSurfInfo>(count);
            topoGraph.resizeSurface(count);
            for (let i = 0; i < count; i++) {
                topoGraph.m_lstSurfaces[i].edge.x = ubit.VD_INVALID_INDEX;
                topoGraph.m_lstSurfaces[i].edge.y = ubit.VD_INVALID_INDEX;
                topoGraph.m_lstSurfaces[i].edge.z = ubit.VD_INVALID_INDEX;

                topoGraph.m_lstVertices[surfBuff[i * 3 + 0]].surfCount += 1;
                topoGraph.m_lstVertices[surfBuff[i * 3 + 1]].surfCount += 1;
                topoGraph.m_lstVertices[surfBuff[i * 3 + 2]].surfCount += 1;
            }
        }

        private static initVertSurf(topoGraph: VSTopoGraph, len: number) {
            let counter = 0;
            //topoGraph.m_lstVertSurf = new Array<VSSurfRef>(len);
            topoGraph.resizeVertSurf(len);
            for (let i = 0; i < topoGraph.m_lstVertices.length; i++) {
                topoGraph.m_lstVertices[i].surfOffset = counter;
                counter += topoGraph.m_lstVertices[i].surfCount;
            }
        }

        private static updateVertSurfRelation(topoGraph: VSTopoGraph, surfBuff: Uint32Array) {
            for (let i = 0; i < topoGraph.m_lstSurfaces.length; i++) {
                let sInfo = topoGraph.m_lstSurfaces[i];
                let tri = mesh.VTBCtrller.GetArray(surfBuff, i);

                for (let j = 0; j < 3; j++) {
                    let vi = topoGraph.m_lstVertices[tri[j]];
                    let ci = vi.edgeOffset;
                    let pb = topoGraph.m_lstVertSurf[vi.surfOffset];
                    let cri = topoGraph.m_lstVertSurf[vi.surfOffset + ci];

                    topoGraph.m_lstVertSurf[vi.surfOffset + ci].idx = i;
                    topoGraph.m_lstVertSurf[vi.surfOffset + ci].crd = j;
                    topoGraph.m_lstVertSurf[vi.surfOffset + ci].pre = ubit.VD_INVALID_INDEX;
                    topoGraph.m_lstVertSurf[vi.surfOffset + ci].nxt = ubit.VD_INVALID_INDEX;

                    topoGraph.m_lstVertices[surfBuff[i * 0 + j]].edgeCount += 2;

                    vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].idxInVertNbr, j, ci);

                    for (let k = 0; k < ci; k++) {
                        let nri = topoGraph.m_lstVertSurf[vi.surfOffset + k];
                        let ntri = mesh.VTBCtrller.GetArray(surfBuff, nri.idx);
                        let nted = topoGraph.m_lstSurfaces[nri.idx].edge
                        let ntedarr = [nted.x, nted.y, nted.z];
                        if (tri[(j + 2) % 3] == ntri[(nri.crd + 1) % 3]) {
                            topoGraph.m_lstVertSurf[vi.surfOffset + ci].pre = k;
                            topoGraph.m_lstVertSurf[vi.surfOffset + k].nxt = ci;
                            topoGraph.m_lstVertices[surfBuff[i * 0 + j]].edgeCount -= 1;

                            let eIndex = (j + 1) % 3;
                            vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].edge, eIndex, ntedarr[(nri.crd + 2) % 3]);
                            vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].idxInEdgeNbr, eIndex, 1);

                            topoGraph.m_lstEdges[vector.VF3Ctrller.GetArray(sInfo.edge)[eIndex]].nbrSurf.y = cri.idx;
                            topoGraph.m_lstEdges[vector.VF3Ctrller.GetArray(sInfo.edge)[eIndex]].idxInSurf.y = eIndex;
                        }

                        if (tri[(j + 1) % 3] == ntri[(nri.crd + 2) % 3]) {
                            topoGraph.m_lstVertSurf[vi.surfOffset + ci].nxt = k;
                            topoGraph.m_lstVertSurf[vi.surfOffset + k].pre = ci;
                            topoGraph.m_lstVertices[surfBuff[i * 0 + j]].edgeCount -= 1;

                            let eIndex = (j + 2) % 3;
                            vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].edge, eIndex, ntedarr[(nri.crd + 1) % 3]);
                            vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].idxInEdgeNbr, eIndex, 1);

                            topoGraph.m_lstEdges[vector.VF3Ctrller.GetArray(sInfo.edge)[eIndex]].nbrSurf.y = cri.idx;
                            topoGraph.m_lstEdges[vector.VF3Ctrller.GetArray(sInfo.edge)[eIndex]].idxInSurf.y = eIndex;
                        }
                    }

                    topoGraph.m_lstVertices[tri[j]].edgeOffset += 1;
                }

                for (let j = 0; j < 3; j++) {
                    if (vector.VF3Ctrller.GetArray(sInfo.edge)[j] == ubit.VD_INVALID_INDEX) {
                        let ei = new VSEdgeInfo();
                        ei.vert.x = tri[(j + 1) % 3];
                        ei.vert.y = tri[(j + 2) % 3];
                        ei.nbrSurf.x = i;
                        ei.idxInSurf.x = j;
                        ei.nbrSurf.y = ubit.VD_INVALID_INDEX;

                        vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].edge, j, topoGraph.m_lstEdges.length);
                        vector.VF3Ctrller.Set(topoGraph.m_lstSurfaces[i].idxInEdgeNbr, j, 0);

                        topoGraph.m_lstEdges.push(ei);
                    }
                }
            }
        }

        private static updateVertEdge(topoGraph: VSTopoGraph) {
            let counter = 0;
            topoGraph.resizeVertEdge(topoGraph.m_lstEdges.length * 2);
            //topoGraph.m_lstVertEdge = new Array<VSEdgeRef>(topoGraph.m_lstEdges.length * 2);
            for (let i = 0; i < topoGraph.m_lstVertices.length; i++) {
                topoGraph.m_lstVertices[i].edgeOffset = counter;
                counter += topoGraph.m_lstVertices[i].edgeCount;
                topoGraph.m_lstVertices[i].edgeCount = 0;
            }

            for (let i = 0; i < topoGraph.m_lstEdges.length; i++) {
                let ei = topoGraph.m_lstEdges[i];
                let eivert = [ei.vert.x, ei.vert.y];

                for (let j = 0; j < 2; j++) {
                    let vidx = eivert[j];
                    let vi = topoGraph.m_lstVertices[vidx];
                    topoGraph.m_lstVertEdge[vi.edgeOffset + vi.edgeCount].idx = i;
                    topoGraph.m_lstVertEdge[vi.edgeOffset + vi.edgeCount].crd = j;
                    topoGraph.m_lstVertices[vidx].edgeCount += 1;
                }
            }
        }
    }

    export class VTopoGraphUtil {
        //static CalcVertexNormal(topoGraph: VSTopoGraph, vertBuffer: Float32Array, triBuffer: Uint32Array, idx: number): vector.VFVector3 {
        //    let norm = vector.VFVector3.ZERO;
        //    let triCount = topoGraph.GetSurfCountOfVetex(idx);
        //
        //    for (let i = 0; i < triCount; i++) {
        //        let ip = topoGraph.GetSurfOfVertex(idx, i);
        //        let ta = mesh.VTBCtrller.GetArray(triBuffer, ip.surfIndx);
        //        let viSt = mesh.VVBCtrller.Get(vertBuffer, ta[(ip.vertInSurf + 2) % 3]);
        //        let viEd = mesh.VVBCtrller.Get(vertBuffer, ta[(ip.vertInSurf + 1) % 3]);
        //
        //        norm = norm.add(this.calcWeightedSurfNorm(viSt, mesh.VVBCtrller.Get(vertBuffer, idx), viEd));
        //    }
        //
        //    if (norm.isZero()) {
        //        return vector.VFVector3.AXIS_Z;
        //    }
        //
        //    norm.normalize();
        //    return norm;
        //}

        //static CalcSurfaceNormal(tri: vector.VNVector3UI, vertBuffer: Float32Array): vector.VFVector3 {
        //    let vs = mesh.VVBCtrller.Get(vertBuffer, tri.x);
        //    let v = mesh.VVBCtrller.Get(vertBuffer, tri.y);
        //    let ve = mesh.VVBCtrller.Get(vertBuffer, tri.z);
        //
        //    let u1 = vs.min(v);
        //    let u2 = ve.min(v);
        //
        //    if (u1.isZero() || u2.isZero()) {
        //        return vector.VFVector3.ZERO;
        //    }
        //
        //    u1.normalize();
        //    u2.normalize();
        //
        //    let d = u2.cross(u1);
        //
        //    if (d.isZero()) {
        //        return vector.VFVector3.ZERO;
        //    }
        //
        //    return d.direction();
        //}

        //private static calcWeightedSurfNorm(vs: vector.VFVector3, v: vector.VFVector3, ve: vector.VFVector3): vector.VFVector3 {
        //    let u1 = vs.min(v);
        //    let u2 = ve.min(v);
        //    if (u1.isZero() || u2.isZero()) {
        //        return vector.VFVector3.ZERO;
        //    }
        //
        //    u1.normalize();
        //    u2.normalize();
        //
        //    let d = u2.cross(u1);
        //
        //    if (d.isZero()) {
        //        return vector.VFVector3.ZERO;
        //    }
        //
        //    d.normalize();
        //
        //    return d.mulNumber(Math.acos(u1.dot(u2)));
        //}

        static CalcSurfaceNormalDir(vs: vector.VFVector3, v: vector.VFVector3, ve: vector.VFVector3): vector.VFVector3 {
            let u1 = vs.min(v);
            let u2 = ve.min(v);
            if (u1.isZero() || u2.isZero()) {
                return vector.VFVector3.ZERO;
            }

            u1.normalize();
            u2.normalize();

            let d = u2.cross(u1);

            if (d.isZero()) {
                return vector.VFVector3.ZERO;
            }

            return d.direction();
        }

        static CalcVertNormalWeight(vs: vector.VFVector3, v: vector.VFVector3, ve: vector.VFVector3): vector.VFVector3 {
            let ws = this.CalcWeight(ve, vs, v );
            let w  = this.CalcWeight(vs, v , ve);
            let we = this.CalcWeight(v, ve, vs);
            return new vector.VFVector3(ws, w, we);
        }

        private static CalcWeight(vs: vector.VFVector3, v: vector.VFVector3, ve: vector.VFVector3) : number {
            let u1 = vs.min(v);
            let u2 = ve.min(v);
            if (u1.isZero() || u2.isZero()) {
                return 0;
            }
        
            u1.normalize();
            u2.normalize();
        
            let d = u2.cross(u1);
        
            if (d.isZero()) {
                return 0;
            }
        
            return Math.acos(u1.dot(u2));
        }
    }

    export class VNormaledMesh extends VSSimpleMesh{
        vertNormalBuffer: Float32Array;
        triangleNormalBuffer: Float32Array;

        constructor(smesh: VSSimpleMesh) {
            super(smesh.vertLength, smesh.vertBuffer, smesh.triangleLength, smesh.triangleBuffer);

            this.triangleNormalBuffer = new Float32Array(smesh.triangleLength * 3);
            this.vertNormalBuffer = new Float32Array(smesh.vertLength * 3);
            for (let i = 0; i < this.vertNormalBuffer.length; i++) {
                this.vertNormalBuffer[i] = 0;
            }
            
            for (let i = 0; i < smesh.triangleLength; i++){
                let vis = VTBCtrller.GetArray(smesh.triangleBuffer, i);
                if (vis[0] < smesh.vertLength && vis[1] < smesh.vertLength && vis[2] < smesh.vertLength) {
                    let pa = VVBCtrller.Get(smesh.vertBuffer, vis[0]);
                    let pb = VVBCtrller.Get(smesh.vertBuffer, vis[1]);
                    let pc = VVBCtrller.Get(smesh.vertBuffer, vis[2]);
                    let surfNorm = VTopoGraphUtil.CalcSurfaceNormalDir(pa, pb, pc);
                    VVBCtrller.Set(this.triangleNormalBuffer, i, surfNorm);
                    let weight = VTopoGraphUtil.CalcVertNormalWeight(pa, pb, pc);
                    let olda = VVBCtrller.Get(this.vertNormalBuffer, vis[0]);
                    VVBCtrller.Set(this.vertNormalBuffer, vis[0], olda.add(surfNorm.mulNumber(weight.x)));
                    let oldb = VVBCtrller.Get(this.vertNormalBuffer, vis[1]);
                    VVBCtrller.Set(this.vertNormalBuffer, vis[1], oldb.add(surfNorm.mulNumber(weight.y)));
                    let oldc = VVBCtrller.Get(this.vertNormalBuffer, vis[2]);
                    VVBCtrller.Set(this.vertNormalBuffer, vis[2], oldc.add(surfNorm.mulNumber(weight.z)));
                } else {
                    console.error("mesh triangle index error.");
                }
            }

            for (let i = 0; i < smesh.vertLength; i++) {
                let old = VVBCtrller.Get(this.vertNormalBuffer, i);
                if (!old.isZero())
                    VVBCtrller.Set(this.vertNormalBuffer, i, old.direction());
            }
        }
    }
}

export { mesh }