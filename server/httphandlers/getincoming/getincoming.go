package getincoming

import (
	"net/http"
	"encoding/json"
	. "../../utils"
	. "../../connect"
	. "../../configfromxml/configcreator"
	"time"
)

func GetIncoming(rw http.ResponseWriter, req *http.Request) {
	query := `
	SELECT "Nomenclature"."Name", "Suppliers"."Name", "Units_Count", "Unit_Cost",
	"Actual_Arrival_Date", "Incoming_Time", "Contract_Arrival_Date", "Passport", "Certificate"
	FROM "Incoming"
	LEFT JOIN "Nomenclature" ON "Incoming"."ID_Nomenclature" = "Nomenclature"."ID"
	LEFT JOIN "Suppliers" ON "Incoming"."Supplier" = "Suppliers"."ID"
	LEFT JOIN "Quality_Control" ON "Incoming"."ID" = "Quality_Control"."ID_Incoming"`

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

	rows, err := DB.Query(query)
	if err != nil {
		res, _ := json.Marshal([]Nomenclature{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}
	defer rows.Close()

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

	res, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, res)
}
