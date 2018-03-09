package utils

import (
	"net/http"
	"encoding/json"
	"database/sql"
	"fmt"
	. "../logger/loggercreator"
	. "../connect"
)

type User struct {
	ID       int
	Login    string
	Password string
	IsAdmin  bool
}

func Response(rw http.ResponseWriter, req *http.Request, err error, status int, res []byte) {
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

func IsContains(DB *sql.DB, table string, login string) (bool) {
	query := fmt.Sprintf(`SELECT "ID" FROM "%s" WHERE "Login" = $1`, table)
	rows, err := DB.Query(query, login)
	defer rows.Close()
	if err != nil {
		return false
	}
	return rows.Next()
}

func WriteToLog(str string) {
	Logger.Infof("%s \r\n", str)
	Logger.Flush()
}

func GetUserByLogin(login string, table string) (*User) {
	query := fmt.Sprintf(`SELECT "ID", "Login", "Password", "Is_Admin" FROM "%s" WHERE "Login" = $1`, table)
	rows, err := DB.Query(query, login)
	if err != nil {
		return &User{0, "", "", false}
	}
	defer rows.Close()

	user := User{0, "", "", false}
	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Login, &user.Password, &user.IsAdmin)
		if err != nil {
			return &User{0, "", "", false}
		}
	}
	return &user
}