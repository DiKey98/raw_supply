package loginadmin

import (
	"net/http"
	"golang.org/x/crypto/bcrypt"
	. "../../../utils"
	"encoding/json"
	"github.com/gorilla/sessions"
	"github.com/satori/go.uuid"
	. "../../../connect"
)

var store = sessions.NewCookieStore([]byte("adminSessions"))

func LoginAdmin(rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("login")
	password := req.FormValue("password")

	session, err := store.Get(req, "adminInfo")
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	if session.Values["adminAuthenticated"] != nil {
		if session.Values["adminAuthenticated"].(bool) {
			return
		}
	}

	user := GetUserByLogin(login, "Users")

	res := make(map[string]interface{}, 0)
	res["ErrorLogin"] = ""
	res["ErrorPassword"] = ""

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
	session.Values["adminAuthenticated"] = true
	session.Options.HttpOnly = false
	session.Save(req, rw)

	query := `
	INSERT INTO "Authorization"("ID_Session", "ID_User", "Role")
	VALUES($1, $2, $3)`

	_,err = DB.Exec(query, idSession.String(), user.ID, 1)
	if err != nil {
		WriteToLog(err.Error())
	}

	res["adminAuthenticated"] = true
	jsonRes, _ := json.Marshal(res)
	Response(rw, req, nil, http.StatusOK, jsonRes)
}