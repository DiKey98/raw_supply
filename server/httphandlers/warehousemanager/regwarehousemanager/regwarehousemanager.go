package regWarehouseManager

import (
	"net/http"
	"fmt"
	. "../../../connect"
	. "../../../utils"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
)

func RegWarehouseManager(rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("login")
	password := req.FormValue("password")
	fio := req.FormValue("fio")
	role := req.FormValue("role")

	WriteToLog(fmt.Sprintf("Запрос на регистрацию %s от пользователя %s с логином %s", role, fio, login))

	if IsContains(DB, "Unverified_Users", login) ||
		IsContains(DB, "Users", login) {
		res, _ := json.Marshal(map[string]interface{}{"OK": false, "ErrorInfo": "Указанный логин уже существует"})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		WriteToLog(err.Error())
		fmt.Println(err)
	}

	query := `
	INSERT INTO "Unverified_Users"("FIO", "Login", "Password", "Role")
	VALUES ($1, $2, $3, $4)`

	_, err = DB.Exec(query, fio, login, string(hash), role)
	if err != nil {
		WriteToLog(err.Error())
	}

	res, _ := json.Marshal(map[string]interface{}{"OK": true, "ErrorInfo": ""})
	Response(rw, req, nil, http.StatusOK, res)
}