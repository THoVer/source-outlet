function AppController(viewFn, modelFn) {
    var view = new AppView();
    var model = new AppModel();

    this.init = function() {
        view.init();
        model.init();
        console.log('loaded');
    }
}

var controller = new AppController();
window.addEventListener("load", controller.init, false);