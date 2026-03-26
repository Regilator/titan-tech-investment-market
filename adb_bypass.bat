@echo off
echo TITAN TECH BYPASS TOOL
adb shell am start -n com.google.android.gsf.login/
adb shell am start -n com.google.android.gsf.login.LoginActivity
echo Bypass command sent. Check device.
pause
