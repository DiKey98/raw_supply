package getnomenclature

import (
	"net/http"
	"encoding/json"
	. "../../utils"
	. "../../connect"
)

func GetNomenclature(rw http.ResponseWriter, req *http.Request) {
	query := `
	SELECT "ID", "Name", "Units"
	FROM "Nomenclature"`

	result := make([]Nomenclature, 0)

	rows, err := DB.Query(query)
	if err != nil {
		res, _ := json.Marshal([]Nomenclature{})
		Response(rw, req, nil, http.StatusOK, res)
		return
	}
	defer rows.Close()

	for rows.Next() {
		nomenclature := Nomenclature{0, "", ""}
		err = rows.Scan(&nomenclature.ID, &nomenclature.Name, &nomenclature.Units)
		if err != nil {
			res, _ := json.Marshal([]UnverifiedUser{})
			Response(rw, req, nil, http.StatusOK, res)
			return
		}
		result = append(result, nomenclature)
	}

	res, _ := json.Marshal(result)
	Response(rw, req, nil, http.StatusOK, res)
}