import VueResource from 'vue-resource';
import http from './../components/modules/http.vue';
import eventBus from './../components/modules/event.vue';
import storage from './../components/modules/storage.vue';
import App from './../components/pages/App.vue';
import LoginPage from './../components/pages/login-page.vue';
import RegistrationPage from './../components/pages/registration-page.vue';
import DashboardPage from './../components/pages/dashboard-page.vue';
import LogsPage from './../components/pages/logs-page.vue';
import LogPage from './../components/pages/log-page.vue';
import StationsPage from './../components/pages/stations-page.vue';
import StationPage from './../components/pages/station-page.vue';
import SettingsPage from './../components/pages/settings-page.vue';
import DebugSettingsPage from './../components/pages/debug-settings-page.vue';

Vue.use(VueMaterial.default);
Vue.use(VueResource);
Vue.use(VueRouter);

// for session
Vue.http.options.credentials = true;

// the router
var router = new VueRouter({
    routes: [{
            path: '/',
            component: LoginPage
        },
        {
            path: '/register',
            component: RegistrationPage
        },
        {
            path: '/dashboard',
            component: DashboardPage
        },
        {
            path: '/logs',
            component: LogsPage
        },
        {
            path: '/log',
            component: LogPage
        },
        {
            path: '/stations',
            component: StationsPage
        },
        {
            path: '/station',
            component: StationPage
        },
        {
            path: '/settings',
            component: SettingsPage
        },
        {
            path: '/debugsettings',
            component: DebugSettingsPage
        }
    ]
});

// the vue instance
var vm = new Vue({
    el: '#app',
    data() {
        return {
            deviceReady: false,
            updateAvailable: false,
            loading: false,
            stationcards: []
        };
    },
    components: {
        'app': App,
        'login-page': LoginPage,
        'registration-page': RegistrationPage,
        'dashboard-page': DashboardPage,
        'logs-page': LogsPage,
        'log-page': LogPage,
        'stations-page': StationsPage,
        'station-page': StationPage,
        'settings-page': SettingsPage,
        'debug-settings-page': DebugSettingsPage
    },
    router: router,
    render: function (h) {
        return h(App);
    }
});

// overwrite RESTURL if specified within debug settings
RESTURL = storage.getValue('debugSettings', {}).resturl || RESTURL;

// apply event listener for cordova device
document.addEventListener('deviceready', function() {
    vm.deviceReady = true;
    eventBus.$emit('deviceReady');
    // event listener for back button
    document.addEventListener('backbutton', function(e) {
        eventBus.$emit('backbuttonPressed', e);
    });
});

eventBus.$on('unauthorized', () => {
    console.log('Unauthorized');
    // unsubscribe from push notifications
    if (window.cordova && window.FCMPlugin && storage.getValue('token')) FCMPlugin.unsubscribeFromTopic(storage.getValue('token'));
    localStorage.clear();
    vm.$router.push('/');
});

eventBus.$on('loading', loading => vm.loading = loading);

eventBus.$on('internalerror', () => {
    console.log('Internal error'); // TODO
});

// cache station cards on every start
http.sendRequest('get', 'stationcards', null, true, (err, cards) => {
    if (!err && cards) {
        vm.stationcards = cards;
        eventBus.$emit('stationcardsCached');
    }
});

if (typeof ROLLBAR_TOKEN === 'string') {
    // rollbar error tracking
    var _rollbarConfig = {
        accessToken: ROLLBAR_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
            environment: "production"
        }
    };
    // Rollbar Snippet
    !function(r){function e(n){if(o[n])return o[n].exports;var t=o[n]={exports:{},id:n,loaded:!1};return r[n].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var o={};return e.m=r,e.c=o,e.p="",e(0)}([function(r,e,o){"use strict";var n=o(1),t=o(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.4.3/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=n.setupShim(window,_rollbarConfig),l=t(_rollbarConfig);window.rollbar=n.Rollbar,a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,l)},function(r,e,o){"use strict";function n(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function t(r,e){this.options=r,this._rollbarOldOnError=null;var o=s++;this.shimId=function(){return o},"undefined"!=typeof window&&window._rollbarShims&&(window._rollbarShims[o]={handler:e,messages:[]})}function a(r,e){if(r){var o=e.globalAlias||"Rollbar";if("object"==typeof r[o])return r[o];r._rollbarShims={},r._rollbarWrappedError=null;var t=new p(e);return n(function(){e.captureUncaught&&(t._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,t,!0),i.wrapGlobals(r,t,!0)),e.captureUnhandledRejections&&i.captureUnhandledRejections(r,t,!0);var n=e.autoInstrument;return e.enabled!==!1&&(void 0===n||n===!0||"object"==typeof n&&n.network)&&r.addEventListener&&(r.addEventListener("load",t.captureLoad.bind(t)),r.addEventListener("DOMContentLoaded",t.captureDomContentLoaded.bind(t))),r[o]=t,t})()}}function l(r){return n(function(){var e=this,o=Array.prototype.slice.call(arguments,0),n={shim:e,method:r,args:o,ts:new Date};window._rollbarShims[this.shimId()].messages.push(n)})}var i=o(2),s=0,d=o(3),c=function(r,e){return new t(r,e)},p=function(r){return new d(c,r)};t.prototype.loadFull=function(r,e,o,t,a){var l=function(){var e;if(void 0===r._rollbarDidLoad){e=new Error("rollbar.js did not load");for(var o,n,t,l,i=0;o=r._rollbarShims[i++];)for(o=o.messages||[];n=o.shift();)for(t=n.args||[],i=0;i<t.length;++i)if(l=t[i],"function"==typeof l){l(e);break}}"function"==typeof a&&a(e)},i=!1,s=e.createElement("script"),d=e.getElementsByTagName("script")[0],c=d.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,o||(s.async=!0),s.onload=s.onreadystatechange=n(function(){if(!(i||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{c.removeChild(s)}catch(r){}i=!0,l()}}),c.insertBefore(s,d)},t.prototype.wrap=function(r,e,o){try{var n;if(n="function"==typeof e?e:function(){return e||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._rollbar_wrapped&&(r._rollbar_wrapped=function(){o&&"function"==typeof o&&o.apply(this,arguments);try{return r.apply(this,arguments)}catch(o){var e=o;throw e&&("string"==typeof e&&(e=new String(e)),e._rollbarContext=n()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e),e}},r._rollbar_wrapped._isWrap=!0,r.hasOwnProperty))for(var t in r)r.hasOwnProperty(t)&&(r._rollbar_wrapped[t]=r[t]);return r._rollbar_wrapped}catch(e){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad".split(","),f=0;f<u.length;++f)t.prototype[u[f]]=l(u[f]);r.exports={setupShim:a,Rollbar:p}},function(r,e){"use strict";function o(r,e,o){if(r){var t;if("function"==typeof e._rollbarOldOnError)t=e._rollbarOldOnError;else if(r.onerror){for(t=r.onerror;t._rollbarOldOnError;)t=t._rollbarOldOnError;e._rollbarOldOnError=t}var a=function(){var o=Array.prototype.slice.call(arguments,0);n(r,e,t,o)};o&&(a._rollbarOldOnError=t),r.onerror=a}}function n(r,e,o,n){r._rollbarWrappedError&&(n[4]||(n[4]=r._rollbarWrappedError),n[5]||(n[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),e.handleUncaughtException.apply(e,n),o&&o.apply(r,n)}function t(r,e,o){if(r){"function"==typeof r._rollbarURH&&r._rollbarURH.belongsToShim&&r.removeEventListener("unhandledrejection",r._rollbarURH);var n=function(r){var o,n,t;try{o=r.reason}catch(r){o=void 0}try{n=r.promise}catch(r){n="[unhandledrejection] error getting `promise` from event"}try{t=r.detail,!o&&t&&(o=t.reason,n=t.promise)}catch(r){t="[unhandledrejection] error getting `detail` from event"}o||(o="[unhandledrejection] error getting `reason` from event"),e&&e.handleUnhandledRejection&&e.handleUnhandledRejection(o,n)};n.belongsToShim=o,r._rollbarURH=n,r.addEventListener("unhandledrejection",n)}}function a(r,e,o){if(r){var n,t,a="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(n=0;n<a.length;++n)t=a[n],r[t]&&r[t].prototype&&l(e,r[t].prototype,o)}}function l(r,e,o){if(e.hasOwnProperty&&e.hasOwnProperty("addEventListener")){for(var n=e.addEventListener;n._rollbarOldAdd&&n.belongsToShim;)n=n._rollbarOldAdd;var t=function(e,o,t){n.call(this,e,r.wrap(o),t)};t._rollbarOldAdd=n,t.belongsToShim=o,e.addEventListener=t;for(var a=e.removeEventListener;a._rollbarOldRemove&&a.belongsToShim;)a=a._rollbarOldRemove;var l=function(r,e,o){a.call(this,r,e&&e._rollbar_wrapped||e,o)};l._rollbarOldRemove=a,l.belongsToShim=o,e.removeEventListener=l}}r.exports={captureUncaughtExceptions:o,captureUnhandledRejections:t,wrapGlobals:a}},function(r,e){"use strict";function o(r,e){this.impl=r(e,this),this.options=e,n(o.prototype)}function n(r){for(var e=function(r){return function(){var e=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,e)}},o="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad".split(","),n=0;n<o.length;n++)r[o[n]]=e(o[n])}o.prototype._swapAndProcessMessages=function(r,e){this.impl=r(this.options);for(var o,n,t;o=e.shift();)n=o.method,t=o.args,this[n]&&"function"==typeof this[n]&&("captureDomContentLoaded"===n||"captureLoad"===n?this[n].apply(this,[t[0],o.ts]):this[n].apply(this,t));return this},r.exports=o},function(r,e){"use strict";r.exports=function(r){return function(e){if(!e&&!window._rollbarInitialized){r=r||{};for(var o,n,t=r.globalAlias||"Rollbar",a=window.rollbar,l=function(r){return new a(r)},i=0;o=window._rollbarShims[i++];)n||(n=o.handler),o.handler._swapAndProcessMessages(l,o.messages);window[t]=n,window._rollbarInitialized=!0}}}}]);
    // End Rollbar Snippet
}

// check for new update
if (typeof LATEST_VERSION === 'string') {
    Vue.http.get('https://api.github.com/repos/EVNotify/EVNotify/releases/latest', {
        credentials: false
    }).then(response => {
        // check if version differs from current one
        if (response.body.node_id && response.body.node_id !== LATEST_VERSION) vm.updateAvailable = true;
    }, err => console.log(err));
}