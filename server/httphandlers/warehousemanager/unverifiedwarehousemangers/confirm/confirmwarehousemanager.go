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

	idRole := GetIdRoleByName(user.Role)

	query = `
	INSERT INTO "Users"( "FIO", "Login", "Password", "Is_Admin", "Role")
	VALUES($1, $2, $3, $4, $5)`

	_, err = DB.Exec(query, user.FIO, user.Login, user.Password, false, idRole)
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