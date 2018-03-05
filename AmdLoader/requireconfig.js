requirejs.config({});
let scripts = document.getElementsByTagName("script");
let mainpoint = "";
for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].dataset.mainpoint) {
        mainpoint = "../" + scripts[i].dataset.mainpoint;
        break;
    }
}
requirejs([mainpoint], (mp) => {
    mp.module_main.main();
});
//# sourceMappingURL=requireconfig.js.map