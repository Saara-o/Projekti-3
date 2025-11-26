const hakukentta = document.querySelector(".hakukentta");
hakukentta.addEventListener("keypress", clickEnter); // Lisätään kuuntelija hakukenttään

// Oletuksena haetaan reseptin nimen mukaan
let hakutyyppi = "StrMeal"

// Enter-näppäimen painalluksesta submit
function clickEnter (e) {
    // Tarkistetaan, että on painettu Enter-näppäintä
    if (e.key === "Enter") {
        e.preventDefault(); // Estetään lomakkeen oletustoiminta
        const pituus = hakukentta.value.length;
        const hakusana = hakukentta.value.trim();

        // Hakukentän tarkastus
        if (pituus === 0) {
        alert("Hakukenttä on tyhjä.")
        hakukentta.disabled = true;
        return;
    }
        // Jos kenttä ei ole tyhjä
        haeData(hakusana);
    }
}

// Luodaan AJAX-olio
function haeData (hakusana) {
// Luodaan URL, jossa on käyttäjän syöte otettu huomioon
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(hakusana);
    let xhr = new XMLHttpRequest();
    // Kerrotaan mihin osoitteeseen tietopyyntö lähtee
    xhr.open("GET", url, true);
    //Määritellään käsittelijä vastauksen saapuessa
    xhr.onreadystatechange = function () {
        // Jos ei ole tullut virheitä matkalla
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Muutetaan vastaus JSON-muotoon
            let data = JSON.parse(xhr.responseText);
            // Tarkistetaan löytyikö yhtään tulosta
            if (!data.meals) {
                document.getElementById("tulokset").innerText =
                "Hakusanalla ei löytynyt yhtään reseptiä. Kokeile toista hakusanaa."
                return;
            }

            // Näytetään konsolissa data
            data.meals.forEach(meal => {
                console.log(meal.strMealThumb);
                console.log("Recipe:", meal.strMeal);
                console.log("Category:", meal.strCategory);
                console.log("Country:", meal.strArea);

            })
        } 
        // Mikäli on tullut virheitä
        else if (xhr.status === 403) {
            document.getElementById("tulokset").innerText =
            "Haussa tapahtui virhe: palvelin esti haun (403). Tarkista hakutyyppi tai kokeile myöhemmin uudelleen.";
        }
        else if (xhr.status === 404) {
            document.getElementById("tulokset").innerText =
            "Haussa tapahtui virhe: reseptiä ei löytynyt (404). Kokeile toista hakusanaa.";
        }
    };
    // Lähetetään edellä muovattu AJAX-olio
    xhr.send();
}