"use strict";
const electron = require("electron");
const fs = require('fs');

let mainWindow;

const constructorMethod = () => {
  // Module to control application life.
  const app = electron.app;

  // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const menu = electron.Menu;
const dialog = electron.dialog;

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save Calender',
        click () {
          var filePath = 'data/event-files/eventlist.json';
          var source = fs.createReadStream(filePath);
          var destination = dialog.showSaveDialog({ defaultPath: 'calender.' + 'json' });
          if(destination){
          const stream = source.pipe(fs.createWriteStream(destination));
          return new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
           });}
        }
      },
      {
        label: 'Load Calender',
        click () {
         
         dialog.showOpenDialog(function(filePath){
            if(filePath){
            return fs.statAsync(filePath[0]).then((stats) => {
              return fs.readFileAsync(filePath[0], "utf-8").then((eventObj)=>{
                return new Promise((fulfill, reject) => {
                    const eventPath = 'data/event-files/eventlist.json';
                    fs.writeFile(eventPath, eventObj, (error, data) => {
                        if (error) {
                        reject(error);
                        return;
                        }
                        fulfill(true);
                    });
                }).then((fulfilled)=>{
                      //console.log("fulfilled " + fulfilled);
                      if(fulfilled)
                      mainWindow.loadURL('http://localhost:3000/monthly');
                  });
              });
            });}
          });
        }
      }
    ]
  },
  {
    label: 'Modes',
    submenu: [
      {
        label: 'Change to Tablet',
        click () {
          mainWindow.setBounds({x:10,y:10,width:1000,height:600});
        }
      },
      {
        label: 'Change to Desktop',
        click () {
          mainWindow.setBounds({x:10,y:10,width:1200,height:600});
        }
      },
      {
        label: 'Change to mobile',
        click () {
          mainWindow.setBounds({x:10,y:10,width:400,height:600});
        }
      }
    ]
  }
]


const menuObj = menu.buildFromTemplate(template)
menu.setApplicationMenu(menuObj);



  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 900, maximizable:false })

    mainWindow.loadURL('http://localhost:3000/monthly');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode: "undocked"});

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    mainWindow.on('maximize',function(){
        mainWindow.setBounds({x:10,y:10,width:1200,height:600});
    });
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
};

module.exports = constructorMethod;