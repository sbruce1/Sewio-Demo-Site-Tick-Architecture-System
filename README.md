# Sewio-Demo-Site-Tick-Architecture-System
Tick Architecture System, setup with Q/KDB+ ingesting real-time location data via Sewio's demo site via websockets. Includes heatmapping, streaming location analytics and GGplot functionality.

## Use instructions

### Before First Use

startupNew.sh currently contains reference directories from my individual computer, this will be updated in later commit.
In the interim, for personal use the following changes should be made to startupNew.sh:

1. Remove lines 3-6,22-23 this only serves to run developer in the same terminal window.
2. Change line 8 to cd /dir/to/gitclone/dash.
3. Change the directory on lines 13 & 16 to a directory desired for the on-disk database.
4. Change the directory on lines 12,15,18 to /dir/to/gitclone/Test/* , where * refers to the end of the existing directory following Test.

endprocesses.sh should be used cautiously as it ends all q instances running on your local machine.

### Startup Sequence

First run "python Main.py" to start the datastream
Secondly run "./startupNew.sh"
