class VGUID {
    str: string;

    constructor(s?: string) {
        if (s != undefined) {
            this.str = s.toLowerCase();
        }
        else {
            var len = 32;//32长度
            var radix = 16;//16进制
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;
            if (len) {
                let shift = 0;
                for (i = 0; i < len; i++) {
                    uuid[i + shift] = chars[0 | Math.random() * radix];
                    if ((7 == i) || (11 == i) || (15 == i) || (19 == i)) {
                        shift++;
                        uuid[i + shift] = '-';
                    }
                }
            }
            else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++){
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            this.str = uuid.join('').toLowerCase();            
        }
    }

    toString(): string {
        return this.str;
    }

    equal(src: VGUID): boolean {
        if (src.str == this.str)
            return true;
        return false;
    }
}

export { VGUID }