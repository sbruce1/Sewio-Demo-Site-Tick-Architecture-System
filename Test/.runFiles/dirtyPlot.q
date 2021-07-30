h1:hopen(`::5005); devTable:h1 "select from test"; hclose h1;


plotFunction:{[x]
        .qp.theme[.gg.dash.dark]
         .qp.path[-300 sublist select from devTable where time > 18803D04:07:45.599174900, myID=x ; `posX; `posY]
               .qp.s.aes[`fill; `time]
             , .qp.s.scale[`fill; .gg.scale.colour.gradient[`steelblue; `firebrick]]
             , .qp.s.aes[`alpha; `time]
             , .qp.s.scale[`alpha; .gg.scale.alpha[0;255]]
             , .qp.s.aes[`size; `time]
             , .qp.s.scale[`size; .gg.scale.line.size[0; 3]]     
        
    }


myList:(`myID xasc select distinct myID from devTable)[`myID];


.qp.go[500;500]
    .qp.theme[`aspect_ratio`legend_use!(`square; 0b)]   
        .qp.stack (
            plotFunction each myList
        )
 
