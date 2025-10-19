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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyw4QkFBOEIsQ0FBQztRQUM3RSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQztRQUN2RSxZQUFZLEVBQUUsQ0FBQyxNQUFjLEVBQUUsV0FBbUIsRUFBRSxFQUFFLENBQ3BELHNCQUFXLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7UUFDbEUsaUJBQWlCLEVBQUUsQ0FBQyxNQUFjLEVBQUUsV0FBbUIsRUFBRSxFQUFFLENBQ3pELHNCQUFXLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7UUFDdkUsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEVBQUUsQ0FDaEQsc0JBQVcsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztLQUMvRDtDQUNGLENBQUM7QUFFRix3QkFBYSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0xTIFZhcmllZGFkZXMgLSBQRFYvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0xTIFZhcmllZGFkZXMgLSBQRFYvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vTFMgVmFyaWVkYWRlcyAtIFBEVi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9MUyBWYXJpZWRhZGVzIC0gUERWLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIERpc2FibGUgbm8tdW51c2VkLXZhcnMsIGJyb2tlbiBmb3Igc3ByZWFkIGFyZ3Ncbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogb2ZmICovXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciwgSXBjUmVuZGVyZXJFdmVudCB9IGZyb20gJ2VsZWN0cm9uJztcblxuZXhwb3J0IHR5cGUgQ2hhbm5lbHMgPSAnaXBjLWV4YW1wbGUnO1xuXG5jb25zdCBlbGVjdHJvbkhhbmRsZXIgPSB7XG4gIGlwY1JlbmRlcmVyOiB7XG4gICAgc2VuZE1lc3NhZ2UoY2hhbm5lbDogQ2hhbm5lbHMsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICB9LFxuICAgIG9uKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4gICAgfSxcbiAgfSxcblxuICBcbiAgZGF0YWJhc2U6IHtcbiAgICBnZXRQcm9kdWN0czogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpnZXRQcm9kdWN0cycpLFxuICAgIGdldFByb2R1Y3Q6IChpZDogbnVtYmVyKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmdldFByb2R1Y3QnLCBpZCksXG4gICAgYWRkUHJvZHVjdDogKHByb2R1Y3REYXRhOiBhbnkpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6YWRkUHJvZHVjdCcsIHByb2R1Y3REYXRhKSxcbiAgICB1cGRhdGVQcm9kdWN0OiAocHJvZHVjdElkOiBudW1iZXIsIHByb2R1Y3REYXRhOiBhbnkpID0+IFxuICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTp1cGRhdGVQcm9kdWN0JywgcHJvZHVjdElkLCBwcm9kdWN0RGF0YSksXG4gICAgZGVsZXRlUHJvZHVjdDogKHByb2R1Y3RJZDogbnVtYmVyKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmRlbGV0ZVByb2R1Y3QnLCBwcm9kdWN0SWQpLFxuICAgIHVwZGF0ZVByb2R1Y3RTdG9jazogKHByb2R1Y3RJZDogbnVtYmVyLCBuZXdTdG9jazogbnVtYmVyKSA9PiBcbiAgICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6dXBkYXRlUHJvZHVjdFN0b2NrJywgcHJvZHVjdElkLCBuZXdTdG9jayksXG4gICAgY3JlYXRlU2FsZTogKHNhbGVEYXRhOiBhbnkpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6Y3JlYXRlU2FsZScsIHNhbGVEYXRhKSxcbiAgICBnZXRTYWxlc1dpdGhJdGVtczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpnZXRTYWxlc1dpdGhJdGVtcycpLFxuICAgIFxuICBcbiAgICBvcGVuQ2FzaFJlZ2lzdGVyOiAoaW5pdGlhbEFtb3VudDogbnVtYmVyKSA9PiBcbiAgICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6b3BlbkNhc2hSZWdpc3RlcicsIGluaXRpYWxBbW91bnQpLFxuICAgIGNsb3NlQ2FzaFJlZ2lzdGVyOiAoZmluYWxBbW91bnQ6IG51bWJlciwgb2JzZXJ2YXRpb25zOiBzdHJpbmcpID0+IFxuICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKCdkYXRhYmFzZTpjbG9zZUNhc2hSZWdpc3RlcicsIGZpbmFsQW1vdW50LCBvYnNlcnZhdGlvbnMpLFxuICAgIGdldE9wZW5DYXNoUmVnaXN0ZXI6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6Z2V0T3BlbkNhc2hSZWdpc3RlcicpLFxuICAgIGdldENhc2hSZWdpc3RlcnM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6Z2V0Q2FzaFJlZ2lzdGVycycpLFxuICAgIGFkZENhc2hFbnRyeTogKGFtb3VudDogbnVtYmVyLCBkZXNjcmlwdGlvbjogc3RyaW5nKSA9PiBcbiAgICAgIGlwY1JlbmRlcmVyLmludm9rZSgnZGF0YWJhc2U6YWRkQ2FzaEVudHJ5JywgYW1vdW50LCBkZXNjcmlwdGlvbiksXG4gICAgYWRkQ2FzaFdpdGhkcmF3YWw6IChhbW91bnQ6IG51bWJlciwgZGVzY3JpcHRpb246IHN0cmluZykgPT4gXG4gICAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmFkZENhc2hXaXRoZHJhd2FsJywgYW1vdW50LCBkZXNjcmlwdGlvbiksXG4gICAgZ2V0TW9udGhseVJlcG9ydDogKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlcikgPT4gXG4gICAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2RhdGFiYXNlOmdldE1vbnRobHlSZXBvcnQnLCB5ZWFyLCBtb250aCksXG4gIH0sXG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIGVsZWN0cm9uSGFuZGxlcik7XG5cbmV4cG9ydCB0eXBlIEVsZWN0cm9uSGFuZGxlciA9IHR5cGVvZiBlbGVjdHJvbkhhbmRsZXI7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9