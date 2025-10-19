(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
const electron_1 = __webpack_require__(/*! electron */ "electron");
const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, ...args) {
            electron_1.ipcRenderer.send(channel, ...args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) => func(...args);
            electron_1.ipcRenderer.on(channel, subscription);
            return () => {
                electron_1.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },
    database: {
        getProducts: () => electron_1.ipcRenderer.invoke('database:getProducts'),
        getProduct: (id) => electron_1.ipcRenderer.invoke('database:getProduct', id),
        addProduct: (productData) => electron_1.ipcRenderer.invoke('database:addProduct', productData),
        updateProduct: (productId, productData) => electron_1.ipcRenderer.invoke('database:updateProduct', productId, productData),
        deleteProduct: (productId) => electron_1.ipcRenderer.invoke('database:deleteProduct', productId),
        updateProductStock: (productId, newStock) => electron_1.ipcRenderer.invoke('database:updateProductStock', productId, newStock),
        createSale: (saleData) => electron_1.ipcRenderer.invoke('database:createSale', saleData),
        getSalesWithItems: () => electron_1.ipcRenderer.invoke('database:getSalesWithItems'),
        openCashRegister: (initialAmount) => electron_1.ipcRenderer.invoke('database:openCashRegister', initialAmount),
        closeCashRegister: (finalAmount, observations) => electron_1.ipcRenderer.invoke('database:closeCashRegister', finalAmount, observations),
        getOpenCashRegister: () => electron_1.ipcRenderer.invoke('database:getOpenCashRegister'),
        getCashRegisters: () => electron_1.ipcRenderer.invoke('database:getCashRegisters'),
        addCashEntry: (amount, description) => electron_1.ipcRenderer.invoke('database:addCashEntry', amount, description),
        addCashWithdrawal: (amount, description) => electron_1.ipcRenderer.invoke('database:addCashWithdrawal', amount, description),
        getMonthlyReport: (year, month) => electron_1.ipcRenderer.invoke('database:getMonthlyReport', year, month),
    },
};
electron_1.contextBridge.exposeInMainWorld('electron', electronHandler);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQzdFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFXLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDO1FBQ3ZFLFlBQVksRUFBRSxDQUFDLE1BQWMsRUFBRSxXQUFtQixFQUFFLEVBQUUsQ0FDcEQsc0JBQVcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQztRQUNsRSxpQkFBaUIsRUFBRSxDQUFDLE1BQWMsRUFBRSxXQUFtQixFQUFFLEVBQUUsQ0FDekQsc0JBQVcsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQztRQUN2RSxnQkFBZ0IsRUFBRSxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsRUFBRSxDQUNoRCxzQkFBVyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO0tBQy9EO0NBQ0YsQ0FBQztBQUVGLHdCQUFhLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTFMgVmFyaWVkYWRlcyAtIFBEVi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTFMgVmFyaWVkYWRlcyAtIFBEVi9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9MUyBWYXJpZWRhZGVzIC0gUERWL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0xTIFZhcmllZGFkZXMgLSBQRFYvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gRGlzYWJsZSBuby11bnVzZWQtdmFycywgYnJva2VuIGZvciBzcHJlYWQgYXJnc1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBvZmYgKi9cbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyLCBJcGNSZW5kZXJlckV2ZW50IH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5leHBvcnQgdHlwZSBDaGFubmVscyA9ICdpcGMtZXhhbXBsZSc7XG5cbmNvbnN0IGVsZWN0cm9uSGFuZGxlciA9IHtcbiAgaXBjUmVuZGVyZXI6IHtcbiAgICBzZW5kTWVzc2FnZShjaGFubmVsOiBDaGFubmVscywgLi4uYXJnczogdW5rbm93bltdKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgb24oY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IHVua25vd25bXSkgPT5cbiAgICAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlwY1JlbmRlcmVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9O1xuICAgIH0sXG4gICAgb25jZShjaGFubmVsOiBDaGFubmVscywgZnVuYzogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZCkge1xuICAgICAgaXBjUmVuZGVyZXIub25jZShjaGFubmVsLCAoX2V2ZW50LCAuLi5hcmdzKSA9PiBmdW5jKC4uLmFyZ3MpKTtcbiAgICB9LFxuICB9LFxuXG4gIFxuICBkYXRhYmFzZToge1xuICAgIGdldFByb2R1Y3RzOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmdldFByb2R1Y3RzJyksXG4gICAgZ2V0UHJvZHVjdDogKGlkOiBudW1iZXIpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6Z2V0UHJvZHVjdCcsIGlkKSxcbiAgICBhZGRQcm9kdWN0OiAocHJvZHVjdERhdGE6IGFueSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTphZGRQcm9kdWN0JywgcHJvZHVjdERhdGEpLFxuICAgIHVwZGF0ZVByb2R1Y3Q6IChwcm9kdWN0SWQ6IG51bWJlciwgcHJvZHVjdERhdGE6IGFueSkgPT4gXG4gICAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOnVwZGF0ZVByb2R1Y3QnLCBwcm9kdWN0SWQsIHByb2R1Y3REYXRhKSxcbiAgICBkZWxldGVQcm9kdWN0OiAocHJvZHVjdElkOiBudW1iZXIpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6ZGVsZXRlUHJvZHVjdCcsIHByb2R1Y3RJZCksXG4gICAgdXBkYXRlUHJvZHVjdFN0b2NrOiAocHJvZHVjdElkOiBudW1iZXIsIG5ld1N0b2NrOiBudW1iZXIpID0+IFxuICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTp1cGRhdGVQcm9kdWN0U3RvY2snLCBwcm9kdWN0SWQsIG5ld1N0b2NrKSxcbiAgICBjcmVhdGVTYWxlOiAoc2FsZURhdGE6IGFueSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpjcmVhdGVTYWxlJywgc2FsZURhdGEpLFxuICAgIGdldFNhbGVzV2l0aEl0ZW1zOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmdldFNhbGVzV2l0aEl0ZW1zJyksXG4gICAgXG4gIFxuICAgIG9wZW5DYXNoUmVnaXN0ZXI6IChpbml0aWFsQW1vdW50OiBudW1iZXIpID0+IFxuICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpvcGVuQ2FzaFJlZ2lzdGVyJywgaW5pdGlhbEFtb3VudCksXG4gICAgY2xvc2VDYXNoUmVnaXN0ZXI6IChmaW5hbEFtb3VudDogbnVtYmVyLCBvYnNlcnZhdGlvbnM6IHN0cmluZykgPT4gXG4gICAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmNsb3NlQ2FzaFJlZ2lzdGVyJywgZmluYWxBbW91bnQsIG9ic2VydmF0aW9ucyksXG4gICAgZ2V0T3BlbkNhc2hSZWdpc3RlcjogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpnZXRPcGVuQ2FzaFJlZ2lzdGVyJyksXG4gICAgZ2V0Q2FzaFJlZ2lzdGVyczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpnZXRDYXNoUmVnaXN0ZXJzJyksXG4gICAgYWRkQ2FzaEVudHJ5OiAoYW1vdW50OiBudW1iZXIsIGRlc2NyaXB0aW9uOiBzdHJpbmcpID0+IFxuICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTphZGRDYXNoRW50cnknLCBhbW91bnQsIGRlc2NyaXB0aW9uKSxcbiAgICBhZGRDYXNoV2l0aGRyYXdhbDogKGFtb3VudDogbnVtYmVyLCBkZXNjcmlwdGlvbjogc3RyaW5nKSA9PiBcbiAgICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6YWRkQ2FzaFdpdGhkcmF3YWwnLCBhbW91bnQsIGRlc2NyaXB0aW9uKSxcbiAgICBnZXRNb250aGx5UmVwb3J0OiAoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyKSA9PiBcbiAgICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6Z2V0TW9udGhseVJlcG9ydCcsIHllYXIsIG1vbnRoKSxcbiAgfSxcbn07XG5cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2VsZWN0cm9uJywgZWxlY3Ryb25IYW5kbGVyKTtcblxuZXhwb3J0IHR5cGUgRWxlY3Ryb25IYW5kbGVyID0gdHlwZW9mIGVsZWN0cm9uSGFuZGxlcjsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=