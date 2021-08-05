# Sewio-Demo-Site-Tick-Architecture-System
Tick Architecture System, setup with Q/KDB+ ingesting real-time location data via Sewio's demo site via websockets. Includes heatmapping, streaming location analytics and GGplot functionality.

## List of Dependencies

### q
Q is required for this project. Instructions pertaining to the install of this dependency is on the code.kx website:
https://code.kx.com/q/learn/install/

### Developer
Developer is a useful tool for expanding upon this project, also available on the code.kx website:
https://code.kx.com/developer/

### PyKdb
PyKdb is a module within Python used to parse K objects to Q instances. This is currently in alpha release, but the documentation regarding install and usage is located at:
https://kxdev.gitlab.io/labs-experiments/pykdb/

## Use instructions

### Before First Use

Change the directories for $BASE_CLONE_DIRECTORY and $ON_DISK_HDB within the startupNew.sh script.

### Startup Sequence

First run "python Main.py" to start the datastream
Secondly run "./startupNew.sh"

### End Sequence

Run ./endprocesses.sh and this will end all q instances running on your local machine. Be cautious of using this as it does not limit itself to only the q processes contained within this project.

## Example Dashboards Setup

![Image of Dashboards](https://github.com/sbruce1/Sewio-Demo-Site-Tick-Architecture-System/blob/main/DashboardsExample.PNG)
