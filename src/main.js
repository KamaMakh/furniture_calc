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
    else if (e.target.classList.contains('removeShelf')){
        let group = e.target.getAttribute('data-group')
        furniture.removeLastShelve(group)
    }

    // else if (e.target.classList.contains('removeSection')){
    //     furniture.removeSection();
    // }
    else if (e.target.classList.contains('addBox')){
        let group = e.target.getAttribute('data-group')
        furniture.addBox(group)
    }
    else if (e.target.classList.contains('removeBox')){
        let group = e.target.getAttribute('data-group')
        console.log(group)
        furniture.removeBox(group)
    }
    else if (e.target.classList.contains('addCrossBar')){
        let group = e.target.getAttribute('data-group')

        if(e.target.checked){
            furniture.addCrossBar(group)
        }else{
            furniture.hideCrossBar(group)
        }
    }
    else if (e.target.classList.contains('doors')){

        // if(!e.target.checked){
        //     furniture.hideDoors()
        // }else{
        //     furniture.showDoors()
        // }
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

let consoles = document.body.querySelector('.consoles'),
    sectionsAmount = document.body.querySelector('.amount-wrap.sections'),
    doorsAmount = document.body.querySelector('.amount-wrap.doors'),
    doorsCheckbox =  document.body.querySelector('.doors-checkbox input'),
    doorOptionColumn = document.body.querySelector('.doors-options-column.column'),
    materials = document.body.querySelectorAll('.materials')



consoles.onchange = function(obj){
    let val = this.options[this.selectedIndex].value

    if(val == 'left'){
        furniture.showLeftSideConsole()
        furniture.hideRightSideConsole()
    }
    else if (val == 'right'){
        furniture.showRightSideConsole()
        furniture.hideLeftSideConsole()
    }
    else if (val == 'all'){
        furniture.showLeftSideConsole()
        furniture.showRightSideConsole(60,false)
    }
    else{
        furniture.hideRightSideConsole()
        furniture.hideLeftSideConsole()
    }
}

sectionsAmount.addEventListener('click', function(e){
    let target = e.target,
        input = this.querySelector('input')

    if(target.classList.contains('minus')){
        if(input.value <= 1){
            return
        }
        input.value--
        furniture.removeSection();
    }
    else if (target.classList.contains('plus')){
        input.value++
        furniture.addSection(input.value)
    }
})

doorsAmount.addEventListener('click', function(e){
    let target = e.target,
        input = this.querySelector('input'),
        isChecked = doorsCheckbox.checked,
        list = doorOptionColumn.querySelector('.body'),
        optionHtml,
        materialsData = document.body.querySelectorAll('.doors-options-column.column .body .option-wrap')


    if(target.classList.contains('minus')){
        if(input.value <= 2){
            return
        }
        input.value--
        furniture.hideDoors()
        furniture.showDoors(input.value)

        list.querySelectorAll('.option-wrap').forEach(function(item, index, arr){
            if(parseInt(item.getAttribute('data-key')) > input.value){
                item.remove()
            }
        })
        materialsData = document.body.querySelectorAll('.doors-options-column.column .body .option-wrap')

        for(let i=0; i<materialsData.length; i++){
            let key = materialsData[i].getAttribute('data-key'),
                val = materialsData[i].querySelector('select').options[materialsData[i].querySelector('select').selectedIndex].value

            furniture.setDoorImage(val, parseInt(key))
        }
        if(!isChecked){
            furniture.hideDoors()
        }

    }
    else if (target.classList.contains('plus')){
        if(input.value >= 4){
            return
        }
        input.value++
        furniture.hideDoors()
        furniture.showDoors(input.value)
        for(let i=0; i<materialsData.length; i++){
            let key = materialsData[i].getAttribute('data-key'),
                val = materialsData[i].querySelector('select').options[materialsData[i].querySelector('select').selectedIndex].value

            furniture.setDoorImage(val, parseInt(key))
        }
        if(!isChecked){
            furniture.hideDoors()
        }

        let container = document.createElement('DIV')

        container.setAttribute('data-key', input.value)
        container.setAttribute('class', 'option-wrap')
        container.innerHTML = `<div class="option-title">
              Дверь ${input.value}:
            </div>
            <div class="option-body">
              <select name="consoles" onchange="doorsChangeVal(this)">
                <option value="default">Материал</option>
                <option value="mirror">Зеркало</option>
                <option value="dsp">ДСП</option>
              </select>
            </div>`

        list.append(container)
    }

})


doorsCheckbox.addEventListener('click', function(e){
    let count = document.body.querySelector('.amount-wrap.doors input').value,
        materialsData = document.body.querySelectorAll('.doors-options-column.column .body .option-wrap')

    if(!e.target.checked){
        furniture.hideDoors()
    }else{
        furniture.showDoors(count)
        for(let i=0; i<materialsData.length; i++){
            let key = materialsData[i].getAttribute('data-key'),
                val = materialsData[i].querySelector('select').options[materialsData[i].querySelector('select').selectedIndex].value

            furniture.setDoorImage(val, parseInt(key))
        }
    }
})

window.doorsChangeVal = function ($this){
    let val = $this.options[$this.selectedIndex].value,
        wrap = $this.closest('.option-wrap'),
        index = wrap.getAttribute('data-key'),
        count = document.body.querySelector('.amount-wrap.doors input').value,
        isChecked = doorsCheckbox.checked

    if (!isChecked){
        furniture.showDoors(count)
    }

    furniture.setDoorImage(val, index)

    if (!isChecked){
        furniture.hideDoors()
    }
}



document.body.querySelector('.addshelfright').addEventListener('click', function(){
    furniture.addRightConsoleShelf()
})

document.body.querySelector('.addshelfleft').addEventListener('click', function(){
    furniture.addLeftConsoleShelf()
})
document.body.querySelector('.removeLastConsoleShelve').addEventListener('click', function(){
    let type = this.getAttribute('data-type')
    furniture.removeLastConsoleShelve(type)
})
