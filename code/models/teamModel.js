var team = [
    {   
        name: "GangGang", 
        id: 1,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"swagmaster",rank:"Initiate",role:"Tech"}
        ]
    },
    {   
        name: "GangGang1", 
        id: 2,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"swagmaster",rank:"Initiate",role:"Tech"}
        ]
    },
    {   
        name: "GangGang2", 
        id: 3,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"swagmaster",rank:"Initiate",role:"Tech"}
        ]
    },
];


module.exports.getAllTeamMembers= function(index) { 
    return team[index].teammate; 
}

module.exports.getAllTeams= function() { 
    return team; 
}

