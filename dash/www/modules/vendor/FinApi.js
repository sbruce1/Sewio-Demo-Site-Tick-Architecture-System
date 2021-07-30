var DEBUG_FINAPI_STYLE = 'background: #0F2E42; color: #039BFF;';
var LOG_ERR_STYLE = 'color: #039BFF; font-weight:bold';
var LOG_DEBUG_STYLE = 'color: #33BBFF; font-weight:bold';
// Array of class names that should not trigger winodw.open()
var LINKCLASS_WHITELIST = ["jstree-anchor,  ui-tabs-anchor", "toolbar-toggler"];
var DEBUG_FINAPI = false;
var TOKENTIMEOUT = 2000;
var LINKCLICKTIMEOUT = 20000;
var TOKENLENGTH = 15;
var DEBUG = false;

var getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var FinApi = function (options) {
    let self = this;
    // Global instance variables
    this.config = {
        "user": {
            "components": {
                "Dashboards": {
                    "compClass": "DashComponent",
                    "compGuid": "",
                    "compType": "",
                    "window": {
                        "url": this.DASH_BASE_URL,
                        "frame": false,
                        "resizable": true,
                        "autoShow": true,
                        "top": "center",
                        "left": "center",
                        "width": 1100,
                        "height": 600,
                        "options": {
                            "securityPolicy": "trusted" 
                        }
                    },
                    "component": {
                        "inject": false,
                        "spawnOnStartup": false,
                        "spawnOnHotKey": [],
                        "preload": "$applicationRoot/preloads/zoom.js"
                    },
                    "foreign": {
                        "services": {
                            "dockingService": {
                                "canGroup": true,
                                "isArrangable": true
                            }
                        },
                        "components": {
                            "App Launcher": {
                                "launchableByUser": false
                            },
                            "Window Manager": {
                                "FSBLHeader": true,
                                "persistWindowState": true,
                                "showLinker": true
                            },
                            "Toolbar": {
                                "iconClass": "Dashboards"
                            }
                        }
                    }
                }
            }
        }
    };

    /* Finsmble constants */
    this.DIALOGS_TOP_MARGIN = 40;

    this.documentModel = null;
    this.viewModel = null;
    this.finInitData = options.finInitData;
    this.viewStateModel = null;
    this.windowId = null;
    this.urlSet = ""; //local variable got overwriten

    this.componentType = "";
    this.documentId = "";
    
    /** Token */
    this.urlChangeToken = "";
    this.tokenTimeoutFn = null;

    /** Button click */
    this.btnClickTimeoutFn = null;
    this.processingClickUrl = "";

    this.dashRenamed = "";
    // on delete change:selectedDocumentId triggered initApi is called
    this.dashRemoving = false;

    this.ignoreViewstateUpdate = false; //used to stop viewstate propagation
    
    // Flag to indicate that first 
    this.dashboardsHasLoaded = false;
    //reference to delta client lib in QuickBase
    this.deltaClientGetter = null;

    // Flag to always instanciate new window;
    this.forceSpawnNewDash = false;
    // Uses current location of finAuth.jsp/finAuth.html to determine location of fin.jsp/fin.html
    this.DASH_BASE_URL = document.location.origin + document.location.pathname.replace('finAuth','fin');
    this.DASH_HOST = document.location.hostname;
    this.DASH_PORT = document.location.port;
    /* Default auth props */
    this.DASH_API_URL = "/api/dash";   
    this.user = "user"; //later on can be used for system user
    this.isAuthenticated = options.isAuthenticated || false;

    /** Keep scope on FinApi class instead of window that it is assigned to **/
    /* View state and init events */
    this.initRoutersEvents = this.initRoutersEvents.bind(this);
    this.getViewStateProps = this.getViewStateProps.bind(this);
    this.processRouterData = this.processRouterData.bind(this);
    this.onDocModelChange = this.onDocModelChange.bind(this);
    this.onDocDownloaded = this.onDocDownloaded.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.setViewSate = this.setViewSate.bind(this);
    this.initApi = this.initApi.bind(this);
    
    /* Navigation handling */
    this.navigateUrl = this.navigateUrl.bind(this);
    this.urlSameOrigin = this.urlSameOrigin.bind(this);
    this.spawnNewComponent = this.spawnNewComponent.bind(this);

    this.getViewstateFromUrl = this.getViewstateFromUrl.bind(this);
    this.parseUrlInToParts = this.parseUrlInToParts.bind(this);
    this.linkClickTimer = this.linkClickTimer.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.getBaseUrl = this.getBaseUrl.bind(this);
    this.getDashURL = this.getDashURL.bind(this);
    
    /* State change */
    this.getDashComponents = this.getDashComponents.bind(this);

    /* ASYNC functions used with regex to retrive app states */
    this.getDashComponents = this.getDashComponents.bind(this);
    this.getOpenedWindows = this.getOpenedWindows.bind(this);
    this.getComponentType = this.getComponentType.bind(this);


    /* Dunamic menu auth functions binding */
    this.applyUserConfig = this.applyUserConfig.bind(this);
    this.generateConfig = this.generateConfig.bind(this);

    this.generateToken = this.generateToken.bind(this);
    
    this.logOut = this.logOut.bind(this);

    this.incomingChanges = {};
};

/**
 * Subscribe to router to listen on the chanel called fin.html
 * Funstion is called after FinApi is instanciated in fin.html or fin.jsp
*/
FinApi.prototype.initRoutersEvents = function() {
    var self = this;
    this.windowId = FSBL.Clients.WindowClient.getWindowIdentifier().windowName;
    //This property does not change if url has changed to different component
    this.componentType = FSBL.Clients.WindowClient.options.customData.component.type;

    //subscribe to link
    FSBL.Clients.LinkerClient.subscribe("transmit", function(data, dataAll){
        //do not process if the origin is this window
        if(!dataAll.originatedHere()) {
            self.processRouterData(data);
        }
    });

    /* 
    * Update single window status 
    * Step_1: Listen for request to check opened windows with the same GUID
    */
    FSBL.Clients.RouterClient.addListener("urlCheck", (err, resp) => {
        if(err) {
            console.log("%cOpned windows request error", LOG_ERR_STYLE, err);
        } else {
            let data = resp.data;
            let screenId = this.viewModel && this.viewModel.get("selectedScreenId");
            let sameLocation = this.documentId === data.guid;

            // If both screen ID's defined check if match provided dashboard ids match
            //! cloned dashborads screen GUIDs are not changed
            if(data.screenId && screenId && sameLocation) {
                sameLocation = data.screenId === screenId;
            }
            // GUID match, send responce with window id and token back
            if(sameLocation) {
                let transmitMsg = {
                    windowId: this.windowId,
                    token: data.token 
                };
                if(DEBUG) console.log("%cUrlCheckResp transmit", LOG_DEBUG_STYLE, transmitMsg);

                FSBL.Clients.RouterClient.transmit("urlCheckResp", transmitMsg);
            }
        }
    });

    // Step_3: Listener to update url if propagated
    FSBL.Clients.RouterClient.addListener("urlChange", (err, resp) => {
        if(err) {
            console.log("%cRouter urlChane error", LOG_ERR_STYLE, err);
        } else {
            let data = resp.data;
            if(DEBUG) console.log("%cUrlChange receive", LOG_DEBUG_STYLE, data);
            if(data.windowId && data.windowId === this.windowId) {
                let vsParams = this.getViewstateFromUrl(data.url);
                // If url contained query string and viewstate parameters can be derived
                // if(vsParams) {
                //     // TODO - review incomingViewState mechanism
                //     this.viewStateModel.set('incomingViewState', 
                //         vsParams, { silent: true });
                //     this.viewStateModel.trigger('processIncomingViewState', this.documentModel);
                // } else {
                document.location.href = data.url;
                document.location.reload();
                // }
            }
        }
    });

    // Step_5: Listener to update url if propagated
    FSBL.Clients.RouterClient.addListener("closeWindow", (err, resp) => {
        if(err) {
            console.log("%cRouter urlChane error", LOG_ERR_STYLE, err);
        } else {
            let data = resp.data;
            let compName = this.documentModel.get("name");
            if(DEBUG) console.log("%ccloseWindow call", LOG_DEBUG_STYLE, data);
            // If this window is instance of the same type and component is 
            // not deleting itself fropm appList
            if((data.documentId && data.documentId === this.documentId) || 
                (data.nameChange && data.nameChange === compName)) {
                FSBL.Clients.WindowClient.close(false);
            }
        }
    });

    // Step_6: Listener to link open lck
    FSBL.Clients.RouterClient.addListener("onAppLoadComplete", (err, resp) => {
        if(err) {
            console.log("%cRouter urlChane error", LOG_ERR_STYLE, err);
        } else {
            let windowId = resp.data.windowId;
            let openurl = resp.data.url;
            // ignore events triggered by this window
            if(windowId === self.windowId) return;

            if(DEBUG) console.log("%cOn App Loaded listener ", LOG_DEBUG_STYLE, resp);
            // Remove time if present 
            if(self.btnClickTimeoutFn) {
                self.linkClickTimer();
            }
        }
    });
};
/**
 * Converts query string to viewstate model property object
 */
FinApi.prototype.getViewstateFromUrl = function (url) {
    let urlParts = this.parseUrlInToParts(url),
        queryString = "";
    
    if(urlParts[5] && urlParts[5].indexOf("?") > -1) {
        queryString = urlParts[5].split("?")[1];
    }    

    let rxMatch = /(^|&)viewstate=([^&;]+?)(&|;|$)/.exec(queryString);
    return rxMatch ? JSON.parse(decodeURIComponent(rxMatch[2])) : null;
};

//Pase url to break it into conmponents eg, domain name, hash etc
//http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript/
/**
 * [0] - full url, [1] - protocol, [2] - host and port, [3] - url paths, [4] -,  
 * [5] - hash portion and query string
 */
FinApi.prototype.parseUrlInToParts = function(url) {
    let urlToParse = url || document.location.href;
    return urlToParse.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
}

//helper function to get base url without query string
FinApi.prototype.getBaseUrl = function(url) {
    // set url hash
    let isUrlAHash = url && url.indexOf("#") === 0;
    // if url is hash get current full path, else pocess url
    let urlParts = this.parseUrlInToParts((!isUrlAHash ? url : null));
    let screenId = (this.viewModel && this.viewModel.get("selectedScreenId")) 
        ? "/"+this.viewModel.get("selectedScreenId") : "";
    let baseUrl = "";
    // url is dashboard GUID
    _.each(urlParts.slice(1), (part, ix) => {
        if(part && ix !== 3) {
            if(ix === 0 ) {
                baseUrl += part+"//";

            }
            // URL has query string remove it 
            else if(ix === 4) { 
                if(part.indexOf("?") > -1) {
                    //hash that may have query string remove it
                    baseUrl += part.split("?")[0];
                    // if no screen id is present
                    if(part.split("?")[0].indexOf("/") === -1) {
                       baseUrl += screenId;
                    }
                } else {
                    // append passed dashboard GUID or hash part
                    baseUrl += ((isUrlAHash ? url : part) + screenId); 
                }
            } else {
                baseUrl += part;
            }
        }
    });
    return baseUrl;
}
/**
 * Logout 
 */
FinApi.prototype.logOut = function(params) {
    var self = this,
        msg = params && params.msg ? params.msg :
            "Finsemble is going to log out",
        title = params && params.title ? params.title : "Attention";
        
    FSBL.Clients.DialogManager.open("yesNo", {
        title: title,
        question: msg,
        showCancelButton: false,
        showNegativeButton: false,
    }, (err, response) => {
        if (err || response.choice === "affirmative") {
            FSBL.Clients.WorkspaceClient.save((err, data) => {
                if(!err){// && data && data.status === "success") {
                    FSBL.restartApplication();
                } else { 
                    self.logOut({msg: "Unable to save workspace, "+err}); 
                }
            });
        }
    });
};

/**
 * Process data transmitted on the channel
 * @param {object} data - transmitted data 
 */
FinApi.prototype.processRouterData = function(data) {
    if(data.viewState) {
        DEBUG_FINAPI && console.log('%c [FIN] Viewstate Object Recieved', 
            DEBUG_FINAPI_STYLE, data);
        // Generate native viewstate object props
        this.setViewSate(data.viewState);
    }
};

/**
 * Recursively set viewstate models
 */
FinApi.prototype.setViewSate = function(data) {
    var self = this,
        nodePath, vsNode;

    /**
     * Recursively set viewstate values
     * @param {*} root - current group
     * @param {*} path - relative path to the group
     */ 
    var setProps = function(root, path, currentNodes) {
        // Use transmitted data if top level else get attibutes of current group
        var nodes = currentNodes ? currentNodes : data;       
        
        _.each(nodes, function(currentNode, key) {
            nodePath = path ? path +"/"+ key: key;
            // Get vsNode by path
            vsNode = root.getByPath(nodePath);
            if(_.isObject(currentNode) && _.has(currentNode, "_viewType")) {
                if(vsNode && vsNode.get('value') != currentNode.value) {
                    self.incomingChanges[nodePath] = currentNode.value;
                    vsNode.set('value', currentNode.value);
                    delete self.incomingChanges[nodePath];
                }
            } else if(_.isObject(currentNode)) {
                setProps(root, nodePath, currentNode);                
            }
        });
    }

    setProps(self.viewStateModel);
};
/**
 * 
 */

/**
 * Process document model listener after all modules including Backbone has loaded.
 * Called form QuickDash/src/QuickDash/views/app.js > finsembleInitEvents();
 */
FinApi.prototype.initApi = function(documentMod, viewModel) {
    var self = this;
    // If call from delete function do not open new window
    // if(this.documentId && !this.dashRemoving) {
    //     this.getComponentType(documentMod.id).then( compType => {
    //         this.spawnNewComponent(
    //             compType, 
    //             this.getBaseUrl("#"+documentMod.id),
    //             {}, (err, resp) => { this.closeWindow() }
    //         );
    //     }).catch( err => {
    //         console.log("error getting component type: ", err);
    //     }); 
    // } else {
        
        DEBUG_FINAPI && console.log('%c [FIN] Initializing API', DEBUG_FINAPI_STYLE);
        //set Dashboard title
        FSBL.Clients.WindowClient.setWindowTitle(documentMod.get("name")+" - Dashboard");
        // unsubscribe in case of document model changes
        if(this.documentModel) {
        this.documentModel.off("change", this.onDocModelChange);
        this.documentModel.off("detail-downloaded", this.onDocDownloaded);
        }

        this.documentModel = documentMod;
        this.documentModel.on("change", this.onDocModelChange);
        this.documentModel.on("detail-downloaded", this.onDocDownloaded);
        
        // Required for sharing dashboard and getting screen
        this.viewModel = viewModel;

        // save document id of inital dashboard
        this.documentId = documentMod.id;
        
        /** Manage links icon clicks no unsolicited windos can be spawned*/

        let navClickUnified = function (event) {
            let $elem = event.currentTarget;
            let doNothing  = false;
            
            // do nothing if click is being processed
            if(self.processingClickUrl) {
                if(DEBUG) console.log("%cBtn timer REPEAT CLICK", LOG_DEBUG_STYLE);
                event.preventDefault();
                return;
            }
            
            switch (event.button) {
                case 0:
                    if (event.shiftKey) {
                        self.forceSpawnNewDash = true;
                        FSBL.Clients.Logger.log("overrideLinks: navClickUnified left button + shift clicked");
                    } else if (event.ctrlKey) {
                        self.forceSpawnNewDash = true;
                        FSBL.Clients.Logger.log("overrideLinks: navClickUnified left button + ctrl clicked");
                    } else {
                        FSBL.Clients.Logger.log("overrideLinks: navClickUnified left button clicked");
                    }

                    self.linkClickTimer();
                    break;
                case 1:
                    self.forceSpawnNewDash = true;
                    FSBL.Clients.Logger.log("overrideLinks: navClickUnified middle button clicked");
                    self.linkClickTimer();
                    break;
                case 2:
                    FSBL.Clients.Logger.log("overrideLinks: navClickUnified right button clicked");
                    doNothing = true;
                    break;
                default:
                    FSBL.Clients.Logger.log("overrideLinks: navClickUnified right button clicked");
              }
            if((($elem.getAttribute("target") && $elem.getAttribute("target") === "_blank")
                || self.forceSpawnNewDash)) {
                    FSBL.Clients.Logger.log("overrideLinks: navClickUnified opening new window");
                window.open($elem.getAttribute('href'));
                event.preventDefault();
            } else if (doNothing) {
                FSBL.Clients.Logger.log(
                    "overrideLinks: navClick doing nothing and NOT preventing default behaviour");
                event.preventDefault();
            } else {
                FSBL.Clients.Logger.log(
                    "overrideLinks: navClick doing nothing and NOT preventing default behaviour");
            }
        };

        window.open = _.wrap(window.open, function(openFn, args) {
            if(args && _.isString(args)) {
                let urlParts = self.parseUrlInToParts(args);
                // Is a short sharing string process required to convert short string to 
                // proper URL !GK's hack 
                if(urlParts[3] && urlParts[3].indexOf("/ux/") === 0) {
                    let xo = document.createElement("iframe");
                    xo.src = args;
                    xo.onload = function() {
                        self.navigateUrl(this.contentDocument.location.href);
                        xo.remove();
                    } 
                    document.getElementsByTagName("body")[0].appendChild(xo);
                } else {
                    self.navigateUrl(args);
                }
            }
        });

        _.debounce(() => {
            //Intersept any links click
            $(document.body).on("mouseover", "a", function(event) {
                let $elem = $(event.currentTarget),
                    classAttr = $elem.attr("class") ? $elem.attr("class").split(" ") : "",
                    whiteListClasses = [];
    
                if(!$elem.attr('updated')) {
                    // Add attribute to prevent reattachment of listeners
                    $elem.attr("updated", true);
    
                    if(_.isArray(classAttr)) {
                        whiteListClasses = _.intersection(LINKCLASS_WHITELIST, classAttr);
                    }
                    // only 
                    if($elem.attr('href') && !whiteListClasses.length) {
                        event.currentTarget.onclick = navClickUnified;
                        //
                        event.currentTarget.ondblclick = navClickUnified;
                        event.currentTarget.onauxclick  = navClickUnified;
                        event.currentTarget.onmousedown = (e) => {e.preventDefault()};
                        event.currentTarget.onmouseup = (e) => {e.preventDefault()};
                    }
                }
            });
        }, 10)();
        // Once dashboards are loaded transmit that window has opened
        _.debounce(() => {
            if(DEBUG) console.log("%cComponent has loaded: ", LOG_DEBUG_STYLE, self.windowId);
            FSBL.Clients.RouterClient.transmit("onAppLoadComplete", {
                windowId: self.windowId,
                url: document.location.href
            });
        }, 15)();
    //}
};

/**Function to control btn click timer*/
FinApi.prototype.linkClickTimer = function(removeTimer) {
    let self = this;
    // explicit timer removal, prevent creation of the new timer
    if(this.btnClickTimeoutFn || removeTimer) {
        this.processingClickUrl = ""; 
        clearTimeout(this.btnClickTimeoutFn);
        this.btnClickTimeoutFn = null;
        if(DEBUG) console.log("%cBtn timer REMOVED", LOG_DEBUG_STYLE);
    } else {
        if(DEBUG) console.log("%cBtn timer ADDED", LOG_DEBUG_STYLE);
        console.log("Click")
        this.processingClickUrl = "pending";
        // If click is not resolved within time frame reset
        this.btnClickTimeoutFn = setTimeout(() => {
            // call this function to pass above if statement check, clear button 
            //  and this timeout function
            self.linkClickTimer();
        }, LINKCLICKTIMEOUT);
    }
};

FinApi.prototype.onDocDownloaded = function() {
    DEBUG_FINAPI && console.log('%c [FIN] Document Downloaded', DEBUG_FINAPI_STYLE);
    this.onDocModelChange(this.documentModel);
}

FinApi.prototype.onDocModelChange = function(documentModel) {
    DEBUG_FINAPI && console.log('%c [FIN] onDocModelChange', DEBUG_FINAPI_STYLE);
    // model exist and is the same do nothing
    if(this.viewStateModel 
        && this.viewStateModel.cid === documentModel.get("viewState").cid) {
            return; 
    }
    if(this.viewStateModel) {    
        this.viewStateModel.off("change", this.onStateChange);
    } 
    this.viewStateModel = documentModel.get("viewState");        
    // listen to view model changed
    this.viewStateModel.on("change", this.onStateChange);  
};

/**
 * Open child window or update url of existent window
 * TODO prevent edit mode navigation to different dashboard within same component
 */
FinApi.prototype.navigateUrl = function(url) {
    let self = this,
        viewStateJson = this.getViewStateProps(),
        selfGuid = this.documentModel.id,
        //urlSet = "", //local variable gets updated in urlCheckResp listener
        urlParts = url ? this.parseUrlInToParts(url) : [],
        compId, screenId;

    //set actuall url string to track 
    this.processingClickUrl = url;

    let processUrl = function(allApps) {
        // App that has same GUID as URL
        let urlApp = _.find(allApps, (app) => {
                return app.compGuid && urlParts[5] && (urlParts[5].indexOf(app.compGuid) === 0);
            });
        
        if(!urlApp) { 
            console.log("%c No app with specified url is found", LOG_ERR_STYLE, urlParts[5]) 
        };
        // Get type of the app based on the url
        let componentType = urlApp && urlApp.compType ? urlApp.compType : "Dashboards";
        // Windows that are opened that has same GUID
        // let openedWindows = _.find(openedApps, (app) => {
        //         return app.customData.compType === componentType;
        //     });

        
        if(urlParts.length && self.urlSameOrigin(urlParts) && urlParts[5].length) {
            self.urlSet = self.DASH_BASE_URL + (_.clone(urlParts[5]));
            // Get read of the hash symbol and query string
            let guidAndScreen = urlParts[5].split("?")[0].slice(1);
            // get guid and screen id
            compId = guidAndScreen.split("/")[0];
            screenId = guidAndScreen.split("/")[1];
        } else { 
            console.log("invalid url: ", url);
            return;
        } 

        // Always Open new window in middle button click 
        if(self.forceSpawnNewDash) {

            self.spawnNewComponent(componentType, viewStateJson);
            self.forceSpawnNewDash = false;
            return;
        }

        self.generateToken();

        // Create timeout function that is triggered unless matching opned window was found 
        self.tokenTimeout = setTimeout(() => {
            if(DEBUG) console.log("%cUrl Change timeout has expired", LOG_DEBUG_STYLE);
            self.urlChangeToken = "";
            self.spawnNewComponent(componentType, viewStateJson);
            FSBL.Clients.RouterClient.removeListener("urlCheckResp", (err, resp) => {
                console.log(self.windowId + " stopped listebning");
            });
        }, TOKENTIMEOUT);

        //Step_2: Creat listener to listen for responce
        FSBL.Clients.RouterClient.addListener("urlCheckResp", (err, resp) => {
            if(err) {
                console.log("%cCheck opned windows responce error", LOG_ERR_STYLE, err);
            } else {
                let data = resp.data;
                if(DEBUG) console.log("%curlChange transmit", LOG_DEBUG_STYLE, data);
                // Step_4: transmit url to first window that has responed
                if(self.urlChangeToken && (self.urlChangeToken === data.token)) {
                    if(DEBUG) console.log("%curlCheckResp transmit first", LOG_DEBUG_STYLE, data);
                    FSBL.Clients.RouterClient.transmit("urlChange", {
                        windowId: data.windowId,
                        url: self.urlSet
                    });
                    // Reset token
                    self.urlChangeToken = "";
                    //reset timeout
                    clearTimeout(self.tokenTimeout);
                    self.tokenTimeout = null;
                }
            }
        });

        //send request with app type and url for all windows those that has the same type
        //will change it's URL
        //Make sure rounter is ready before transmitting
        FSBL.Clients.RouterClient.onReady( () => {
            let transmitMsg = {
                componentType: componentType,
                guid: compId,
                screenId: screenId,
                token: self.urlChangeToken
            };
            if(DEBUG) console.log("%curlChange transmit", LOG_DEBUG_STYLE, transmitMsg);
            FSBL.Clients.RouterClient.transmit("urlCheck", transmitMsg);
        });
    }

    this.getDashComponents().then((params) => { processUrl(params); });
};

/**
 * Generate random token
 */
FinApi.prototype.generateToken = function() {
    var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e',
        'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v',
        'w','x','y','z','A','B','C','D','E','F','G','H',
        'I','J','K','L','M','N','O','P','Q','R','S',
        'T','U','V','W','X','Y','Z','!','?'];
    var rndString = "";
	
    // build a string with random characters
    for (var i = 1; i < TOKENLENGTH; i++) { 
        var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
        rndString = rndString + stringArray[rndNum];
    };

    console.log("Url navigation token was successfully generated - ", rndString);

    this.urlChangeToken = rndString;

};

/**
 * Funstion spawn new coponent based on type and url
 */
FinApi.prototype.spawnNewComponent = function(componentType, viewStateJson, cb) {
    FSBL.Clients.LauncherClient.spawn(componentType,
        {   
            addToWorkspace: true,
            left: "adjacent",
            url: this.urlSet,
            slave: false,
            data: {
                "viewState": viewStateJson
            }
        }, _.bind(function(err, resp) {
            if(err) {
                console.log("%cUnable to spawn window ", LOG_ERR_STYLE, err);
            }
            cb && cb(err, resp);
        }, this)
    );
};
/**
 * Chaeck that url is the same origin before extracting hash
 */
FinApi.prototype.urlSameOrigin = function(urlParts) {
    let urlHost = urlParts[2]; 
    let thisHost = document.location.host;

    // set localhost to the same standart if any of host part using IP
    urlHost = (urlHost && urlHost.indexOf("127.0.0.1") === 0)
        ? urlHost.replace("127.0.0.1", "localhost") : urlHost;

    thisHost = thisHost.indexOf("127.0.0.1") === 0 ? thisHost.replace("127.0.0.1", "localhost"): thisHost;
    //TODO Probable can add more complex hostname recognision matching hostname to IP
    //if host portion is the same or url contains only hash part
    return (urlHost === thisHost  
        || (!urlHost && urlParts[5] && urlParts[5].indexOf("#") === 0));
};

/* 
* ASYNC Call with PROMISE 
* Return object with current dashboards configs 
*/
FinApi.prototype.getDashComponents = function() {
    return new Promise ((resolve, reject) => {
        FSBL.Clients.ConfigClient.getValues({field:"finsemble.components"},
            (err, arr) => {
                if(err) {
                    console.log("%c Could not get components config", LOG_ERR_STYLE, err);
                    reject(err);
                } else {
                    let components = {}; 
                    _.each(arr , (item, key) => {
                        if(item.compClass === "DashComponent") {
                            components[key] = item;
                        }
                    }); 
                    resolve(components);
                }
        });
    });
};

/* 
* ASYNC Call with PROMISE 
* Return array of all windows dashboard windows opened 
*/
FinApi.prototype.getOpenedWindows = function() {
    return new Promise ((resolve, reject) => {
        FSBL.Clients.LauncherClient.getActiveDescriptors((err,arr) => {
            if(err) {
                console.log("%c Could not get components config", LOG_ERR_STYLE, err);
                reject(err);
            } else {
                let components = {}; 
                _.each(arr , (item, key) => {
                    if(item.customData && item.customData.compClass === "DashComponent") {
                        components[key] = item;
                    }
                }); 
                resolve(components);
            }
        });
    });
};
/** */
FinApi.prototype.getComponentType = function(compId) {
    
    return new Promise ((resolve, reject) => {
        this.getDashComponents()
        .then((comps) => {
            let compType = _.find(comps, comp => {
                return comp.compGuid === ("#"+compId);
            });
            if(compType && compType.compType) {
                resolve(compType.compType);
            } else { reject("type for: #"+compId+" not found"); }
        }).catch((err) => {
            reject(err);
        });
    });
};

FinApi.prototype.onStateChange = function(model) {
    var vsObject = {};
    if(model.path) {
        vsObject[model.path] = model.toJSON();

        if(this.incomingChanges[model.path]) {
            return;
        }
        DEBUG_FINAPI && console.log('%c [FIN] Transmitting Viewstate Object', DEBUG_FINAPI_STYLE, vsObject);
        FSBL.Clients.LinkerClient.publish({
            dataType: "transmit",
            data : {
                "viewState": vsObject
            }
        });
    }
};
/**
 * Generate url for dashboar sharing
*/
FinApi.prototype.getDashURL = function(cb) {
    let doc = this.documentModel;
    let url = this.getBaseUrl();

    //clicking url before dashboard is fully loaded
    if(!doc) return;
    viewStateParameters = doc.get("viewState").getViewStateExport();

    if (viewStateParameters) {
        url += '?viewstate=' + encodeURIComponent(JSON.stringify(viewStateParameters));
    }

    let deltaClient = this.deltaClientGetter();

    // DeltaClient lib is not exposed in stand alone 
    if(deltaClient) {
        deltaClient.request('UrlAPI.getShortUrl', function (data) {
            let shortUrl = data[1];
            cb(shortUrl);
        }, function (data) {
            cb("error getting short url");
        }, url);
    } else {
        cb(url);
    }
}
/**
 * Calculate height for any Jquerty UI dialog that if overflows affects dashboards layout
*/
FinApi.prototype.getDialogHeightOffset = function(dialogName) {
    dialogName = dialogName ? dialogName : "none";
    return {
        "dataDialog": 120,
        "viewStateDialog": 50,
        "none": 40
    }[dialogName];
};
/**
 * Viewstate property getter 
 */
FinApi.prototype.getViewStateProps = function() {
    var initalObj = _.omit(this.viewStateModel.toJSON(true), ".settings");
    var returnViewStateObj = {};
    /* Recursively generate structure where groups are keys of objects
        containing viewstates */
    var mapedProps = function(root, path) {
        var tempVs = !path ? returnViewStateObj : {};
        _.each(root, function(val, key) {

            if(_.isObject(val) && _.has(val,"_viewType")){
                tempVs[key] = val;
            } else if(_.isFunction(val.toJSON)) {
                tempVs[key] = mapedProps(val.toJSON(true), key);
            } else {

            }
        }); 
        return tempVs;
    }
    
    return mapedProps(initalObj);
};

/**
 * Auth config and components menu handling function
 */
FinApi.prototype.applyUserConfig = function(configNew) {
    // Get user configuration. Replace with get from database/remote service
    var username = "user";
    // processAndSet expects just a config portion
    var userConf = configNew[username];

    console.log("config: ", userConf);

    if (!userConf) {
        console.error("No configuration found for user: " + username);
        return;
    }

    // Apply the configuration to Finsemble
    FSBL.Clients.ConfigClient.processAndSet(
        {
            newConfig: userConf,
            overwrite: true,
            replace: true
        },
        function(err, userConf) {
            if (err) {
                console.error(err);
                return;
            }

            // Applied successfully, publish authorization and close window 
            // run only Onse when the Finsemble is opening
            if(!this.isAuthenticated) {
                this.isAuthenticated = true;
                // Load dashboards config for user set above
                FSBL.Clients.AuthenticationClient.publishAuthorization(username, getCookie('deltaToken'));
                // Cloase window displaing "loading" icon
                this.closeWindow();
            }

            //on rename close any windows with old dashboard name 
            if(this.dashRenamed) {

                FSBL.Clients.RouterClient.transmit("closeWindow", {
                    nameChange: this.dashRenamed
                });
                
                this.dashRenamed = "";
            }
            // If component type is present it is not an authentication module
            if(this.componentType && this.compBeingDeleted) {
                FSBL.Clients.WindowClient.close(false);
            }

        }.bind(this)
    );
};

// Close current window window 
FinApi.prototype.closeWindow = function(dockumentId) {
    var self = this;

    this.tokenTimeout = null;
    // Close windows matching deleted document GUID
    if(dockumentId) {
        FSBL.Clients.RouterClient.onReady( () => {
            FSBL.Clients.RouterClient.transmit("closeWindow", {
                documentId: dockumentId 
            });
        });
    }
    // Windows is closing itself  
    else {
        FSBL.Clients.WindowClient.close(false);
    }
};
/**
 * Generate config object from available dashboards resolving name and url
 * @param {string} dashData - JSON object string returned from api with list of dashboards  
 */
FinApi.prototype.generateConfig = function (dashData, noJsonParse) {
    //get dash config sample
    var self = this,
        configToReturn = JSON.parse(JSON.stringify(this.config));

    // Increment unique name index for already existent names
    var createUniqueName = function(dashNames, name) {
        let sortedNames = dashNames.filter(a => a.indexOf(name) === 0).sort();
        let lastItem = _.last(sortedNames),
            lastNum = Number(lastItem.slice(lastItem.length));
        
        let returnName = "";

        if(!_.isNaN(lastNum)) {
            returnName = name + (lastNum+1);
        }
        return returnName;
    };

    var parseData = (dasboard) => {
        var dashName = dasboard.name.replace(/[-[\]{}()*+?.,\\^$|#]/g, ' '),
            templateConf = JSON.parse(JSON.stringify(self.config.user.components.Dashboards)),
            componentUrl = self.DASH_BASE_URL + "#" + dasboard.id;
            
        // Set component url 
        templateConf.window.url = componentUrl;

        // keep guid of the dash board to track
        templateConf.compGuid = "#" + dasboard.id;
        
        // Enable component to be visible in Apps meny
        templateConf.foreign.components["App Launcher"].launchableByUser = true;

        //TODO exclude posibility for components with the same name
        if(configToReturn.user.components[dashName]) {
            dashName = createUniqueName(_.keys(configToReturn.user.components), dashName);
        }

        if(dashName) {
            // Add config to specific dashboard name this is also set as type
            templateConf.compType = dashName;
            configToReturn.user.components[dashName] = templateConf;
        } else {
            console.log("%cInvalid dash name", LOG_ERR_STYLE, dashName);
        }
    };
    
    if (dashData) {
        if(noJsonParse) {
            _.each(dashData, dash => {
                parseData(dash);
            });
        } else {
            JSON.parse(dashData).forEach(function (dash) {
                parseData(dash);
            });
        }
    }
    return configToReturn;
};