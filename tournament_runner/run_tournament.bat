@echo off

set FILEPATHS=

cd ../Centarians
for /D %%f in (*) do (
	cd %%f
	for %%g in (*.gb) do (
		call set "FILEPATHS=%%FILEPATHS%% ../Centarians/%%f/%%g"
	)
	cd ..
)


cd ../tournament_runner

@echo on


GrobotsHeadless.exe -t200 -l18000 -H -b2000 %FILEPATHS% > output.txt

node post-results.js