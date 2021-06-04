console.clear()
const setAlarm__time = document.getElementById("setAlarm__time")
const setAlarm__repeat = document.getElementById("setAlarm__repeat")
const setAlarm__repeatDays = document.getElementById("setAlarm_repeatDays")
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
let daysHTML //= []
function reset() {
    let testAlarms = {
        times: [
            {
                id: 0,
                active: true,
                time: "14:00",
                repeat: [0, 1, 2, 3, 4]
            },
            {
                id: 1,
                active: true,
                time: "13:00",
                repeat: []
            }
        ]
    }
    window.localStorage.setItem("alarms", JSON.stringify(testAlarms))
}

//set Alarms 
let alarms = JSON.parse(window.localStorage.alarms)

window.addEventListener('storage', () => {
    // When local storage changes, dump the list to
    // the console.
    console.log("storage update")
    console.log(window.localStorage.getItem('alarms'));
});


//CRUD alarms
function localUpdate(alarms) {
    window.localStorage.setItem("alarms", JSON.stringify(alarms))
    alarms = JSON.parse(window.localStorage.alarms)
}
function updateAlarm(id, attr, value) {
    alarms.times.find(x => x.id == id)[attr] = value;
    localUpdate(alarms)
}
function deleteAlarm(id) {
    alarms.times = alarms.times.filter(x => x.id != id);
    localUpdate(alarms)
}
function createAlarm(hhmm, repeatArray) {
    let newAlarm = {
        id: alarms.times.length,
        active: true,
        time: hhmm,
        repeat: Array.from(repeatArray)
    };
    alarms.times.push(newAlarm)
    localUpdate(alarms)
}


var alarmsList = document.getElementById('alarms');

for (let i = 0; i < alarms.times.length; i++) {
    printAlart(alarms.times[i])
}






function printAlart(singleAlarm, updateID) {
    //need <div id="alarms"></div>
    //var alarmsList = document.getElementById('alarms');
   // for (let i = 0; i < alarmObject.times.length; i++) {
        var o = singleAlarm //alarmObject.times[i]
        
        //poblado de dias
        let badgeList = "";
        for (let j = 0; j < days.length; j++) {
            if(o.repeat.length){
            badgeList += `<span class="badge ${o.repeat.includes(j) ? o.active?'bg-dark':'bg-secondary' : 'bg-light text-dark' }">
            ${days[j].substring(0,2)}
            </span>
            `
            }
        }
        
        let timeCard;
        
        if(updateID){
            timeCard = document.querySelector(`.timeCard[data-id="${updateID}"]`)
            timeCard.innerHTML = ""
        }else{
            timeCard = document.createElement("div");
            timeCard.dataset.id = updateID ? updateID:singleAlarm.id ;
            timeCard.classList.add("timeCard","form-check","form-switch")
        }


        
        

        let checkTimeCard = document.createElement("input");
        checkTimeCard.classList.add('form-check-input')
        checkTimeCard.type = "checkbox";
        checkTimeCard.id = `alarm-${o.id}`;
        checkTimeCard.dataset.id = o.id;
        checkTimeCard.checked = o.active ? "checked" : "";

        
        //create elelemt
        
        timeCard.append(checkTimeCard);
        alarmsList.append(timeCard)
        checkTimeCard.insertAdjacentHTML('afterend', `<label class="form-check-label" for="alarm-${o.id}">${o.time}<div class="px-3">${badgeList}</div></label>`)
        
        
        checkTimeCard.addEventListener("change", (e) => {
            updateAlarm(Number(e.target.dataset.id), "active", e.target.checked)
        })
        //delete
        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger");
        btnDelete.innerText = 'Borrar';
        btnDelete.dataset.id = o.id

        btnDelete.addEventListener("click", (e) => {
            e.preventDefault()
            deleteAlarm(Number(e.target.dataset.id))
            timeCard.remove();
        })
        //edit
        const btnEdit = document.createElement("button");
        btnEdit.classList.add("btn", "btn-primary");
        btnEdit.innerText = 'Editar';
        btnEdit.dataset.id = o.id

        btnEdit.addEventListener("click", (e) => {
            e.preventDefault()
            newAlarm(e.target.dataset.id);
        })
        
        timeCard.append(checkTimeCard, btnDelete, btnEdit);
        
        if(!updateID){
            alarmsList.append(timeCard)
        }
        //checkTimeCard.insertAdjacentHTML('afterend', `<label class="form-check-label" for="alarm-${o.id}">${o.time}<div class="px-3">${badgeList}</div></label>`)
        //timeCard.append(btnDelete);

    //}//for
    
}




let $newAlarm
function newAlarm(id) {
    //si existe $newAlarm no hace nada
    if (!document.body.contains($newAlarm)) {
        

        $newAlarm = document.createElement("form")
        $newAlarm.id = "newAlarm"
        $newAlarm.classList.add('form-modal')
        let formdays = `<div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Hora</div>
                        </div>
                        <input type="time"
                        value="${id?alarms.times.filter(x => x.id == id)[0].time:''}"
                        class="form-control" >
                    </div>`
        for (let j = 0; j < days.length; j++) {
            formdays += `<div class="form-check form-check-inline">
                            <input class="form-check-input" 
                            type="checkbox" 
                            ${id?alarms.times.filter(x => x.id == id)[0].repeat.find(y => y == j) != undefined?'checked':false:false}
                            value="${j}">
                            <label class="form-check-label">${days[j]} </label>
                        </div>`
        }
        $newAlarm.innerHTML = `<h2 class="h4 text-center">Nueva Alarma</h2><div class="w-100 py-3">${formdays}</div>`;

        //btn crear
        const btnCreate = document.createElement("button");
        btnCreate.classList.add("btn", "btn-primary");
        btnCreate.innerText = 'Guardar';
        btnCreate.addEventListener("click", (e) => {
            

            let newAlarm = { time: "", repeat: [] }

            for (a of $newAlarm.elements) {
                if (a.type == "time") { 
                    newAlarm.time = a.value
                } else if (a.type == "checkbox" && a.checked == true) {
                    newAlarm.repeat.push(Number(a.value))
                }
            }
            if(newAlarm.time != ""){
                if(id){
                    //si tiene id actualiza 
                    updateAlarm(id, "time", newAlarm.time);
                    updateAlarm(id, "repeat", newAlarm.repeat);
                    printAlart(alarms.times.filter(x => x.id == id)[0],id)

                }else{
                    //sino, crea
                createAlarm(newAlarm.time, newAlarm.repeat) //create
                printAlart(alarms.times[alarms.times.length-1])
                }
                console.log()
                //update view
                modal.remove();
            }else{
                $newAlarm.elements[0].focus()
            }
        })
        
        //btn borrar
        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger","mx-3");
        btnDelete.innerText = 'Cancelar';
        btnDelete.addEventListener("click", (e) => {
            e.preventDefault()
            modal.remove();
        })

        $newAlarm.appendChild(btnDelete)
        $newAlarm.appendChild(btnCreate)


        //submit del formulario
        $newAlarm.addEventListener("submit", function (e) {
            e.preventDefault()
        })
        //agregar formulario
        let modal = document.createElement("div");
        modal.classList.add("modal-back");
        modal.appendChild($newAlarm)
        document.body.appendChild(modal)
    }
}
/*
var newAlarmForm = document.getElementById("newAlarm");
newAlarmForm.addEventListener("submit", function(e){

    e.preventDefault()
    let newAlarm = { time: "",repeat: []}

    for(a of e.target.elements){
        if(a.type == "time"){
            newAlarm.time = a.value
        }else if (a.type == "checkbox" && a.checked == true){
            newAlarm.repeat.push(Number(a.value))
        }
    }
    createAlarm(newAlarm.time, newAlarm.repeat) //create
    printAlart(alarms) //update view
})
*/

/*
console.log(JSON.parse(window.localStorage.alarms))
console.log("set alarms")

console.log(alarms)
console.log("new alarms")

alarms.alarms.push({ time: "13:00", repeat: [5,6]})
//save local stoge
window.localStorage.setItem("alarms", JSON.stringify(alarms))
console.log('save local')
console.log(JSON.parse(window.localStorage.alarms))
*/


/*
const createCheckbox = (array,nameID) => {
    let ar = []
    for(let i=0; i<array.length;i++){
        //daysHTML += `<label for="days-${i}"><input id="${days[i]}" type="checkbox">${days[i]}</label>`
        let day__checkbox   = document.createElement("input");
        day__checkbox.type  = "checkbox";
        day__checkbox.id    = `${nameID}-${i}`;
        let day__checkbox_txt = document.createElement("span");
        day__checkbox_txt.innerText = `${array[i]}`;
        let day__label = document.createElement("label");
        day__label.htmlFor = `${nameID}-${i}`;
        day__label.appendChild(day__checkbox);
        day__label.appendChild(day__checkbox_txt);
        ar.push(day__label)
    }
    return ar
}
*/

//daysHTML = createCheckbox(days,"day");
/*
var loadTime = new Date()
setAlarm__time.value = `${formatTime(loadTime.getHours()) }:${formatTime(loadTime.getMinutes())}`;

function formatTime(t){
    return t < 10? `0${t}`:`${t}`
}

setAlarm__repeat.addEventListener("change", (e) => {
    if(e.target.checked){
        daysHTML = ""
        for(let i = 0; i< days.length; i++){
            daysHTML += `<div><label for="days-${i}"><input id="${days[i]}" type="checkbox">${days[i]}</label></div>`
        }
        setAlarm__repeatDays.innerHTML = daysHTML

    }else{
        setAlarm__repeatDays.innerHTML = ""
    }
});
*/