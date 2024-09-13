window.onload = startUp();

function startUp() {  
    
    window.electronAPI.startUpMain().then((data) =>{
        array = data
        if(data.length > 0) {
            for(let i = 0 ; i < data.length; ++i) {
                var mainFlex = document.getElementById('mainFlex');
   
                var element = document.createElement('div');
            
                element.classList.add("reminderElement")
                let date = new Date(data[i].date)
                let today = new Date();
                if( date.getDate() === today.getDate()
                && date.getMonth() === today.getMonth()
                && date.getFullYear() === today.getFullYear())
                {
                    element.classList.add("dueToday")
                }
                var elementText =  document.createElement('span');
                var icon = document.createElement('img');
                icon.src = "./Resources/delete.png"
                icon.classList.add('deleteIcon')
                var iconDate = document.createElement('input');
                iconDate.type = "date"
                iconDate.classList.add('datePicker')
                var divForIcons = document.createElement('div');
                divForIcons.appendChild(iconDate);
                divForIcons.appendChild(icon);
                divForIcons.classList.add("iconsFlex")
                icon.addEventListener("click", removeReminder)
                iconDate.addEventListener("change",handleDate)
         
       
           
                iconDate.value = data[i].date
        
                elementText.innerHTML = data[i].text;
                elementText.classList.add("reminderText")
                element.appendChild(elementText);
                element.appendChild(divForIcons);
                
                mainFlex.insertBefore(element, addButton);
            
            }
            
          
          updateDate(data);
        }

        
    })
   
    
}

function updateDate(data) {
    let mainFlex = document.getElementById("mainFlex")
   for(let i = 0 ; i < data.length; ++i) 
   {
    let date = new Date(data[i].date)
    let today = new Date();
    if( date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear())
    {
        let reminder = mainFlex.childNodes.item(i);
        if(!reminder.classList.contains("dueToday")) {
            reminder.classList.add("dueToday")
        }
    } else {
        if(reminder.classList.contains("dueToday")) {
        reminder.classList.remove("dueToday")
        }
    }
   }

    setTimeout(updateDate,600000)
}
var header = document.getElementById('headerBar')
var startPos = header.style.top
document.addEventListener("scroll",(event) => {
   
    console.log(document.documentElement.scrollTop)
    header.style.top = startPos + document.documentElement.scrollTop + "px"
    console.log( header.style.top)
})

var closeIcon = document.getElementById('iconClose');
var inputForText;
closeIcon.addEventListener('click', () => {

    window.electronAPI.handleClose();
})

var maximizeIcon = document.getElementById('iconMaximize');

maximizeIcon.addEventListener('click', () => {

    window.electronAPI.handleMaximize();
})

var minimizeIcon = document.getElementById('iconMinimize');

minimizeIcon.addEventListener('click', () => {

    window.electronAPI.handleMinimize();
})


var addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
   
    if(document.getElementsByClassName("input").length === 0) {
        var mainFlex = document.getElementById('mainFlex');
        var addButton = document.getElementById("addButton")
        var inputForText = document.createElement("input")
        inputForText.classList.add("input")
        inputForText.id = "inputForText"
        inputForText.placeholder = "type reminder here and press enter to save"
        inputForText.addEventListener("keypress", addElement)
        mainFlex.insertBefore(inputForText, addButton)
    }

   
})

function addElement(event) {
    if(event.key === "Enter") {
    var input = event.target
   
    var mainFlex = document.getElementById('mainFlex');
   
    var element = document.createElement('div');
   
    element.classList.add("reminderElement")
    var elementText =  document.createElement('span');
    var icon = document.createElement('img');
    icon.src = "./Resources/delete.png"
    icon.classList.add('deleteIcon')
    var iconDate = document.createElement('input');
    iconDate.type = "date"
    iconDate.classList.add('datePicker')
    var divForIcons = document.createElement('div');
    divForIcons.appendChild(iconDate);
    divForIcons.appendChild(icon);
    divForIcons.classList.add("iconsFlex")
    icon.addEventListener("click", removeReminder)
    iconDate.addEventListener("change",handleDate )
    elementText.innerHTML = input.value;
    elementText.classList.add("reminderText")
    element.appendChild(elementText);
    element.appendChild(divForIcons);
    
    mainFlex.insertBefore(element, addButton);
    mainFlex.removeChild(input);
    var reminder = {text:event.target.value, date: "null"};
    window.electronAPI.addToJson(reminder);
    }
    
   
    
}

function removeReminder(event)  {
    
    window.electronAPI.removeFromJson(event.target.parentElement.parentElement.innerText);
    event.target.parentElement.parentElement.remove();
  
}

function handleDate(event) {
    var datePicked = event.target.value;
    const index = Array.from(
        event.target.parentElement.parentElement.parentElement.children
      ).indexOf(event.target.parentElement.parentElement);
    
    var date = new Date(datePicked);
    let today = new Date();
    if( date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear()){
            event.target.parentElement.parentElement.classList.add("dueToday")
        } else {
            event.target.parentElement.parentElement.classList.remove("dueToday")
        }
    
    window.electronAPI.handleDatePicked(event.target.parentElement.innerText, datePicked,index)
}


