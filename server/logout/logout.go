package logout

import (
	"net/http"
	"github.com/gorilla/sessions"
	"fmt"
	. "../connect"
	. "../utils"
)

var store = sessions.NewCookieStore([]byte("sessions"))

func Logout(rw http.ResponseWriter, req *http.Request) {
	sessionName := req.FormValue("sessionName")
	session, err := store.Get(req, sessionName)
	if err != nil {
		fmt.Println(err)
		return
	}

	if session.Values["id_session"] == nil {
		return
	}

	idSession := session.Values["id_session"].(string)

	query := `
	DELETE
	FROM "Authorization"
	WHERE "ID_Session" = $1`

	_,err = DB.Exec(query, idSession)
	if err != nil {
		WriteToLog(err.Error())
		fmt.Println(err)
	}

	session.Options.MaxAge = 0
	session.Save(req, rw)
}