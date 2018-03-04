package loggermanager

import (
	"os"
	"strings"
	"github.com/chasex/glog"
	"archive/zip"
	"time"
	"io"
	"io/ioutil"
	"fmt"
	"strconv"
)

var  bytesPerKB float64 = 1024
var  kbytesPerMB float64 = 1024

func CreateNewLogger(dir string, logName string, perm os.FileMode, flag int,
	level glog.Level, mode glog.RotateMode) (*glog.Logger, *glog.LogOptions, error) {
	logDir := dir

	err := os.MkdirAll(logDir, perm)
	if err != nil {
		fmt.Println(err)
		return nil, nil, err
	}

	options := &glog.LogOptions{
		File:  logDir + "\\" + logName,
		Flag:  flag,
		Level: level,
		Mode:  mode,
	}

	logger, err := glog.New(*options)
	if err != nil {
		return nil, options, err
	}

	return logger, options, nil
}

func isRotated(logFilePath string, maxSize float64) (bool, error) {
	fileInfo, err := os.Stat(logFilePath)
	if err != nil {
		return false, err
	}

	if float64(fileInfo.Size()) <= maxSize * kbytesPerMB * bytesPerKB {
		return false, err
	}

	return true, nil
}

func timeToStr(time time.Time, separator string, dateTimeSeparator string) (string) {
	return fmt.Sprintf("%s%s%s%s%s%s%s%s%s%s%s", strconv.Itoa(time.Year()), separator,
		time.Month().String(), separator, strconv.Itoa(time.Day()), dateTimeSeparator,
			strconv.Itoa(time.Hour()), separator, strconv.Itoa(time.Minute()), separator,
				strconv.Itoa(time.Hour()))
}

func getZipName(logFilePath string) (string) {
	zipDate := timeToStr(time.Now(), "-", "_")
	return logFilePath[0:strings.LastIndex(logFilePath, ".")] + zipDate + ".zip"
}

func isZip(fileName string) (bool) {
	readerCloser, err := zip.OpenReader(fileName)
	if err != nil {
		return false
	}
	readerCloser.Close()
	return true
}

func isOld(modeTime time.Time, maxDuration time.Duration) (bool) {
	if time.Since(modeTime).Hours() > maxDuration.Hours(){
		return true
	}
	return false
}

func moveToZip(logFilePath string, maxSize float64) (error) {
	isRotated, err := isRotated(logFilePath, maxSize)
	if err != nil {
		return err
	}

	if !isRotated {
		return nil
	}

	zipName := getZipName(logFilePath)

	zipFile, err := os.Create(zipName)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	archive := zip.NewWriter(zipFile)
	defer archive.Close()

	info, err := os.Stat(logFilePath)
	if err != nil {
		return err
	}

	header, err := zip.FileInfoHeader(info)
	if err != nil {
		return err
	}
	header.Method = zip.Deflate

	writer, err := archive.CreateHeader(header)
	if err != nil {
		return err
	}

	file, err := os.Open(logFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(writer, file)
	if err != nil {
		return err
	}
	file.Close()

	err = os.Truncate(logFilePath, 0)
	if err != nil {
		return err
	}

	return err
}

func removeOldZip (duration time.Duration, dir string) (error)  {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, file := range files {
		if isOld(file.ModTime(), duration) && isZip(dir + file.Name()) {
			err = os.Remove(dir + file.Name())
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func Rotation(logOptions *glog.LogOptions, maxLogSizeMegaBytes float64, maxLogDuration time.Duration) (error) {
	err := moveToZip(logOptions.File, maxLogSizeMegaBytes)
	if err != nil {
		return err
	}

	err = removeOldZip(maxLogDuration, logOptions.File[0:strings.LastIndex(logOptions.File, "\\")+1])
	if err != nil {
		return err
	}

	return nil
}