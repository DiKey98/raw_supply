/*package registration

import (
	"net/http"
	"fmt"
	"database/sql"
	. "../connect"
	"golang.org/x/crypto/bcrypt"
)

func Registration(rw http.ResponseWriter, req *http.Request) {
	login := req.FormValue("Login")
	password := req.FormValue("Password")

	if isContains(DB, login) {
		fmt.Println("Такой логин уже есть")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		fmt.Println(err)
	}

	query := `
	INSERT INTO "Users"("Login", "Password")
	VALUES ($1, $2)`

	_, err = DB.Exec(query, login, string(hash))
	if err != nil {
		fmt.Println(err.Error() + " registration")
	}
}

func isContains(DB *sql.DB, login string) (bool) {
	query := `
	SELECT "ID"
	FROM "Users"
	WHERE "Login" = $1`

	rows, err := DB.Query(query, login)
	defer rows.Close()
	if err != nil {
		return false
	}

	return rows.Next()
}*/