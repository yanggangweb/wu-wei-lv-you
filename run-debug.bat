::???????
set $root=%cd%
set $cordovaRoot=%$root%\cordova-android-allen

echo %$cordovaRoot%
echo %$root%


::webpack????
call npm run pub

::cordova build apk
cd %$cordovaRoot%


echo cordova build android>temp.bat
call temp.bat
del temp.bat


cd %$cordovaRoot%
start platforms\android\build\outputs\apk

adb uninstall com.trgis.qyly1
adb install platforms\android\build\outputs\apk\android-armv7-debug.apk
::call npm run i-apk
cd %$root%


