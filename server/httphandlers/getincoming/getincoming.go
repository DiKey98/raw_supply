package getincoming

import (
	"net/http"
	"encoding/json"
	. "../../utils"
	. "../../connect"
	. "../../configfromxml/configcreator"
	"time"
	"strconv"
	"database/sql"
	"github.com/jinzhu/now"
)

func GetIncoming(rw http.ResponseWriter, req *http.Request) {
	var err error

	forToday, err := strconv.ParseBool(req.FormValue("forToday"))
	if err != nil {
		res, _ := json.Marshal([]Incoming{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	forCurrentMonth, err := strconv.ParseBool(req.FormValue("forCurrentMonth"))
	if err != nil {
		res, _ := json.Marshal([]Incoming{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	isPeriod, err := strconv.ParseBool(req.FormValue("isPeriod"))
	if err != nil {
		res, _ := json.Marshal([]Incoming{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	start, err := time.Parse("02.01.2006", req.FormValue("start"))
	end, err := time.Parse("02.01.2006", req.FormValue("end"))

	baseQuery := `
	SELECT "Nomenclature"."Name", "Suppliers"."Name", "Units_Count", "Unit_Cost",
	"Actual_Arrival_Date", "Incoming_Time", "Contract_Arrival_Date", "Passport", "Certificate"
	FROM "Incoming"
	LEFT JOIN "Nomenclature" ON "Incoming"."ID_Nomenclature" = "Nomenclature"."ID"
	LEFT JOIN "Suppliers" ON "Incoming"."Supplier" = "Suppliers"."ID"
	LEFT JOIN "Quality_Control" ON "Incoming"."ID" = "Quality_Control"."ID_Incoming"`

	var rows *sql.Rows

	if forToday {
		baseQuery += ` WHERE "Actual_Arrival_Date" = $1`
		todayStr := time.Now().Local().Format("02.01.2006")
		today, _ := time.Parse("02.01.2006", todayStr)
		rows, err = DB.Query(baseQuery, today)
		if err != nil {
			res, _ := json.Marshal([]Incoming{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		defer rows.Close()
	}

	if forCurrentMonth {
		baseQuery += ` WHERE "Actual_Arrival_Date" BETWEEN $1 AND $2`
		monthBeginningStr := now.BeginningOfMonth().Format("02.01.2006")
		monthBeginning, _ := time.Parse("02.01.2006", monthBeginningStr)
		monthEndStr := now.EndOfMonth().Format("02.01.2006")
		monthEnd, _ := time.Parse("02.01.2006", monthEndStr)
		rows, err = DB.Query(baseQuery, monthBeginning, monthEnd)
		if err != nil {
			res, _ := json.Marshal([]Incoming{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		defer rows.Close()
	}

	if isPeriod {
		baseQuery += ` WHERE "Actual_Arrival_Date" BETWEEN $1 AND $2`
		rows, err = DB.Query(baseQuery, start, end)
		if err != nil {
			res, _ := json.Marshal([]Incoming{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		defer rows.Close()
	}

	type ReturnIncoming struct {
		Nomenclature string
		Supplier string
		UnitsCount int
		UnitCost int
		IncomingDate string
		IncomingTime string
		ContractIncomingDate string
		Passport string
		Certificate string
	}

	result := make([]ReturnIncoming, 0)

	for rows.Next() {
		incoming := Incoming{"", "", 0, 0,
			time.Time{}, time.Time{}, time.Time{},
			"", ""}

		err = rows.Scan(&incoming.Nomenclature, &incoming.Supplier, &incoming.UnitsCount,
			&incoming.UnitCost, &incoming.IncomingDate, &incoming.IncomingTime,
			&incoming.ContractIncomingDate, &incoming.Passport, &incoming.Certificate)
		if err != nil {
			res, _ := json.Marshal([]UnverifiedUser{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		returnIncoming := ReturnIncoming{
			incoming.Nomenclature,
			incoming.Supplier,
			incoming.UnitsCount,
			incoming.UnitCost,
			incoming.IncomingDate.Format("02.01.2006"),
			incoming.IncomingTime.Format("15:04:05"),
			incoming.ContractIncomingDate.Format("02.01.2006"),
			 Config.Upload.UploadPassportDir + "\\" + incoming.Passport,
			Config.Upload.UploadCertificateDir + "\\" + incoming.Certificate}
		result = append(result, returnIncoming)
	}

	jsonRes, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, jsonRes)
}
