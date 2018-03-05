import { VGUID } from "../Lib/Std/guid";

module module_main{
    export function main(){
        let i = new VGUID();

        console.log(i.toString());
    }
}

export { module_main }
