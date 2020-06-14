export default () => {
  if (window.cordova) {
    // cordova-plugin-screen-orientation
    if (screen) screen.orientation.lock('portrait');
    
    // cordova-plugin-keyboard
    if (Keyboard) Keyboard.shrinkView(false); // only ios
    
    // cordova-plugin-splashscreen
    if (navigator) setTimeout(() => {
      alert('PASSOU AQUI');
      navigator.splashscreen.hide();
    }, 2000);
  }
  document.addEventListener((window.cordova ? 'backbutton' : 'keydown'), (e) => {
    const currentView = app.views.current;
    if (!window.cordova && e.keyCode != 27) return false; else
    if ($('.dialog.modal-in').length) e.preventDefault(); else
    if ($('.panel.panel-in').length) app.panel.close('.panel.panel-in'); else
    if ($('.sheet-modal.modal-in').length) app.sheet.close('.sheet-modal.modal-in'); else
    if ($('.page-current .searchbar-enabled').length) app.searchbar.disable('.page-current .searchbar-enabled'); else
    if (currentView && currentView.router && currentView.router.history.length > 1) currentView.router.back(); else
    if (window.cordova) navigator.app.exitApp();
  }, false);
};

//if ($('.actions-modal.modal-in').length) app.actions.close('.actions-modal.modal-in'); else

