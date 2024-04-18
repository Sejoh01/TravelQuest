const destinations = [
    {
      name: "Nairobi",
      country: "Kenya",
      population: 4397073,
      attractions: ["Nairobi National Park", "David Sheldrick Wildlife Trust", "Karen Blixen Museum"],
      timezone: "EAT",
      description:
        "Nairobi is the capital and largest city of Kenya. It is famous for its national parks, wildlife conservation areas, and cultural heritage sites.",
    },
    {
      name: "Mombasa",
      country: "Kenya",
      population: 1208334,
      attractions: ["Fort Jesus", "Diani Beach", "Haller Park"],
      timezone: "EAT",
      description:
        "Mombasa is a coastal city in Kenya known for its beautiful beaches, rich history, and diverse cultural heritage.",
    },
    {
      name: "Kisumu",
      country: "Kenya",
      population: 500000,
      attractions: ["Kisumu Impala Sanctuary", "Kisumu Museum", "Hippo Point"],
      timezone: "EAT",
      description:
        "Kisumu is a port city in Western Kenya, located on the shores of Lake Victoria. It is known for its scenic landscapes, vibrant markets, and cultural festivities.",
    },
    {
      name: "Nakuru",
      country: "Kenya",
      population: 570674,
      attractions: ["Lake Nakuru National Park", "Menengai Crater", "Hyrax Hill Prehistoric Site"],
      timezone: "EAT",
      description:
        "Nakuru is a city in Kenya's Rift Valley region, famous for its flamingo-filled Lake Nakuru National Park, picturesque landscapes, and rich cultural heritage."
    }
  ];
  
  let grid = document.getElementById("grid__destinations");
  const loader = document.getElementById("loader");
  let loaderContainer = document.querySelector(".loader-container");
  let mostSearched = Array.from(document.querySelectorAll("#most-searched>div"));
  
  mostSearched.forEach((el) => {
    el.addEventListener("click", () => {
      searchQuery = el.children[1].textContent.toLowerCase();
      createResult();
    });
  });
  
  async function getPhotos() {
    try {
        const localImages = [
            "../images/mombasa.jpg",
            "../images/kisumu.jpg",
            "../images/nakuru.jpg",
            "../images/nairobi.jpg"
        ];
        return localImages;
    } catch (error) {
        console.error("Error occurred:", error);
    }
  }
  
  async function findImageUrl(query) {
    try {
        const localImages = {
            "mombasa": "../images/mombasa.jpg",
            "kisumu": "../images/kisumu.jpg",
            "nakuru": "../images/nakuru.jpg",
            "nairobi": "../images/nairobi.jpg"
        };
        return localImages[query.toLowerCase()];
    } catch (error) {
        console.error("Error occurred:", error);
    }
  }
  
  function createResult() {
    let city;
    destinations.forEach((dest) => {
      if (dest.name.toLowerCase() === searchQuery) city = dest;
    });
    if (!city) {
      grid.innerHTML = "<h2>No such city found</h2>";
    } else {
      let attractions = city.attractions;
      attractions.forEach(async (att) => {
        let url = findImageUrl(att);
        url
          .then((response) => {
            let link = response[0].urls.regular;
            city[att.toLowerCase()] = [att, link];
          })
          .catch((e) => console.log(e));
      });
      let urls = getPhotos(city.name.toLowerCase());
      let imgUrls = [];
      urls
        .then((response) => {
          response.map((el) => {
            imgUrls.push(el.urls.regular);
            city.imgUrls = imgUrls;
          });
          setTimeout(() => {
            displayCity(city);
            loaderContainer.style.height = "auto";
            loader.style.display = "none";
          }, 1200);
        })
        .catch((e) => {
          console.log(e);
          loader.style.display = "none";
        });
    }
  }
  
  function displayCity(city) {
    let cityImages = city.imgUrls;
    let collage = document.createElement("div");
    collage.setAttribute("class", "collage");
    cityImages.map((el, i) => {
      let img = document.createElement("img");
      img.setAttribute("class", `img-${i + 1}`);
      img.setAttribute("src", el);
      img.addEventListener("click", () => {
        let link = el;
        window.open(link, "_blank");
      });
      collage.append(img);
    });
    grid.append(collage);
  
    let cityContent = document.createElement("div");
    cityContent.setAttribute("class", "city-content");
    let h2 = document.createElement("h2");
    h2.innerText = city.name;
    let population = document.createElement("p");
    population.innerText = `The city of ${city.name} has around ${city.population} people`;
    let extraInfo = document.createElement("p");
    extraInfo.innerText = city.description;
    let addToWishlist = document.createElement("button");
    addToWishlist.innerText = "Add To Wishlist";
    addToWishlist.setAttribute("class", "primary-btn");
    addToWishlist.addEventListener("click", () => {
      let obj = {};
      obj["name"] = city.name;
      if (userLogin.cart.length == 0) {
        userLogin.cart.push(obj);
        localStorage.setItem("user-login", JSON.stringify(userLogin));
        populateWishlistContent(userLogin.cart);
        displayTotal();
      } else {
        let flag = true;
        userLogin.cart.map((el) => {
          if (el.name == city.name) flag = false;
        });
        if (flag) {
          userLogin.cart.push(obj);
          localStorage.setItem("user-login", JSON.stringify(userLogin));
          updateUsers();
          populateWishlistContent(userLogin.cart);
          displayTotal();
        }
      }
    });
    cityContent.append(h2, population, extraInfo, addToWishlist);
  
    let touristSpots = document.createElement("div");
    touristSpots.setAttribute("class", "recommended");
    let recommended = document.createElement("h2");
    recommended.style.margin = "2rem 0";
    recommended.innerText = `Common Tourist Spots in ${city.name}`;
    for (let i = 0; i <= 2; i++) {
      let card = document.createElement("div");
      let spot = document.createElement("img");
      spot.setAttribute("src", city[city.attractions[i].toLowerCase()][1]);
      let spotName = document.createElement("h3");
      spotName.innerText = city[city.attractions[i].toLowerCase()][0];
      spotName.addEventListener("click", () => {
        window.open(city[city.attractions[i].toLowerCase()][1], "_blank");
      });
      card.append(spot, spotName);
      touristSpots.append(card);
    }
    grid.append(cityContent, recommended, touristSpots);
  }
  
  let form = document.getElementById("search");
  let searchInput = document.getElementById("place");
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchQuery = searchInput.value.toLowerCase();
    createResult();
    form.reset();
  });
