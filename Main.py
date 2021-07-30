import websocket, json
import pykdb
from pykdb import q
import numpy as np
import time

if q.licensed:
	print("Runing example in presence of licensed kdb+")
else:
	print("Unlicensed kdb+")

connection = q.ipc.Connection('localhost', 5000, sync=False)

API_KEY = "171555a8fe71148a165392904"
socket = "ws://demo.sewio.net:8080"

def on_open(ws):
	print("opened")
	secData = {
		"X-ApiKey": API_KEY
	}
	auth_data = {
		"headers": secData,
		"method": "subscribe",
		#"resource":"/feeds/14"
		"resource":"/feeds/"
	}
	ws.send(json.dumps(auth_data))


def on_message(ws, message):
	data = json.loads(message)
	ourDataList = data['body']['datastreams']
	dataID = data['body']['id']
	#a = [q.K(float(0.0)), 'GS.N']
	# a = [q.K(np.timedelta64(0,'ns')), 'GS.N']
	a = [q.K(np.timedelta64(time.time_ns(),'ns')), 'GS.N']


	for i in range (0,2): # Change to 3 when including z data
		a.append(float(ourDataList[i]['current_value']))

	a.append(float(dataID))
	print(a)
	connection('.u.upd','test',a)







ws = websocket.WebSocketApp(socket, on_open=on_open, on_message=on_message)
ws.run_forever()
