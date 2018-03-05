import { vector } from "./vector";
import { quaternion } from "./quaternion";
import { matrix } from "./matrix";
import { float } from "./float";

module location {
    export class VFLocation {
        constructor(public position: vector.VFVector3, public orientation: quaternion.VFQuaternion) { }

        transLocalVertexToGlobal(v: vector.VFVector3): vector.VFVector3 {
            return this.position.add(this.orientation.rotateVector3(v));
        }

        transGlobalVertexToLocal(v: vector.VFVector3): vector.VFVector3 {
            return this.orientation.inverted().rotateVector3(v.min(this.position));
        }

        transLocalNormalToGlobal(v: vector.VFVector3): vector.VFVector3 {
            return this.orientation.rotateVector3(v);
        }

        transGlobalNormalToLocal(v: vector.VFVector3): vector.VFVector3 {
            return this.orientation.inverted().rotateVector3(v);
        }

        transLocalPosToGlobal(v: VFLocation): VFLocation {
            let vx = v.orientation.rotateVector3(vector.VFVector3.AXIS_X).direction();
            let vy = v.orientation.rotateVector3(vector.VFVector3.AXIS_Y).direction();
            let vz = v.orientation.rotateVector3(vector.VFVector3.AXIS_Z).direction();

            let _vx = this.transLocalNormalToGlobal(vx).direction();
            let _vy = this.transLocalNormalToGlobal(vy).direction();
            let _vz = this.transLocalNormalToGlobal(vz).direction();

            return new VFLocation(this.transLocalVertexToGlobal(v.position), quaternion.VFQuaternion.FromAxes(_vx, _vy, _vz));
        }

        transGlobalPosToLocal(v: VFLocation): VFLocation {
            let vx = v.orientation.rotateVector3(vector.VFVector3.AXIS_X).direction();
            let vy = v.orientation.rotateVector3(vector.VFVector3.AXIS_Y).direction();
            let vz = v.orientation.rotateVector3(vector.VFVector3.AXIS_Z).direction();

            let _vx = this.transGlobalNormalToLocal(vx).direction();
            let _vy = this.transGlobalNormalToLocal(vy).direction();
            let _vz = this.transGlobalNormalToLocal(vz).direction();

            return new VFLocation(this.transGlobalVertexToLocal(v.position), quaternion.VFQuaternion.FromAxes(_vx, _vy, _vz));
        }

        toMatrix4(): matrix.VMat4 {
            let rtValue = new matrix.VMat4();
            rtValue.fromMat3(this.orientation.toMat3());
            rtValue.setTrans(this.position);
            return rtValue;
        }

        inverted(): VFLocation {
            let v = this.orientation.inverted().rotateVector3(this.position.negative());
            return new VFLocation(v, this.orientation.inverted());
        }

        isZero(): boolean {
            return float.vf_appro_zero(1 - this.orientation.s) && this.position.isZero();
        }

        isSame(v: VFLocation): boolean {
            return this.position.isSame(v.position) && this.orientation.isSame(v.orientation);
        }

        static Lerp(from: VFLocation, to: VFLocation, t: number): VFLocation { 
            let position = from.position.mulNumber(1 - t).add(to.position.mulNumber(t));
            let orientation = quaternion.VFQuaternion.Lerp(from.orientation, to.orientation, t);
            return new VFLocation(position, orientation);
        }

        static SLerp(from: VFLocation, to: VFLocation, t: number): VFLocation {
            let position = from.position.mulNumber(1 - t).add(to.position.mulNumber(t));
            let orientation = quaternion.VFQuaternion.SLerp(from.orientation, to.orientation, t);
            return new VFLocation(position, orientation);
        }

        static ORIGIN = new VFLocation(new vector.VFVector3(0, 0, 0), new quaternion.VFQuaternion(1, new vector.VFVector3(0, 0, 0)));
    }
}

export { location }