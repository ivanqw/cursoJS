console.clear()
const setAlarm__time = document.getElementById("setAlarm__time")
const setAlarm__repeat = document.getElementById("setAlarm__repeat")
const setAlarm__repeatDays = document.getElementById("setAlarm_repeatDays")
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function reset() {
    let testAlarms = {
        lastID: 2,
        times: [
            {
                id: 0,
                active: false,
                time: "07:00",
                repeat: [0, 1, 2, 3, 4]
            },
            {
                id: 1,
                active: false,
                time: "12:00",
                repeat: []
            }
        ]
    }
    window.localStorage.setItem("alarms", JSON.stringify(testAlarms))
    location.reload();
}

//set Alarms 
let alarms = JSON.parse(window.localStorage.alarms)






class TimeCard {
    constructor(id, active, time, repeat) {
        this.id = id;
        this.active = active;
        this.time = time;
        this.repeat = repeat;
    }

    get htmlCard() {
        return this.htmlCard();
    }
    get createModal() {
        return this.createModal();
    }
    get create() {
        return create()
    }

    htmlCard() {
        //element
        let card = document.createElement("div");
        card.dataset.id = this.id
        card.classList.add("timeCard", "form-check", "form-switch", "px-5","py-3", "border","rounded","shadow-sm")

        let checkTimeCard = document.createElement("input");
        checkTimeCard.classList.add('form-check-input')
        checkTimeCard.type = "checkbox";
        checkTimeCard.id = `alarm-${this.id}`;
        checkTimeCard.dataset.id = this.id;
        checkTimeCard.checked = this.active ? "checked" : "";

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = `alarm-${this.id}`;

        let alarmDays = document.createElement("div");
        alarmDays.classList.add("col-sm-6")

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger");
        btnDelete.innerText = 'Borrar';

        const btnUpdate = document.createElement("button");
        btnUpdate.classList.add("btn", "btn-success");
        btnUpdate.innerText = 'Editar';
        //events
        checkTimeCard.addEventListener("change", (e) => {
            updateAlarm(this.id, "active", !this.active)
        })
        btnDelete.addEventListener("click", (e) => {
            deleteAlarm(this.id)
            card.remove();
        })
        btnUpdate.addEventListener("click", (e) => {
            this.createModal(this.id)
            console.log(this)
        })


        //create card
        this.updateView(label, alarmDays)
        card.append(checkTimeCard, label, alarmDays, btnUpdate, btnDelete);

        return card;
    }

    updateView($label, $days) {
        $label.innerText = this.time;
        $days.innerHTML = days.map(
            (d, index) => `<span class="badge me-1 ${this.repeat.includes(index) ?
                "bg-dark" : "bg-light text-dark"}">
                ${d.substring(0, 2)}
                </span>`).join("");

    }
    createModal($id) {
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.id = `modal-${this.id}`
        const modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog")

        const form = document.createElement("form");
        form.classList.add("modal-content", "p-3")
        const formElements = `
            <div class="input-group mb-2 mr-sm-2">
                <div class="input-group-prepend">
                    <div class="input-group-text">Hora</div>
                </div>
            <input type="time"
                value="${$id != undefined ? alarms.times.filter(x => x.id == $id)[0].time : ''}"
                        class="form-control" >
                    </div>
        ${days.map((d, index) => `
            <div class="form-check form-check-inline">
                <input  class="form-check-input" 
                        type="checkbox" 
                        ${$id != undefined ? this.repeat.includes(index) ? "checked" : null : null}
                        value="${index}">
                <label class="form-check-label">${d} </label>
            </div>`
        ).join("")}`

        const btnSave = document.createElement("button");
        btnSave.classList.add("btn", "btn-success")
        btnSave.innerText = "Guardar"

        btnSave.addEventListener("click", (e) => {
            e.preventDefault();
            let newHour = ""
            let newRepeat = []
            for (let i = 0; i < form.elements.length; i++) {
                let a = form.elements[i]

                if (a.type == "time") {
                    newHour = a.value
                } else if (a.type == "checkbox" && a.checked == true) {
                    newRepeat.push(Number(a.value))
                }
            }
            updateAlarm(this.id, "time", newHour)
            updateAlarm(this.id, "repeat", newRepeat)
            form.submit()
        })


        form.innerHTML = formElements
        if ($id != undefined) {
            form.append(btnSave)
        } else {

        }

        modalDialog.append(form)
        modal.append(modalDialog)
        const m = new bootstrap.Modal(modal)
        m.show();

    }

};

function createAlarmForm() {
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog")

    const form = document.createElement("form");
    form.classList.add("modal-content", "p-3")
    const formElements = `
            <div class="input-group mb-2 mr-sm-2">
                <div class="input-group-prepend">
                    <div class="input-group-text">Hora</div>
                </div>
                    <input type="time" value=""class="form-control" required>
                </div>
        ${days.map((d, index) => `
            <div class="form-check form-check-inline">
                <input  class="form-check-input" 
                        type="checkbox" 
                        value="${index}">
                <label class="form-check-label">${d} </label>
            </div>`
    ).join("")}`

    const btnSave = document.createElement("button");
    btnSave.classList.add("btn", "btn-success")
    btnSave.innerText = "Crear"

    btnSave.addEventListener("click", (e) => {
        e.preventDefault();
        let hhmm;
        let repeatArray = []
        for (let i = 0; i < form.elements.length; i++) {
            let a = form.elements[i]

            if (a.type == "time") {
                    hhmm = a.value
            } else if (a.type == "checkbox" && a.checked == true) {
                repeatArray.push(Number(a.value))
            }
        }
        console.log(hhmm?true:false)
        if(hhmm){
            createAlarm(hhmm, repeatArray)
            form.submit()
        }else{
            form.elements[0].focus()
        }
        
    })


    form.innerHTML = formElements
    form.append(btnSave)


    modalDialog.append(form)
    modal.append(modalDialog)
    const m = new bootstrap.Modal(modal)
    m.show()
}

function validateTime (time) {
    const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    return time.match(timeReg)
  }

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
    let newAlarm = new TimeCard(alarms.lastID++, true, hhmm, Array.from(repeatArray))
    alarms.times.push(newAlarm)
    alarms.lastID = alarms.lastID++
    localUpdate(alarms)
}



//print load 
var alarmsList = document.getElementById('alarms');
for (let i = 0; i < alarms.times.length; i++) {
    let t = alarms.times[i]
    let alarm = new TimeCard(t.id, t.active, t.time, t.repeat)
    alarmsList.append(alarm.htmlCard())
}








//clock 

class Clock{
    
    constructor(id){
        this.id = id
        this.time = '00:00:00'
        this.day = 0
        this.hour = '00'
        this.minutes = '00'
        this.seconds = '00'
        
    }
    get html(){
        return html();
    }
    get run(){
        return run();
    }

    setter(){

        let t = new Date();
        const format = (num) => num > 9? `${num}`: `0${num}`;

        this.hour = format(t.getHours())
        this.minutes = format(t.getMinutes())
        this.seconds = format(t.getSeconds())
        this.day = t.getDay() -1 >= 0 ? t.getDay() -1: 6;

        this.time = `${this.hour}:${this.minutes}:${this.seconds}`;
        
        
    }

    render(){
        this.setter();
        const clockhtml = document.getElementById(this.id)
        clockhtml.style.textAlign = "center";
        clockhtml.style.fontSize = "36px";
        clockhtml.style.background = "silver";
        clockhtml.style.borderRadius = '1rem'
        clockhtml.style.padding = "1rem";
        clockhtml.style.margin = "1rem 0"
        clockhtml.classList.add("clock")
        clockhtml.innerHTML = `

            <span class="hour">
                ${this.hour}
            </span>
            <span>:</span>
            <span class="minutes">
                ${this.minutes}
            </span>
            <span>:</span>
            <span class="seconds">
                ${this.seconds}
            </span>

        `
    }
    alarmCheck(){
        alarms.times.filter(x => x.active == true && `${x.time}:00` == this.time)[0] != undefined ?
        document.body.style.background = "red":
        document.body.style.background = "white"

    }

    start() {
        this.render();
        //tiene que ser 500 para que no se desfase
        this.timer = setInterval(() => {this.render(); this.alarmCheck()}, 500);
      }

    
  }





  let t = document.getElementById("clock");

  //inicia reloj con id clock
  let clock = new Clock('clock');
    //acción recursiva
    clock.start()

    console.log(clock)
    
  
