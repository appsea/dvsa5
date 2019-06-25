cd C:/Data/Rakesh/Workspace/Projects/Nativescript/Dvsa
npm run lintfix
tns build android --env.snapshot --env.uglify --release --key-store-path C:/Data/Rakesh/Workspace/Release/Certificates/sasquiz.keystore --key-store-password 0e2c0157 --key-store-alias sasquiz --key-store-alias-password 0e2c0157 --copy-to dvsa.apk
cd C:/Data/Rakesh/Workspace/Projects/Nativescript/AdvanceSas
npm run lintfix
tns build android --env.snapshot --env.uglify --release --key-store-path C:/Data/Rakesh/Workspace/Release/Certificates/sasquiz.keystore --key-store-password 0e2c0157 --key-store-alias sasquiz --key-store-alias-password 0e2c0157 --copy-to advanceSas.apk
cd C:/Data/Rakesh/Workspace/Projects/Nativescript/BaseSas
npm run lintfix
tns build android --env.snapshot --env.uglify --release --key-store-path C:/Data/Rakesh/Workspace/Release/Certificates/sasquiz.keystore --key-store-password 0e2c0157 --key-store-alias sasquiz --key-store-alias-password 0e2c0157 --copy-to baseSas.apk
cd C:/Data/Rakesh/Workspace/Projects/Nativescript/CompTIAA+
npm run lintfix
tns build android --env.snapshot --env.uglify --release --key-store-path C:/Data/Rakesh/Workspace/Release/Certificates/sasquiz.keystore --key-store-password 0e2c0157 --key-store-alias sasquiz --key-store-alias-password 0e2c0157 --copy-to compTiaPlus.apk
