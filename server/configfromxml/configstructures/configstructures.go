package configstructures

import (
	"encoding/xml"
	"strconv"
	"time"
)

type Configuration struct {
	//корневой элемент файла конфигурации
	XMLName xml.Name `xml:"configuration"`
	DBConnect DBConnect
	Server  Server
}

type DBConnect struct {
	//подключение к БД
	XMLName  xml.Name `xml:"dbconnect"`
	ConnectionString string `xml:"constr"`
}

type Server struct {
	//параметры сервера
	XMLName        xml.Name `xml:"server"`
	MaxLogSizeMB    Float64      `xml:"maxLogSizeMB"`
	MaxLogDuration Duration `xml:"maxLogDuration"`
	LogDir         string   `xml:"logdir"`
	LogName         string   `xml:"logname"`
	RotationPeriod Duration `xml:"rotationPeriod"`
}

var yesNo = map[string]bool{
	"yes": true,
	"no":  false,
	"да":  true,
	"нет": false,
}

type Bool struct {
	Value bool
}

type Duration struct {
	time.Duration
}

type Float64 struct {
	Value float64
}

func (duration *Duration) UnmarshalXML(decoder *xml.Decoder, start xml.StartElement) (error) {
	var strDuration string
	err := decoder.DecodeElement(&strDuration, &start)
	if err != nil {
		return err
	}

	parse, err := time.ParseDuration(strDuration)
	if err != nil {
		return err
	}

	duration.Duration = parse

	return nil
}

func (b *Bool) UnmarshalXML(decoder *xml.Decoder, start xml.StartElement) (error) {
	var strBoolFlag string
	err := decoder.DecodeElement(&strBoolFlag, &start)
	if err != nil {
		return err
	}

	b.Value = yesNo[strBoolFlag]

	return nil
}

func (integer *Float64) UnmarshalXML(decoder *xml.Decoder, start xml.StartElement) (error) {
	var strFloat string
	err := decoder.DecodeElement(&strFloat, &start)

	parse, err := strconv.ParseFloat(strFloat, 64);
	if err != nil {
		return err
	}

	integer.Value = parse

	return nil
}