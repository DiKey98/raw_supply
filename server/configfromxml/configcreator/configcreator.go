package configcreator

import (
	. "../configstructures"
	"os"
	"encoding/xml"
)

var Config *Configuration

func GetConfigFromFile(fileName string) (*Configuration, error) {
	cfgFile, err := open(fileName)
	defer cfgFile.Close()

	if err != nil {
		return nil, err
	}

	return parse(cfgFile)
}

func open(xmlFilePath string) (*os.File, error) {
	xmlFile, err := os.Open(xmlFilePath)
	if err != nil {
		return nil, err
	}
	return xmlFile, nil
}

func parse(xmlFile *os.File) (*Configuration, error) {
	var config *Configuration
	decoder := xml.NewDecoder(xmlFile)
	err := decoder.Decode(&config)
	if err != nil {
		return config, err
	}
	return config, nil
}