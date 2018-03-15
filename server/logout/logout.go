package logout

import (
	"net/http"
	"github.com/gorilla/sessions"
	"fmt"
	. "../connect"
	. "../utils"
	"encoding/json"
)

var store = sessions.NewCookieStore([]byte("sessions"))

func Logout(rw http.ResponseWriter, req *http.Request) {
	sessionName := req.FormValue("sessionName")
	role := req.FormValue("role")

	session, err := store.Get(req, sessionName)
	if err != nil {
		return
	}

	authenticated := fmt.Sprintf("authenticated_for_%s", role)
	if session.Values[authenticated] == nil {
		return
	}

	idSession := session.Values[fmt.Sprintf("id_session_for_%s", role)].(string)

	query := `
	DELETE
	FROM "Authorization"
	WHERE "ID_Session" = $1`

	_,err = DB.Exec(query, idSession)
	if err != nil {
		WriteToLog(err.Error())
	}

	session.Options.MaxAge = 0
	session.Save(req, rw)

	jsonRes, _ := json.Marshal(map[string]interface{} {"OK" : true})
	Response(rw, req, nil, http.StatusOK, jsonRes)
}