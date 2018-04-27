::???????
set $root=%cd%
set $cordovaRoot=%$root%\cordova-android-allen

echo %$cordovaRoot%
echo %$root%


rd /s/q %$cordovaRoot%\www\static
del /f/s/q %$cordovaRoot%\www\index.html



::webpack????
call npm run pub

::cordova build apk
cd %$cordovaRoot%


echo cordova build android --release>temp.bat
call temp.bat
del temp.bat

::??????????

xcopy %$root%\release.jks %$cordovaRoot%\platforms\android\build\outputs\apk\ /yf
cd %$cordovaRoot%\platforms\android\build\outputs\apk

jarsigner -digestalg SHA1 -sigalg SHA1withRSA -verbose -keystore release.jks -signedjar qyly.release.apk android-armv7-release-unsigned.apk fsl|echo "android"

cd %$cordovaRoot%
start platforms\android\build\outputs\apk

::call npm run i-apk
cd %$root%


