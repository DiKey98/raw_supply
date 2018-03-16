package deletewarehousemanager

import (
	"net/http"
	. "../../../../connect"
	. "../../../../utils"
)

func DeleteUnverifiedWarehouseManager(rw http.ResponseWriter, req *http.Request) {
	id := req.FormValue("id")

	query := `
	DELETE
	FROM "Unverified_Users"
	WHERE "ID" = $1`

	_, err := DB.Exec(query, id)
	if err != nil {
		WriteToLog(err.Error())
	}
}