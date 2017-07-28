echo "pls work"
./GrobotsHeadless.exe -t2 -l18000 -H -b2000 ../Centarians/*/*.gb > output.txt

echo output.txt
echo "node?"

node post-results.js
