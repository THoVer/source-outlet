function AppController(viewFn, modelFn) {
    var view = new AppView();
    var model = new AppModel();
    
    model.setDataLoadedCallback(view.renderList);

    this.init = function() {
        view.init();
        model.init();
        console.log("refered from", document.referrer);
    }
}

var controller = new AppController();
window.addEventListener("load", controller.init, false);