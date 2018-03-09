package getunverifiedusers

import (
	"net/http"
	. "../../connect"
	. "../../utils"
	"encoding/json"
	"fmt"
)

type UnverifiedUser struct {
	ID       int
	Login    string
	FIO string
	Role  string
}

func GetUnverifiedUsers(rw http.ResponseWriter, req *http.Request) {
	query := `
	SELECT "ID", "FIO", "Login", "Role"
	FROM "Unverified_Users"`

	result := make([]UnverifiedUser, 0)

	rows, err := DB.Query(query)
	if err != nil {
		fmt.Println(err)
		res, _ := json.Marshal([]UnverifiedUser{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}
	defer rows.Close()


	for rows.Next() {
		user := UnverifiedUser{0, "", "", ""}
		err = rows.Scan(&user.ID, &user.Login, &user.FIO, &user.Role)
		if err != nil {
			fmt.Println(err)
			res, _ := json.Marshal([]UnverifiedUser{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		result = append(result, user)
	}

	res, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, res)
}