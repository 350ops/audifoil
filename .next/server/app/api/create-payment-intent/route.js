"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/create-payment-intent/route";
exports.ids = ["app/api/create-payment-intent/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcreate-payment-intent%2Froute&page=%2Fapi%2Fcreate-payment-intent%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-payment-intent%2Froute.ts&appDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcreate-payment-intent%2Froute&page=%2Fapi%2Fcreate-payment-intent%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-payment-intent%2Froute.ts&appDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_mgl_Projects_audifoil_app_api_create_payment_intent_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/create-payment-intent/route.ts */ \"(rsc)/./app/api/create-payment-intent/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/create-payment-intent/route\",\n        pathname: \"/api/create-payment-intent\",\n        filename: \"route\",\n        bundlePath: \"app/api/create-payment-intent/route\"\n    },\n    resolvedPagePath: \"/Users/mgl/Projects/audifoil/app/api/create-payment-intent/route.ts\",\n    nextConfigOutput,\n    userland: _Users_mgl_Projects_audifoil_app_api_create_payment_intent_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/create-payment-intent/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjcmVhdGUtcGF5bWVudC1pbnRlbnQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmNyZWF0ZS1wYXltZW50LWludGVudCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmNyZWF0ZS1wYXltZW50LWludGVudCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1nbCUyRlByb2plY3RzJTJGYXVkaWZvaWwlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGbWdsJTJGUHJvamVjdHMlMkZhdWRpZm9pbCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDbUI7QUFDaEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib2hvd2F2ZXMtd2ViLz80MjhmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9tZ2wvUHJvamVjdHMvYXVkaWZvaWwvYXBwL2FwaS9jcmVhdGUtcGF5bWVudC1pbnRlbnQvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2NyZWF0ZS1wYXltZW50LWludGVudC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NyZWF0ZS1wYXltZW50LWludGVudFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvY3JlYXRlLXBheW1lbnQtaW50ZW50L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL21nbC9Qcm9qZWN0cy9hdWRpZm9pbC9hcHAvYXBpL2NyZWF0ZS1wYXltZW50LWludGVudC9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvY3JlYXRlLXBheW1lbnQtaW50ZW50L3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcreate-payment-intent%2Froute&page=%2Fapi%2Fcreate-payment-intent%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-payment-intent%2Froute.ts&appDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/create-payment-intent/route.ts":
/*!************************************************!*\
  !*** ./app/api/create-payment-intent/route.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stripe */ \"(rsc)/./node_modules/stripe/esm/stripe.esm.node.js\");\n\n\nconst stripe = new stripe__WEBPACK_IMPORTED_MODULE_1__[\"default\"](process.env.STRIPE_SECRET_KEY, {\n    apiVersion: \"2024-12-18.acacia\"\n});\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { amount, currency = \"usd\", customerEmail, customerName, description, metadata } = body;\n        if (!amount || amount < 50) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid amount\"\n            }, {\n                status: 400\n            });\n        }\n        // Create or retrieve customer\n        let customerId;\n        if (customerEmail) {\n            const customers = await stripe.customers.list({\n                email: customerEmail,\n                limit: 1\n            });\n            if (customers.data.length > 0) {\n                customerId = customers.data[0].id;\n            } else {\n                const customer = await stripe.customers.create({\n                    email: customerEmail,\n                    name: customerName\n                });\n                customerId = customer.id;\n            }\n        }\n        // Create PaymentIntent\n        const paymentIntent = await stripe.paymentIntents.create({\n            amount,\n            currency,\n            customer: customerId,\n            description: description || \"Boho Waves Watersports - Trip Booking\",\n            metadata: metadata || {},\n            automatic_payment_methods: {\n                enabled: true\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            clientSecret: paymentIntent.client_secret,\n            paymentIntentId: paymentIntent.id\n        });\n    } catch (error) {\n        console.error(\"Error creating payment intent:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NyZWF0ZS1wYXltZW50LWludGVudC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBd0Q7QUFDNUI7QUFFNUIsTUFBTUUsU0FBUyxJQUFJRCw4Q0FBTUEsQ0FBQ0UsUUFBUUMsR0FBRyxDQUFDQyxpQkFBaUIsRUFBRztJQUN4REMsWUFBWTtBQUNkO0FBRU8sZUFBZUMsS0FBS0MsT0FBb0I7SUFDN0MsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTUQsUUFBUUUsSUFBSTtRQUMvQixNQUFNLEVBQUVDLE1BQU0sRUFBRUMsV0FBVyxLQUFLLEVBQUVDLGFBQWEsRUFBRUMsWUFBWSxFQUFFQyxXQUFXLEVBQUVDLFFBQVEsRUFBRSxHQUFHUDtRQUV6RixJQUFJLENBQUNFLFVBQVVBLFNBQVMsSUFBSTtZQUMxQixPQUFPWCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO2dCQUFFTyxPQUFPO1lBQWlCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUN0RTtRQUVBLDhCQUE4QjtRQUM5QixJQUFJQztRQUNKLElBQUlOLGVBQWU7WUFDakIsTUFBTU8sWUFBWSxNQUFNbEIsT0FBT2tCLFNBQVMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUFFQyxPQUFPVDtnQkFBZVUsT0FBTztZQUFFO1lBQy9FLElBQUlILFVBQVVJLElBQUksQ0FBQ0MsTUFBTSxHQUFHLEdBQUc7Z0JBQzdCTixhQUFhQyxVQUFVSSxJQUFJLENBQUMsRUFBRSxDQUFDRSxFQUFFO1lBQ25DLE9BQU87Z0JBQ0wsTUFBTUMsV0FBVyxNQUFNekIsT0FBT2tCLFNBQVMsQ0FBQ1EsTUFBTSxDQUFDO29CQUM3Q04sT0FBT1Q7b0JBQ1BnQixNQUFNZjtnQkFDUjtnQkFDQUssYUFBYVEsU0FBU0QsRUFBRTtZQUMxQjtRQUNGO1FBRUEsdUJBQXVCO1FBQ3ZCLE1BQU1JLGdCQUFnQixNQUFNNUIsT0FBTzZCLGNBQWMsQ0FBQ0gsTUFBTSxDQUFDO1lBQ3ZEakI7WUFDQUM7WUFDQWUsVUFBVVI7WUFDVkosYUFBYUEsZUFBZTtZQUM1QkMsVUFBVUEsWUFBWSxDQUFDO1lBQ3ZCZ0IsMkJBQTJCO2dCQUFFQyxTQUFTO1lBQUs7UUFDN0M7UUFFQSxPQUFPakMscURBQVlBLENBQUNVLElBQUksQ0FBQztZQUN2QndCLGNBQWNKLGNBQWNLLGFBQWE7WUFDekNDLGlCQUFpQk4sY0FBY0osRUFBRTtRQUNuQztJQUNGLEVBQUUsT0FBT1QsT0FBWTtRQUNuQm9CLFFBQVFwQixLQUFLLENBQUMsa0NBQWtDQTtRQUNoRCxPQUFPakIscURBQVlBLENBQUNVLElBQUksQ0FBQztZQUFFTyxPQUFPQSxNQUFNcUIsT0FBTztRQUFDLEdBQUc7WUFBRXBCLFFBQVE7UUFBSTtJQUNuRTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9ob3dhdmVzLXdlYi8uL2FwcC9hcGkvY3JlYXRlLXBheW1lbnQtaW50ZW50L3JvdXRlLnRzP2Y2NWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCBTdHJpcGUgZnJvbSAnc3RyaXBlJztcblxuY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShwcm9jZXNzLmVudi5TVFJJUEVfU0VDUkVUX0tFWSEsIHtcbiAgYXBpVmVyc2lvbjogJzIwMjQtMTItMTguYWNhY2lhJyBhcyBhbnksXG59KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc3QgeyBhbW91bnQsIGN1cnJlbmN5ID0gJ3VzZCcsIGN1c3RvbWVyRW1haWwsIGN1c3RvbWVyTmFtZSwgZGVzY3JpcHRpb24sIG1ldGFkYXRhIH0gPSBib2R5O1xuXG4gICAgaWYgKCFhbW91bnQgfHwgYW1vdW50IDwgNTApIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBhbW91bnQnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG9yIHJldHJpZXZlIGN1c3RvbWVyXG4gICAgbGV0IGN1c3RvbWVySWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY3VzdG9tZXJFbWFpbCkge1xuICAgICAgY29uc3QgY3VzdG9tZXJzID0gYXdhaXQgc3RyaXBlLmN1c3RvbWVycy5saXN0KHsgZW1haWw6IGN1c3RvbWVyRW1haWwsIGxpbWl0OiAxIH0pO1xuICAgICAgaWYgKGN1c3RvbWVycy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VzdG9tZXJJZCA9IGN1c3RvbWVycy5kYXRhWzBdLmlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY3VzdG9tZXIgPSBhd2FpdCBzdHJpcGUuY3VzdG9tZXJzLmNyZWF0ZSh7XG4gICAgICAgICAgZW1haWw6IGN1c3RvbWVyRW1haWwsXG4gICAgICAgICAgbmFtZTogY3VzdG9tZXJOYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgY3VzdG9tZXJJZCA9IGN1c3RvbWVyLmlkO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBQYXltZW50SW50ZW50XG4gICAgY29uc3QgcGF5bWVudEludGVudCA9IGF3YWl0IHN0cmlwZS5wYXltZW50SW50ZW50cy5jcmVhdGUoe1xuICAgICAgYW1vdW50LFxuICAgICAgY3VycmVuY3ksXG4gICAgICBjdXN0b21lcjogY3VzdG9tZXJJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiB8fCAnQm9obyBXYXZlcyBXYXRlcnNwb3J0cyAtIFRyaXAgQm9va2luZycsXG4gICAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgICBhdXRvbWF0aWNfcGF5bWVudF9tZXRob2RzOiB7IGVuYWJsZWQ6IHRydWUgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBjbGllbnRTZWNyZXQ6IHBheW1lbnRJbnRlbnQuY2xpZW50X3NlY3JldCxcbiAgICAgIHBheW1lbnRJbnRlbnRJZDogcGF5bWVudEludGVudC5pZCxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHBheW1lbnQgaW50ZW50OicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiU3RyaXBlIiwic3RyaXBlIiwicHJvY2VzcyIsImVudiIsIlNUUklQRV9TRUNSRVRfS0VZIiwiYXBpVmVyc2lvbiIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsImpzb24iLCJhbW91bnQiLCJjdXJyZW5jeSIsImN1c3RvbWVyRW1haWwiLCJjdXN0b21lck5hbWUiLCJkZXNjcmlwdGlvbiIsIm1ldGFkYXRhIiwiZXJyb3IiLCJzdGF0dXMiLCJjdXN0b21lcklkIiwiY3VzdG9tZXJzIiwibGlzdCIsImVtYWlsIiwibGltaXQiLCJkYXRhIiwibGVuZ3RoIiwiaWQiLCJjdXN0b21lciIsImNyZWF0ZSIsIm5hbWUiLCJwYXltZW50SW50ZW50IiwicGF5bWVudEludGVudHMiLCJhdXRvbWF0aWNfcGF5bWVudF9tZXRob2RzIiwiZW5hYmxlZCIsImNsaWVudFNlY3JldCIsImNsaWVudF9zZWNyZXQiLCJwYXltZW50SW50ZW50SWQiLCJjb25zb2xlIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/create-payment-intent/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/stripe"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcreate-payment-intent%2Froute&page=%2Fapi%2Fcreate-payment-intent%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-payment-intent%2Froute.ts&appDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmgl%2FProjects%2Faudifoil&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();