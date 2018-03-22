package addsupplier

import (
	"net/http"
	. "../../utils"
	. "../../connect"
	"encoding/json"
	"fmt"
)

func AddSupplier (rw http.ResponseWriter, req *http.Request) {
	org := req.FormValue("org")
	phone := req.FormValue("phone")
	legalAddress := req.FormValue("legalAddress")
	mailingAddress := req.FormValue("mailingAddress")
	inn := req.FormValue("inn")
	bankDetails := req.FormValue("bankDetails")
	generalManager := req.FormValue("generalManager")
	generalAccountant := req.FormValue("generalAccountant")

	if IsConsistsINN(inn) {
		res, _ := json.Marshal(map[string]interface{}{"OK": false, "ErrorInfo": "Указанный ИНН уже существует"})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	query := `
	INSERT INTO "Suppliers"("Name", "Phone", "Legal_Address", "Mailing_Address",
	"INN", "Bank_Details", "General_Manager", "General_Accountant")
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := DB.Exec(query, org, phone, legalAddress, mailingAddress,
		inn, bankDetails, generalManager, generalAccountant)
	if err != nil {
		fmt.Println(err)
		WriteToLog(err.Error())
		return
	}

	res, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, res)
}