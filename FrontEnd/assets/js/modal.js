// 1. importation de la fonction "displayWorks" du fichier index.js
import { displayWorks } from "./index.js";
// 1. importation de la fonction "deleProject" du fichier delete.js
import { deleteProject } from "./delete.js";
/********** 2. Afficher la fenêtre modale lors du clic sur le bouton "éditer" **********/

const modalTriggers = document.querySelectorAll(".modal-trigger");

// 3. Variable pour savoir quelle modal est ouverte
let modal = null;

// Créer un sélecteur pour identifier tous les éléments sélectionnables
const focusableSelector = "button, a, input, textarea";
// 3. Créer une variable pour enregistrer tous les éléments sélectionnables lorsque la boîte modale est ouverte
let focusables = [];
// 3. Créer une variable pour identifier l'élément précédemment sélectionné
let previouslyFocusedElement = null;

// 4. Fonction pour ouvrir la modal
const openModal = async function (event) {
  event.preventDefault();
  // Récupérer l'attribut 'href=#modal1'
  modal = document.querySelector(event.target.getAttribute("href"));
  // Récupérer tous les éléments sélectionnables à l'intérieur de la modal correspondant à notre focusableSelector et convertir la liste de nœuds en tableau
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  // Trouver l'élément précédemment sélectionné et le stocker dans notre variable lorsque la modal est ouverte
  previouslyFocusedElement = document.querySelector(":focus");

  // Effacer la galerie modale avant d'afficher les œuvres
  const modalGallery = modal.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  // Afficher les œuvres dans la modal
  await displayWorks(modalGallery, true);

  //delete works from the modal
  deleteProject();

  // Afficher la modal
  modal.style.display = null;
  // Définir le premier élément sélectionnable par défaut
  focusables[0].focus();
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  // Fermer la modal au clic
  modal.addEventListener("click", closeModal);
  modal
    .querySelectorAll(".close-modal")
    .forEach((close) => close.addEventListener("click", closeModal));
  modal.querySelector(".stop-modal").addEventListener("click", stopPropagation);
};

// 5. Fonction pour fermer la modal
const closeModal = function (event) {
  // Ne rien faire si nous essayons de fermer une modal qui n'existe pas
  if (modal === null) {
    return;
  }
  // Renvoyer le focus à l'élément précédemment sélectionné après la fermeture de la modal
  if (previouslyFocusedElement !== null) {
    previouslyFocusedElement.focus();
  }
  event.preventDefault();
  // Modifier le comportement par défaut du navigateur pour relancer l'animation dans une direction inverse
  modal.style.display = "none";
  modal.offsetWidth;
  modal.style.display = null;

  // Masquer la modal pour les lecteurs d'écran en définissant 'aria-hidden' sur 'true'
  // Supprimer l'attribut 'aria-modal' pour indiquer que la modal n'est pas une boîte de dialogue modale

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  // Supprimer l'écouteur d'événements pour nettoyer entièrement la boîte modale
  modal.removeEventListener("click", closeModal);
  modal
    .querySelectorAll(".close-modal")
    .forEach((close) => close.addEventListener("click", closeModal));
  modal
    .querySelector(".stop-modal")
    .removeEventListener("click", stopPropagation);
  // autre façon d'ajouter un délai et de gérer une animation plus longue
  const hideModal = function () {
    // Cacher la modal
    modal.style.display = "none";
    // Empêcher l'accumulation du même événement plusieurs fois avec chaque clic et éviter le bug qui masque la modal dès le deuxième clic
    modal.removeEventListener("animationend", hideModal);
    // Redéfinir modal à null comme par défaut
    modal = null;
  };
  modal.addEventListener("animationend", hideModal);
};

// 6. Fonction pour empêcher la fermeture de la boîte modale lors du clic dessus
const stopPropagation = function (event) {
  event.stopPropagation();
};

// 8. Ouvrir la modal au clic sur le lien d'édition
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openModal);
});

// Prise en charge de la fonctionnalité clavier pour fermer la modal lorsque la touche 'Escape' est pressée
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
  // Piéger le focus de l'utilisateur dans la boîte modale
  if (event.key === "Tab" && modal !== null) {
  }
});
