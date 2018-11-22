if(!window.hasOwnProperty('furniture_calc')){
    window.furniture_calc = {}
}


let watchers = {
    createButtons(groups, width, height, limits){
        let canvasWrap = document.body.querySelector('#app'),
            canvasWrapLeft = canvasWrap.offsetLeft,
            canvasWrapTop =  canvasWrap.offsetTop,
            count = groups.count,
            buttonsWrap = document.body.querySelector('.buttons-wrap')

        buttonsWrap.style.cssText += ';' + `top:${canvasWrapTop+height+100}px; left: ${canvasWrapLeft+limits.left}px; width:${width}px`;
        buttonsWrap.innerHTML = ''

        for(let i=0; i<count; i++){
            let button = document.createElement('DIV'),
                popup = document.createElement('DIV'),
                shelvesAmount,
                boxesAmount,
                crossBar,
                addShelfTrigger = document.querySelector('.addShelf'),
                removeShelfTrigger = document.querySelector('.removeShelf'),
                crossBarTrigger = document.body.querySelector('.addCrossBar'),
                addBoxTrigger = document.body.querySelector('.addBox'),
                removeBoxTrigger = document.body.querySelector('.removeBox'),
                shelfValue = groups['group'+(i+1)]['shelfGroup']['children']['length'],
                boxValue = groups['group'+(i+1)]['boxGroup']['children']['length'],
                crossBarValue = groups['group'+(i+1)]['crossBarGroup']['children']['length'],
                popupIn = `<div class="shelves">
                                <div class="title">Полки:</div>
                                <div class="btn-wrap">
                                    <button class="minus">-</button>
                                        <input type="text" value="${shelfValue}">
                                    <button class="plus">+</button>
                                </div>
                                
                            </div>
                            <div class="boxes">
                                <div class="title">Ящики:</div>
                                <div class="btn-wrap">
                                    <button class="minus">-</button>
                                        <input type="text" value="${boxValue}">
                                    <button class="plus">+</button>
                                </div>
                            </div>
                            <div class="crossbar">
                                <label><input type="checkbox" ${!!crossBarValue ? 'checked' : ''} name="crossBar">Штанга</label>
                            </div>`

            popup.innerHTML = popupIn
            popup.setAttribute('class', 'popup')
            popup.classList.add('hidden')

            button.setAttribute('class', 'sectionButton')
            button.setAttribute('data-key', i+1)
            button.style.cssText += ';' + `z-index:${count+100-(i+1)};`
            button.append(popup)
            buttonsWrap.append(button)

            button.addEventListener('click', function(e){
                let closed = this.querySelector('.popup').classList.contains('hidden'),
                    target = e.target,
                    allButtuns = document.body.querySelectorAll('.sectionButton')

                if(!target.classList.contains('sectionButton') && this == target.closest('.sectionButton')){
                    return
                }
                if(closed){
                    for(let i=0; i<allButtuns.length; i++){
                        allButtuns[i].querySelector('.popup').classList.add('hidden')
                    }
                    this.querySelector('.popup').classList.remove('hidden')
                }
                else{
                    this.querySelector('.popup').classList.add('hidden')
                }

                document.body.addEventListener('click', (c)=>{
                    if (c.target.querySelector('.sectionButton') || c.target.classList.contains('buttons-wrap') || c.target.getAttribute('id')=='app' || c.target.tagName == 'CANVAS'){
                        this.querySelector('.popup').classList.add('hidden')
                    }
                })
            })

            document.body.addEventListener('keyup', function(e){
                if (e.keyCode == 27){
                    let allPopups = document.body.querySelectorAll('.popup')
                    for(let i=0; i<allPopups.length; i++){
                        allPopups[i].classList.add('hidden')
                    }
                }
            })

            shelvesAmount = popup.querySelector('.shelves')
            boxesAmount =  popup.querySelector('.boxes')
            crossBar = popup.querySelector('.crossbar input')
            shelvesAmount.addEventListener('click', function(e){
                let target = e.target,
                    input = this.querySelector('input')

                if(target.classList.contains('minus')){
                    if(input.value <= 0){
                        return
                    }
                    input.value--
                    removeShelfTrigger.setAttribute('data-group', i+1)
                    watchers.simulateClick(removeShelfTrigger)
                }
                else if (target.classList.contains('plus')){
                    let maxShelves = window.furniture_calc.max_shelves ? window.furniture_calc.max_shelves : 6
                    if(input.value >= maxShelves){
                        return
                    }
                    input.value++

                    addShelfTrigger.setAttribute('data-group', i+1)
                    watchers.simulateClick(addShelfTrigger)
                }
            })
            boxesAmount.addEventListener('click', function(e){
                let target = e.target,
                    input = this.querySelector('input')

                if(target.classList.contains('minus')){
                    if(input.value <= 0){
                        return
                    }
                    input.value--

                    removeBoxTrigger.setAttribute('data-group', i+1)
                    watchers.simulateClick(removeBoxTrigger)
                }
                else if (target.classList.contains('plus')){
                    let maxBoxes = window.furniture_calc.max_boxes ? window.furniture_calc.max_boxes : 2
                    if(input.value >= maxBoxes){
                        return
                    }
                    input.value++

                    addBoxTrigger.setAttribute('data-group', i+1)
                    watchers.simulateClick(addBoxTrigger)
                }
            })
            crossBar.addEventListener('click', function(e){
                crossBarTrigger.setAttribute('data-group', i+1)
                if(e.target.checked){
                    crossBarTrigger.setAttribute('checked', e.target.checked)
                    crossBarTrigger.checked = false
                }
                else{
                    crossBarTrigger.checked = true
                }

                watchers.simulateClick(crossBarTrigger)
            })
        }
    },

    createConsoleButton(groups, width, height, limits, consoleType, removeButtons){
        let canvasWrap = document.body.querySelector('#app'),
            canvasWrapLeft = canvasWrap.offsetLeft,
            canvasWrapTop =  canvasWrap.offsetTop,
            count = groups.length == 0 ? 0 : ['children']['length'],
            oldButton = document.body.querySelectorAll('.sectionButton.console.'+consoleType)

        if(oldButton.length){
            return
        }

        let button = document.createElement('DIV'),
            popup = document.createElement('DIV'),
            shelvesAmount,
            addShelfTrigger = document.querySelector('.addshelf'+consoleType),
            removeShelfTrigger = document.querySelector('.removeLastConsoleShelve'),
            popupIn = `<div class="shelves">
                            <div class="title">Полки:</div>
                            <div class="btn-wrap">
                                <button class="minus">-</button>
                                    <input type="text" value="${count}">
                                <button class="plus">+</button>
                            </div>
                            
                        </div>
                        `

        popup.innerHTML = popupIn
        popup.setAttribute('class', 'popup')
        popup.classList.add('hidden')

        button.setAttribute('class', 'sectionButton console')
        if(consoleType == 'right'){
            button.style.cssText += ';' + `position:absolute;top:${canvasWrapTop+height+100}px; left: ${canvasWrapLeft+limits.right+15}px;`
            button.classList.add('right')
        }
        else{
            button.style.cssText += ';' + `position:absolute;top:${canvasWrapTop+height+100}px; left: ${canvasWrapLeft+limits.left-25}px; z-index:200;};`
            button.classList.add('left')
        }

        button.append(popup)
        document.body.append(button)
        //buttonsWrap.append(button)

        button.addEventListener('click', function(e){
            let closed = this.querySelector('.popup').classList.contains('hidden'),
                target = e.target,
                allButtuns = document.body.querySelectorAll('.sectionButton')

            if(!target.classList.contains('sectionButton') && this == target.closest('.sectionButton')){
                return
            }
            if(closed){
                for(let i=0; i<allButtuns.length; i++){
                    allButtuns[i].querySelector('.popup').classList.add('hidden')
                }
                this.querySelector('.popup').classList.remove('hidden')
            }
            else{
                this.querySelector('.popup').classList.add('hidden')
            }
        })

        document.body.addEventListener('keyup', function(e){
            if (e.keyCode == 27){
                let allPopups = document.body.querySelectorAll('.popup')
                for(let i=0; i<allPopups.length; i++){
                    allPopups[i].classList.add('hidden')
                }
            }
        })

        shelvesAmount = popup.querySelector('.shelves')
        shelvesAmount.addEventListener('click', function(e){
            let target = e.target,
                input = this.querySelector('input')

            if(target.classList.contains('minus')){
                if(input.value <= 0){
                    return
                }
                removeShelfTrigger.setAttribute('data-type', consoleType+'ConsoleShelves')
                input.value--
                watchers.simulateClick(removeShelfTrigger)
            }
            else if (target.classList.contains('plus')){
                let maxShelves = window.furniture_calc.max_console_shelves ? window.furniture_calc.max_console_shelves : 6
                if(input.value >= maxShelves){
                    return
                }
                input.value++

                watchers.simulateClick(addShelfTrigger)
            }
        })
    },
    hideConsoleButton(type){
        let child  = document.body.querySelector('.sectionButton.console.'+type)
        if(!child) return
        child.remove()
    },
    handleMouseOver(konva, isButton = false){
        if(!isButton){
            konva.fill('rgba(225,225,225, 0.5)')
        }else{
            konva.fill('#464657')
        }
    },
    handleMouseLeave(konva, isButton = false){
        if(!isButton){
            konva.fill('white')
        }else{
            konva.fill('white')
        }
    },
    simulateClick(elem) {
        let event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let canceled = !elem.dispatchEvent(event);
        if (canceled) {
            // A handler called preventDefault.
            alert("canceled");
        }
    }
}


export {watchers}