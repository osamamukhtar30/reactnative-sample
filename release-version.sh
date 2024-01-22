if [[ ! -n $1 ]]; then
	#statements
	echo BUILD NUMBER NOT SUPPLIED;
	exit;
fi

if [[ ! -n $2 ]]; then
	#statements
	echo VERSION NOT SUPPLIED;
	exit;
fi

echo BUILD NUMBER: $1;
echo VERSION: $2;

# Android
sed -E "s/versionCode ([0-9])+/versionCode $1/" ./android/app/build.gradle > ./android/app/build.gradle.temp;
mv ./android/app/build.gradle.temp ./android/app/build.gradle
sed "s/\(versionName .[[:digit:]]*.[[:digit:]]*.\)/versionName \"$2\"/" ./android/app/build.gradle > ./android/app/build.gradle.temp;
mv ./android/app/build.gradle.temp ./android/app/build.gradle

# iOS
sed "s/CURRENT_PROJECT_VERSION.*/CURRENT_PROJECT_VERSION = $1;/" ./ios/duelme.xcodeproj/project.pbxproj > ./ios/duelme.xcodeproj/project.pbxproj.temp;
mv ./ios/duelme.xcodeproj/project.pbxproj.temp ./ios/duelme.xcodeproj/project.pbxproj
sed "s/MARKETING_VERSION.*/MARKETING_VERSION = $2;/" ./ios/duelme.xcodeproj/project.pbxproj > ./ios/duelme.xcodeproj/project.pbxproj.temp;
mv ./ios/duelme.xcodeproj/project.pbxproj.temp ./ios/duelme.xcodeproj/project.pbxproj

# Package

echo "$(jq ".version = \"0.$2\""  package.json)" > package.json
