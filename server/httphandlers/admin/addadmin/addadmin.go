package addadmin

import (
	"net/http"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	. "../../../utils"
	. "../../../connect"
)

func AddAdmin(rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("login")
	password := req.FormValue("password")
	role := req.FormValue("role")

	roleId := GetIdRoleByName(role)

	if IsContains(DB, "Users", login) {
		res, _ := json.Marshal(map[string]interface{}{"OK": false, "ErrorInfo": "Указанный логин уже существует"})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		WriteToLog(err.Error())
		return
	}

	query := `
	INSERT INTO "Users"("FIO", "Login", "Password", "Role", "Is_Admin")
	VALUES ($1, $2, $3, $4, $5)`

	_, err = DB.Exec(query, "Admin", login, string(hash), roleId, true)
	if err != nil {
		WriteToLog(err.Error())
		return
	}

	res, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, res)
}