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
                active: true,
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

console.log(alarms)






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
        let card
        card = document.createElement("div");
        card.dataset.id = this.id
        card.dataset.active = this.active
        card.classList.add("timeCard", "form-check", "form-switch", "px-5", "py-3", "border", "rounded", "shadow-sm")

        let checkTimeCard = document.createElement("input");
        checkTimeCard.classList.add('form-check-input')
        checkTimeCard.type = "checkbox";
        checkTimeCard.id = `alarm-${this.id}`;
        checkTimeCard.dataset.id = this.id;
        console.log("problema del checked")
        checkTimeCard.checked = this.active == "false" ? false : this.active;


        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = `alarm-${this.id}`;

        let alarmDays = document.createElement("div");
        alarmDays.classList.add("col-sm-12","pb-3")

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger");
        btnDelete.innerText = 'Borrar';

        const btnUpdate = document.createElement("button");
        btnUpdate.classList.add("btn", "btn-success");
        btnUpdate.innerText = 'Editar';
        //events
        checkTimeCard.addEventListener("change", (e) => {
            this.active = e.target.checked
            card.dataset.active = this.active;
            updateAlarm(this.id, "active", this.active)
            if (this.active == false) {
                alarmPause()
                e.target.closest(".timeCard").classList.remove("bg-warning")
            }
        })
        btnDelete.addEventListener("click", (e) => {
            deleteAlarm(this.id)
            card.remove();
            alarmPause()

        })
        btnUpdate.addEventListener("click", (e) => {
            //this.createModal(this.id)
            createAlarmForm(this.id)
        })


        //create card
        this.updateView(label, alarmDays)
        card.append(checkTimeCard, label, alarmDays, btnUpdate, btnDelete);

        return card;
    }

    updateView($label, $days) {
        $label.innerText = this.time;
        $days.innerHTML = days.map(
            (d, index) => this.repeat.length > 0? `<span class="badge me-1 ${this.repeat.includes(index) ?
                "bg-dark" : "bg-light text-dark"}">
                ${d.substring(0, 2)}
                </span>`:"").join("");

    }

};

function createAlarmForm($id) {
    const thisAlarm = alarms.times.find(x => x.id == $id);
    console.log(thisAlarm)

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
                    <input type="time" value="${thisAlarm ? thisAlarm.time : ""}"class="form-control" required>
                </div>
        ${days.map((d, index) => `
            <div class="form-check form-check-inline">
                <input  class="form-check-input" 
                        type="checkbox" 
                        ${thisAlarm != undefined ? thisAlarm.repeat.includes(index) ? "checked" : null : null}
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
        if (hhmm) {
            if (thisAlarm) {
                //actualiza
                updateAlarm(thisAlarm.id, "time", hhmm)
                updateAlarm(thisAlarm.id, "repeat", repeatArray)

                //selecciona la tarjeta segun el id
                let card1 = document.querySelector(`.timeCard[data-id="${thisAlarm.id}"]`)
                let active = card1.dataset.active
                //crea una nueva time card
                let card2 = new TimeCard(thisAlarm.id, active, hhmm, repeatArray, false)
                


                
                //reemplaza la antigua por la nueva ¿alguna mejor forma de optimizar esto? 
                
                card1.parentNode.replaceChild(card2.htmlCard(), card1);

                //document.querySelector(`input[data-id="${thisAlarm.id}"]`).checked = card2.active

                //destruye el modal
                e.target.closest(".modal").remove()
                document.querySelector(".modal-backdrop").remove()
                alarmPause();
            } else {
                //crea
                createAlarm(hhmm, repeatArray)
                //remove modal
                e.target.closest(".modal").remove()
                document.querySelector(".modal-backdrop").remove()
            }

        } else {
            form.elements[0].focus()
        }

    })


    form.innerHTML = formElements
    form.append(btnSave)


    modalDialog.append(form)
    modal.append(modalDialog)
    const m = new bootstrap.Modal(modal)
    m.show()
}// create modalform


//CRUD alarms
function localUpdate(alarms) {
    window.localStorage.setItem("alarms", JSON.stringify(alarms))
    alarms = JSON.parse(window.localStorage.alarms)
}
function updateAlarm(id, attr, value) {
    alarms.times.find(x => x.id == id)[attr] = value;
    localUpdate(alarms)
}
function updateCard(card, array) {
    console.log(card)
    console.log(array)
}
function deleteAlarm(id) {
    alarms.times = alarms.times.filter(x => x.id != id);
    localUpdate(alarms)
}
function createAlarm(hhmm, repeatArray) {
    var alarmsList = document.getElementById('alarms');
    let newAlarm = new TimeCard(alarms.lastID++, true, hhmm, Array.from(repeatArray))
    alarms.times.push(newAlarm)
    alarmsList.append(newAlarm.htmlCard())
    alarms.lastID = alarms.lastID++
    localUpdate(alarms)
}

//clock 

class Clock {

    constructor(id) {
        this.id = id
        this.time = '00:00:00'
        this.day = 0
        this.hour = '00'
        this.minutes = '00'
        this.seconds = '00'

    }
    get html() {
        return html();
    }
    get run() {
        return run();
    }

    setter() {

        let t = new Date();
        const format = (num) => num > 9 ? `${num}` : `0${num}`;

        this.hour = format(t.getHours())
        this.minutes = format(t.getMinutes())
        this.seconds = format(t.getSeconds())
        this.day = t.getDay() - 1 >= 0 ? t.getDay() - 1 : 6;

        this.time = `${this.hour}:${this.minutes}:${this.seconds}`;


    }

    render() {
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
        document.querySelector("title").innerText = `${this.hour}:${this.minutes}:${this.seconds}`
    }
    alarmCheck() {
        let clock = document.querySelector(".clock");


        let t = alarms.times.filter(x => x.active == true && `${x.time}` == this.time.slice(0, 5) &&
            (x.repeat.length == 0 || x.repeat.includes(this.day)))[0]

        if (t) {
            const title = document.querySelector("title")
            const timeCard = document.querySelector(`.timeCard[data-id="${t.id}"]`)
            timeCard.classList.add("bg-warning")
            const timeCardCheck = timeCard.querySelector(`input[data-id="${t.id}"]`)

            title.innerHTML = `${this.time} ⏰`
            alarmPlay()
            if (timeCardCheck && this.seconds >= 59) {

                timeCard.classList.remove("bg-warning")

                alarmPause()
                //si la alarma no tiene repetición debe cambiar su estado active
                if (t.repeat.length <= 0) {
                    timeCardCheck.checked = "";
                    updateAlarm(t.id, "active", false)
                }
            }
        } else {
            document.body.style.background = "white"
        }

    }

    start() {
        this.render();
        //tiene que ser 500 para que no se desfase
        this.timer = setInterval(() => { this.render(); this.alarmCheck() }, 500);
    }


}




let s = document.getElementById("sound");
function alarmPlay() {

    let playPromise = s.play();
    //es necesario que el usuario interacture con la pagina para que suene, sino dará error 
    if (playPromise !== undefined) {
        playPromise.then(_ => { console.log("play") }).catch(error => { console.log("error") });
    }
}
function alarmPause() {
    console.log("off")
    let playPromise = s.pause();
    //es necesario que el usuario interacture con la pagina para que suene, sino dará error 
    if (playPromise !== undefined) {
        playPromise.then(_ => { console.log("pause") }).catch(error => { console.log("error") });
    }
}


let t = document.getElementById("clock");

//inicia reloj con id clock
let clock = new Clock('clock');
//acción recursiva
clock.start()

//print alarms
var alarmsList = document.getElementById('alarms');
for (let i = 0; i < alarms.times.length; i++) {
    let t = alarms.times[i]
    let alarm = new TimeCard(t.id, t.active, t.time, t.repeat)
    alarmsList.append(alarm.htmlCard())
}

console.log(alarmsList)
