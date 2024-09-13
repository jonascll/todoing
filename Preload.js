const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    handleClose: () => ipcRenderer.invoke('iconClose'),
    handleMaximize: () => ipcRenderer.invoke('iconMaximize'),
    handleMinimize: () => ipcRenderer.invoke('iconMinimize'),
    removeFromJson: (reminder) => ipcRenderer.send('removeReminderFromFile', reminder),
    addToJson :(reminder) => ipcRenderer.send('addReminderToFile', reminder),
    startUpMain: () => ipcRenderer.invoke('startUp'),
    handleDatePicked: (reminder, datePicked, index) => ipcRenderer.send('pickedDate', reminder, datePicked, index)
})


