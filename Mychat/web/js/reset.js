
    // 重命名 Electron 提供的 require
    window._require = window.require;
    window._exports = window.exports;
    window._module  = window.module;

    delete window.require;
    delete window.exports;
    delete window.module;