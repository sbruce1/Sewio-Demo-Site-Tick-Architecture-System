#!/bin/bash

# Insert your own directory for ON_DISK_HDB and BASE_CLONE_DIRECTORY here
ON_DISK_HDB="/home/sbruce1/sbruce1/OnDiskDB/TickerPlantTestDB/"
BASE_CLONE_DIRECTORY="/home/sbruce1/Desktop/Work/Projects/Git/Sewio/Sewio-Demo-Site-Tick-Architecture-System/"


echo $BASE_CLONE_DIRECTORY
echo "Starting Dashboards"
cd $BASE_CLONE_DIRECTORY/dash
q sample/demo.q -u 1 &
q dash.q -p 10001 -u 1 &
echo "Starting Tickerplant" &
cd $BASE_CLONE_DIRECTORY/Test/kdb-tick
q tick.q sym $ON_DISK_HDB -p 5000 &
echo "Starting HDB"
cd $BASE_CLONE_DIRECTORY/Test/kdb-tick/HDB
q hdb.q $ON_DISK_HDB -p 5002 &
echo "Starting RTS"
cd $BASE_CLONE_DIRECTORY/Test/kdb-tick/tick
q RealTimeTradeWithAsofQuotes.q -tp localhost:5000 -syms MSFT.O IBM.N GS.N -p 5001 &
echo "Starting RDB"
q r.q localhost:5000 localhost:5002 -p 5005 &
