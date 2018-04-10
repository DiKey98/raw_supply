package updateincoming

import (
	"encoding/json"
	"net/http"
	. "../../utils"
	. "../../connect"
	"time"
	"strings"
)

func UpdateIncoming (rw http.ResponseWriter, req *http.Request) {
	res := make(map[string]interface{})

	nomenclature := req.FormValue("nomenclature")
	supplier := req.FormValue("supplier")
	unitsCount := req.FormValue("unitsCount")
	unitCost := strings.Split(req.FormValue("unitCost"), " ")[0]
	id := req.FormValue("id")

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

	idNomenclature := GetIdNomenclatureByName(nomenclature)

	query := `
	UPDATE "Incoming" SET
	"ID_Nomenclature" = $1,
	"Supplier" = $2,
	"Units_Count" = $3,
	"Unit_Cost" = $4,
	"Actual_Arrival_Date" = $5,
	"Incoming_Time" = $6,
	"Contract_Arrival_Date" = $7
	WHERE "ID" = $8
	`

	_, err = DB.Exec(query, idNomenclature, supplier, unitsCount, unitCost,
		incomingDate, incomingTime, contractIncomingDate, id)
	if err != nil {
		WriteToLog(err.Error())
		return
	}

	jsonRes, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, jsonRes)
}
