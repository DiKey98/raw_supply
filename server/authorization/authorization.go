package authorization

import (
	"net/http"
	"github.com/gorilla/sessions"
	. "../connect"
	"golang.org/x/crypto/bcrypt"
	"fmt"
	"github.com/satori/go.uuid"
	"encoding/json"
)

var store = sessions.NewCookieStore([]byte("trololo"))

func Login(rw http.ResponseWriter, req *http.Request) {
	session, err := store.Get(req, "userInfo")
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	if session.Values["authenticated"] != nil {
		if session.Values["authenticated"].(bool) {
			fmt.Println("Уже зареган")
			return
		}
	}

	login := req.FormValue("Login")
	password := req.FormValue("Password")

	user := getUserByLogin(login)
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		fmt.Println("Неверный пароль")
		res, _ := json.Marshal(map[string]interface{}{"Info": "Неверный пароль"})
		response(rw, req, nil, http.StatusOK, res)
		return
	}

	var idSession uuid.UUID
	idSession, err = uuid.NewV4()
	if err != nil {
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
	INSERT INTO "Authorization"("ID_Session", "ID_User", "Type")
	VALUES($1, $2, $3)`

	_,err = DB.Exec(query, idSession.String(), user.ID, "Бомж")
	if err != nil {
		fmt.Println(err)
	}
}

func Logout(rw http.ResponseWriter, req *http.Request) {
	session, err := store.Get(req, "userInfo")
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	query := `
	DELETE
	FROM "Authorization"
	WHERE "ID_Session" = $1`

	_, err = DB.Exec(query, session.Values["id_session"])
	if err != nil {
		http.Error(rw, err.Error(), http.StatusInternalServerError)
		return
	}

	session.Options.MaxAge = -1
	session.Save(req, rw)
}



func response(rw http.ResponseWriter, req *http.Request, err error, status int, res []byte) {
	if err != nil {
		data, _ := json.Marshal(map[string]interface{}{"OK": false, "Error": err.Error()})
		rw.WriteHeader(status)
		rw.Write(data)
		return
	}

	if res == nil && len(res) == 0 {
		http.NotFound(rw, req)
		return
	}

	rw.WriteHeader(status)
	rw.Write(res)
}