#!/bin/bash
echo "Ending Processes"
kill $(ps aux | grep '[q] *' | awk '{print $2}')
