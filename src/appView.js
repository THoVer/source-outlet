function AppView() {
    var me = this,
        list = document.getElementById('list'),

    websitePositionElement = function(itemData) {
        var position = document.createElement('div');
        position.classList.add('website-rank');

        title = '#' + itemData.position;
        if (itemData.position == 1) {
            title += ' <i class="fas fa-trophy"></i>'
            position.classList.add('first');
        } else if (itemData.position == 2) {
            title += ' <i class="fas fa-medal"></i>'
            position.classList.add('second');      
        } else {
            if (itemData.position == 3) {
                position.classList.add('third');      
            }
            position.style.color = itemData.textcolor;  
        }

        position.innerHTML = title;
        return position;
    };
    
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
            data[i].position = i + 1;
            item = me.listItem(data[i]);
            list.appendChild(item);
        }
    }

    this.listItem = function(itemData) {
        var listItem = document.createElement('div');
        listItem.classList.add('column', 'is-full-mobile', 'is-half-tablet', 'is-one-third-widescreen', 'is-one-quarter-fullhd');

        var box = document.createElement('div');
        box.classList.add('box');
        box.style.backgroundColor = itemData.color;
        {
            var position = websitePositionElement(itemData);
            box.appendChild(position);

            var icon = document.createElement('img');
            icon.classList.add('website-icon', 'center');
            icon.src = itemData.icon;
            box.appendChild(icon);
            
            var name = document.createElement('div');
            name.classList.add('website-name', 'text-center');
            name.textContent = itemData.name;
            name.style.color = itemData.textcolor;
            box.appendChild(name);

            var count = document.createElement('div');
            count.classList.add('website-count', 'text-center');
            count.textContent = itemData.count;
            count.style.color = itemData.textcolor;
            box.appendChild(count);
        }
        listItem.appendChild(box);

        return listItem;
    }

    this.init = function() {
        this.renderEmptyList();
        console.log('view is ready')
    }
}