const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    title: "Video Con",
    width:1386,
    height:756,
    maxHeight:1080,
    maxWidth:1920,
    minHeight:756,
    minWidth:1316,
    backgroundColor:'#7B435B',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.removeMenu()
  win.loadURL('http://localhost:3000');

  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})