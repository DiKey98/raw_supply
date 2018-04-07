package addincoming

import (
	"net/http"
	. "../../utils"
	. "../../connect"
	"encoding/json"
	. "../../configfromxml/configcreator"
	"github.com/satori/go.uuid"
	"path/filepath"
	"time"
	"strconv"
	"fmt"
)

func AddIncoming(rw http.ResponseWriter, req *http.Request) {
	res := make(map[string]interface{})
	var err error

	newCertificateName, err := uploadCertificate(rw, req)
	if err != nil {
		return
	}
	newPassportName, err := uploadPassport(rw, req)
	if err != nil {
		return
	}

	nomenclature := req.FormValue("nomenclature")
	supplier := req.FormValue("supplier")
	unitsCount := req.FormValue("unitsCount")

	unitCost, err := strconv.ParseInt(req.FormValue("unitCost"), 10, 64)
	if err != nil {
		res["ErrorUnitCost"] = "Некорректная стомость"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		WriteToLog(err.Error())
		return
	}

	incomingDate, err := time.Parse("02.01.2006", req.FormValue("incomingDate"))
	if err != nil {
		res["ErrorIncomingDate"] = "Некорректный формат даты"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		WriteToLog(err.Error())
		return
	}

	incomingTime := req.FormValue("incomingTime")

	contractIncomingDate, err := time.Parse("02.01.2006", req.FormValue("contractIncomingDate"))
	if err != nil {
		res["ErrorContractIncomingDate"] = "Некорректный формат даты"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		WriteToLog(err.Error())
		return
	}

	idSupplier := GetIdSupplierByINN(supplier)

	query := `
	INSERT INTO "Incoming"("Units_Count", "Unit_Cost", "Actual_Arrival_Date",
	"Incoming_Time", "Contract_Arrival_Date", "ID_Nomenclature", "Supplier")
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	RETURNING "ID"`

	var lastIncomingId int64 = 0

	err = DB.QueryRow(query, unitsCount, unitCost, incomingDate, incomingTime,
		contractIncomingDate, nomenclature, idSupplier).Scan(&lastIncomingId)
	if err != nil {
		res["ErrorAdd"] = "Невозможно добавить значение"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		WriteToLog(err.Error())
		return
	}

	query = `
	INSERT INTO "Quality_Control"("Certificate", "Passport", "ID_Incoming")
	VALUES ($1, $2, $3)`

	_, err = DB.Exec(query, newCertificateName, newPassportName, lastIncomingId)
	if err != nil {
		res["ErrorAdd"] = "Невозможно добавить значение"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		WriteToLog(err.Error())
		return
	}

	jsonRes, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, jsonRes)
}

func uploadCertificate(rw http.ResponseWriter, req *http.Request) (string, error) {
	res := make(map[string]interface{})
	file, handler, err := req.FormFile("certificate")
	fmt.Println(err)
	if err != nil {
		res["ErrorCertificate"] = "Ошибка загрузки файла сертификата"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return "", err
	}

	uid, _ := uuid.NewV4()
	newName := uid.String() + filepath.Ext(handler.Filename)
	err = MoveFileTo(file, Config.Server.RootDir + "\\" + Config.Upload.UploadCertificateDir, newName)
	if err != nil {
		res["ErrorCertificate"] = "Ошибка загрузки файла сертификата"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return "", err
	}

	return newName, nil
}

func uploadPassport(rw http.ResponseWriter, req *http.Request) (string, error) {
	res := make(map[string]interface{})
	file, handler, err := req.FormFile("passport")
	if err != nil {
		res["ErrorPassport"] = "Ошибка загрузки файла паспорта"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return "", err
	}

	uid, _ := uuid.NewV4()
	newName := uid.String() + filepath.Ext(handler.Filename)
	err = MoveFileTo(file, Config.Server.RootDir + "\\" +Config.Upload.UploadPassportDir, newName)
	if err != nil {
		res["ErrorPassport"] = "Ошибка загрузки файла паспорта"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return "", err
	}

	return newName, nil
}
