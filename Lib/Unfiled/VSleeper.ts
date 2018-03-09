
class VSleeper {
    static sleep( ms: number ){
        let starttime = new Date();
        while((new Date().getTime() - starttime.getTime()) < ms) {}
    }
}

export{ VSleeper }