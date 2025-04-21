async function fetchData() {
    try {
      const HeroId = document.getElementById("HeroId").value.toLowerCase();
      const response = await fetch(`https://dragonball-api.com/api/characters/${HeroId}`);
  
      if (!response.ok)
        throw new Error('Could not fetch the hero');
  
      const data = await response.json();
        document.getElementById("result").textContent = data.name;                  

    } catch (error) {
      console.error(error);
      document.getElementById("result").textContent = "Герой не найден!";
    }
  }
  