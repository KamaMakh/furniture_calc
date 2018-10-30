import VueKonva from "vue-konva";
import {furniture} from './js/index.js'


furniture.init();

let shelvesWrap = document.body.querySelector('.shelves-wrap'),
    boxesWrap = document.body.querySelector('.box-wrap'),
    crossBarWrap = document.body.querySelector('.crossBar-wrap')


document.body.addEventListener('click', function(e){
    if(e.target.classList.contains('addShelf')){
        let group = e.target.getAttribute('data-group')
        furniture.addShelf(group)
    }
    else if (e.target.classList.contains('addSection')){
        let group = e.target.getAttribute('data-group'),
            shelf_span  = document.createElement('SPAN'),
            box_span = document.createElement('SPAN'),
            crossBar_span = document.createElement('SPAN')
        furniture.addSection(group)
        e.target.setAttribute('data-group', parseInt(group)+1)
        shelf_span.innerHTML = `<button class="addShelf" data-group="${parseInt(group)}">Добавить полку в ${parseInt(group)} секцию</button>`
        box_span.innerHTML = `<button class="addBox" data-group="${parseInt(group)}">Добавить ящик в ${parseInt(group)} секцию</button>`
        crossBar_span.innerHTML = `<button class="addCrossBar" data-group="${parseInt(group)}">Добавить штангу в ${parseInt(group)} секцию</button>`
        shelvesWrap.append(shelf_span)
        boxesWrap.append(box_span)
        crossBarWrap.append(crossBar_span)
    }
    else if (e.target.classList.contains('removeSection')){
        //furniture.removeSection();
    }
    else if (e.target.classList.contains('addBox')){
        let group = e.target.getAttribute('data-group')
        furniture.addBox(group)
    }
    else if (e.target.classList.contains('addCrossBar')){
        let group = e.target.getAttribute('data-group')
        //furniture.addCrossBar(group)
        if(e.target.checked){
            console.log(group)
            furniture.addCrossBar(group)
        }else{
            furniture.hideCrossBar(group)
        }
    }
    else if (e.target.classList.contains('doors')){

        if(!e.target.checked){
            furniture.hideDoors()
        }else{
            furniture.showDoors()
        }
    }
    else if (e.target.classList.contains('rightConsole')){
        let shelfButton = document.querySelector('.add-shelf-right-console')
        if(e.target.checked){
            furniture.showRightSideConsole()
            shelfButton.classList.remove('hide')
        }
        else{
            furniture.hideRightSideConsole()
            shelfButton.classList.add('hide')
        }
    }
    else if (e.target.classList.contains('add-shelf-right-console')){
        furniture.addRightConsoleShelf()
    }
    else if (e.target.classList.contains('leftConsole')){
        let shelfButton = document.querySelector('.add-shelf-left-console')
        if(e.target.checked){
            furniture.showLeftSideConsole()
            shelfButton.classList.remove('hide')
        }else{
            furniture.hideLeftSideConsole()
            shelfButton.classList.add('hide')
        }
    }
    else if (e.target.classList.contains('add-shelf-left-console')){
        furniture.addLeftConsoleShelf()
    }
});