// Oletuksena haetaan reseptin nimen mukaan
let hakutyyppi = "strMeal"

// API -haku tapahtuu Enter-näppäintä painamalla, haetaan reseptin nimen mukaan
$(document).ready(function() {
    $(".hakukentta").keypress(function(e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Estetään lomakkeen oletustoiminta
            const hakusana = $(".hakukentta").val().trim();

            // Hakukentän tarkastus
            if (hakusana === "") {
                $(".hakukentta").attr("placeholder", "The search bar is empty.")
                return;
            }

            // Luodaan URL, jossa on käyttäjän syöte otettu huomioon
            let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(hakusana);

            // Axios-pyyntö
            axios.get(url)
                .then(function(response) {
                    let data = response.data;
                    if (!data.meals) {
                        $("#tulokset").text("No recipes found. Try another recipe name.");
                        return;
                    }

                    // Tulostetaan konsoliin
                    console.log("Reseptejä löytyi:", data.meals.length);
                    for (let i = 0; i < data.meals.length; i++) {
                        console.log(data.meals[i].strMeal);
                    }

                    // Näytetään hakutulokset div-elementissä
                    $("#tulokset").empty(); // Poistetaan vanhat hakutulokset
                    for (let i = 0; i < data.meals.length; i++) {
                        let meal = data.meals[i];
                        let mealURL = "resepti.html?id=" + meal.idMeal;
                        
                        // Luodaan reseptistä korttinäkymä, reseptikortti linkkinä reseptiin
                        $("#tulokset").append(`
                            <div class = "reseptikortti"> 
                                <a href = "${mealURL}"> 
                                    <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}">
                                    <h2>${meal.strMeal}</h2>
                                </a>    
                                <p>Category: ${meal.strCategory}</p>
                                <p>Region: ${meal.strArea}</p>
                            </div>
                        `);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.error(error.response.data);
                        console.error(error.response.status);
                        console.error(error.response.headers);
                    } else if (error.request) {
                        console.error(error.request);
                    } else {
                        console.error("Error", error.message);
                    }
                    $("#tulokset").text("There was an error while fetching recipes. Please try again later.")
                });
    }});
});

// Reseptin hakeminen ohjeineen näytölle
$(document).ready(function (e) {
    // Etsitään reseptin ID URL:sta
    let etsiURL = new URLSearchParams(window.location.search);
    let mealId = etsiURL.get("id");

    if(!mealId) {
        $("#resepti").text("No recipe selected.");
        return;
    }

    // Haetaan reseptin tiedot API:sta
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId;

    // Luodaan uusi axios-pyyntö
    axios.get(url)
        .then(function(response) {
            let meal = response.data.meals[0];

            // Reseptin sijoitus ja ulkoasu
            $("#resepti").html(`
                <h2>${meal.strMeal}</h2>
                <img src = "${meal.strMealThumb}" alt = "${meal.strMeal}">
                <p>Category: ${meal.strCategory}</p>
                <p>Region: ${meal.strArea}</p>
                <p id = "ohje"> ${meal.strInstructions}</p>
            `);
        })
        .catch((error) => {
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error("Error", error.message);
            }
            $("#tulokset").text("There was an error while fetching recipes. Please try again later.")
        });

});