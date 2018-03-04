package loggercreator

import (
	"github.com/chasex/glog"
	"os"
	. "../loggermanager"
)

var Logger *glog.Logger

func GetLogger(logDir, logName string, perm os.FileMode) (*glog.LogOptions, error) {
	var logOptions *glog.LogOptions
	var err error
	Logger, logOptions, err = CreateNewLogger(logDir, logName, perm, glog.LstdFlags|glog.Llongfile, glog.Ldebug, glog.R_None)
	if err != nil {
		return logOptions, err
	}

	return logOptions, nil
}