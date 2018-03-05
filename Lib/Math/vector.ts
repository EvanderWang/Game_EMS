import { float } from "./float";

module vector {
    export class VFVector2 {
        x: number;
        y: number;

        constructor(x?: number, y?:number) {
            this.x = x == undefined ? 0 : x;
            this.y = y == undefined ? 0 : y;
        }

        set(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        setVec(vec2: VFVector2) {
            this.x = vec2.x;
            this.y = vec2.y;
        }

        add(vec2: VFVector2): VFVector2 {
            return new VFVector2(this.x + vec2.x, this.y + vec2.y);
        }

        min(vec2: VFVector2): VFVector2 {
            return new VFVector2(this.x - vec2.x, this.y - vec2.y);
        }

        mul(vec2: VFVector2): VFVector2 {
            return new VFVector2(this.x * vec2.x, this.y * vec2.y);
        }

        div(vec2: VFVector2): VFVector2 | null {
            if (float.vf_appro_zero(vec2.x) || float.vf_appro_zero(vec2.y)) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector2(this.x / vec2.x, this.y / vec2.y);
            }
        }

        mulNumber(f: number): VFVector2 {
            return new VFVector2(this.x * f, this.y * f);
        }

        divNumber(f: number): VFVector2 | null {
            if (float.vf_appro_zero(f)) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector2(this.x / f, this.y / f);
            }
        }

        negative(): VFVector2 {
            return new VFVector2(-this.x, -this.y);
        }

        // 点积
        dot(vec2: VFVector2): number { 
            return this.x * vec2.x + this.y * vec2.y;
        }

        // |x1*x2| + |y1*y2|
        absDot(vec2: VFVector2): number { 
            return Math.abs(this.x * vec2.x) + Math.abs(this.y * vec2.y);
        }

        // 模的平方
        sqrMagnitude(): number {
            return this.dot(this);
        }

        // 模长
        magnitude(): number {
            return Math.sqrt(this.sqrMagnitude());
        }

        direction(): VFVector2 {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
                return new VFVector2();
            } else {
                let magnitude = this.magnitude();
                return <VFVector2>this.divNumber(magnitude);
            }
        }

        normalize() {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
            } else {
                let magnitude = this.magnitude();
                this.x /= magnitude;
                this.y /= magnitude;
            }
        }

        isSame(vec2: VFVector2): boolean {
            return (float.vf_appro_zero(this.x - vec2.x) && float.vf_appro_zero(this.y - vec2.y));
        }

        cross(vec2: VFVector2): number {
            return this.x * vec2.y - this.y * vec2.x;
        }

        isZero(): boolean {
            return float.vf_appro_zero(this.sqrMagnitude());
        }

        isNormalized(): boolean {
            return float.vf_appro_zero(1.0 - this.sqrMagnitude());
        }

        // 笛卡尔坐标系 -> 极坐标系
        cartesian2Polar(): VFVector2 {
            if (this.isZero()) {
                return new VFVector2();
            }
            let r = this.magnitude();
            let fValue = this.x / r;
            let theta: number;

            if (fValue >= 1.0 ) {
                theta = 0;
            } else if (fValue <= -1.0) {
                theta = Math.PI;
            } else {
                theta = Math.acos(fValue);
            }

            if (this.y < 0) {
                return new VFVector2(-theta, r);
            } else {
                return new VFVector2(theta, r);
            }
        }

        // 极坐标系 -> 笛卡尔坐标系
        polar2Cartesian(): VFVector2 {
            return new VFVector2(Math.cos(this.x), Math.sin(this.x)).mulNumber(this.y);
        }

        static ORIGIN: VFVector2 = new VFVector2(0, 0);
        static ZERO: VFVector2 = new VFVector2(0, 0);
        static AXIS_X: VFVector2 = new VFVector2(1, 0);
        static AXIS_Y: VFVector2 = new VFVector2(0, 1);
        static AXIS_NEG_X: VFVector2 = new VFVector2(-1, 0);
        static AXIS_NEG_Y: VFVector2 = new VFVector2(0, -1);
        static UNIT_SCALE: VFVector2 = new VFVector2(1, 1);
    }

    export class VFVector3 {
        x: number;
        y: number;
        z: number;

        constructor(x?: number, y?: number, z?: number) {
            this.x = x == undefined ? 0 : x;
            this.y = y == undefined ? 0 : y;
            this.z = z == undefined ? 0 : z;
        }

        set(x: number, y: number, z: number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        setVec(vec3: VFVector3) {
            this.x = vec3.x;
            this.y = vec3.y;
            this.z = vec3.z;
        }

        add(vec3: VFVector3): VFVector3 {
            return new VFVector3(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
        }

        min(vec3: VFVector3): VFVector3 {
            return new VFVector3(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
        }

        mul(vec3: VFVector3): VFVector3 {
            return new VFVector3(this.x * vec3.x, this.y * vec3.y, this.z * vec3.z);
        }

        div(vec3: VFVector3): VFVector3 | null {
            if (float.vf_appro_zero(vec3.x) || float.vf_appro_zero(vec3.y) || float.vf_appro_zero(vec3.z)) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector3(this.x / vec3.x, this.y / vec3.y, this.z / vec3.z);
            }
        }

        mulNumber(f: number): VFVector3 {
            return new VFVector3(this.x * f, this.y * f, this.z * f);
        }

        divNumber(f: number): VFVector3 | null {
            if (float.vf_appro_zero(f)) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector3(this.x / f, this.y / f, this.z / f);
            }
        }

        negative(): VFVector3 {
            return new VFVector3(-this.x, -this.y, -this.z);
        }

        // 点积
        dot(vec3: VFVector3): number {
            return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z;
        }

        // |x1*x2| + |y1*y2| + |z1*z2|
        absDot(vec3: VFVector3): number {
            return Math.abs(this.x * vec3.x) + Math.abs(this.y * vec3.y) + Math.abs(this.z * vec3.z);
        }

        // 模的平方
        sqrMagnitude(): number {
            return this.dot(this);
        }

        // 模长
        magnitude(): number {
            return Math.sqrt(this.sqrMagnitude());
        }

        direction(): VFVector3 {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
                return new VFVector3();
            } else {
                let magnitude = this.magnitude();
                return <VFVector3>this.divNumber(magnitude);
            }
        }

        normalize() {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
            } else {
                let magnitude = this.magnitude();
                this.x /= magnitude;
                this.y /= magnitude;
                this.z /= magnitude;
            }
        }


        isSame(vec3: VFVector3): boolean {
            return (float.vf_appro_zero(this.x - vec3.x) && float.vf_appro_zero(this.y - vec3.y) && float.vf_appro_zero(this.z - vec3.z));
        }

        cross(vec3: VFVector3): VFVector3 {
            return new VFVector3(this.y * vec3.z - this.z * vec3.y,this.z * vec3.x - this.x * vec3.z,this.x * vec3.y - this.y * vec3.x);
        }

        isZero(): boolean {
            return float.vf_appro_zero(this.sqrMagnitude());
        }

        isNormalized(): boolean {
            return float.vf_appro_zero(1.0 - this.sqrMagnitude());
        }

        // 生成一个与自己垂直的向量( 任意 )
        createOrthoVector(): VFVector3 {
            if (Math.abs(this.x) > Math.abs(this.y)) {
                if (Math.abs(this.x) < Math.abs(this.z))
                    return this.cross(VFVector3.AXIS_Y);

                return this.cross(VFVector3.AXIS_Z);
            }
            else {
                //if (Math.abs(this.y) < Math.abs(this.z))
                //    return this.cross(VFVector3.AXIS_X);

                return this.cross(VFVector3.AXIS_X);
            }
        }

        createOrthoNormal(): VFVector3 {
            return this.createOrthoVector().direction();
        }

        static ORIGIN: VFVector3 = new VFVector3(0, 0, 0);
        static ZERO: VFVector3 = new VFVector3(0, 0, 0);
        static AXIS_X: VFVector3 = new VFVector3(1, 0, 0);
        static AXIS_Y: VFVector3 = new VFVector3(0, 1, 0);
        static AXIS_Z: VFVector3 = new VFVector3(0, 0, 1);
        static AXIS_NEG_X: VFVector3 = new VFVector3(-1, 0, 0);
        static AXIS_NEG_Y: VFVector3 = new VFVector3(0, -1, 0);
        static AXIS_NEG_Z: VFVector3 = new VFVector3(0, 0, -1);
        static UNIT_SCALE: VFVector3 = new VFVector3(1, 1, 1);
    }

    export class VFVector4 {
        x: number;
        y: number;
        z: number;
        w: number;

        constructor(x?: number, y?: number, z?: number, w?: number) {
            this.x = x == undefined ? 0 : x;
            this.y = y == undefined ? 0 : y;
            this.z = z == undefined ? 0 : z;
            this.w = w == undefined ? 0 : w;
        }

        set(x: number, y: number, z: number, w: number) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        setVec(vec4: VFVector4) {
            this.x = vec4.x;
            this.y = vec4.y;
            this.z = vec4.z;
            this.w = vec4.w;
        }

        add(vec4: VFVector4): VFVector4 {
            return new VFVector4(this.x + vec4.x, this.y + vec4.y, this.z + vec4.z, this.w + vec4.w);
        }

        min(vec4: VFVector4): VFVector4 {
            return new VFVector4(this.x - vec4.x, this.y - vec4.y, this.z - vec4.z, this.w - vec4.w);
        }

        mul(vec4: VFVector4): VFVector4 {
            return new VFVector4(this.x * vec4.x, this.y * vec4.y, this.z * vec4.z, this.w * vec4.w);
        }

        div(vec4: VFVector4): VFVector4 | null {
            if (float.vf_appro_zero(vec4.x)
                || float.vf_appro_zero(vec4.y)
                || float.vf_appro_zero(vec4.z)
                || float.vf_appro_zero(vec4.w)
            ) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector4(this.x / vec4.x, this.y / vec4.y, this.z / vec4.z, this.w / vec4.w);
            }
        }

        mulNumber(f: number): VFVector4 {
            return new VFVector4(this.x * f, this.y * f, this.z * f, this.w * f);
        }

        divNumber(f: number): VFVector4 | null {
            if (float.vf_appro_zero(f)) {
                console.error("can not div 0.");
                return null;
            } else {
                return new VFVector4(this.x / f, this.y / f, this.z / f, this.w / f);
            }
        }

        negative(): VFVector4 {
            return new VFVector4(-this.x, -this.y, -this.z, -this.w);
        }

        // 模的平方
        sqrMagnitude(): number {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }

        // 模长
        magnitude(): number {
            return Math.sqrt(this.sqrMagnitude());
        }

        direction(): VFVector4 {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
                return new VFVector4();
            } else {
                let magnitude = this.magnitude();
                return <VFVector4>this.divNumber(magnitude);
            }
        }

        normalize() {
            if (this.isZero()) {
                console.error("can not normalize 0 vector.");
            } else {
                let magnitude = this.magnitude();
                this.x /= magnitude;
                this.y /= magnitude;
                this.z /= magnitude;
                this.w /= magnitude;
            }
        }

        isSame(vec4: VFVector4): boolean {
            return (float.vf_appro_zero(this.x - vec4.x)
                && float.vf_appro_zero(this.y - vec4.y)
                && float.vf_appro_zero(this.z - vec4.z)
                && float.vf_appro_zero(this.w - vec4.w));
        }

        isZero(): boolean {
            return float.vf_appro_zero(this.sqrMagnitude());
        }

        isNormalized(): boolean {
            return float.vf_appro_zero(1.0 - this.sqrMagnitude());
        }

        static ORIGIN: VFVector4 = new VFVector4(0, 0, 0, 0);
        static ZERO: VFVector4 = new VFVector4(0, 0, 0, 0);
        static AXIS_X: VFVector4 = new VFVector4(1, 0, 0, 0);
        static AXIS_Y: VFVector4 = new VFVector4(0, 1, 0, 0);
        static AXIS_Z: VFVector4 = new VFVector4(0, 0, 1, 0);
        static AXIS_W: VFVector4 = new VFVector4(0, 0, 0, 1);
        static AXIS_NEG_X: VFVector4 = new VFVector4(-1, 0, 0, 0);
        static AXIS_NEG_Y: VFVector4 = new VFVector4(0, -1, 0, 0);
        static AXIS_NEG_Z: VFVector4 = new VFVector4(0, 0, -1, 0);
        static AXIS_NEG_W: VFVector4 = new VFVector4(0, 0, 0, -1);
        static UNIT_SCALE: VFVector4 = new VFVector4(1, 1, 1, 1);
    }

    export type VNVector2UI = VFVector2;
    export type VNVector3UI = VFVector3;
    export type VNVector4UI = VFVector4;

    export class VF3Ctrller {
        static GetArray(v: VFVector3): number[] {
            return [v.x, v.y, v.z];
        }

        static Set(v: VFVector3, idx: number, val: number) {
            let eIndex = idx % 3;
            if (eIndex == 0) {
                v.x = val;
            } else if (eIndex == 1) {
                v.y = val;
            } else {
                v.z = val;
            }
        }
    }
}

export { vector }