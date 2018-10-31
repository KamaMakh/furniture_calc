let watchers = {
    watchSectionsCount(count){
        // let shelvesWrap = document.body.querySelector('.shelves-wrap'),
        //     boxesWrap = document.body.querySelector('.box-wrap'),
        //     crossBarWrap = document.body.querySelector('.crossBar-wrap'),
        //     shelf_span  = document.createElement('SPAN'),
        //     box_span = document.createElement('SPAN'),
        //     crossBar_span = document.createElement('SPAN'),
        //     addSectionButton = document.body.querySelector('.addSection')
        //
        //
        //
        // if(count>1){
        //     shelvesWrap.innerHTML=''
        //     boxesWrap.innerHTML=''
        //     crossBarWrap.innerHTML=''
        //     for(let i=0; i<count; i++){
        //         shelf_span.innerHTML = `<button class="addShelf" data-group="${parseInt(i)}">Добавить полку в ${parseInt(i)} секцию</button>`
        //         box_span.innerHTML = `<button class="addBox" data-group="${parseInt(i)}">Добавить ящик в ${parseInt(i)} секцию</button>`
        //         crossBar_span.innerHTML =`<button class="addCrossBar" data-group="${parseInt(i)}">Добавить штангу в ${parseInt(i)} секцию</button>`
        //
        //         shelvesWrap.append(shelf_span)
        //         boxesWrap.append(box_span)
        //         crossBarWrap.append(crossBar_span)
        //     }
        // }
        // addSectionButton.setAttribute('data-group', count+1)
    },

    handleMouseOver(konva){
        konva.fill('rgba(225,225,225, 0.5)')
    },
    handleMouseLeave(konva){
        konva.fill('white')
    }
}

export {watchers}