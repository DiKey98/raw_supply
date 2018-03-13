package loginwarehousemanager

import (
	"net/http"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"github.com/satori/go.uuid"
	"github.com/gorilla/sessions"
	. "../../../utils"
	. "../../../connect"
	"fmt"
)

var store = sessions.NewCookieStore([]byte("sessions"))

func LoginWarehouseManager (rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("login")
	password := req.FormValue("password")
	role := req.FormValue("role")

	session, err := store.Get(req, "warehouseManagerInfo")
	if err != nil {
		WriteToLog(err.Error())
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	if session.Values["warehouseManagerAuthenticated"] != nil {
		if session.Values["warehouseManagerAuthenticated"].(bool) {
			return
		}
	}

	user := GetUserByLogin(login, "Users")
	roleId := GetIdRoleByName(role)

	res := make(map[string]interface{}, 0)
	res["ErrorLogin"] = ""
	res["ErrorPassword"] = ""
	res["ErrorRole"] = ""

	if user.Role != roleId {
		res["ErrorRole"] = fmt.Sprintf(`Указанный логин не относится к роли "%s"`, role)
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	if user.Login == "" {
		res["ErrorLogin"] = "Неверный логин"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		res["ErrorPassword"] = "Неверный пароль"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	var idSession uuid.UUID
	idSession, err = uuid.NewV4()
	if err != nil {
		WriteToLog(err.Error())
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	session.Values["id_session"] = idSession.String()
	session.Values["id_user"] = user.ID
	session.Values["user_login"] = user.Login
	session.Values["authenticated"] = true
	session.Options.HttpOnly = false
	session.Save(req, rw)

	query := `
	INSERT INTO "Authorization"("ID_Session", "ID_User", "Role")
	VALUES($1, $2, $3)`

	_,err = DB.Exec(query, idSession.String(), user.ID, 2)
	if err != nil {
		WriteToLog(err.Error())
		return
	}

	res["authenticated"] = true
	jsonRes, _ := json.Marshal(res)
	Response(rw, req, nil, http.StatusOK, jsonRes)
}