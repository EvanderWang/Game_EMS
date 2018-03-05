module float {
    export function vf_appro_zero(val: number): boolean {
        return Math.abs( val ) <= 0.000001;
    }
}

export { float }