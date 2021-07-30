bigX:(value (select max posX from test)[0])[0]
bigY:(value (select max posY from test)[0])[0]
smallX:0
smallY:0
n:10

dx:%[bigX-smallX;n]
dy:%[bigY-smallY;n]

a:update x_grid:ceiling %[posX;dx], y_grid:ceiling %[posY;dy] from test

count each {select from a where x_grid = x}each 1+ til 10 // Counts Each in the X
count each {select from a where y_grid = x}each 1+ til 10 // Counts Each in the Y


select cnt:count i by x_grid,y_grid from a