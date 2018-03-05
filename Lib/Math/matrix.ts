import { float } from "./float";
import { vector } from "./vector";

module matrix {
    export class VMat3 {
        m00: number; m01: number; m02: number;
        m10: number; m11: number; m12: number;
        m20: number; m21: number; m22: number;

        constructor(
            m00?: number, m01?: number, m02?: number,
            m10?: number, m11?: number, m12?: number,
            m20?: number, m21?: number, m22?: number
        ) {
            if (
                m00 == undefined || m01 == undefined || m02 == undefined || 
                m10 == undefined || m11 == undefined || m12 == undefined || 
                m20 == undefined || m21 == undefined || m22 == undefined ) {
                this.identity();
            } else {
                this.set(
                    m00, m01, m02, 
                    m10, m11, m12, 
                    m20, m21, m22
                );
            }
        }

        set(m00: number, m01: number, m02: number,
            m10: number, m11: number, m12: number,
            m20: number, m21: number, m22: number) {
            this.m00 = m00; this.m01 = m01; this.m02 = m02;
            this.m10 = m10; this.m11 = m11; this.m12 = m12;
            this.m20 = m20; this.m21 = m21; this.m22 = m22;
        }

        identity() {
            this.set(
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0
            );
        }

        inverse(): VMat3 {
            let rtValue = new VMat3();

            rtValue.m00 = this.m11 * this.m22 - this.m12 * this.m21;
            rtValue.m01 = this.m02 * this.m21 - this.m01 * this.m22;
            rtValue.m02 = this.m01 * this.m12 - this.m02 * this.m11;
            rtValue.m10 = this.m12 * this.m20 - this.m10 * this.m22;
            rtValue.m11 = this.m00 * this.m22 - this.m02 * this.m20;
            rtValue.m12 = this.m02 * this.m10 - this.m00 * this.m12;
            rtValue.m20 = this.m10 * this.m21 - this.m11 * this.m20;
            rtValue.m21 = this.m01 * this.m20 - this.m00 * this.m21;
            rtValue.m22 = this.m00 * this.m11 - this.m01 * this.m10;

            let fDet = this.m00 * rtValue.m00 + this.m01 * rtValue.m10 + this.m02 * rtValue.m20;

            if (float.vf_appro_zero(fDet)) {
                console.error("VMat3 inverse error.")
            }

            let fInvDet = 1.0 / fDet;

            rtValue.m00 *= fInvDet;
            rtValue.m01 *= fInvDet;
            rtValue.m02 *= fInvDet;
            rtValue.m10 *= fInvDet;
            rtValue.m11 *= fInvDet;
            rtValue.m12 *= fInvDet;
            rtValue.m20 *= fInvDet;
            rtValue.m21 *= fInvDet;
            rtValue.m22 *= fInvDet;

            return rtValue;
        }

        leftMulMat3(rkMatrix: VMat3): VMat3 {
            let kProd = new VMat3();
            kProd.m00 = this.m00 * rkMatrix.m00 + this.m01 * rkMatrix.m10 + this.m02 * rkMatrix.m20;
            kProd.m01 = this.m00 * rkMatrix.m01 + this.m01 * rkMatrix.m11 + this.m02 * rkMatrix.m21;
            kProd.m02 = this.m00 * rkMatrix.m02 + this.m01 * rkMatrix.m12 + this.m02 * rkMatrix.m22;
            kProd.m10 = this.m10 * rkMatrix.m00 + this.m11 * rkMatrix.m10 + this.m12 * rkMatrix.m20;
            kProd.m11 = this.m10 * rkMatrix.m01 + this.m11 * rkMatrix.m11 + this.m12 * rkMatrix.m21;
            kProd.m12 = this.m10 * rkMatrix.m02 + this.m11 * rkMatrix.m12 + this.m12 * rkMatrix.m22;
            kProd.m20 = this.m20 * rkMatrix.m00 + this.m21 * rkMatrix.m10 + this.m22 * rkMatrix.m20;
            kProd.m21 = this.m20 * rkMatrix.m01 + this.m21 * rkMatrix.m11 + this.m22 * rkMatrix.m21;
            kProd.m22 = this.m20 * rkMatrix.m02 + this.m21 * rkMatrix.m12 + this.m22 * rkMatrix.m22;
            return kProd;
        }
    }

    export class VMat4 {
        m00: number; m01: number; m02: number; m03: number;
        m10: number; m11: number; m12: number; m13: number;
        m20: number; m21: number; m22: number; m23: number;
        m30: number; m31: number; m32: number; m33: number;

        constructor(
            m00?: number, m01?: number, m02?: number, m03?: number,
            m10?: number, m11?: number, m12?: number, m13?: number,
            m20?: number, m21?: number, m22?: number, m23?: number,
            m30?: number, m31?: number, m32?: number, m33?: number,
        ) {
            if (
                m00 == undefined || m01 == undefined || m02 == undefined || m03 == undefined ||
                m10 == undefined || m11 == undefined || m12 == undefined || m13 == undefined ||
                m20 == undefined || m21 == undefined || m22 == undefined || m23 == undefined ||
                m30 == undefined || m31 == undefined || m32 == undefined || m33 == undefined) {
                this.identity();
            } else {
                this.set(
                    m00, m01, m02, m03,
                    m10, m11, m12, m13,
                    m20, m21, m22, m23,
                    m30, m31, m32, m33
                );
            }
        }

        toFloat32Array(): Float32Array {
            return new Float32Array([
                this.m00, this.m01, this.m02, this.m03,
                this.m10, this.m11, this.m12, this.m13,
                this.m20, this.m21, this.m22, this.m23,
                this.m30, this.m31, this.m32, this.m33
            ])
        }

        set(
            m00: number, m01: number, m02: number, m03: number,
            m10: number, m11: number, m12: number, m13: number,
            m20: number, m21: number, m22: number, m23: number,
            m30: number, m31: number, m32: number, m33: number,
        ) {
            this.m00 = m00; this.m01 = m01; this.m02 = m02; this.m03 = m03;
            this.m10 = m10; this.m11 = m11; this.m12 = m12; this.m13 = m13;
            this.m20 = m20; this.m21 = m21; this.m22 = m22; this.m23 = m23;
            this.m30 = m30; this.m31 = m31; this.m32 = m32; this.m33 = m33;
        }

        setTrans(v: vector.VFVector3) {
            this.m03 = v.x;
            this.m13 = v.y;
            this.m23 = v.z;
        }

        identity() {
            this.set(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }

        fromMat3(mat3: VMat3) {
            this.set(
                mat3.m00, mat3.m01, mat3.m02, 0,
                mat3.m10, mat3.m11, mat3.m12, 0,
                mat3.m20, mat3.m21, mat3.m22, 0,
                       0,        0,        0, 1
            );
        }

        leftMulMat4(mat4: VMat4): VMat4 {
            let m00 = this.m00 * mat4.m00 + this.m01 * mat4.m10 + this.m02 * mat4.m20 + this.m03 * mat4.m30;
            let m01 = this.m00 * mat4.m01 + this.m01 * mat4.m11 + this.m02 * mat4.m21 + this.m03 * mat4.m31;
            let m02 = this.m00 * mat4.m02 + this.m01 * mat4.m12 + this.m02 * mat4.m22 + this.m03 * mat4.m32;
            let m03 = this.m00 * mat4.m03 + this.m01 * mat4.m13 + this.m02 * mat4.m23 + this.m03 * mat4.m33;

            let m10 = this.m10 * mat4.m00 + this.m11 * mat4.m10 + this.m12 * mat4.m20 + this.m13 * mat4.m30;
            let m11 = this.m10 * mat4.m01 + this.m11 * mat4.m11 + this.m12 * mat4.m21 + this.m13 * mat4.m31;
            let m12 = this.m10 * mat4.m02 + this.m11 * mat4.m12 + this.m12 * mat4.m22 + this.m13 * mat4.m32;
            let m13 = this.m10 * mat4.m03 + this.m11 * mat4.m13 + this.m12 * mat4.m23 + this.m13 * mat4.m33;

            let m20 = this.m20 * mat4.m00 + this.m21 * mat4.m10 + this.m22 * mat4.m20 + this.m23 * mat4.m30;
            let m21 = this.m20 * mat4.m01 + this.m21 * mat4.m11 + this.m22 * mat4.m21 + this.m23 * mat4.m31;
            let m22 = this.m20 * mat4.m02 + this.m21 * mat4.m12 + this.m22 * mat4.m22 + this.m23 * mat4.m32;
            let m23 = this.m20 * mat4.m03 + this.m21 * mat4.m13 + this.m22 * mat4.m23 + this.m23 * mat4.m33;

            let m30 = this.m30 * mat4.m00 + this.m31 * mat4.m10 + this.m32 * mat4.m20 + this.m33 * mat4.m30;
            let m31 = this.m30 * mat4.m01 + this.m31 * mat4.m11 + this.m32 * mat4.m21 + this.m33 * mat4.m31;
            let m32 = this.m30 * mat4.m02 + this.m31 * mat4.m12 + this.m32 * mat4.m22 + this.m33 * mat4.m32;
            let m33 = this.m30 * mat4.m03 + this.m31 * mat4.m13 + this.m32 * mat4.m23 + this.m33 * mat4.m33;

            let rtValue = new VMat4();
            rtValue.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            );
            return rtValue;
        }

        leftMulVec3(vec3: vector.VFVector3): vector.VFVector3 {
            let fInvW = 1.0 / (this.m30 * vec3.x + this.m31 * vec3.y + this.m32 * vec3.z + this.m33);

            let x = (this.m00 * vec3.x + this.m01 * vec3.y + this.m02 * vec3.z + this.m03) * fInvW;
            let y = (this.m10 * vec3.x + this.m11 * vec3.y + this.m12 * vec3.z + this.m13) * fInvW;
            let z = (this.m20 * vec3.x + this.m21 * vec3.y + this.m22 * vec3.z + this.m23) * fInvW;

            return new vector.VFVector3(x,y,z);
        }

        // 不知何用。
        mltipleNorm(vec3: vector.VFVector3): vector.VFVector3 {
            let fInvW = 1.0 / (this.m30 * vec3.x + this.m31 * vec3.y + this.m32 * vec3.z + this.m33);

            let x = (this.m00 * vec3.x + this.m01 * vec3.y + this.m02 * vec3.z) * fInvW;
            let y = (this.m10 * vec3.x + this.m11 * vec3.y + this.m12 * vec3.z) * fInvW;
            let z = (this.m20 * vec3.x + this.m21 * vec3.y + this.m22 * vec3.z) * fInvW;

            return new vector.VFVector3(x, y, z);
        }

        add(mat4: VMat4): VMat4 {
            let m00 = this.m00 + mat4.m00;
            let m01 = this.m01 + mat4.m01;
            let m02 = this.m02 + mat4.m02;
            let m03 = this.m03 + mat4.m03;

            let m10 = this.m10 + mat4.m10;
            let m11 = this.m11 + mat4.m11;
            let m12 = this.m12 + mat4.m12;
            let m13 = this.m13 + mat4.m13;

            let m20 = this.m20 + mat4.m20;
            let m21 = this.m21 + mat4.m21;
            let m22 = this.m22 + mat4.m22;
            let m23 = this.m23 + mat4.m23;

            let m30 = this.m30 + mat4.m30;
            let m31 = this.m31 + mat4.m31;
            let m32 = this.m32 + mat4.m32;
            let m33 = this.m33 + mat4.m33;

            let rtValue = new VMat4();
            rtValue.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            );
            return rtValue;
        }

        min(mat4: VMat4): VMat4 {
            let m00 = this.m00 - mat4.m00;
            let m01 = this.m01 - mat4.m01;
            let m02 = this.m02 - mat4.m02;
            let m03 = this.m03 - mat4.m03;

            let m10 = this.m10 - mat4.m10;
            let m11 = this.m11 - mat4.m11;
            let m12 = this.m12 - mat4.m12;
            let m13 = this.m13 - mat4.m13;
                               
            let m20 = this.m20 - mat4.m20;
            let m21 = this.m21 - mat4.m21;
            let m22 = this.m22 - mat4.m22;
            let m23 = this.m23 - mat4.m23;
                               
            let m30 = this.m30 - mat4.m30;
            let m31 = this.m31 - mat4.m31;
            let m32 = this.m32 - mat4.m32;
            let m33 = this.m33 - mat4.m33;

            let rtValue = new VMat4();
            rtValue.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            );
            return rtValue;
        }

        isSame(mat4: VMat4): boolean {
            return (
                float.vf_appro_zero( this.m00 - mat4.m00) && float.vf_appro_zero( this.m01 - mat4.m01) && float.vf_appro_zero( this.m02 - mat4.m02) && float.vf_appro_zero( this.m03 - mat4.m03) &&
                float.vf_appro_zero( this.m10 - mat4.m10) && float.vf_appro_zero( this.m11 - mat4.m11) && float.vf_appro_zero( this.m12 - mat4.m12) && float.vf_appro_zero( this.m13 - mat4.m13) &&
                float.vf_appro_zero( this.m20 - mat4.m20) && float.vf_appro_zero( this.m21 - mat4.m21) && float.vf_appro_zero( this.m22 - mat4.m22) && float.vf_appro_zero( this.m23 - mat4.m23) &&
                float.vf_appro_zero( this.m30 - mat4.m30) && float.vf_appro_zero( this.m31 - mat4.m31) && float.vf_appro_zero( this.m32 - mat4.m32) && float.vf_appro_zero( this.m33 - mat4.m33)
                 );
        }

        transpose(): VMat4 {
            let rtValue = new VMat4();
            rtValue.set(
                this.m00, this.m10, this.m20, this.m30,
                this.m01, this.m11, this.m21, this.m31,
                this.m02, this.m12, this.m22, this.m32,
                this.m03, this.m13, this.m23, this.m33
            );
            return rtValue;
        }

        inverse(): VMat4 {
            let v0 = this.m20 * this.m31 - this.m21 * this.m30;
            let v1 = this.m20 * this.m32 - this.m22 * this.m30;
            let v2 = this.m20 * this.m33 - this.m23 * this.m30;
            let v3 = this.m21 * this.m32 - this.m22 * this.m31;
            let v4 = this.m21 * this.m33 - this.m23 * this.m31;
            let v5 = this.m22 * this.m33 - this.m23 * this.m32;

            let t00 = + (v5 * this.m11 - v4 * this.m12 + v3 * this.m13);
            let t10 = - (v5 * this.m10 - v2 * this.m12 + v1 * this.m13);
            let t20 = + (v4 * this.m10 - v2 * this.m11 + v0 * this.m13);
            let t30 = - (v3 * this.m10 - v1 * this.m11 + v0 * this.m12);

            let invDet = 1.0 / (t00 * this.m00 + t10 * this.m01 + t20 * this.m02 + t30 * this.m03);

            let d00 = t00 * invDet;
            let d10 = t10 * invDet;
            let d20 = t20 * invDet;
            let d30 = t30 * invDet;

            let d01 = - (v5 * this.m01 - v4 * this.m02 + v3 * this.m03) * invDet;
            let d11 = + (v5 * this.m00 - v2 * this.m02 + v1 * this.m03) * invDet;
            let d21 = - (v4 * this.m00 - v2 * this.m01 + v0 * this.m03) * invDet;
            let d31 = + (v3 * this.m00 - v1 * this.m01 + v0 * this.m02) * invDet;

            v0 = this.m10 * this.m31 - this.m11 * this.m30;
            v1 = this.m10 * this.m32 - this.m12 * this.m30;
            v2 = this.m10 * this.m33 - this.m13 * this.m30;
            v3 = this.m11 * this.m32 - this.m12 * this.m31;
            v4 = this.m11 * this.m33 - this.m13 * this.m31;
            v5 = this.m12 * this.m33 - this.m13 * this.m32;

            let d02 = + (v5 * this.m01 - v4 * this.m02 + v3 * this.m03) * invDet;
            let d12 = - (v5 * this.m00 - v2 * this.m02 + v1 * this.m03) * invDet;
            let d22 = + (v4 * this.m00 - v2 * this.m01 + v0 * this.m03) * invDet;
            let d32 = - (v3 * this.m00 - v1 * this.m01 + v0 * this.m02) * invDet;

            v0 = this.m21 * this.m10 - this.m20 * this.m11;
            v1 = this.m22 * this.m10 - this.m20 * this.m12;
            v2 = this.m23 * this.m10 - this.m20 * this.m13;
            v3 = this.m22 * this.m11 - this.m21 * this.m12;
            v4 = this.m23 * this.m11 - this.m21 * this.m13;
            v5 = this.m23 * this.m12 - this.m22 * this.m13;

            let d03 = - (v5 * this.m01 - v4 * this.m02 + v3 * this.m03) * invDet;
            let d13 = + (v5 * this.m00 - v2 * this.m02 + v1 * this.m03) * invDet;
            let d23 = - (v4 * this.m00 - v2 * this.m01 + v0 * this.m03) * invDet;
            let d33 = + (v3 * this.m00 - v1 * this.m01 + v0 * this.m02) * invDet;

            let rtValue = new VMat4();
            rtValue.set(
                d00, d01, d02, d03,
                d10, d11, d12, d13,
                d20, d21, d22, d23,
                d30, d31, d32, d33
            );
            return rtValue;
        }

        inverseAffine(): VMat4 {
            let t00 = this.m22 * this.m11 - this.m21 * this.m12;
            let t10 = this.m20 * this.m12 - this.m22 * this.m10;
            let t20 = this.m21 * this.m10 - this.m20 * this.m11;

            let invDet = 1 / (this.m00 * t00 + this.m01 * t10 + this.m02 * t20);
            t00 *= invDet; t10 *= invDet; t20 *= invDet;
            let m00 = this.m00 * invDet;
            let m01 = this.m01 * invDet;
            let m02 = this.m02 * invDet;

            let r00 = t00;
            let r01 = m02 * this.m21 - m01 * this.m22;
            let r02 = m01 * this.m12 - m02 * this.m11;

            let r10 = t10;
            let r11 = m00 * this.m22 - m02 * this.m20;
            let r12 = m02 * this.m10 - m00 * this.m12;

            let r20 = t20;
            let r21 = m01 * this.m20 - m00 * this.m21;
            let r22 = m00 * this.m11 - m01 * this.m10;

            let r03 = - (r00 * this.m03 + r01 * this.m13 + r02 * this.m23);
            let r13 = - (r10 * this.m03 + r11 * this.m13 + r12 * this.m23);
            let r23 = - (r20 * this.m03 + r21 * this.m13 + r22 * this.m23);

            let rtValue = new VMat4();
            rtValue.set(
                r00, r01, r02, r03,
                r10, r11, r12, r13,
                r20, r21, r22, r23,
                0  , 0  , 0  , 1
            );
            return rtValue;
        }

        insertMatrix3(mat3: VMat3) {
            this.m00 = mat3.m00; this.m01 = mat3.m01; this.m02 = mat3.m02;
            this.m10 = mat3.m10; this.m11 = mat3.m11; this.m12 = mat3.m12;
            this.m20 = mat3.m20; this.m21 = mat3.m21; this.m22 = mat3.m22;
        }

        extractMatrix3(): VMat3 {
            let rtValue = new VMat3();
            rtValue.set(
                this.m00, this.m01, this.m02,
                this.m10, this.m11, this.m12,
                this.m20, this.m21, this.m22
            );
            return rtValue;
        }

        concatenate(mat4: VMat4): VMat4 {
            return this.leftMulMat4(mat4);
        }

        concatenateAffine(mat4: VMat4): VMat4 {
            let m00 = this.m00 * mat4.m00 + this.m01 * mat4.m10 + this.m02 * mat4.m20;
            let m01 = this.m00 * mat4.m01 + this.m01 * mat4.m11 + this.m02 * mat4.m21;
            let m02 = this.m00 * mat4.m02 + this.m01 * mat4.m12 + this.m02 * mat4.m22;
            let m03 = this.m00 * mat4.m03 + this.m01 * mat4.m13 + this.m02 * mat4.m23 + this.m03;

            let m10 = this.m10 * mat4.m00 + this.m11 * mat4.m10 + this.m12 * mat4.m20;
            let m11 = this.m10 * mat4.m01 + this.m11 * mat4.m11 + this.m12 * mat4.m21;
            let m12 = this.m10 * mat4.m02 + this.m11 * mat4.m12 + this.m12 * mat4.m22;
            let m13 = this.m10 * mat4.m03 + this.m11 * mat4.m13 + this.m12 * mat4.m23 + this.m13;

            let m20 = this.m20 * mat4.m00 + this.m21 * mat4.m10 + this.m22 * mat4.m20;
            let m21 = this.m20 * mat4.m01 + this.m21 * mat4.m11 + this.m22 * mat4.m21;
            let m22 = this.m20 * mat4.m02 + this.m21 * mat4.m12 + this.m22 * mat4.m22;
            let m23 = this.m20 * mat4.m03 + this.m21 * mat4.m13 + this.m22 * mat4.m23 + this.m23;

            let rtValue = new VMat4();
            rtValue.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                  0,   0,   0,   1
            );
            return rtValue;
        }

        isAffine(): boolean {
            return (this.m30 == 0 && this.m31 == 0 && this.m32 == 0 && this.m33 == 1);
        }

        transformAffine(vec3: vector.VFVector3): vector.VFVector3 {
            return new vector.VFVector3(
                this.m00 * vec3.x + this.m01 * vec3.y + this.m02 * vec3.z + this.m03,
                this.m10 * vec3.x + this.m11 * vec3.y + this.m12 * vec3.z + this.m13,
                this.m20 * vec3.x + this.m21 * vec3.y + this.m22 * vec3.z + this.m23
            );
        }

        static CreateFromTrans(vec3: vector.VFVector3): VMat4 {
            let rtValue = new VMat4();
            rtValue.set(
                1.0, 0.0, 0.0, vec3.x,
                0.0, 1.0, 0.0, vec3.y,
                0.0, 0.0, 1.0, vec3.z,
                0.0, 0.0, 0.0, 1.0
            );
            return rtValue;
        }

        static CreateFromScale(s3: vector.VFVector3, fix: vector.VFVector3 = new vector.VFVector3(0, 0, 0)) {
            let rtValue = new VMat4();
            rtValue.set(
                s3.x, 0.0 , 0.0 , (1 - s3.x) * fix.x,
                0.0 , s3.y, 0.0 , (1 - s3.y) * fix.y,
                0.0 , 0.0 , s3.z, (1 - s3.z) * fix.z,
                0.0 , 0.0 , 0.0 , 1.0
            );
            return rtValue;
        }

        static CreateFromRotate(axis: vector.VFVector3, theta: number, pos: vector.VFVector3 = new vector.VFVector3(0, 0, 0)): VMat4 {
            let matT = VMat4.CreateFromTrans(pos);
            let matTInv = matT.inverse();
            let dir = axis.direction();

            let tsin = Math.sin(theta);
            let tcos = Math.cos(theta);
            let tomcos = 1 - tcos;
            let matR = new VMat4();
            matR.fromMat3(new VMat3(
                dir.x * dir.x * tomcos + tcos, dir.x * dir.y * tomcos - dir.z * tsin, dir.x * dir.z * tomcos + dir.y * tsin,
                dir.y * dir.x * tomcos + dir.z * tsin, dir.y * dir.y * tomcos + tcos, dir.y * dir.z * tomcos - dir.x * tsin,
                dir.z * dir.x * tomcos - dir.y * tsin, dir.z * dir.y * tomcos + dir.x * tsin, dir.z * dir.z * tomcos + tcos
            ));

            return matTInv.leftMulMat4(matR.leftMulMat4(matT));
        }

        static CreatePerspective(fovy: number, aspect: number, near: number, far: number): VMat4 {
            let m11 = 1.0 / Math.tan(fovy / 2);
            let m00 = m11 / aspect;
            let m22 = (near + far) / (near - far);
            let m32 = - 1;
            let m23 = 2 * near * far / (near - far);

            return new VMat4(
                m00,   0,   0,   0,
                  0, m11,   0,   0,
                  0,   0, m22, m23,
                  0,   0, m32,   0
            );
        }

        static CreateOrtho(top:number, bottom:number, left:number, right:number, near:number, far:number): VMat4 {
            let m00 = 2 / (right - left);
            let m11 = 2 / (top - bottom);
            let m22 = - 2 / (far - near);
            let m03 = - (right + left) / (right - left);
            let m13 = - (top + bottom) / (top - bottom);
            let m23 = - (far + near) / (far - near);
            let m33 = 1; 
        
            return new VMat4(
                m00,   0,   0, m03,
                  0, m11,   0, m13,
                  0,   0, m22, m23,
                  0,   0,   0, m33
            );
        }

        static CreateLookAt(eyepos: vector.VFVector3, lookat: vector.VFVector3, up: vector.VFVector3): VMat4 {
            let zaxis = eyepos.min(lookat).direction();
            let xaxis = up.direction().cross(zaxis).direction();
            let yaxis = zaxis.cross(xaxis);

            return new VMat4(
                xaxis.x, xaxis.y, xaxis.z, xaxis.negative().dot(eyepos),
                yaxis.x, yaxis.y, yaxis.z, yaxis.negative().dot(eyepos),
                zaxis.x, zaxis.y, zaxis.z, zaxis.negative().dot(eyepos),
                0, 0, 0, 1
            );
        }

        static MAT4_ZERO: VMat4 = new VMat4(
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
        );

        static MAT4_IDENTITY: VMat4 = new VMat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        );
    }

    export class VBigMatrix {
        matrix: Array<Array<number>>;

        constructor(public rowCount: number, public columnCount: number) {
            this.matrix = new Array<Array<number>>();
            for (let i = 0; i < rowCount; i++) {
                let row = new Array<number>();
                for (let j = 0; j < columnCount; j++) {
                    row.push(0);
                }
                this.matrix.push(row);
            }
        }

        random() {
            for (let i = 0; i < this.rowCount; i++) {
                for (let j = 0; j < this.columnCount; j++) {
                    this.matrix[i][j] = Math.random();
                }
            }
        }

        leftMul(bmt: VBigMatrix): VBigMatrix | null {
            if (this.columnCount == bmt.rowCount) {
                let rtValue = new VBigMatrix(this.rowCount, bmt.columnCount);

                for (let i = 0; i < this.rowCount; i++) {
                    for (let j = 0; j < bmt.columnCount; j++) {
                        let sum = 0;
                        for (let k = 0; k < this.columnCount; k++) {
                            sum += this.matrix[i][k] * bmt.matrix[k][j];
                        }
                        rtValue.matrix[i][j] = sum;
                    }
                }
                return rtValue;
            }
            return null;
        }
    }

    export class VBigMatrixTA {
        matrix: Float32Array;

        constructor(public rowCount: number, public columnCount: number) {
            this.matrix = new Float32Array(rowCount * columnCount);
            for (let i = 0; i < rowCount; i++) {
                for (let j = 0; j < columnCount; j++) {
                    this.set(i, j, 0);
                }
            }
        }

        set(row: number, column: number, val: number) {
            this.matrix[row * this.columnCount + column] = val;
        }

        get(row: number, column: number): number {
            return this.matrix[row * this.columnCount + column];
        }

        random() {
            for (let i = 0; i < this.rowCount; i++) {
                for (let j = 0; j < this.columnCount; j++) {
                    this.set(i, j, Math.random());
                }
            }
        }

        leftMul(bmt: VBigMatrixTA): VBigMatrixTA | null {
            if (this.columnCount == bmt.rowCount) {
                let rtValue = new VBigMatrixTA(this.rowCount, bmt.columnCount);

                for (let i = 0; i < this.rowCount; i++) {
                    for (let j = 0; j < bmt.columnCount; j++) {
                        let sum = 0;
                        for (let k = 0; k < this.columnCount; k++) {
                            sum += this.get(i, k) * bmt.get(k, j);
                        }
                        rtValue.set(i, j, sum);
                    }
                }
                return rtValue;
            }
            return null;
        }
    }
}

export { matrix }