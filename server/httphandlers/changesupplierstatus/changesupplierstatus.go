package changesupplierstatus

import (
	"net/http"
	. "../../utils"
	. "../../connect"
	"encoding/json"
)

func ChangeSupplierStatus(rw http.ResponseWriter, req *http.Request) {
	supplier := req.FormValue("supplier")
	status := req.FormValue("status")

	supplierId := GetIdSupplierByINN(supplier)
	statusId := GetIdStatusByName(status)

	query := ""
	if IsExistsStatus(supplierId) {
		query = `
		UPDATE "Supplier_Status"
		SET "ID_Status" = $1
		WHERE "ID_Supplier" = $2`
	}else {
		query = `
		INSERT INTO "Supplier_Status" ("ID_Status", "ID_Supplier")
		VALUES($1, $2)`
	}

	_, err := DB.Exec(query, statusId, supplierId)
	if err != nil {
		res, _ := json.Marshal(map[string]interface{}{"OK": false, "ErrorInfo": "Невозможо изменить статус"})
		Response(rw, req, nil, http.StatusOK, res)
		WriteToLog(err.Error())
		return
	}

	res, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, res)
}
