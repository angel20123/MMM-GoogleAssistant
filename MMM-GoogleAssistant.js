var _log=Function.prototype.bind.call(console.log,console,"[ASSISTANT]"),log=function(){};Module.register("MMM-GoogleAssistant",{defaults:{debug:!1,assistantConfig:{lang:"en-US",credentialPath:"credentials.json",tokenPath:"token.json",projectId:"",modelId:"",instanceId:"",latitude:51.50853,longitude:-.076132},responseConfig:{useScreenOutput:!0,screenOutputCSS:"screen_output.css",screenOutputTimer:5e3,screenRotate:!1,activateDelay:250,useAudioOutput:!0,useChime:!0,newChime:!1,useNative:!1,playProgram:"mpg321"},micConfig:{recorder:"arecord",device:null},customActionConfig:{autoMakeAction:!1,autoUpdateAction:!1},snowboy:{usePMDL:!1,PMDLPath:"../../../components",audioGain:2,Frontend:!0,Model:"jarvis",Sensitivity:null},A2DServer:{useA2D:!1,stopCommand:"stop"},recipes:[]},plugins:{onReady:[],onNotificationReceived:[],onActivate:[]},commands:{},actions:{},transcriptionHooks:{},responseHooks:{},getScripts:function(){return["/modules/MMM-GoogleAssistant/components/response.js"]},getStyles:function(){return["/modules/MMM-GoogleAssistant/MMM-GoogleAssistant.css"]},getTranslations:function(){return{en:"translations/en.json",fr:"translations/fr.json"}},start:function(){const t=["debug","dev","recipes","customActionConfig","assistantConfig","micConfig","responseConfig","A2DServer","snowboy"];this.helperConfig={},this.config.debug&&(log=_log),this.config=this.configAssignment({},this.defaults,this.config);for(var s=0;s<t.length;s++)this.helperConfig[t[s]]=this.config[t[s]];this.myStatus={actual:"standby",old:"standby"};var e={assistantActivate:t=>{this.assistantActivate(t)},postProcess:(t,s,e)=>{this.postProcess(t,s,e)},endResponse:()=>{this.endResponse()},sendNotification:(t,s=null)=>{this.sendNotification(t,s)},sendSocketNotification:(t,s=null)=>{this.sendSocketNotification(t,s)},translate:t=>this.translate(t),myStatus:t=>{this.myStatus=t},A2D:t=>{if(this.config.A2DServer.useA2D)return this.Assistant2Display(t)},sendAudio:t=>{this.sendSocketNotification("PLAY_AUDIO",t)},sendChime:t=>{this.sendSocketNotification("PLAY_CHIME",t)}};this.assistantResponse=new AssistantResponse(this.helperConfig.responseConfig,e)},doPlugin:function(t,s){if(this.plugins.hasOwnProperty(t)){var e=this.plugins[t];if(Array.isArray(e)&&e.length>0)for(var n=0;n<e.length;n++){var i=e[n];this.doCommand(i,s,t)}}},registerPluginsObject:function(t){for(var s in this.plugins)if(t.hasOwnProperty(s)){var e=[];Array.isArray(t[s])?e=e.concat(t[s]):e.push(t[s].toString());for(var n=0;n<e.length;n++)this.registerPlugin(s,e[n])}},registerPlugin:function(t,s){this.plugins.hasOwnProperty(t)&&(Array.isArray(s)&&this.plugins[t].concat(s),this.plugins[t].push(s))},registerCommandsObject:function(t){this.commands=Object.assign({},this.commands,t)},registerTranscriptionHooksObject:function(t){this.transcriptionHooks=Object.assign({},this.transcriptionHooks,t)},registerActionsObject:function(t){this.actions=Object.assign({},this.actions,t)},registerResponseHooksObject:function(t){this.responseHooks=Object.assign({},this.responseHooks,t)},configAssignment:function(t){for(var s,e,n=Array.prototype.slice.call(arguments,1);n.length;)for(e in s=n.shift())s.hasOwnProperty(e)&&("object"==typeof t[e]&&t[e]&&"[object Array]"!==Object.prototype.toString.call(t[e])&&"object"==typeof s[e]&&null!==s[e]?t[e]=this.configAssignment({},t[e],s[e]):t[e]=s[e]);return t},getDom:function(){this.assistantResponse.modulePosition();var t=document.createElement("div");return t.id="GA_DOM",MM.getModules().withClass("MMM-GoogleAssistant").enumerate(t=>{t.hide(0,{lockString:"GA_LOCKED"})}),t},notificationReceived:function(t,s=null,e=null){switch(this.doPlugin("onNotificationReceived",{notification:t,payload:s}),t){case"DOM_OBJECTS_CREATED":this.sendSocketNotification("INIT",this.helperConfig),this.assistantResponse.prepare();break;case"ASSISTANT_WELCOME":this.assistantActivate({type:"TEXT",key:s.key,chime:!1},Date.now());break;case"ASSISTANT_START":this.sendSocketNotification("ASSISTANT_READY");break;case"ASSISTANT_STOP":this.sendSocketNotification("ASSISTANT_BUSY")}},socketNotificationReceived:function(t,s){switch(t){case"NPM_UPDATE":s&&this.sendNotification("NPM_UPDATE",s);break;case"LOAD_RECIPE":this.parseLoadedRecipe(s);break;case"NOT_INITIALIZED":this.assistantResponse.fullscreen(!0),this.assistantResponse.showError(s);break;case"INITIALIZED":log("Initialized."),this.assistantResponse.status("standby"),this.sendSocketNotification("ASSISTANT_READY"),this.doPlugin("onReady"),this.config.A2DServer.useA2D&&this.sendNotification("ASSISTANT_READY");break;case"ASSISTANT_RESULT":null!==s.volume&&this.sendNotification("A2D_VOLUME",s.volume),this.assistantResponse.start(s);break;case"TUNNEL":this.assistantResponse.tunnel(s);break;case"ASSISTANT_ACTIVATE":this.assistantActivate(s);break;case"AUDIO_END":this.assistantResponse.end()}},parseLoadedRecipe:function(payload){let reviver=(key,value)=>{if("string"==typeof value&&0===value.indexOf("__FUNC__")){value=value.slice(8);let functionTemplate=`(${value})`;return eval(functionTemplate)}return value};var p=JSON.parse(payload,reviver);p.hasOwnProperty("commands")&&this.registerCommandsObject(p.commands),p.hasOwnProperty("actions")&&this.registerActionsObject(p.actions),p.hasOwnProperty("transcriptionHooks")&&this.registerTranscriptionHooksObject(p.transcriptionHooks),p.hasOwnProperty("responseHooks")&&this.registerResponseHooksObject(p.responseHooks),p.hasOwnProperty("plugins")&&this.registerPluginsObject(p.plugins)},assistantActivate:function(t){if("standby"!=this.myStatus.actual&&!t.force)return log("Assistant is busy.");this.doPlugin("onActivate"),this.assistantResponse.fullscreen(!0),this.config.A2DServer.useA2D&&this.sendNotification("A2D_ASSISTANT_BUSY"),this.sendSocketNotification("ASSISTANT_BUSY"),this.lastQuery=null;var s={type:"TEXT",key:null,lang:this.config.assistantConfig.lang,useScreenOutput:this.config.responseConfig.useScreenOutput,useAudioOutput:this.config.responseConfig.useAudioOutput,status:this.myStatus.old,chime:!0};s=Object.assign({},s,t);setTimeout(()=>{this.assistantResponse.status(s.type,!!s.chime),this.sendSocketNotification("ACTIVATE_ASSISTANT",s)},this.config.responseConfig.activateDelay)},endResponse:function(){this.config.A2DServer.useA2D&&this.sendNotification("A2D_ASSISTANT_READY"),this.sendSocketNotification("ASSISTANT_READY")},postProcess:function(t,s=(()=>{}),e=(()=>{})){if("continue"==t.lastQuery.status)return e();var n=this.findAllHooks(t),i=!1;if(n.length>0){this.assistantResponse.status("hook");for(var o=0;o<n.length;o++){var a=n[o];this.doCommand(a.command,a.params,a.from),"CUSTOM_DEVICE_ACTION"==a.from&&(i=!0)}i?e():s()}else e()},findAllHooks:function(t){var s=[];return s=(s=(s=s.concat(this.findTranscriptionHook(t))).concat(this.findAction(t))).concat(this.findResponseHook(t))},findResponseHook:function(t){var s=[];if(t.screen){var e=[];for(var n in e.links=t.screen.links?t.screen.links:[],e.text=t.screen.text?[].push(t.screen.text):[],e.photos=t.screen.photos?t.screen.photos:[],this.responseHooks)if(this.responseHooks.hasOwnProperty(n)){var i=this.responseHooks[n];if(i.where&&i.pattern&&i.command){var o=new RegExp(i.pattern,"ig").exec(e[i.where]);o&&(s.push({from:n,params:o,command:i.command}),log("ResponseHook matched:",n))}}}return s},findAction:function(t){var s=[],e=t.action?t.action:null;if(!e||!e.inputs)return[];for(var n=0;n<e.inputs.length;n++){var i=e.inputs[n];if("action.devices.EXECUTE"==i.intent)for(var o=i.payload.commands,a=0;a<o.length;a++)for(var r=o[a].execution,c=0;c<r.length;c++){var p=r[c];s.push({from:"CUSTOM_DEVICE_ACTION",params:p.params,command:p.command})}}return s},findTranscriptionHook:function(t){var s=[],e=t.transcription?t.transcription.transcription:"";for(var n in this.transcriptionHooks)if(this.transcriptionHooks.hasOwnProperty(n)){var i=this.transcriptionHooks[n];if(i.pattern&&i.command){var o=new RegExp(i.pattern,"ig").exec(e);o&&(s.push({from:n,params:o,command:i.command}),log("TranscriptionHook matched:",n))}else log(`TranscriptionHook:${n} has invalid format`)}return s},doCommand:function(t,s,e){if(this.assistantResponse.doCommand(t,s,e),"action.devices.commands.SetVolume"==t)return log("Volume Control:",s),this.sendNotification("A2D_VOLUME",s.volumeLevel);if(this.commands.hasOwnProperty(t)){var n=this.commands[t],i="object"==typeof s?Object.assign({},s):s;if(n.hasOwnProperty("notificationExec")){var o=n.notificationExec;if(o.notification){var a="function"==typeof o.notification?o.notification(i,e):o.notification,r=o.payload?"function"==typeof o.payload?o.payload(i,e):o.payload:null,c="object"==typeof r?Object.assign({},r):r;log(`Command ${t} is executed (notificationExec).`),this.sendNotification(a,c)}}if(n.hasOwnProperty("shellExec")){var p=n.shellExec;if(p.exec){var u="function"==typeof p.exec?p.exec(i,e):p.exec,l=p.options?"function"==typeof p.options?p.options(i,e):p.options:null,f="function"==typeof l?l(i,key):l;log(`Command ${t} is executed (shellExec).`),this.sendSocketNotification("SHELLEXEC",{command:u,options:f})}}if(n.hasOwnProperty("moduleExec")){var h=n.moduleExec,d="function"==typeof h.module?h.module(i,e):h.module,g=Array.isArray(d)?d:new Array(d);"function"==typeof h.exec&&MM.getModules().enumerate(s=>{(0==g.length||g.indexOf(s.name)>=0)&&(log(`Command ${t} is executed (moduleExec) for :`,s.name),h.exec(s,i,e))})}if(n.hasOwnProperty("functionExec")){var m=n.functionExec;"function"==typeof m.exec&&(log(`Command ${t} is executed (functionExec)`),m.exec(i,e))}if(n.hasOwnProperty("soundExec")){var A=n.soundExec;A.chime&&"string"==typeof A.chime&&("open"==A.chime&&this.assistantResponse.playChime("open"),"close"==A.chime&&this.assistantResponse.playChime("close")),A.sound&&"string"==typeof A.sound&&this.assistantResponse.playChime(A.sound,!0)}}else log(`Command ${t} is not found.`)},Assistant2Display:function(t){if(t.transcription&&t.transcription.transcription==this.config.A2DServer.stopCommand)return this.sendNotification("A2D_STOP");var s={photos:null,urls:null,transcription:null};t.screen&&(t.screen.links.length>0||t.screen.photos.length>0)&&(s.photos=t.screen.photos,s.urls=t.screen.links,s.transcription=t.transcription,log("Send A2D Response."),this.sendNotification("A2D",s))}});
