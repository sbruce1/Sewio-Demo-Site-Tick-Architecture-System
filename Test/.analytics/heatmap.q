getTable:{[tableName]
    
    bigX:(value (select max posX from tableName)[0])[0];
    bigY:(value (select max posY from tableName)[0])[0];
    smallX:0;
    smallY:0;
    n:10;

    dx:%[bigX-smallX;n];
    dy:%[bigY-smallY;n];

    a:update x_grid:ceiling %[posX;dx], y_grid:ceiling %[posY;dy] from tableName;

    myTable:select COUNT:count i by x_grid,y_grid from a;

    ([]x_grid:1+til 10);
    rack:([]x_grid:1+til 10) cross ([]y_grid:1+til 10);

    result:0^rack lj myTable   

    }
