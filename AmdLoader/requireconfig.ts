requirejs.config({
    // baseUrl: basePath,
    // paths: {
    //     jquery: jqueryPath,
    //     alioss: aliossPath,
    //     //opentype: opentypePath,// 仅用于生成文字网格 发布时不允许使用
    //     //contours: contoursPath,// 仅用于生成文字网格 发布时不允许使用
    //     //triangulate: triangulatePath,// 仅用于生成文字网格 发布时不允许使用
    // },
    // map: {
    //     '*': {
    //         'style': cssPath,
    //         'text': textPath,
    //         'image': imagePath,
    //     }
    // },
    // urlArgs: "SMTLine2.17.150",
});

let scripts = document.getElementsByTagName("script");
let mainpoint = "";
for (let i = 0; i < scripts.length; i++) {
    if(scripts[i].dataset.mainpoint){
        mainpoint = "../" + scripts[i].dataset.mainpoint;
        break;
    }
}

requirejs([mainpoint], ( mp ) => {
    mp.module_main.main();
})
