function AppModel() {
    var _data = [],
        renderDataCallback = null,
    
    loadData = function() {
        fetch('/stats')
            .then(response => {
                return response.json();
            })
            .then(function(data) {
                _data = data;
                renderDataCallback(data);
            });
    }

    this.setDataLoadedCallback = function(callback) {
        renderDataCallback = callback;
    }

    this.init = function() {
        loadData();
        console.log('model is ready')
    }
}