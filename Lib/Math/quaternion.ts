import { vector } from "./vector";
import { radian } from "./radian";
import { matrix } from "./matrix";
import { float } from "./float";

module quaternion {
    export class VAxisAngle {
        constructor(public angle: radian.VFRadian, public axis: vector.VFVector3) { }
    }

    export class VFQuaternion {
        constructor(public s: number, public v: vector.VFVector3) { }

        add(q: VFQuaternion): VFQuaternion{
            return new VFQuaternion(this.s + q.s, this.v.add(q.v));
        }

        min(q: VFQuaternion): VFQuaternion {
            return new VFQuaternion(this.s - q.s, this.v.min(q.v));
        }

        mul(q: VFQuaternion): VFQuaternion {
            return new VFQuaternion(this.s * q.s - this.v.dot(q.v),
                new vector.VFVector3(
                    this.v.y * q.v.z - this.v.z * q.v.y + this.s * q.v.x + this.v.x * q.s,
                    this.v.z * q.v.x - this.v.x * q.v.z + this.s * q.v.y + this.v.y * q.s,
                    this.v.x * q.v.y - this.v.y * q.v.x + this.s * q.v.z + this.v.z * q.s 
                )
            );
        }

        div(q: VFQuaternion): VFQuaternion {
            let qInvert = q.inverted();
            return this.mul(qInvert);
        }

        mulNumber(scale: number): VFQuaternion {
            return new VFQuaternion(this.s * scale, this.v.mulNumber(scale));
        }

        divNumber(scale: number): VFQuaternion {
            let divV = this.v.divNumber(scale);
            if (divV == null) {
                console.error("div 0.");
            }
            return new VFQuaternion(this.s / scale, <vector.VFVector3>divV);
        }

        negative(): VFQuaternion {
            return new VFQuaternion(-this.s, this.v.negative());
        }

        isSame(q: VFQuaternion): boolean {
            return (this.v.x == q.v.x && this.v.y == q.v.y && this.v.z == q.v.z && this.s == q.s); 
        }

        length(): number {
            return Math.sqrt(this.length_squared());
        }

        length_squared(): number {
            return this.s * this.s + this.v.sqrMagnitude();
        }

        normalized(): VFQuaternion {
            return this.divNumber(this.length());
        }

        conjugate(): VFQuaternion {
            return new VFQuaternion(this.s, this.v.negative());
        }

        inverted(): VFQuaternion {
            let fNorm = this.length_squared();

            if (fNorm > 0.0) {
                let fInvNorm = 1.0 / fNorm;
                return new VFQuaternion(this.s * fInvNorm, new vector.VFVector3(- this.v.x * fInvNorm, -this.v.y * fInvNorm, -this.v.z * fInvNorm));
            }
            else {
                // return an invalid result to flag the error
                return VFQuaternion.ZERO;
            }
        }

        //! returns the logarithm of a VFQuaternion = v*a where q = [cos(a),v*sin(a)]
        log(): VFQuaternion {
            let a = Math.acos(this.s);
            let sina = Math.sin(a);
            if (sina > 0) {
                return new VFQuaternion(0, new vector.VFVector3(a * this.v.x / sina, a * this.v.y / sina, a * this.v.z / sina));
            } else {
                return VFQuaternion.ZERO;
            }
        }

        //! returns e^VFQuaternion = exp(v*a) = [cos(a),vsin(a)]
        exp(): VFQuaternion {
            let a = this.v.magnitude() ;
            let sina = Math.sin(a);
            let cosa = Math.cos(a);
            if (a > 0) {
                return new VFQuaternion(cosa, new vector.VFVector3(sina * this.v.x / a, sina * this.v.y / a, sina * this.v.z / a));
            } else {
                return new VFQuaternion(cosa, new vector.VFVector3(0, 0, 0));
            }
        }

        dot(q: VFQuaternion): number {
            return this.v.dot(q.v) + this.s * q.s;
        }

        rotate(q: VFQuaternion): VFQuaternion {   
            let conjugated = this.conjugate();
            return this.mul(q).mul(conjugated);
        } 

        rotateVector3(v: vector.VFVector3): vector.VFVector3 {
            let uv = this.v.cross(v);
            let uuv = this.v.cross(uv);
            let _uv = uv.mulNumber(this.s * 2);
            let _uuv = uuv.mulNumber(2);
            return v.add(uv).add(uuv);
        }

        toMat3(): matrix.VMat3 {
            return new matrix.VMat3(1 - 2 * (this.v.y * this.v.y + this.v.z * this.v.z), 2 * (this.v.x * this.v.y - this.s * this.v.z), 2 * (this.v.x * this.v.z + this.s * this.v.y),
                2 * (this.v.x * this.v.y + this.s * this.v.z), 1 - 2 * (this.v.x * this.v.x + this.v.z * this.v.z), 2 * (this.v.y * this.v.z - this.s * this.v.x),
                2 * (this.v.x * this.v.z - this.s * this.v.y), 2 * (this.v.y * this.v.z + this.s * this.v.x), 1 - 2 * (this.v.x * this.v.x + this.v.y * this.v.y));
        }

        static FromEulerAngles(theta_z: radian.VFRadian, theta_y: radian.VFRadian, theta_x: radian.VFRadian): VFQuaternion {
            let cos_z_2 = Math.cos(0.5 * theta_z.mRad);
            let cos_y_2 = Math.cos(0.5 * theta_y.mRad);
            let cos_x_2 = Math.cos(0.5 * theta_x.mRad);
            let sin_z_2 = Math.sin(0.5 * theta_z.mRad);
            let sin_y_2 = Math.sin(0.5 * theta_y.mRad);
            let sin_x_2 = Math.sin(0.5 * theta_x.mRad);

            let temps = cos_z_2 * cos_y_2 * cos_x_2 + sin_z_2 * sin_y_2 * sin_x_2;
            let tempx = cos_z_2 * cos_y_2 * sin_x_2 - sin_z_2 * sin_y_2 * cos_x_2;
            let tempy = cos_z_2 * sin_y_2 * cos_x_2 + sin_z_2 * cos_y_2 * sin_x_2;
            let tempz = sin_z_2 * cos_y_2 * cos_x_2 - cos_z_2 * sin_y_2 * sin_x_2;

            return new VFQuaternion(temps, new vector.VFVector3(tempx, tempy, tempz));
        }

        static ToEulerAngles(q: VFQuaternion, homogenous: boolean = true): vector.VFVector3 {
            let sqw = q.s * q.s;
            let sqx = q.v.x * q.v.x;
            let sqy = q.v.y * q.v.y;
            let sqz = q.v.z * q.v.z;
            if (homogenous) {
                let x = Math.atan2(2 * (q.v.x * q.v.y + q.v.z * q.s), sqx - sqy - sqz + sqw);
                let y = Math.asin(-2 * (q.v.x * q.v.z - q.v.y * q.s));
                let z = Math.atan2(2 * (q.v.y * q.v.z + q.v.x * q.s), -sqx - sqy + sqz + sqw);
                return new vector.VFVector3(x, y, z);
            } else {
                let x = Math.atan2(2 * (q.v.z * q.v.y + q.v.x * q.s), 1 - 2 * (sqx + sqy));
                let y = Math.asin(-2 * (q.v.x * q.v.z - q.v.y * q.s));
                let z = Math.atan2(2 * (q.v.x * q.v.y + q.v.z * q.s), 1 - 2 * (sqy + sqz));
                return new vector.VFVector3(x, y, z);
            }
        }

        //! linear VFQuaternion interpolation
        static Lerp(from: VFQuaternion, to: VFQuaternion, t: number): VFQuaternion {
            return from.mulNumber(1 - t).add(to.mulNumber(t)).normalized();
        }

        //! spherical linear interpolation
        static SLerp(from: VFQuaternion, to: VFQuaternion, t: number): VFQuaternion {
            let q3 = to;
            let dotVal = from.dot(to);
            if (dotVal < 0) {
                dotVal = -dotVal;
                q3 = to.negative();
            } 
            if (dotVal < 0.95) {
                let angle = Math.acos(dotVal);
                return from.mulNumber(Math.sin(angle * (1 - t))).add(q3.mulNumber(Math.sin(angle * t))).divNumber(Math.sin(angle));
            } else {
                return VFQuaternion.Lerp(from, q3, t);
            }
        }

        //! This version of slerp, used by squad, does not check for theta > 90.
        static SLerpNoInvert(from: VFQuaternion, to: VFQuaternion, t: number): VFQuaternion {
            let dotVal = from.dot(to);

            if (Math.abs(dotVal) < 0.95)
            {
                let angle = Math.acos(dotVal);
                return from.mulNumber(Math.sin(angle * (1 - t))).add(to.mulNumber(Math.sin(angle * t))).divNumber(Math.sin(angle));
            } else {
                return VFQuaternion.Lerp(from, to, t);
            }
        }

        //! spherical cubic interpolation
        static Squad(from: VFQuaternion, to: VFQuaternion, a: VFQuaternion, b: VFQuaternion, t: number): VFQuaternion {
            let c = VFQuaternion.SLerpNoInvert(from, to, t);
            let d = VFQuaternion.SLerpNoInvert(a, b, t);
            return VFQuaternion.SLerpNoInvert(c, d, 2 * t * (1 - t));
        }

        //! Shoemake-Bezier interpolation using De Castlejau algorithm
        static Bezier(from: VFQuaternion, to: VFQuaternion, a: VFQuaternion, b: VFQuaternion, t: number): VFQuaternion {
            // level 1
            let q11 = VFQuaternion.SLerpNoInvert(from, a, t);
            let q12 = VFQuaternion.SLerpNoInvert(a, b, t);
            let q13 = VFQuaternion.SLerpNoInvert(b, to, t);
            // level 2 and 3
            return VFQuaternion.SLerpNoInvert(VFQuaternion.SLerpNoInvert(q11, q12, t), VFQuaternion.SLerpNoInvert(q12, q13, t), t);
        }

        //! Given 3 VFQuaternions, qn-1,qn and qn+1, calculate a control point to be used in spline interpolation
        static Spline(qnm1: VFQuaternion, qn: VFQuaternion, qnp1: VFQuaternion): VFQuaternion {
            let qni = new VFQuaternion(qn.s, qn.v.negative());
            return qn.mul(qni.mul(qnm1).log().add(qni.mul(qnp1).log()).divNumber(-4).exp());
        }

        static FromAxisAngle(axis: vector.VFVector3, angle: radian.VFRadian): VFQuaternion {
            return new VFQuaternion(Math.cos(angle.mRad / 2), axis.mulNumber(Math.sin(angle.mRad / 2)));
        }

        static ToAxisAngle(q: VFQuaternion): VAxisAngle {
            let fSqrLength = q.v.sqrMagnitude();

            if (fSqrLength > 0)
            {
                let fInvLength = 1 / Math.sqrt(fSqrLength);
                return new VAxisAngle(new radian.VFRadian(2.0 * Math.acos(q.s)), q.v.mulNumber(fInvLength));
            }
            else
            {
                return new VAxisAngle(new radian.VFRadian(0), new vector.VFVector3(1,0,0));
            }
        }

        static FromRotateAxis(orign: vector.VFVector3, dest: vector.VFVector3): VFQuaternion {
            let vo = orign.direction();
            let vd = dest.direction();
            let vAxis = vo.cross(vd);
            let dot = vo.dot(vd);

            if (vAxis.isZero()) {
                if (dot > 0)
                    return VFQuaternion.IDENTITY;
                else {
                    let vtemp = vo.mul(vo);

                    if (vtemp.y >= vtemp.x && vtemp.z >= vtemp.x) {
                        vtemp = vector.VFVector3.AXIS_X;
                    } else if (vtemp.x >= vtemp.y && vtemp.z >= vtemp.y) {
                        vtemp = vector.VFVector3.AXIS_Y;
                    } else {
                        vtemp = vector.VFVector3.AXIS_Z;
                    }

                    return VFQuaternion.FromAxisAngle(vo.cross(vtemp), new radian.VFRadian(Math.PI));
                }
            }
            return VFQuaternion.FromAxisAngle(vAxis.direction(), new radian.VFRadian(Math.acos(dot)));
        }

        static FromRotationMatrix(kRot: matrix.VMat3): VFQuaternion {     
            let fTrace = kRot.m00 + kRot.m11 + kRot.m22;
        
            if ( fTrace > 0.0 ) {
                let fRoot = Math.sqrt(fTrace + 1);
                let s = 0.5 * fRoot;
                let halfinvfRoot = 0.5 / fRoot;
                let x = (kRot.m21 - kRot.m12) * halfinvfRoot;
                let y = (kRot.m02 - kRot.m20) * halfinvfRoot;
                let z = (kRot.m10 - kRot.m01) * halfinvfRoot;
                let qRtn = new VFQuaternion(s, new vector.VFVector3(x, y, z));
                return qRtn.normalized();
            } else {
                let i: number;
                let j: number;
                let k: number;
                if (kRot.m11 > kRot.m00) {
                    if (kRot.m22 > kRot.m11) {
                        i = 2;
                        j = 0;
                        k = 1;
                        let fRoot = Math.sqrt(kRot.m22 - kRot.m00 - kRot.m11 + 1);
                        let z = 0.5 * fRoot;
                        let halfinvfRoot = 0.5 / fRoot;
                        let s = (kRot.m10 - kRot.m01) * fRoot;
                        let x = (kRot.m02 + kRot.m20) * fRoot;
                        let y = (kRot.m12 + kRot.m21) * fRoot;
                        let qRtn = new VFQuaternion(s, new vector.VFVector3(x, y, z));
                        return qRtn.normalized();
                    } else {
                        i = 1;
                        j = 2;
                        k = 0;
                        let fRoot = Math.sqrt(kRot.m11 - kRot.m22 - kRot.m00 + 1);
                        let y = 0.5 * fRoot;
                        let halfinvfRoot = 0.5 / fRoot;
                        let s = (kRot.m02 - kRot.m20) * fRoot;
                        let z = (kRot.m21 + kRot.m12) * fRoot;
                        let x = (kRot.m01 + kRot.m10) * fRoot;
                        let qRtn = new VFQuaternion(s, new vector.VFVector3(x, y, z));
                        return qRtn.normalized();
                    }
                } else {
                    if (kRot.m22 > kRot.m00) {
                        i = 2;
                        j = 0;
                        k = 1;
                        let fRoot = Math.sqrt(kRot.m22 - kRot.m00 - kRot.m11 + 1);
                        let z = 0.5 * fRoot;
                        let halfinvfRoot = 0.5 / fRoot;
                        let s = (kRot.m10 - kRot.m01) * fRoot;
                        let x = (kRot.m02 + kRot.m20) * fRoot;
                        let y = (kRot.m12 + kRot.m21) * fRoot;
                        let qRtn = new VFQuaternion(s, new vector.VFVector3(x, y, z));
                        return qRtn.normalized();
                    } else {
                        i = 0;
                        j = 1;
                        k = 2;
                        let fRoot = Math.sqrt(kRot.m00 - kRot.m11 - kRot.m22 + 1);
                        let x = 0.5 * fRoot;
                        let halfinvfRoot = 0.5 / fRoot;
                        let s = (kRot.m21 - kRot.m12) * fRoot;
                        let y = (kRot.m10 + kRot.m01) * fRoot;
                        let z = (kRot.m20 + kRot.m02) * fRoot;
                        let qRtn = new VFQuaternion(s, new vector.VFVector3(x, y, z));
                        return qRtn.normalized();
                    }
                }
            }
        }

        static FromAxes(xaxis: vector.VFVector3, yaxis: vector.VFVector3, zaxis: vector.VFVector3): VFQuaternion{
            let kRot = new matrix.VMat3();

            if (xaxis.isNormalized()
                && yaxis.isNormalized()
                && zaxis.isNormalized()
                //&& float.vf_appro_zero(xaxis.dot(yaxis))
                //&& float.vf_appro_zero(yaxis.dot(zaxis))
                //&& float.vf_appro_zero(zaxis.dot(xaxis))
            ){
                kRot.m00 = xaxis.x;
                kRot.m10 = xaxis.y;
                kRot.m20 = xaxis.z;
                kRot.m01 = yaxis.x;
                kRot.m11 = yaxis.y;
                kRot.m21 = yaxis.z;
                kRot.m02 = zaxis.x;
                kRot.m12 = zaxis.y;
                kRot.m22 = zaxis.z;
                return VFQuaternion.FromRotationMatrix(kRot);
            } else {
                console.error("error at gen VFQuaternion from Axes.");
                return VFQuaternion.ZERO;
            }
        }	

        static FromAxesXY(xaxis: vector.VFVector3, yaxis: vector.VFVector3): VFQuaternion {
            return VFQuaternion.FromAxes(xaxis, yaxis, xaxis.cross(yaxis));
        }

        static FromAxesYZ(yaxis: vector.VFVector3, zaxis: vector.VFVector3): VFQuaternion {
            return VFQuaternion.FromAxes(yaxis.cross(zaxis), yaxis, zaxis);
        }

        static FromAxesZX(zaxis: vector.VFVector3, xaxis: vector.VFVector3): VFQuaternion {
            return VFQuaternion.FromAxes(xaxis, zaxis.cross(xaxis), zaxis);
        }

        static ZERO = new VFQuaternion(0.0, new vector.VFVector3(0.0, 0.0, 0.0));
        static IDENTITY = new VFQuaternion(1.0, new vector.VFVector3(0.0, 0.0, 0.0));
    }
}

export { quaternion }