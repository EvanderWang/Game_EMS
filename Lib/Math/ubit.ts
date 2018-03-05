module ubit {
    export function u32(i32: number): number {
        return i32 >>> 0;
    }

    export var VD_INVALID_INDEX = u32(-1);
}

export { ubit }