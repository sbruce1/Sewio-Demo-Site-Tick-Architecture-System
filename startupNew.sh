#!/bin/bash
source config.profile

echo $BASE_CLONE_DIRECTORY
echo "Starting Dashboards"
cd $BASE_CLONE_DIRECTORY
cd dash
q sample/demo.q -u 1 &
q dash.q -p 10001 -u 1 &
echo "Starting Tickerplant" &
cd $BASE_CLONE_DIRECTORY
cd Test/kdb-tick
q tick.q sym $ON_DISK_HDB -p 5000 &
echo "Starting HDB"
cd $BASE_CLONE_DIRECTORY
cd Test/kdb-tick/HDB
q hdb.q $ON_DISK_HDB -p 5002 &
echo "Starting RTS"
cd $BASE_CLONE_DIRECTORY
cd Test/kdb-tick/tick
q RealTimeTradeWithAsofQuotes.q -tp localhost:5000 -syms MSFT.O IBM.N GS.N -p 5001 &
echo "Starting RDB"
q r.q localhost:5000 localhost:5002 -p 5005 &
