package otherorganizationslogin

import (
	"net/http"
	"github.com/gorilla/sessions"
	"github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
	"encoding/json"
	"fmt"
	. "../utils"
	. "../connect"
)

var store = sessions.NewCookieStore([]byte("sessions"))

func Login (rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("login")
	password := req.FormValue("password")
	role := req.FormValue("role")
	inn := req.FormValue("inn")
	sessionName := req.FormValue("sessionName")

	session, err := store.Get(req, sessionName)
	if err != nil {
		WriteToLog(err.Error())
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	authenticated := fmt.Sprintf("authenticated_for_%s", role)
	if session.Values[authenticated] != nil {
		if session.Values[authenticated].(bool) {
			return
		}
	}

	user := GetUserByLogin(login, "Users")
	roleId := GetIdRoleByName(role)
	supplierId := GetIdSupplierByINN(inn)

	res := make(map[string]interface{}, 0)
	res["ErrorLogin"] = ""
	res["ErrorPassword"] = ""
	res["ErrorRole"] = ""
	res["ErrorSupplier"] = ""

	if user.Login == "" {
		res["ErrorLogin"] = "Неверный логин"
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	if user.Role != roleId {
		res["ErrorRole"] = fmt.Sprintf(`Указанный логин не относится к роли "%s"`, role)
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	if supplierId == 0 {
		res["ErrorSupplier"] = fmt.Sprintf(`Поставщика с ИНН %s не существует в системе`, inn)
		jsonRes, _ := json.Marshal(res)
		Response(rw, req, nil, http.StatusOK, jsonRes)
		return
	}

	if user.Organization.Int64 != supplierId {
		res["ErrorLogin"] = fmt.Sprintf(`Указанный логин не относится к данному поставщику`)
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

	session.Values[fmt.Sprintf("id_session_for_%s", role)] = idSession.String()
	session.Values[fmt.Sprintf("id_user_for_%s", role)] = user.ID
	session.Values[fmt.Sprintf("user_login_for_%s", role)] = user.Login
	session.Values[fmt.Sprintf("authenticated_for_%s", role)] = true
	session.Options.HttpOnly = false
	session.Save(req, rw)

	query := `
	INSERT INTO "Authorization"("ID_Session", "ID_User", "Role")
	VALUES($1, $2, $3)`

	_,err = DB.Exec(query, idSession.String(), user.ID, roleId)
	if err != nil {
		WriteToLog(err.Error())
		return
	}

	res[fmt.Sprintf("authenticated_for_%s", role)] = true
	jsonRes, _ := json.Marshal(res)
	Response(rw, req, nil, http.StatusOK, jsonRes)
}
