/**********Variables générales**********/

// 1. Récupérer l'élément DOM qui hébergera les œuvres
const mainGallery = document.querySelector(".gallery");
// 1. Récupérer l'élément DOM qui hébergera les boutons de catégories
const filter = document.querySelector(".filter");

/**********Fonctions pour récupérer la galerie et les catégories depuis l'API*********/

/**
 *
 * @returns fonction qui récupère les œuvres depuis l'API
 */

// 2. fonction pour récupérer la galerie depuis l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

getWorks();

/**
 *
 * @returns fonction qui récupère les catégories depuis l'API
 */

// 2. fonction pour récupérer les categories depuis l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

getCategories();

/**********Fonctions pour générer la galerie et les catégories*******

/**
 * @generator fonction pour générer des œuvres et les afficher sur le site web
 */

// 3. fonction pour générer la galerie
function generateWorks(work, targetGallery, showDeleteIcon = false) {
  // créer des éléments dédiés pour chaque œuvre
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  // accéder à l'image de chaque œuvre pour configurer ses attributs source et alt
  img.src = work.imageUrl;
  img.alt = work.title;
  const figcaption = document.createElement("figcaption");
  // ajouter le titre de l'œuvre à figcaption en tant que texte
  figcaption.innerText = work.title;

  // si showDeleteIcon est true, ajouter l'icône de suppression à la figure
  if (showDeleteIcon) {
    // Créer une div conteneur pour contenir à la fois l'image et l'icône de suppression
    const container = document.createElement("div");
    container.classList.add("work-container");

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "assets/icons/modal-delete-icon.svg";
    deleteIcon.alt = "Delete Icon";
    deleteIcon.classList.add("modal-delete-icon");
    deleteIcon.dataset.id = work.id;

    // Ajouter l'image et l'icône de suppression au conteneur
    container.appendChild(img);
    container.appendChild(deleteIcon);

    // Ajouter le conteneur et figcaption à la figure
    figure.appendChild(container);
    figure.appendChild(figcaption);
  } else {
    // si showDeleteIcon est false, ajouter simplement l'image et figcaption à la figure
    figure.appendChild(img);
    figure.appendChild(figcaption);
  }

  // Ajouter la figure à la galerie cible
  targetGallery.appendChild(figure);
}

/**
 * @generator fonction pour générer des catégories et les afficher sur le site web
 */

// 3. fonction pour générer les catégories
function generateCategories(category) {
  // créer des éléments dédiés pour chaque bouton de catégorie
  const btnFilter = document.createElement("button");
  // insérer l'ID et le nom dans chaque bouton de catégorie
  btnFilter.innerText = category.name.toUpperCase();
  btnFilter.id = category.id;
  // ajouter la classe "button"
  btnFilter.classList.add("button");

  // vérifier si la variable filtre n'est pas nulle avant d'effectuer des opérations dessus
  if (filter) {
    // ajouter chaque bouton de catégorie à son parent
    filter.appendChild(btnFilter);
  }
}

/**********Fonctions pour afficher les œuvres et les catégories**********/

/**
 * @async afficher les œuvres dans le DOM
 */

// 4. fonction pour afficher les oeuvres
export async function displayWorks(targetGallery, showDeleteIcon) {
  // stocker la réponse API http dans une constante au format JSON
  const works = await getWorks();

  works.forEach((work) => {
    generateWorks(work, targetGallery, showDeleteIcon);
  });
}
displayWorks(mainGallery);

/**
 * @async afficher les catégories dans le DOM
 */

// 4. fonction pour afficher les catégories
async function displayCategories() {
  // stocker la réponse API http dans une constante au format JSON
  const categories = await getCategories();

  categories.forEach((category) => {
    generateCategories(category);
  });
}
displayCategories();

/*********fonction pour filtrer la galerie par catégorie de projet**********/

/**
 * @event
 */

// 5. fonction pour filter la galerie par catégorie de projet
async function filterCategories() {
  const works = await getWorks();

  const filterButtons = document.querySelectorAll(".filter .button");

  // itérer à travers chaque bouton de filtre
  filterButtons.forEach((filterButton) => {
    // ajouter un écouteur d'événements à chaque bouton de filtre
    filterButton.addEventListener("click", (event) => {
      // récupérer l'ID du bouton de filtre lors d'un clic sur un bouton sélectionné
      const filterButtonId = event.target.id;

      // supprimer toutes les œuvres dans la galerie à chaque bouton de filtre pour rafraîchir la page et la rendre interactive
      gallery.innerHTML = "";

      // logique pour les boutons de filtre
      if (filterButtonId !== "0") {
        const filteredWorks = works.filter((work) => {
          return work.categoryId == filterButtonId;
        });
        filteredWorks.forEach((work) => {
          generateWorks(work);
        });
      } else {
        displayWorks();
      }
    });
  });
}
filterCategories();
