package confirmwarehousemanager

import (
	"net/http"
	. "../../../../connect"
	. "../../../../utils"
)

func ConfirmWarehouseManager(rw http.ResponseWriter, req *http.Request) {
	id := req.FormValue("id")

	query := `
	SELECT "FIO", "Login", "Password"
	FROM "Unverified_Users"
	WHERE "ID" = $1`

	rows, err := DB.Query(query, id)
	if err != nil {
		WriteToLog(err.Error())
		return
	}
	defer rows.Close()

	user := UnverifiedUser{0, "", "", "", ""}
	for rows.Next() {
		err = rows.Scan(&user.FIO, &user.Login, &user.Password)
		if err != nil {
			WriteToLog(err.Error())
			return
		}
	}

	query = `
	INSERT INTO "Users"( "FIO", "Login", "Password", "Is_Admin")
	VALUES($1, $2, $3, $4)`

	_, err = DB.Exec(query, user.FIO, user.Login, user.Password, false)
	if err != nil {
		WriteToLog(err.Error())
	}

	query = `
	DELETE
	FROM "Unverified_Users"
	WHERE "ID" = $1`

	_, err = DB.Exec(query, id)
	if err != nil {
		WriteToLog(err.Error())
	}
}