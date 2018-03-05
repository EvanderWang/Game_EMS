import { float } from "./float";

module radian {
    export class VFDegree {
        constructor(public mDeg: number) { }

        valueDegrees(): number {
            return this.mDeg;
        }

        valueRadians(): number {
            return this.mDeg * (Math.PI / 180);
        }

        add(deg: VFDegree): VFDegree {
            return new VFDegree(this.mDeg + deg.mDeg);
        }

        min(deg: VFDegree): VFDegree {
            return new VFDegree(this.mDeg - deg.mDeg);
        }

        mulNumber(scale: number): VFDegree {
            return new VFDegree(this.mDeg * scale);
        }

        div(deg: VFDegree): number {
            return this.mDeg / deg.mDeg;
        }

        divNumber(scale: number): VFDegree {
            return new VFDegree(this.mDeg / scale);
        }

        isSame(deg: VFDegree): boolean {
            return float.vf_appro_zero(this.mDeg - deg.mDeg);
        }

        isLarger(deg: VFDegree): boolean {
            return this.mDeg > deg.mDeg;
        }

        isSmaller(deg: VFDegree): boolean {
            return this.mDeg < deg.mDeg;
        }

        static FromRadian(rad: VFRadian): VFDegree {
            return new VFDegree(rad.valueDegrees());
        }
    }

    export class VFRadian {
        constructor(public mRad: number) { }

        valueDegrees(): number {
            return this.mRad * (180 / Math.PI); 
        }

        valueRadians(): number {
            return this.mRad;
        }

        add(rad: VFRadian): VFRadian {
            return new VFRadian(this.mRad + rad.mRad);
        }

        min(rad: VFRadian): VFRadian {
            return new VFRadian(this.mRad - rad.mRad);
        }

        mulNumber(scale: number): VFRadian {
            return new VFRadian(this.mRad * scale);
        }

        div(rad: VFRadian): number {
            return this.mRad / rad.mRad;
        }

        divNumber(scale: number): VFRadian {
            return new VFRadian(this.mRad / scale);
        }

        isSame(rad: VFRadian): boolean {
            return float.vf_appro_zero(this.mRad - rad.mRad);
        }

        isLarger(rad: VFRadian): boolean {
            return this.mRad > rad.mRad;
        }

        isSmaller(rad: VFRadian): boolean {
            return this.mRad < rad.mRad;
        }

        static FromDegree(deg: VFDegree): VFRadian {
            return new VFRadian(deg.valueRadians());
        }
    }
}

export { radian }