const clients = [
  { 
    name: "Anna",
    city: "Львів" 
  },
  { 
    name: "Darina",
    city: "Київ" 
  },

        {
    name: "Oleksandra",
    city: "Харків" },
  {
    name: "Sofiya",
    city: "Одеса" },
  { 
    name: "Maksimka",
    city: "Дніпро" 
  },
  {
    name: "Andriy",
    city: "Вінниця" 
  },
  { 
    name: "Irina",
    city: "Чернівці" 
  },
  { 
    name: "Vladislav",
    city: "Тернопіль" 
  },
  { 
    name: "Mariya",
    city: "Івано-Франківськ"
 }
];
const brands = [
  "panda",
  "intuit",
  "mondelez",
  "ome",
  "batman"
];
for(let i =0 ; i< clients.length ; i++){
    let clientName = clients[i].name;
    $(`.clients`).append(`
    <div class="client">
    <img src="./img/${clientName}.png">
    </div>
    
`)
}
for(let i =0 ; i< brands.length ; i++){
    $(`.brands`).append(`
    <div class="brand">
    <img src="./img/${brands[i]}.png">
    </div>
    
`)
}