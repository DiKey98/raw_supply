package main

import (
	"net/http"
	"github.com/gorilla/context"
	. "./configfromxml/configcreator"
	. "./logger/loggermanager"
	. "./logger/loggercreator"
	"fmt"
	"github.com/chasex/glog"
	. "./connect"
	. "./httphandlers/warehousemanager/regwarehousemanager"
	//. "./httphandlers/admin/loginadmin"
	. "./httphandlers/getunverifiedusers"
	. "./logout"
	. "./login"
	. "./httphandlers/warehousemanager/unverifiedwarehousemangers/confirm"
	. "./httphandlers/warehousemanager/unverifiedwarehousemangers/delete"
	//. "./httphandlers/warehousemanager/loginwarehousemanager"
	. "./httphandlers/admin/addadmin"
	. "./httphandlers/addsupplier"
	"time"
	. "./utils"
)

var cfgFile = "config.xml"

func main() {
	var err error
	var logOptions *glog.LogOptions

	Config, err = GetConfigFromFile(cfgFile)
	if err != nil {
		Logger.Errorf("%s \r\n", err.Error())
		Logger.Flush()
		panic(err)
	}

	ticker := time.NewTicker(Config.Log.RotationPeriod.Duration)

	logOptions, err = GetLogger(Config.Log.LogDir, Config.Log.LogName, 0755)
	if err != nil {
		fmt.Println(err)
	}
	defer Logger.Flush()

	go func() {
		for {
			select {
			case <- ticker.C:
				{
					err = Rotation(logOptions, Config.Log.MaxLogSizeMB.Value, Config.Log.MaxLogDuration.Duration)
					if err != nil {
						Logger.Errorf("%s \r\n", err.Error())
						Logger.Flush()
					}
				}
			}
		}
	}()

	err = MakeUploadDirs()
	if err != nil {
		Logger.Errorf("%s \r\n", err.Error())
		Logger.Flush()
		panic(err)
	}

	err = MakeTestUploadDirs()
	if err != nil {
		Logger.Errorf("%s \r\n", err.Error())
		Logger.Flush()
		panic(err)
	}

	DB, err = ConnectToDataBase(Config.DBConnect.ConnectionString)
	if err != nil {
		Logger.Errorf("%s \r\n", err.Error())
		Logger.Flush()
	}

	http.Handle("/", http.FileServer(http.Dir("./build")))

	http.HandleFunc("/regWarehouseManager/", RegWarehouseManager)
	http.HandleFunc("/confirmWarehouseManager/", ConfirmWarehouseManager)
	http.HandleFunc("/deleteWarehouseManager/", DeleteUnverifiedWarehouseManager)
	http.HandleFunc("/loginWarehouseManager/", Login)
	http.HandleFunc("/logoutWarehouseManager/", Logout)
	http.HandleFunc("/addSupplier/", AddSupplier)

	http.HandleFunc("/loginAdmin/", Login)
	http.HandleFunc("/logoutAdmin/", Logout)
	http.HandleFunc("/addAdmin/", AddAdmin)

	http.HandleFunc("/getUnverifiedUsers/", GetUnverifiedUsers)

	http.ListenAndServe(Config.Server.Port, context.ClearHandler(http.DefaultServeMux))
}