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
	Role int
}

type UnverifiedUser struct {
	ID       int
	Login    string
	Password string
	FIO string
	Role  string
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
	query := fmt.Sprintf(`SELECT "ID", "Login", "Password", "Is_Admin", "Role" FROM "%s" WHERE "Login" = $1`, table)
	rows, err := DB.Query(query, login)
	if err != nil {
		return &User{0, "", "", false, 0}
	}
	defer rows.Close()

	user := User{0, "", "", false,0}
	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Login, &user.Password, &user.IsAdmin, &user.Role)
		if err != nil {
			return &User{0, "", "", false, 0}
		}
	}
	return &user
}

func GetIdRoleByName(roleName string) (int) {
	query := `
	SELECT "ID"
	FROM "Role"
	WHERE "Name" = $1`

	rows, err := DB.Query(query, roleName)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	defer rows.Close()

	result := 0
	for rows.Next() {
		err = rows.Scan(&result)
		if err != nil {
			fmt.Println(err)
			return 0
		}
	}
	return result
}