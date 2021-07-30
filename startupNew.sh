#!/bin/bash
echo "Establishing Function"
dev()
{
	source /home/sbruce1/developer/config/config.profile;q /home/sbruce1/developer/launcher.q_
}
echo "Starting Dashboards"
cd /home/sbruce1/Desktop/Work/Projects/Tick\ Architecture/dash
q sample/demo.q -u 1 &
q dash.q -p 10001 -u 1 &
echo "Starting Tickerplant" &
cd /home/sbruce1/developer/workspace/a/Test/kdb-tick
q tick.q sym /home/sbruce1/sbruce1/OnDiskDB/TickerPlantTestDB -p 5000 &
echo "Starting HDB"
cd /home/sbruce1/developer/workspace/a/Test/kdb-tick/HDB
q hdb.q /home/sbruce1/sbruce1/OnDiskDB/TickerPlantTestDB -p 5002 &
echo "Starting RTS"
cd /home/sbruce1/developer/workspace/a/Test/kdb-tick/tick
q RealTimeTradeWithAsofQuotes.q -tp localhost:5000 -syms MSFT.O IBM.N GS.N -p 5001 &
echo "Starting RDB"
q r.q localhost:5000 localhost:5002 -p 5005 &
echo "Starting Developer"
dev
