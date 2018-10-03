function AppView() {
    var me = this,
        list = document.getElementById('list');
    
    this.renderEmptyList = function() {
        var item;
        list.innerHTML = '';
        for (var i = 0; i < 4; i++) {
            item = me.listItem({text: (i+1).toString() + ' Box'});
            list.appendChild(item);
        }
    }

    this.renderList = function(data) {
        var item;
        list.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            item = me.listItem(data[i]);
            list.appendChild(item);
        }
    }

    this.listItem = function(itemData) {
        var listItem = document.createElement('div');
        listItem.classList.add('column', 'is-full-mobile', 'is-half-tablet', 'is-one-third-widescreen', 'is-one-quarter-fullhd');

        var box = document.createElement('div');
        box.classList.add('box', 'website-name');
        box.textContent = itemData.name;
        box.style.backgroundColor = itemData.color;
        box.style.color = itemData.textcolor;

        var icon = document.createElement('img');
        icon.classList.add('website-icon');
        icon.src = itemData.icon;
        box.appendChild(icon);
        
        listItem.appendChild(box);
        return listItem;
    }

    this.init = function() {
        this.renderEmptyList();
        console.log('view is ready')
    }
}