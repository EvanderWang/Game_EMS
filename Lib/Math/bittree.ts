module bittree {
    export class VBitTree {
        m_vCumulativeFreq: Uint32Array;

        constructor(private size: number, initVal: number = 0) {
            this.m_vCumulativeFreq = new Uint32Array(size + 1);
            for (let i = 0; i < this.m_vCumulativeFreq.length; i++){
                this.m_vCumulativeFreq[i] = 0;
            }

            if (initVal != 0) {
                for (let i = 0; i < size; i++) {
                    for (let n = 0; n < initVal; n++) {
                        this.UpdateFreq(i);
                    }
                }
            }
        }

        GetCumulativeFrequency(idx: number): number {
            let sum = 0;
            while (idx > 0) {
                sum += this.m_vCumulativeFreq[idx];
                idx -= this.LowBitPos(idx);        //低位1减1
            }
            return sum;
        }

        UpdateFreq(idx: number) {
            idx += 1;
            while (idx <= this.m_vCumulativeFreq.length && idx > 0) {
                this.m_vCumulativeFreq[idx] += 1;
                idx += this.LowBitPos(idx);         //低位1加1
            }
        }

        GetTotalFreq(): number {
            return this.m_vCumulativeFreq[this.size];
        }

        private LowBitPos(val: number): number {
            return (val & (~val + 1));
        }
    }
}

export { bittree }