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
	. "./httphandlers/regwarehousemanager"
	. "./httphandlers/admin/loginadmin"
	. "./httphandlers/getunverifiedusers"
	. "./httphandlers/admin/logoutadmin"
	. "./httphandlers/unverifiedwarehousemangers/confirm"
	. "./httphandlers/unverifiedwarehousemangers/delete"
	"time"
)

var cfgFile = "config.xml"

func main() {
	var err error
	var logOptions *glog.LogOptions

	Config, err = GetConfigFromFile(cfgFile)
	if err != nil {
		panic(err)
	}

	ticker := time.NewTicker(Config.Server.RotationPeriod.Duration)

	logOptions, err = GetLogger(Config.Server.LogDir, Config.Server.LogName, 0755)
	if err != nil {
		fmt.Println(err)
	}
	defer Logger.Flush()

	go func() {
		for {
			select {
			case <- ticker.C:
				{
					err = Rotation(logOptions, Config.Server.MaxLogSizeMB.Value, Config.Server.MaxLogDuration.Duration)
					if err != nil {
						Logger.Errorf("%s \r\n", err.Error())
						Logger.Flush()
					}
				}
			}
		}
	}()

	DB, err = ConnectToDataBase(Config.DBConnect.ConnectionString)
	if err != nil {
		Logger.Errorf("%s \r\n", err.Error())
		Logger.Flush()
	}

	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.HandleFunc("/regWarehouseManager/", RegWarehouseManager)
	http.HandleFunc("/loginAdmin/", LoginAdmin)
	http.HandleFunc("/logoutAdmin/", LogoutAdmin)
	http.HandleFunc("/getUnverifiedUsers/", GetUnverifiedUsers)
	http.HandleFunc("/confirmWarehouseManager/", ConfirmWarehouseManager)
	http.HandleFunc("/deleteWarehouseManager/", DeleteUnverifiedWarehouseManager)

	http.ListenAndServe(Config.Server.Port, context.ClearHandler(http.DefaultServeMux))
}