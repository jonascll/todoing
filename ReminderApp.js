const { app, BrowserWindow } = require('electron')
const path = require('path')
const {ipcMain} = require('electron');
const fs = require('fs')
const pathJson = './Reminders.json'
const tt = require('electron-tooltip')

var previousWindowSize;
var previousWindowPosition;
var stateWindowMaximized = false;



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    
    webPreferences: {
      preload: path.join(__dirname, 'Preload.js')
    },
    frame: false,
    transparent: true,
    icon: "./Resources/flavicon.ico"
  })
  
 win.setAlwaysOnTop(true,'screen')
  
  win.loadFile('ReminderApp.html')
  win.once('focus', () => win.flashFrame(false))
}

app.whenReady().then(() => {
  createWindow()
  try {
    if (!fs.existsSync(pathJson)) {
      let emptyArray = [];
      fs.writeFileSync("Reminders.json",JSON.stringify(emptyArray) )
    }
  } catch(err) {
    console.error(err)
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }

  })
 
  
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.handle("iconClose", () => {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.close();
})

ipcMain.handle("iconMaximize", () => {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  
  if(stateWindowMaximized) {
   focusedWindow.setSize(previousWindowSize[0], previousWindowSize[1])
   focusedWindow.setPosition(previousWindowPosition[0], previousWindowPosition[1])
   stateWindowMaximized = false;
  } else {
    previousWindowSize = focusedWindow.getSize()
    previousWindowPosition = focusedWindow.getPosition()
    
    focusedWindow.maximize();
    stateWindowMaximized = true;
  }

})
ipcMain.handle("iconMinimize", () => {
  var focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.minimize();
  focusedWindow.flashFrame(true);
})

ipcMain.on("addReminderToFile", (event, reminder) => {
  data = readJson();
  data.push(reminder)
  fs.writeFileSync("Reminders.json", JSON.stringify(data))

})

ipcMain.on("removeReminderFromFile", (event , reminder) => {
  data = readJson();
  data.splice(data.indexOf(reminder) , 1)
  fs.writeFileSync("Reminders.json", JSON.stringify(data))
})

function readJson() {
  let data = fs.readFileSync('./Reminders.json')
  return JSON.parse(data)
}

ipcMain.handle("startUp", () => {
    let data = fs.readFileSync('./Reminders.json')
    data = JSON.parse(data)
   
    return data;
})

ipcMain.on("pickedDate", (event, reminder, datePicked, index) => {
  data = readJson();
  
 
  let reminderInData = data[index]


  reminderInData.date = datePicked;
  data[index] = reminderInData;
  fs.writeFileSync("Reminders.json", JSON.stringify(data))

})