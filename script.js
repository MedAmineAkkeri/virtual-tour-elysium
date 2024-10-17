(function(){
    var script = {
 "start": "this.playAudioList([this.audio_8CAD04D8_99FB_35B8_41C9_6AA690214C0C]); this.init()",
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "borderRadius": 0,
 "borderSize": 0,
 "vrPolyfillScale": 0.75,
 "width": "100%",
 "minHeight": 20,
 "propagateClick": false,
 "scripts": {
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "registerKey": function(key, value){  window[key] = value; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "existsKey": function(key){  return key in window; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "unregisterKey": function(key){  delete window[key]; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "defaultVRPointer": "laser",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "downloadEnabled": false,
 "verticalAlign": "top",
 "layout": "absolute",
 "class": "Player",
 "paddingTop": 0,
 "backgroundPreloadEnabled": true,
 "gap": 10,
 "shadow": false,
 "paddingBottom": 0,
 "horizontalAlign": "left",
 "data": {
  "name": "Player15569"
 },
 "overflow": "visible",
 "mouseWheelEnabled": true,
 "scrollBarWidth": 10,
 "definitions": [{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_896356E1_99A7_D588_41DD_005565BB02FA_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8BFA4993_9A3C_7241_41DF_C6DC6D45C34D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -75.4,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B08A935_9A3C_7241_41D2_0862753BBA88",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -107.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 104.6,
   "backwardYaw": 159.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074",
 "thumbnailUrl": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_494996AD_5BB9_A97B_41C5_935D0BB31F82"
 ]
},
{
 "items": [
  {
   "media": "this.panorama_9642B679_99BA_D579_41DB_B8D7733EBD72",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_896356E1_99A7_D588_41DD_005565BB02FA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_896356E1_99A7_D588_41DD_005565BB02FA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8A5B53C1_99A5_5389_41CD_1771006E1648",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE",
   "camera": "this.panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8ACA3910_9A3C_725F_41D4_94E73BA145EA",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 113.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8ABDC8DE_9A3C_73C3_41BA_E0C7AEBEBE7A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -159.81,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AF6F903_9A3C_7241_41A9_A470D6ED34F5",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 72.7,
   "backwardYaw": 2.36,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623",
 "thumbnailUrl": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_t.jpg",
 "label": "1",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8A066EF8_99DB_5578_41DA_32D31B18C8C3"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -87.37,
   "backwardYaw": 0.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E",
   "distance": 1
  },
  {
   "yaw": 2.14,
   "backwardYaw": -178.06,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64",
 "thumbnailUrl": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_t.jpg",
 "label": "1_6",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4FE8192B_5B8B_DB78_41D1_6F05385192C5",
  "this.overlay_4FA40A1C_5B8B_5958_41CA_0C5ABAF9DB96"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B3EC92E_9A3C_7243_41D1_F17B010BE138",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 119.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8BB5A974_9A3C_72C7_41D0_470737F7E1E1",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 78.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": 83.28,
   "backwardYaw": 49.59,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
   "distance": 1
  },
  {
   "yaw": 38.56,
   "backwardYaw": -71.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8",
   "distance": 1
  },
  {
   "yaw": -86.45,
   "backwardYaw": 67.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_4B7066F0_5B99_F6E9_41D1_448497894C64",
 "thumbnailUrl": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_t.jpg",
 "label": "1_3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4A85C084_5B97_A928_41CB_163A352D462A",
  "this.overlay_4B091A69_5B96_B9F8_41D2_E7134455C0CE",
  "this.overlay_96AD3BB8_99AB_5387_41C5_AD3CD096E78A"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -176.48,
   "backwardYaw": -4.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E",
   "distance": 1
  },
  {
   "yaw": 49.59,
   "backwardYaw": 83.28,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64",
   "distance": 1
  },
  {
   "yaw": 87.23,
   "backwardYaw": -88.81,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8",
   "distance": 1
  },
  {
   "yaw": 159.12,
   "backwardYaw": 104.6,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
 "thumbnailUrl": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_t.jpg",
 "label": "1_2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4B66CC30_5B8A_F969_41D3_3BD4978DB78F",
  "this.overlay_4B77BF86_5B8B_5729_41BA_2266D17E165A",
  "this.overlay_4A99171E_5B89_5759_41B4_AB58F63D18EF",
  "this.overlay_4A8EBD35_5B8E_FB6B_41C5_F22D230ED8E0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 166.65,
   "backwardYaw": 5.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC"
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788",
 "thumbnailUrl": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_t.jpg",
 "label": "1_4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8B28F8AA_99AB_7D99_41D1_A29F72AD5540",
  "this.overlay_8A9C0586_99AB_D78B_41B5_22441A490D2E"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -0.63,
   "backwardYaw": -178.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC",
   "distance": 1
  },
  {
   "yaw": 5.15,
   "backwardYaw": 166.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788",
   "distance": 1
  },
  {
   "yaw": 161,
   "backwardYaw": -66.65,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B",
 "thumbnailUrl": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_t.jpg",
 "label": "1_5",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8829CC1F_99AD_34B9_41CA_C8B05EF9C073",
  "this.overlay_886BE945_99AD_3C89_41C9_72EEAA645AB0",
  "this.overlay_8DBF94A1_99EB_3589_41E2_B1FEB2A2C73A"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AEBE8FD_9A3C_73C1_41D3_96FA67B2611A",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.94,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B12093C_9A3C_7247_41B2_C86000A96137",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -130.41,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.5,
  "class": "PanoramaCameraPosition",
  "pitch": -2.26
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AD4A916_9A3C_7243_41C0_77FAAC077C77",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -177.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8A97A8F1_9A3C_73C1_41E2_A00C33458D03",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -92.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B5C7968_9A3C_72CF_41DE_AF69D15D5DFF",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 92.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B83B97A_9A3C_72C3_41BD_A9929BFE467E",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B333928_9A3C_724F_41D6_C8A9F7E8011C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 179.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -101.4,
   "backwardYaw": -133.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE",
 "thumbnailUrl": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_t.jpg",
 "label": "rooftop_3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8A6614B2_9A03_F243_41DA_C2C5BC15F166"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B47A95B_9A3C_72C2_41D1_3E7D9ECEAC2C",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -165.43,
   "backwardYaw": 3.64,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_9642B679_99BA_D579_41DB_B8D7733EBD72",
   "distance": 1
  },
  {
   "yaw": -68.99,
   "backwardYaw": -67.11,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_896356E1_99A7_D588_41DD_005565BB02FA",
 "thumbnailUrl": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_t.jpg",
 "label": "1_3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9647767C_99A5_5578_41E0_B11D9C8DC33A",
  "this.overlay_8983F731_99A5_3488_41CE_D59856124703"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 3.64,
   "backwardYaw": -165.43,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_896356E1_99A7_D588_41DD_005565BB02FA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_9642B679_99BA_D579_41DB_B8D7733EBD72",
 "thumbnailUrl": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_t.jpg",
 "label": "1_2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_88DB6510_99BB_5488_41CB_0107FFA11452"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B72C94F_9A3C_72C2_41E0_CE33FC79085D",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 46.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8A8428E4_9A3C_73C7_41CD_DE81438A19BC",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -177.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8BA7E96E_9A3C_72C3_41BE_77925E173230",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 3.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8BEB698D_9A3C_7241_41D3_A7FB1EC9DD06",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 91.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B9EA987_9A3C_7241_41B0_969755B515B5",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -96.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AE148F7_9A3C_73C1_41D6_0299554695FE",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -178.12,
   "backwardYaw": -0.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B",
   "distance": 1
  },
  {
   "yaw": 20.19,
   "backwardYaw": -60.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8A5B53C1_99A5_5389_41CD_1771006E1648",
   "distance": 1
  },
  {
   "yaw": 2.36,
   "backwardYaw": 72.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC",
 "thumbnailUrl": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_t.jpg",
 "label": "1_3",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8B5F2C76_99A5_348B_41BE_E91D84FFE7CE",
  "this.overlay_8AED2F80_99A7_5388_41D0_ADD3615C834B",
  "this.overlay_8A81E688_99A6_D587_41DE_C7602AA95744"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 0.88,
   "backwardYaw": -87.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64",
   "distance": 1
  },
  {
   "yaw": -4.65,
   "backwardYaw": -176.48,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
   "distance": 1
  },
  {
   "yaw": -133.15,
   "backwardYaw": -101.4,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074"
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E",
 "thumbnailUrl": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_t.jpg",
 "label": "1_7",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_49BC4236_5B89_6968_41D3_752F48992248",
  "this.overlay_49D72A92_5B89_F928_41D2_99400BF9C7F9",
  "this.overlay_49D1496C_5BB6_DBF9_41D0_F025A0CE4C27",
  "this.overlay_97CAC2B6_9A04_7642_41C2_23F65D1BE8E8"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B67C949_9A3C_72CE_41DF_F1E395F374B8",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -112.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "autoplay": true,
 "audio": {
  "mp3Url": "media/audio_8CAD04D8_99FB_35B8_41C9_6AA690214C0C.mp3",
  "oggUrl": "media/audio_8CAD04D8_99FB_35B8_41C9_6AA690214C0C.ogg",
  "class": "AudioResource"
 },
 "id": "audio_8CAD04D8_99FB_35B8_41C9_6AA690214C0C",
 "data": {
  "label": "Soft melodies for daydreams."
 },
 "class": "MediaAudio"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -60.96,
   "backwardYaw": 20.19,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8A5B53C1_99A5_5389_41CD_1771006E1648",
 "thumbnailUrl": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_t.jpg",
 "label": "1_2",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8A409725_99DB_7489_41DD_AE91BE5EF1A7"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "adjacentPanoramas": [
  {
   "yaw": -178.06,
   "backwardYaw": 2.14,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64",
   "distance": 1
  },
  {
   "yaw": -71.25,
   "backwardYaw": 38.56,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64",
   "distance": 1
  },
  {
   "yaw": -88.81,
   "backwardYaw": 87.23,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074"
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8",
 "thumbnailUrl": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_t.jpg",
 "label": "1_4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4ABBE8B5_5B8F_F968_41D1_4DE5B4533277",
  "this.overlay_4A32C43D_5B8E_A95B_41D4_570DEF7BF1CB",
  "this.overlay_4A278A9A_5B8A_F959_41C8_0C0ACC091B81"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B295922_9A3C_7243_41E0_68AF9E4C0A88",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 14.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B7B4955_9A3C_72C6_41A5_F126E29DB2E1",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 111.01,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_970C7439_99AA_D4F8_41DD_6C789591B399_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B504962_9A3C_72C3_41D4_8AA901D51027",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 93.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B8FC981_9A3C_7241_41DF_E13C1A19CDDB",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 175.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8B1CE942_9A3C_72C3_41DF_362F5E7D6AEA",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 108.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AB838D8_9A3C_73CF_41E1_C6058B8279FE",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 112.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8A8CC8EB_9A3C_73C1_418F_9686A3C710C8",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -141.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AFF390A_9A3C_7243_41D0_A86253544E7E",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -13.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -67.11,
   "backwardYaw": -68.99,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_896356E1_99A7_D588_41DD_005565BB02FA",
   "distance": 1
  },
  {
   "yaw": -66.65,
   "backwardYaw": 161,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B",
   "distance": 1
  },
  {
   "yaw": 67.96,
   "backwardYaw": -86.45,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_970C7439_99AA_D4F8_41DD_6C789591B399",
 "thumbnailUrl": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_t.jpg",
 "label": "1_4",
 "pitch": 0,
 "class": "Panorama",
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "height": 2048,
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_8977A554_99BD_5488_41E2_A0BC904D44DB",
  "this.overlay_8919CD46_99BD_348B_41DD_26D09D8FC5B6",
  "this.overlay_895EA163_99BD_CC88_41DB_22C38E9F896F",
  "this.overlay_88266829_99BB_5C98_41A8_BF0DD11AD5D0",
  "this.overlay_88A04B0D_99A5_DC99_41D5_FFD5DAC5ABBC",
  "this.overlay_880B187E_99A5_7D7B_41DC_F36CC97E515B"
 ]
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_camera",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8AB228D2_9A3C_73C3_41E0_BB37199C7400",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   },
   {
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticZoomSpeed": 10,
 "id": "camera_8ADFA91C_9A3C_7247_41D4_B0666E8E96D8",
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -20.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "id": "MainViewer",
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "progressBorderRadius": 0,
 "toolTipPaddingLeft": 6,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "borderRadius": 0,
 "toolTipDisplayTime": 600,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "width": "100%",
 "progressBackgroundColorRatios": [
  0
 ],
 "minHeight": 50,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadHeight": 15,
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "minWidth": 100,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "class": "ViewerArea",
 "toolTipOpacity": 1,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontSize": "1.11vmin",
 "height": "100%",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "shadow": false,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarRight": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "transitionMode": "blending",
 "toolTipShadowHorizontalLength": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowOpacity": 1,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "paddingTop": 0,
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "toolTipFontColor": "#606060",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "paddingBottom": 0,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "transitionDuration": 500,
 "progressBorderSize": 0,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B, this.camera_8ADFA91C_9A3C_7247_41D4_B0666E8E96D8); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_48941265_5BBA_A9E8_41C9_DDF11E16A77D",
   "yaw": 104.6,
   "pitch": -0.41,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_494996AD_5BB9_A97B_41C5_935D0BB31F82",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12,
   "yaw": 104.6,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC, this.camera_8AD4A916_9A3C_7243_41C0_77FAAC077C77); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 28.08,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8A450A18_99DD_3C87_41C9_230060D718B2",
   "yaw": 72.7,
   "pitch": -0.79,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8A066EF8_99DB_5578_41DA_32D31B18C8C3",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 28.08,
   "yaw": 72.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8, this.camera_8AEBE8FD_9A3C_73C1_41D3_96FA67B2611A); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.52,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483BBFB1_5BB7_5768_4190_FFBF61CA8987",
   "yaw": 2.14,
   "pitch": -15.51,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4FE8192B_5B8B_DB78_41D1_6F05385192C5",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.52,
   "yaw": 2.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E, this.camera_8AE148F7_9A3C_73C1_41D6_0299554695FE); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.59,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483C5FB1_5BB7_5768_41CC_F4570F8AD0B6",
   "yaw": -87.37,
   "pitch": -13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4FA40A1C_5B8B_5958_41CA_0C5ABAF9DB96",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.59,
   "yaw": -87.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B, this.camera_8B12093C_9A3C_7247_41B2_C86000A96137); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 19.48,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A9E0634_5B89_6968_41C3_D04A5A3E9E74",
   "yaw": 83.28,
   "pitch": -36.11,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4A85C084_5B97_A928_41CB_163A352D462A",
 "data": {
  "label": "Arrow 06b Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 19.48,
   "yaw": 83.28,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -36.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_1_HS_0_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8, this.camera_8B1CE942_9A3C_72C3_41DF_362F5E7D6AEA); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.86,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A995634_5B89_6968_41AA_91A2AF0C1058",
   "yaw": 38.56,
   "pitch": -24.31,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4B091A69_5B96_B9F8_41D2_E7134455C0CE",
 "data": {
  "label": "Arrow 06c Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.86,
   "yaw": 38.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_1_HS_1_0_0_map.gif",
      "width": 41,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399, this.camera_8B67C949_9A3C_72CE_41DF_F1E395F374B8); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_968393AE_99A5_3398_41C4_AA1C547DB574",
   "yaw": -86.45,
   "pitch": -10.33,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_96AD3BB8_99AB_5387_41C5_AD3CD096E78A",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17,
   "yaw": -86.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64, this.camera_8B9EA987_9A3C_7241_41B0_969755B515B5); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A993634_5B89_6968_41D5_CC092925A843",
   "yaw": 49.59,
   "pitch": -4.93,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4B66CC30_5B8A_F969_41D3_3BD4978DB78F",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.96,
   "yaw": 49.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8, this.camera_8BEB698D_9A3C_7241_41D3_A7FB1EC9DD06); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.7,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A991634_5B89_6968_41D0_E1B77CD7CC17",
   "yaw": 87.23,
   "pitch": -25.06,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4B77BF86_5B8B_5729_41BA_2266D17E165A",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.7,
   "yaw": 87.23,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074, this.camera_8BFA4993_9A3C_7241_41DF_C6DC6D45C34D); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A99F634_5B89_6968_41D0_7CD37939FF6C",
   "yaw": 159.12,
   "pitch": 0.59,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4A99171E_5B89_5759_41B4_AB58F63D18EF",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12,
   "yaw": 159.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E, this.camera_8B8FC981_9A3C_7241_41DF_E13C1A19CDDB); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.07,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A99D634_5B89_6968_41D1_D7F6E54D8D4C",
   "yaw": -176.48,
   "pitch": -21.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4A8EBD35_5B8E_FB6B_41C5_F22D230ED8E0",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.07,
   "yaw": -176.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_3_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.14,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8B9B6232_99AB_4C88_41DB_7AC99C6E9BA2",
   "yaw": -155.76,
   "pitch": -38.75,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8B28F8AA_99AB_7D99_41D1_A29F72AD5540",
 "data": {
  "label": "Arrow 06a Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.14,
   "yaw": -155.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -38.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0_HS_2_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B, this.camera_8B83B97A_9A3C_72C3_41BD_A9929BFE467E); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 17.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8B9B3232_99AB_4C88_41B7_583306DF8C95",
   "yaw": 166.65,
   "pitch": -36.87,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8A9C0586_99AB_D78B_41B5_22441A490D2E",
 "data": {
  "label": "Arrow 06b Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 17.63,
   "yaw": 166.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -36.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0_HS_3_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC, this.camera_8AF6F903_9A3C_7241_41A9_A470D6ED34F5); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.1,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8B942976_99AD_FC88_4199_65B2CFCFCC39",
   "yaw": -0.63,
   "pitch": -15.51,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8829CC1F_99AD_34B9_41CA_C8B05EF9C073",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.1,
   "yaw": -0.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788, this.camera_8AFF390A_9A3C_7243_41D0_A86253544E7E); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 15.75,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8B8B9976_99AD_FC88_41D9_72D7BBFEF901",
   "yaw": 5.15,
   "pitch": -26.44,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_886BE945_99AD_3C89_41C9_72EEAA645AB0",
 "data": {
  "label": "Arrow 06b Right"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.75,
   "yaw": 5.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_1_HS_1_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399, this.camera_8ACA3910_9A3C_725F_41D4_94E73BA145EA); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 21.25,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8DC23A62_99EF_3C8B_41B6_073640A4A498",
   "yaw": 161,
   "pitch": -3.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8DBF94A1_99EB_3589_41E2_B1FEB2A2C73A",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 21.25,
   "yaw": 161,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E, this.camera_8B72C94F_9A3C_72C2_41E0_CE33FC79085D); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.95,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8FE11873_9A3C_72C2_41DB_8C544B16662F",
   "yaw": -101.4,
   "pitch": -5.18,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8A6614B2_9A03_F243_41DA_C2C5BC15F166",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.95,
   "yaw": -101.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_970C7439_99AA_D4F8_41DD_6C789591B399, this.camera_8AB838D8_9A3C_73CF_41E1_C6058B8279FE); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.63,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_96400FAC_99BB_F398_41E3_1AF6AB66B674",
   "yaw": -68.99,
   "pitch": -14.23,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_9647767C_99A5_5578_41E0_B11D9C8DC33A",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.63,
   "yaw": -68.99,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_9642B679_99BA_D579_41DB_B8D7733EBD72, this.camera_8AB228D2_9A3C_73C3_41E0_BB37199C7400); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.98,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_96405FAC_99BB_F398_41DA_113F300B0FB7",
   "yaw": -165.43,
   "pitch": -30.59,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8983F731_99A5_3488_41CE_D59856124703",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.98,
   "yaw": -165.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_896356E1_99A7_D588_41DD_005565BB02FA, this.camera_8B295922_9A3C_7243_41E0_68AF9E4C0A88); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.31,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_96407FAC_99BB_F398_41CE_E50ED0CD4B9A",
   "yaw": 3.64,
   "pitch": -18.28,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_88DB6510_99BB_5488_41CB_0107FFA11452",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.31,
   "yaw": 3.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_1_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B, this.camera_8B333928_9A3C_724F_41D6_C8A9F7E8011C); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 16.4,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8ADC45A9_99A7_5799_41D4_2A2ED89736D8",
   "yaw": -178.12,
   "pitch": -13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8B5F2C76_99A5_348B_41BE_E91D84FFE7CE",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 16.4,
   "yaw": -178.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_0_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8A5B53C1_99A5_5389_41CD_1771006E1648, this.camera_8B3EC92E_9A3C_7243_41D1_F17B010BE138); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8A420A18_99DD_3C87_41DC_162EA1252FF0",
   "yaw": 20.19,
   "pitch": -4.43,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8AED2F80_99A7_5388_41D0_ADD3615C834B",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.96,
   "yaw": 20.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623, this.camera_8B08A935_9A3C_7241_41D2_0862753BBA88); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.96,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8A424A18_99DD_3C87_41D6_5A2077515743",
   "yaw": 2.36,
   "pitch": -4.43,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8A81E688_99A6_D587_41DE_C7602AA95744",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.96,
   "yaw": 2.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483A9FB0_5BB7_5768_41D5_A781814E8FA0",
   "yaw": -25.78,
   "pitch": -0.91,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_49BC4236_5B89_6968_41D3_752F48992248",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12,
   "yaw": -25.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64, this.camera_8B5C7968_9A3C_72CF_41DE_AF69D15D5DFF); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.67,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483B4FB1_5BB7_5768_41BA_B28548874126",
   "yaw": 0.88,
   "pitch": -13.25,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_49D72A92_5B89_F928_41D2_99400BF9C7F9",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.67,
   "yaw": 0.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B, this.camera_8BA7E96E_9A3C_72C3_41BE_77925E173230); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 22.19,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483B0FB1_5BB7_5768_41D0_91F4653B4CE3",
   "yaw": -4.65,
   "pitch": -23.05,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_49D1496C_5BB6_DBF9_41D0_F025A0CE4C27",
 "data": {
  "label": "Arrow 06c Left"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 22.19,
   "yaw": -4.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_2_0_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE, this.camera_8BB5A974_9A3C_72C7_41D0_470737F7E1E1); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.79,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_94DAAF8F_9A07_EE41_41D7_0F13F5F43563",
   "yaw": -133.15,
   "pitch": -3.58,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_97CAC2B6_9A04_7642_41C2_23F65D1BE8E8",
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.79,
   "yaw": -133.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC, this.camera_8ABDC8DE_9A3C_73C3_41BA_E0C7AEBEBE7A); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 16.73,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8A42DA18_99DD_3C87_41DD_12B4D0AEDEB4",
   "yaw": -60.96,
   "pitch": 1.03,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8A409725_99DB_7489_41DD_AE91BE5EF1A7",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 16.73,
   "yaw": -60.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 6); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 11.99,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A99B634_5B89_6968_41D4_4AC575FA2BEF",
   "yaw": -71.25,
   "pitch": -1.92,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4ABBE8B5_5B8F_F968_41D1_4DE5B4533277",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.99,
   "yaw": -71.25,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.92,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B, this.camera_8A97A8F1_9A3C_73C1_41E2_A00C33458D03); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 14.58,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_4A999634_5B89_6968_41D2_A739230C327D",
   "yaw": -88.81,
   "pitch": -14.76,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4A32C43D_5B8E_A95B_41D4_570DEF7BF1CB",
 "data": {
  "label": "Arrow 06c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.58,
   "yaw": -88.81,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_1_HS_1_0_0_map.gif",
      "width": 32,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64, this.camera_8A8428E4_9A3C_73C7_41CD_DE81438A19BC); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 12.21,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_483AFFB0_5BB7_5768_41C5_462C6EF32ADC",
   "yaw": -178.06,
   "pitch": -19.03,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4A278A9A_5B8A_F959_41C8_0C0ACC091B81",
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.21,
   "yaw": -178.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.9,
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_1_0.png",
      "width": 121,
      "class": "ImageResourceLevel",
      "height": 77
     }
    ]
   },
   "pitch": -19.38,
   "yaw": -67.36,
   "distance": 50
  }
 ],
 "id": "overlay_8977A554_99BD_5488_41E2_A0BC904D44DB",
 "data": {
  "label": "RDC"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.9,
   "yaw": -67.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_1_0_map.gif",
      "width": 25,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_896356E1_99A7_D588_41DD_005565BB02FA, this.camera_8B7B4955_9A3C_72C6_41A5_F126E29DB2E1); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 9.36,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8BCE3E58_99A5_54B8_41B6_275C5CFE3C2E",
   "yaw": -67.11,
   "pitch": -12.68,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_8919CD46_99BD_348B_41DD_26D09D8FC5B6",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.36,
   "yaw": -67.11,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B, this.camera_8B47A95B_9A3C_72C2_41D1_3E7D9ECEAC2C); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 10.23,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8BCEFE58_99A5_54B8_41DE_0D9DF96C3C7A",
   "yaw": -66.65,
   "pitch": 2.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_895EA163_99BD_CC88_41DB_22C38E9F896F",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.23,
   "yaw": -66.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 2.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.58,
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_4_0.png",
      "width": 226,
      "class": "ImageResourceLevel",
      "height": 79
     }
    ]
   },
   "pitch": -4.24,
   "yaw": -66.67,
   "distance": 50
  }
 ],
 "id": "overlay_88266829_99BB_5C98_41A8_BF0DD11AD5D0",
 "data": {
  "label": "BUREAU "
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.58,
   "yaw": -66.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_4_0_map.gif",
      "width": 45,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4B7066F0_5B99_F6E9_41D1_448497894C64, this.camera_8B504962_9A3C_72C3_41D4_8AA901D51027); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "items": [
  {
   "hfov": 9.42,
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_8BCD6E58_99A5_54B8_41B7_99DE87701FBA",
   "yaw": 67.96,
   "pitch": -3.65,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_88A04B0D_99A5_DC99_41D5_FFD5DAC5ABBC",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.42,
   "yaw": 67.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.6,
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_6_0.png",
      "width": 420,
      "class": "ImageResourceLevel",
      "height": 103
     }
    ]
   },
   "pitch": -12.98,
   "yaw": 68.89,
   "distance": 50
  }
 ],
 "id": "overlay_880B187E_99A5_7D7B_41DC_F36CC97E515B",
 "data": {
  "label": "CO-WORKING SPACE"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 24.6,
   "yaw": 68.89,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_6_0_map.gif",
      "width": 65,
      "class": "ImageResourceLevel",
      "height": 15
     }
    ]
   }
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_48941265_5BBA_A9E8_41C9_DDF11E16A77D",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B4DCD4F_5B89_5B37_41D4_4A458E8F4074_0_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8A450A18_99DD_3C87_41C9_230060D718B2",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8D97D1B9_99DA_CFF9_41A4_35F312D36623_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483BBFB1_5BB7_5768_4190_FFBF61CA8987",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483C5FB1_5BB7_5768_41CC_F4570F8AD0B6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4A452764_5B8B_57E8_41D0_8FB7E4BFFF64_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A9E0634_5B89_6968_41C3_D04A5A3E9E74",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_1_HS_0_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A995634_5B89_6968_41AA_91A2AF0C1058",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_1_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_968393AE_99A5_3398_41C4_AA1C547DB574",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B7066F0_5B99_F6E9_41D1_448497894C64_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A993634_5B89_6968_41D5_CC092925A843",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A991634_5B89_6968_41D0_E1B77CD7CC17",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A99F634_5B89_6968_41D0_7CD37939FF6C",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A99D634_5B89_6968_41D1_D7F6E54D8D4C",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B45A40A_5B97_E939_41D5_81EA22483C6B_1_HS_3_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B9B6232_99AB_4C88_41DB_7AC99C6E9BA2",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0_HS_2_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B9B3232_99AB_4C88_41B7_583306DF8C95",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8BA5469F_99AE_F5B9_41D9_09FF3B062788_0_HS_3_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B942976_99AD_FC88_4199_65B2CFCFCC39",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B8B9976_99AD_FC88_41D9_72D7BBFEF901",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_1_HS_1_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8DC23A62_99EF_3C8B_41B6_073640A4A498",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_888B6A46_99AA_DC8B_41DD_7A09E232788B_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8FE11873_9A3C_72C2_41DB_8C544B16662F",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8BDB4AE5_9A04_37C1_41AA_390482A3CFEE_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_96400FAC_99BB_F398_41E3_1AF6AB66B674",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_96405FAC_99BB_F398_41DA_113F300B0FB7",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_896356E1_99A7_D588_41DD_005565BB02FA_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_96407FAC_99BB_F398_41CE_E50ED0CD4B9A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_9642B679_99BA_D579_41DB_B8D7733EBD72_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8ADC45A9_99A7_5799_41D4_2A2ED89736D8",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8A420A18_99DD_3C87_41DC_162EA1252FF0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8A424A18_99DD_3C87_41D6_5A2077515743",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_880C1E3B_99AD_D4F9_41B1_7B6CEE89CBDC_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483A9FB0_5BB7_5768_41D5_A781814E8FA0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483B4FB1_5BB7_5768_41BA_B28548874126",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483B0FB1_5BB7_5768_41D0_91F4653B4CE3",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_2_0.png",
   "width": 640,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_94DAAF8F_9A07_EE41_41D7_0F13F5F43563",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_4B73E74A_5B8F_5738_41C6_BC90B2EB5F1E_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8A42DA18_99DD_3C87_41DD_12B4D0AEDEB4",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_8A5B53C1_99A5_5389_41CD_1771006E1648_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A99B634_5B89_6968_41D4_4AC575FA2BEF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_1_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4A999634_5B89_6968_41D2_A739230C327D",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_483AFFB0_5BB7_5768_41C5_462C6EF32ADC",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_498CC79B_5B89_775F_41AE_B283C9F6B0F8_0_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BCE3E58_99A5_54B8_41B6_275C5CFE3C2E",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_2_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BCEFE58_99A5_54B8_41DE_0D9DF96C3C7A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BCD6E58_99A5_54B8_41B7_99DE87701FBA",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_970C7439_99AA_D4F8_41DD_6C789591B399_0_HS_5_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
}],
 "height": "100%",
 "desktopMipmappingEnabled": false
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
