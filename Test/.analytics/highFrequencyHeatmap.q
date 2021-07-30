highFrequencyTable:{[tableName]
    b:select from tableName;
    bigX:(value (select max posX from b)[0])[0];
    bigY:(value (select max posY from b)[0])[0];
    smallX:0;
    smallY:0;
    n:10;

    dx:%[bigX-smallX;n];
    dy:%[bigY-smallY;n];

    a:-500 sublist update x_grid:ceiling %[posX;dx], y_grid:ceiling %[posY;dy] from b;

    myTable:select COUNT:count i by x_grid,y_grid from a;
    rack:([]x_grid:1+til 10) cross ([]y_grid:1+til 10);

    result:0^rack lj myTable   

    }
