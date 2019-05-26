
#!/bin/sh
 
firstplist='<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>com.alibaba.security.AliEntSafe</string>
        <key>ProgramArguments</key>
        <array>
                <string>/Applications/AliEntSafe.app/Contents/MacOS/AliEntSafe</string>
        </array>
        <key>RunAtLoad</key>
        <false/>
        <key>KeepAlive</key>
        <false/>
</dict>
</plist>'
 
secondplist='<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.alibaba.security.AliESD</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Applications/AliEntSafe.app/Contents/Services/AliESD</string>
    </array>
    <key>RunAtLoad</key>
    <false/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>'
 
echo "$firstplist" > ./tmp.txt
sudo sh -c ' cat ./tmp.txt > /Library/LaunchAgents/com.alibaba.security.AliEntSafe.plist'
echo "$secondplist" > ./tmp.txt
sudo sh -c ' cat ./tmp.txt > /Library/LaunchDaemons/com.alibaba.security.AliESD.plist'
rm ./tmp.txt
 
 
function findProcess() {
    echo "正在停止阿里安全服务...$1"
    pinfo=$(pgrep -l $1)
    echo "发现如下进程:"
    echo "$pinfo"
    pinfo=$(pgrep $1)
    arr=${pinfo//\n/}
 
    for each in ${arr[*]}
    do 
        sudo kill -9 $each >/dev/null 2>&1
    done
    echo "已关闭相关进程!\n完成!"
}
 
name=$1
if [ "$name" = "stop" ]
then
    sudo chmod 000 /usr/local/bin/alipro
    sudo chmod -x /Applications/AliEntSafe.app/Contents/Services/AliESD
	findProcess "Ali"
    findProcess "ali"
    ps -eo pid,ppid,comm | grep ali
    ps -eo pid,ppid,comm | grep Ali
    ps -ef | grep "Ali"
elif [ "$name" = "start" ]
then
	echo "正在开启阿里安全服务..."
    sudo chmod 777 /usr/local/bin/alipro
    /usr/local/bin/alipro &
    sudo chmod +x /Applications/AliEntSafe.app/Contents/Services/AliESD
	sudo nohup /Applications/Alilang.app/Contents/MacOS/AliLang &
	/Applications/AliEntSafe.app/Contents/MacOS/AliEntSafe &
	sudo nohup  /Applications/AliEntSafe.app/Contents/Services/AliESD &
	sleep 1.5s
	echo "完成!"
else 
	echo "通过命令行执行alisafe stop或alisafe start来关闭或打开阿里的安全监控"
fi
